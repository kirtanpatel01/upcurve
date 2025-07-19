import { databases } from "@/lib/appwrite";
import { dbId, exerciseCol } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const exerciseId = req.nextUrl.pathname.split('/').pop()
  if(!exerciseId) {
    return NextResponse.json({ message: 'Habit ID is required' }, { status: 400 });
  }
  
  try {
    const exercise = await databases.getDocument(
      dbId,
      exerciseCol,
      exerciseId
    )
    if(!exercise) {
      return NextResponse.json({ message: "Exercise not found!" }, { status: 404 })
    }

    return NextResponse.json({ message: "Exercise fetched successfully.", exercise }, { status: 200 })
  } catch (error) {
    console.log("Error while fetching exercise: ", error)
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}
