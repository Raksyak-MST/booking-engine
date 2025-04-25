// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import { Cashfree } from "cashfree-pg";

export async function POST(req) {
  const cashFree = new Cashfree(
    Cashfree.SANDBOX,
    process.env.CASHFREE_API_CLIENT_ID,
    process.env.CASHFREE_API_CLIENT_SECRET,
  );
  const request = await req.json();
  try {
    const response = await cashFree.PGCreateOrder(request);
    return NextResponse.json(response?.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
