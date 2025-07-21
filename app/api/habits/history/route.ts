import { databases } from "@/lib/appwrite"
import { dbId, historyCol } from "@/lib/config"
import { Query } from "appwrite"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: "User id not found!" }, { status: 404 })
  }
  try {
    const history = await databases.listDocuments(
      dbId,
      historyCol,
      [
        Query.equal("userId", userId)
      ]
    )

    if (history.total === 0) {
      return NextResponse.json({ chartData: [] }, { status: 200 })
    }

    const rawHistory = history.documents;

    const chartData = rawHistory.map(doc => {
      const dateObj = new Date(doc.$createdAt);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });

      return {
        day: weekday,
        habits: doc.count,
        date: formattedDate
      }
    });

    return NextResponse.json({ message: "History fetched successfully for the user.", chartData }, { status: 200 })
  } catch (error) {
    console.log('Error while fetching habit history: ', error)
    return NextResponse.json({ error: "Error while fetching habit history!" }, { status: 500 })
  }
}