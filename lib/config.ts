const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const endPoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME!
const dbId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!
const habitCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HABIT_ID!
const profileCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PROFILE_ID!
const historyCol = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_HABIT_HOSTORY_ID!
const exerciseCol = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EXERCISE_ID!
const exerciseLogCol = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_EXERCISE_LOGS_ID!

export {
  projectId,
  endPoint,
  project,
  dbId,
  habitCollectionId,
  profileCollectionId,
  historyCol,
  exerciseCol,
  exerciseLogCol,
}