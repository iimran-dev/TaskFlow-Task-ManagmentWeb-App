import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createTodoSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(500, "Title cannot exceed 500 characters"),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid due date format",
    }),
});

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const todos = await db.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createTodoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input payload" },
        { status: 400 }
      );
    }

    const { title, dueDate } = result.data;

    // Ensure the user exists in database to maintain relation integrity
    if (user.email) {
      await db.user.upsert({
        where: { id: user.id },
        update: { email: user.email },
        create: {
          id: user.id,
          email: user.email,
          name:
            user.user_metadata?.name ||
            user.user_metadata?.full_name ||
            user.email.split("@")[0],
        },
      });
    }

    const todo = await db.todo.create({
      data: {
        userId: user.id,
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
