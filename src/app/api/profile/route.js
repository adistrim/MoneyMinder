import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

async function protect(request) {
  let token;

  if (
    request.headers.get("authorization") &&
    request.headers.get("authorization").startsWith("Bearer")
  ) {
    token = request.headers.get("authorization").split(" ")[1];
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  await connectToDatabase();
  const userId = await protect(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not authorized" },
      { status: 401 },
    );
  }

  const user = await User.findById(userId).select("name email createdAt");
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, user });
}
