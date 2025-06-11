import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoose';
import { Habit } from '@/models/habits';
import { databases } from '@/lib/appwrite';

const dbId = process.env.APPWRITE_DB_ID!;
const habitCollectionId = process.env.APPWRITE_COLLECTION_HABIT_ID!

export async function PUT(req: NextRequest) {
  const habitId = req.nextUrl.pathname.split('/').pop(); // or use regex
  if (!habitId) {
    return NextResponse.json({ message: 'Habit ID is required' }, { status: 400 });
  }
  const body = await req.json();

  await connectToDB();
  try {
    const updatedHabit = await databases.updateDocument(
      dbId,
      habitCollectionId,
      habitId,
      body
    );
    if (!updatedHabit) return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    return NextResponse.json({ habit: updatedHabit });
  } catch {
    return NextResponse.json({ message: 'Error updating habit' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const habitid = req.nextUrl.pathname.split('/').pop(); // get dynamic [habitid]
  if (!habitid) {
    return NextResponse.json({ message: 'Habit ID is required' }, { status: 400 });
  }

  await connectToDB();
  try {
    await databases.deleteDocument(dbId, habitCollectionId, habitid);
    return NextResponse.json({ message: 'habit deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Error deleting habit' }, { status: 400 });
  }
}
