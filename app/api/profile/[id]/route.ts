import { databases } from "@/lib/appwrite";
import { dbId, profileCollectionId } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const profileId = req.nextUrl.pathname.split('/').pop()
  if(!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
  }

  const body = await req.json();

  try {
    const updatedProfile = await databases.updateDocument(
      dbId,
      profileCollectionId,
      profileId,
      body
    )

    if(!updatedProfile) return NextResponse.json({ error: 'Profile not updated!' }, { status: 500 })

    return NextResponse.json({ message: "Profile updated successfully.", updatedProfile }, { status: 200 })
  } catch (error) {
    console.log("Error while updating user profile: ", error)
    return NextResponse.json({ error: 'Error while updating user profile!' }, { status: 500 })
  }
}