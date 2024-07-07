import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Expense from "@/models/Item";
import jwt from 'jsonwebtoken';

// Middleware to protect routes
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
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  const expenses = await Expense.find({ userId }).sort({ date: -1 });
  return NextResponse.json(expenses);
}

export async function POST(request) {
  await connectToDatabase();
  const userId = await protect(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  const data = await request.json();
  const newExpense = new Expense({ ...data, userId });
  await newExpense.save();
  return NextResponse.json(newExpense);
}