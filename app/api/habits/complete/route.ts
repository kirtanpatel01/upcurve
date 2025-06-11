import { connectToDB } from "@/lib/mongoose";
import { Habit } from "@/models/habits";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { _id } = await req.json();

  if (!_id) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 })
  }
  await connectToDB();

  try {
    await Habit.findOneAndUpdate({ _id }, { $set: { isCompleted: true } })
    return NextResponse.json({ message: 'Habit marked as completed' }, { status: 200 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}