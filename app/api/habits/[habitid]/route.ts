import { NextRequest, NextResponse } from 'next/server';
import { databases } from '@/lib/appwrite';
import { dbId, habitCollectionId } from '@/lib/config';

export async function PUT(req: NextRequest) {
  const habitId = req.nextUrl.pathname.split('/').pop(); // or use regex
  if (!habitId) {
    return NextResponse.json({ message: 'Habit ID is required' }, { status: 400 });
  }

  const body = await req.json();

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

  try {
    await databases.deleteDocument(dbId, habitCollectionId, habitid);
    return NextResponse.json({ message: 'habit deleted' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Error deleting habit' }, { status: 400 });
  }
}
