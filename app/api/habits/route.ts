import { databases } from "@/lib/appwrite";
import { dbId, habitCollectionId } from "@/lib/config";
import { ID, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, title } = await req.json();
    console.log(userId, title)
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
    console.log(habit)
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