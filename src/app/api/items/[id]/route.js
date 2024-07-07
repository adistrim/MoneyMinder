import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";

export async function DELETE(request, { params }) {
  await connectToDatabase();
  const { id } = params;
  await Item.findByIdAndDelete(id);
  return NextResponse.json({ message: "Item deleted successfully" });
}