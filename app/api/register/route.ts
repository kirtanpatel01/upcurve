import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const dbId = process.env.APPWRITE_DB_ID!
const userId = process.env.APPWRITE_COLLECTION_USER_ID!

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { fullName, username, email, phone, password } = formData;

        const queries = []
        if(username) queries.push(Query.equal('username', username))
        else if(email) queries.push(Query.equal('email', email))
        else if(phone) queries.push(Query.equal('phone', phone))
            
        if(queries.length === 0) {
            return NextResponse.json({ error: "No identifier provided" }, { status: 400 })
        }

        const existedUser = await databases.listDocuments(dbId, userId, queries)
        if(existedUser.total > 0) {
            return NextResponse.json({ error: "User already exists!" }, { status: 409 })
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await databases.createDocument(
            dbId,
            userId,
            ID.unique(),
            {
                fullName,
                username,
                email,
                phone,
                password: hashedPassword,
            }
        );

        if (!user) {
            return NextResponse.json({ message: "Error while registering user!" }, { status: 500 });
        }

        return NextResponse.json({
            message: "User registered successfully",
            data: {
                user
            }
        }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}