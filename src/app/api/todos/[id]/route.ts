import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTodoSchema = z.object({
  completed: z.boolean().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(500, "Title cannot exceed 500 characters")
    .optional(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid due date format",
    }),
  priority: z.enum(["urgent", "high", "medium", "low"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID parameter" }, { status: 400 });
    }

    // Verify task exists and belongs to this user
    const existing = await db.todo.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Todo not found or access denied" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateTodoSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid input payload" },
        { status: 400 }
      );
    }

    const { completed, title, dueDate, priority } = result.data;

    const todo = await db.todo.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(title !== undefined && { title }),
        ...(dueDate !== undefined && {
          dueDate: dueDate ? new Date(dueDate) : null,
        }),
        ...(priority !== undefined && { priority }),
      },
    });

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Failed to update todo:", error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID parameter" }, { status: 400 });
    }

    // Verify task exists and belongs to this user
    const existing = await db.todo.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Todo not found or access denied" },
        { status: 404 }
      );
    }

    await db.todo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
