import { databases } from "@/lib/appwrite";
import { dbId, habitCollectionId } from "@/lib/config";
import { NextResponse } from "next/server";

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