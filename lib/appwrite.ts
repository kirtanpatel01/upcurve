import { Account, Client, Databases, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

const databases = new Databases(client)
const account = new Account(client)

export { databases, account, client }

export async function checkAuthStatus() {
  try {
    const user = await account.get();
    console.log('User is authenticated: ', user) 
    return user
  } catch (error) {
    console.log("User is not authenticated: ", error)
    return null
  }
}