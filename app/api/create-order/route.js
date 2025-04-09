// app/api/create-order/route.ts
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();

  const cfRes = await fetch('https://sandbox.cashfree.com/pg/orders', {
    method: 'POST',
    headers: {
      'x-api-version': process.env.CF_API_VERSION,
      'x-client-id': process.env.CASHFREE_API_CLIENT_ID,
      'x-client-secret': process.env.CASHFREE_API_CLIENT_SECRET,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });

  const data = await cfRes.json();
  return NextResponse.json(data, { status: cfRes.status });
}
