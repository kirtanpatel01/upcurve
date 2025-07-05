import { databases } from "@/lib/appwrite"
import { dbId, habitCollectionId, historyCol } from "@/lib/config"
import { ID } from "appwrite"
import { NextResponse } from "next/server"

const qSecret = process.env.QSTASH_SECRET!

export async function PUT(req: Request) {
  const { secret } = await req.json()
  if (secret !== qSecret) {
    return NextResponse.json({ error: "You're not authorized to make this API call!" }, { status: 401 })
  }
  try {
    const habits = await databases.listDocuments(dbId, habitCollectionId, [])

    const userHabitMap: { [userId: string]: typeof habits.documents } = {}

    habits.documents.forEach(habit => {
      if (!userHabitMap[habit?.userId]) {
        userHabitMap[habit.userId] = [];
      }
      userHabitMap[habit.userId].push(habit)
    })

    // const today = new Date();
    // const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' }); // e.g., "Tuesday"

    for (const [userId, userHabits] of Object.entries(userHabitMap)) {
      const completedCount = userHabits.filter(h => h.isCompleted).length
      console.log(completedCount)

      await databases.createDocument(dbId, historyCol, ID.unique(), {
        userId,
        count: completedCount
      })
    }

    await Promise.all(
      Object.values(userHabitMap).flat().map(habit =>
        databases.updateDocument(dbId, habitCollectionId, habit.$id, {
          isCompleted: false
        })
      )
    )

    return NextResponse.json({ message: "Habits fetched successfully.", habits }, { status: 200 })
  } catch (error) {
    console.log('Error while resetting the habits: ', error)
    return NextResponse.json({ error: "Error while restting the habits!" }, { status: 500 })
  }
}
