import { account } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.json();
  console.log(formData)
  const { email, password } = formData;
  console.log(email, password)
    try {
        const user = await account.createEmailPasswordSession(email, password)
        return NextResponse.json({ message: "User logged in successfully", user }, { status: 200 })
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