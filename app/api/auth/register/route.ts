import { account, databases } from "@/lib/appwrite";
import { dbId, profileCollectionId } from "@/lib/config";
import { AppwriteException, ID } from "appwrite";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.json();
        const { fullName, email, password } = formData;
        const user = await account.create(ID.unique(), email, password, fullName)
        const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`;
        await databases.createDocument(
            dbId,
            profileCollectionId,
            ID.unique(),
            {
                userId: user?.$id,
                email: user?.email,
                name: user?.name,
                avatar: fallbackAvatar
            }
        )
        return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
    } catch (error) {
        if (error instanceof AppwriteException) {
            return NextResponse.json({
                message: error.message,
                type: error.type,
                code: error.code,
            },
            { status: error.code || 400 });

        }
        console.log(error);
        return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
    }
}