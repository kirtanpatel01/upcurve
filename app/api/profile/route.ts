import { databases } from "@/lib/appwrite";
import { dbId, profileCollectionId } from "@/lib/config";
import { ID, Query } from "appwrite";
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ message: "User id required!" }, { status: 400 })
    }

    const userProfile = await databases.listDocuments(
      dbId,
      profileCollectionId,
      [
        Query.equal('userId', userId)
      ]
    )

    let exists = false
    if (userProfile && userProfile.total > 0) {
      exists = true;
    }

    return NextResponse.json({ message: "User profile fetched successfully.", exists, userProfile }, { status: 200 })
  } catch (error) {
    console.log("Error while fetching user profile: ", error)
    return NextResponse.json({ message: "Something went wrong while fetching profile" })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, email, avatar } = await req.json();
    if (!userId || !email) {
      return NextResponse.json({ message: "UserId and email both are required!" }, { status: 400 })
    }

    const existing = await databases.listDocuments(dbId, profileCollectionId, [
      Query.equal('userId', userId),
    ]);

    if (existing.total > 0) {
      return NextResponse.json({ message: "Profile already exists!" }, { status: 409 });
    }

    const userProfile = await databases.createDocument(
      dbId,
      profileCollectionId,
      ID.unique(),
      {
        userId,
        email,
        avatar
      }
    )

    if (!userProfile) {
      return NextResponse.json({ message: "User profile not created!" }, { status: 404 });
    }

    return NextResponse.json({ message: "User profile created successfully." }, { status: 201 })
  } catch (error) {
    console.log("Error while creating user profile: ", error)
    return NextResponse.json({ message: "Something went wrong while creating profile" })
  }
}