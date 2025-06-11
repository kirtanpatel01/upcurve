export const runtime = "nodejs";

import NextAuth from "next-auth"
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { User } from "./models/user";
import { connectToDB } from "./lib/mongoose";
import bcrypt from "bcryptjs";
import { databases } from "./lib/appwrite";
import { ID, Query } from "appwrite";
import { z } from "zod";

const dbId = process.env.APPWRITE_DB_ID!
const userId = process.env.APPWRITE_COLLECTION_USER_ID!

const credentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                const parsed = credentialsSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new Error('Invalid credentials input');
                }
                const { email, password } = parsed.data;

                if (!email || !password) {
                    throw new Error('Email or Password not provided!')
                }

                try {
                    const result = await databases.listDocuments(dbId, userId, [
                        Query.equal('email', email)
                    ])

                    if (result.total === 0) {
                        throw new Error('User not found for this email address!')
                    }

                    const user = result.documents[0];
                    console.log(user);

                    if (typeof password !== 'string') {
                        throw new Error('Stored password is not a valid string');
                    }

                    const isValid = await bcrypt.compare(password, user.password);
                    if (!isValid) {
                        throw new Error('Password not match');
                    }

                    return {
                        id: user.$id,
                        email: user.email,
                        name: user.fullName,
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ],

    callbacks: {
        async signIn({ user, account }) {
            const user2 = user
            if (account?.provider === 'google') {
                try {
                    if (!user2?.email) {
                        throw new Error('Email is missing from user object');
                    }
                    const result = await databases.listDocuments(dbId, userId, [
                        Query.equal('email', user2.email)
                    ])

                    let existingUser;
                    if (result.total !== 0) {
                        existingUser = result.documents[0];
                    }

                    console.log("existedUser: ", existingUser);
                    if (!existingUser) {
                        await databases.createDocument(
                            dbId,
                            userId,
                            ID.unique(),
                            {
                                email: user.email,
                                fullName: user.name
                            }
                        )
                    }
                } catch (error) {
                    console.log("Error saving google user: ", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                if(!user?.email) {
                        throw new Error('Email is missing from user object');
                    }
                    const result = await databases.listDocuments(dbId, userId, [
                        Query.equal('email', user.email)
                    ])

                    if (result.total === 0) {
                        throw new Error('User not found for this email address!')
                    }

                    const dbUser = result.documents[0];
                    console.log("dbUser: ", dbUser);
                token.id = dbUser.$id
            }
            return token;
        },

        async session({ session, token }) {
            if (session?.user && token?.id) {
                session.user.id = token.id.toString();
            }
            return session;
        }
    },
})