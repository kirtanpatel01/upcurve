// app\api\send\route.ts

import EmailTemplate from '@/components/email-template';
import { Resend } from 'resend';
import { sign } from 'jsonwebtoken';
import { auth } from '@/auth';
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { NextResponse } from 'next/server';

const dbId = process.env.APPWRITE_DB_ID!;
const userCollectionId = process.env.APPWRITE_COLLECTION_USER_ID!;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        let name = "User";
        const userResult = await databases.listDocuments(dbId, userCollectionId, [
            Query.equal("email", email)
        ]);

        if (userResult.total !== 0) {
            const userDoc = userResult.documents[0];
            name = userDoc.fullName;
        }

        const token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: "15m" })
        const resetUrl = `https://next-auth-five-ruby.vercel.app/reset?token=${token}`;

        const { data, error } = await resend.emails.send({
            from: 'Kiton <onboarding@resend.dev>',
            to: [email],
            subject: 'Reset your kiton account password',
            react: EmailTemplate({ firstName: name }, {resetUrl}),
        });
        
        if (error) {
            console.log(error);
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        console.log(error);
        return Response.json({ error }, { status: 500 });
    }
}