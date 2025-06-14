import { databases } from "@/lib/appwrite";
import { NextResponse } from "next/server";

const dbId = process.env.APPWRITE_DB_ID!;
const habitCollectionId = process.env.APPWRITE_COLLECTION_HABIT_ID!

export async function POST(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }

  try {
    await databases.updateDocument(
      dbId,
      habitCollectionId,
      id,
      {
        isCompleted: false
      }
    )
    return NextResponse.json({ message: 'Habit marked as incompleted' }, { status: 200 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}