import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(request) {
  const { level, user } = await request.json();

  try {

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`, {
        level,
        user
    })


  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
