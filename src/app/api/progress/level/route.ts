import { NextResponse, NextRequest } from "next/server";
import axios from "axios";


export async function GET(request: NextRequest) {
  // const { level } = await request.json();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/progress/level`,
      {
        level: 1,
      },
    );
    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
