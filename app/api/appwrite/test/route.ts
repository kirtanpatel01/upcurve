import { databases, } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const dbId = process.env.APPWRITE_DB_ID!
const userId = process.env.APPWRITE_COLLECTION_USER_ID!

export async function POST(req: Request) {
  const { fullName, username, phone, email, password } = await req.json();
  try {
    const newUser = await databases.createDocument(
      dbId,
      userId,
      ID.unique(),
      {
        fullName,
        username,
        phone,
        email,
        password
      }
    )
    console.log('Apprwrite response: ', newUser);
    return NextResponse.json(
      { message: "User created successfully", userId: newUser.$id }, 
      { status: 201 })
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error while creating user" }, 
      { status: 500 })
  }
}

