import { databases } from "@/lib/appwrite";
import { dbId, exerciseCol } from "@/lib/config";
import { ID, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, sets, type, reps, duration, durationUnit, userId } = await req.json();
  try {
    const exercise = await databases.createDocument(
      dbId,
      exerciseCol,
      ID.unique(),
      {
        user: userId,
        name,
        sets,
        type,
        reps,
        duration,
        durationUnit
      }
    )

    if (exercise.total === 0) {
      return NextResponse.json({ message: "Exercise not created!" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Exercise created successfully.",
        exercises: exercise[0]
      },
      { status: 201 }
    )
  } catch (error) {
    console.log("Error while creating exercise: ", error)
    return NextResponse.json({ message: "Error while creating exercise!" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized request!" }, { status: 401 })
  }

  try {
    const exercises = await databases.listDocuments(
      dbId,
      exerciseCol,
      [
        Query.equal("user", userId)
      ]
    )

    if (!exercises) {
      return NextResponse.json({ message: "Exercises not found!" }, { status: 404 })
    }

    return NextResponse.json({ message: "Exercises fetched successfully!", exercises: exercises.documents }, { status: 200 })
  } catch (error) {
    console.log("Error while fetching exercises: ", error)
    return NextResponse.json({ message: "Something went wrong while fetching!" }, { status: 500 })
  }
}