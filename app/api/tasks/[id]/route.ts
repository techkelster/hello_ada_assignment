import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Adjust import path as necessary

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const taskId = parseInt(params.id); // Extract task ID from URL parameters

  try {
    const { title, description } = await req.json(); // Parse request body
    // Update task, ensuring it belongs to the current user
    const task = await prisma.task.update({
      where: {
        id: taskId, // Directly use `id`
      },
      data: {
        title,
        description,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const taskId = parseInt(params.id); // Extract task ID from URL parameters

  try {
    // Check if the task belongs to the current user before deleting
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.task.delete({
      where: {
        id: taskId, // Directly use `id`
      },
    });

    return new NextResponse(null, { status: 204 }); // Empty response for successful deletion
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
