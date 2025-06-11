import { databases } from "@/lib/appwrite";
import { connectToDB } from "@/lib/mongoose";
import { Habit } from "@/models/habits";
import { ID, Permission, Query, Role } from "appwrite";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const dbId = process.env.APPWRITE_DB_ID!
const habitCollectionId = process.env.APPWRITE_COLLECTION_HABIT_ID!

export async function POST(req: Request) {
  try {
    const { userId, title } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "User ID is required!" }, { status: 400 });
    }
    const habit = await databases.createDocument(
      dbId,
      habitCollectionId,
      ID.unique(),
      {
        userId, title
      }
    )

    if (!habit) {
      return NextResponse.json({ message: "Error while creating habit!" }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Habits saved", data: { habit } },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('id');
    if (!userId) {
      return NextResponse.json({ message: "User id required!" }, { status: 400 });
    }

    const habits = await databases.listDocuments(dbId, habitCollectionId, [
      Query.equal('userId', userId)
    ])
    if (!habits) {
      return NextResponse.json({ message: "No habits found!" }, { status: 404 })
    }

    return NextResponse.json({ message: "Habits fetched successfully.", data: { habits } }, { status: 201 })

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 })
  }
}