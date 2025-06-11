import { verify } from "jsonwebtoken";

type JwtPayload = {
  email: string;
};

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    return Response.json({ email: decoded.email });
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
