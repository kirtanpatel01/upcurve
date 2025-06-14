// app\api\send\route.ts

import { account } from '@/lib/appwrite';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        const recoveryURL = process.env.NEXT_PUBLIC_RECOVERY_URL!
        const res = await account.createRecovery(email, recoveryURL)

        return Response.json({ message: "Recovery email sent", data: res }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ error: "Failed to send recovery email!" }, { status: 500 });
    }
}