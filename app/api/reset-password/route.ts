import { databases } from '@/lib/appwrite';
import { User } from '@/models/user';
import { Query } from 'appwrite';
import { hash } from 'bcryptjs'; // or your preferred hasher
import { NextResponse } from 'next/server';

const dbId = process.env.APPWRITE_DB_ID!;
const userCollectionId = process.env.APPWRITE_COLLECTION_USER_ID!;

export async function POST(req: Request) {
    try {
        const { email, newPassword } = await req.json();
        const hashed = await hash(newPassword, 12);
        const userResult = await databases.listDocuments(dbId, userCollectionId, [
            Query.equal("email", email)
        ]);

        if (userResult.total === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userDoc = userResult.documents[0];
        await databases.updateDocument(
            dbId,
            userCollectionId,
            userDoc.$id,
            { password: hashed }
        );
        return NextResponse.json({ message: 'Password reset' }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
