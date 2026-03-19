import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    // Retrieve session with line_items expanded to get the price ID
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });

    const priceId = fullSession.line_items?.data[0]?.price?.id;

    let plan = "pro";
    if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) plan = "business";

    if (userId) {
      await supabase
        .from("user_plans")
        .upsert({ user_id: userId, plan, updated_at: new Date().toISOString() });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const email = customer.email;

      if (email) {
        const { data } = await supabase.auth.admin.listUsers();
        const user = data.users.find((u) => u.email === email);
        if (user) {
          await supabase
            .from("user_plans")
            .upsert({ user_id: user.id, plan: "free", updated_at: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.error("Error handling subscription deletion:", err);
    }
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    try {
      const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
      const email = customer.email;

      if (email) {
        const priceId = subscription.items.data[0]?.price?.id;
        let plan = "pro";
        if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) plan = "business";

        const { data } = await supabase.auth.admin.listUsers();
        const user = data.users.find((u) => u.email === email);
        if (user) {
          await supabase
            .from("user_plans")
            .upsert({ user_id: user.id, plan, updated_at: new Date().toISOString() });
        }
      }
    } catch (err) {
      console.error("Error handling subscription update:", err);
    }
  }

  return NextResponse.json({ received: true });
}
