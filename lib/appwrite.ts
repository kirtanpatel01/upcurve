import { Account, Client, Databases } from 'appwrite'
import { endPoint, projectId } from './config'

const client = new Client()
  .setEndpoint(endPoint)
  .setProject(projectId)

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