import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const level = url.searchParams.get("level");
  const token = url.searchParams.get("token");

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/level`,
      { level: level },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error when completing level:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the level." },
      { status: 500 }
    );
  }
}
