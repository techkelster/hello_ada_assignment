import prisma from "@/lib/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

const bcrypt = require("bcryptjs");

export async function POST(req: NextRequest) {
  try {
    // Read and parse the request body
    const { email, name, password } = await req.json();

    // Check if email is provided
    if (!email) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Store hashed password
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
