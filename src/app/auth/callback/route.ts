import { NextResponse } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/#app";

  const supabase = await createClient();

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data?.user?.email) {
        try {
          await db.user.upsert({
            where: { id: data.user.id },
            update: { email: data.user.email },
            create: {
              id: data.user.id,
              email: data.user.email,
              name:
                data.user.user_metadata?.name ||
                data.user.user_metadata?.full_name ||
                data.user.email.split("@")[0],
            },
          });
        } catch (dbErr) {
          console.error("Failed to sync user on code exchange:", dbErr);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
    if (!error) {
      if (data?.user?.email) {
        try {
          await db.user.upsert({
            where: { id: data.user.id },
            update: { email: data.user.email },
            create: {
              id: data.user.id,
              email: data.user.email,
              name:
                data.user.user_metadata?.name ||
                data.user.user_metadata?.full_name ||
                data.user.email.split("@")[0],
            },
          });
        } catch (dbErr) {
          console.error("Failed to sync user on otp verify:", dbErr);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Fallback redirect to workspace if already processed or on callback
  return NextResponse.redirect(`${origin}${next}`);
}
