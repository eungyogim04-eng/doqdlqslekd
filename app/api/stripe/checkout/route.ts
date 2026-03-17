import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { plan, userId, userEmail } = await req.json();

  const prices: Record<string, string> = {
    pro: process.env.STRIPE_PRO_PRICE_ID!,
    business: process.env.STRIPE_BUSINESS_PRICE_ID!,
  };

  if (!prices[plan]) {
    return NextResponse.json({ error: "잘못된 플랜입니다." }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [{ price: prices[plan], quantity: 1 }],
    metadata: { userId, plan },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
