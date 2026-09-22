import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const name =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email.split("@")[0];

    const dbUser = await db.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        ...(name ? { name } : {}),
      },
      create: {
        id: user.id,
        email: user.email,
        name,
      },
    });

    return NextResponse.json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
