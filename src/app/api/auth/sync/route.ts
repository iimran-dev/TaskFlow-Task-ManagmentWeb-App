import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. If active user session exists in cookies
    if (user && user.email) {
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
    }

    // 2. Alternatively, check if caller provided user details in JSON body
    let body: { id?: string; email?: string; name?: string } | null = null;
    try {
      body = await request.json();
    } catch {
      // Body may be empty
    }

    if (body?.id && body?.email) {
      const cleanEmail = body.email.trim().toLowerCase();
      const cleanName = body.name?.trim() || cleanEmail.split("@")[0];

      const dbUser = await db.user.upsert({
        where: { id: body.id },
        update: {
          email: cleanEmail,
          ...(cleanName ? { name: cleanName } : {}),
        },
        create: {
          id: body.id,
          email: cleanEmail,
          name: cleanName,
        },
      });

      return NextResponse.json({ success: true, user: dbUser });
    }

    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
}
