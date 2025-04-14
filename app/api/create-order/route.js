// app/api/create-order/route.ts
import { NextResponse } from 'next/server';
import { Cashfree } from "cashfree-pg"

export async function POST(req) {
  const cashFree = new Cashfree(
    Cashfree.SANDBOX,
    process.env.CASHFREE_API_CLIENT_ID,
    process.env.CASHFREE_API_CLIENT_SECRET
  );
  const request = await req.json();
  console.log("Request:", request);
  try {
    const response = await cashFree.PGCreateOrder(request);
    console.log("Cashfree response:", response);
    return NextResponse.json(response?.data, { status: 200 });
  } catch (error) {
    console.error("Error creating shfree order:", error?.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
