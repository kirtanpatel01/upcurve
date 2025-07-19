import { databases } from "@/lib/appwrite"
import { calculateStreaks } from "@/lib/calcStreak"
import { dbId, exerciseCol, exerciseLogCol } from "@/lib/config"
import { ID, Query } from "appwrite"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { user, exercise, duration, performance, overall } = await req.json()

  try {
    if (!user || !exercise || !performance || !duration) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 409 })
    }

    const exerciseLog = await databases.createDocument(
      dbId,
      exerciseLogCol,
      ID.unique(),
      { user, exercise, duration, performance, overall }
    )

    console.log(exercise)
    // Step 1: Get all logs for this exercise
    const logsRes = await databases.listDocuments(
      dbId,
      exerciseLogCol,
      [Query.equal("exercise", exercise)]
    )
    const logDates = logsRes.documents.map(doc => new Date(doc.$createdAt))

    // Step 2: Calculate streaks
    const { current, longest } = calculateStreaks(logDates)

    // Step 3: Update the exercise document
    await databases.updateDocument(
      dbId,
      exerciseCol,
      exercise,
      {
        "streak": JSON.stringify({
          current,
          longest,
          lastLoggedAt: new Date().toISOString()
        })
      }
    )

    if (!exerciseLog) {
      return NextResponse.json({ message: "Exercise acitivity not logged!" }, { status: 500 })
    }

    return NextResponse.json({ message: "Activity Successfully logged.", exerciseLog }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Activity not logged." }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exerciseId = searchParams.get("exerciseId");

  if (!exerciseId) {
    return NextResponse.json({ message: "Exercise id not provided!" }, { status: 409 })
  }
  try {
    const res = await databases.listDocuments(
      dbId,
      exerciseLogCol,
      [
        Query.equal("exercise", exerciseId)
      ]
    )

    console.log(res)
    if (res.total === 0) {
      return NextResponse.json({ message: "Exercise history not found!" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Exercise fetched successfully.",
      exerciseHistory: res.documents
    }, { status: 200 })
  } catch (error) {
    console.log("Error while fetching exercise history for user: ", error)
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}