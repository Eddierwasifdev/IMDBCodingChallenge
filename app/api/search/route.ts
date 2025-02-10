import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 }
    );
  }

  const OMDB_API_KEY = process.env.OMDB_API_KEY;

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?s=${query}&apikey=${OMDB_API_KEY}`
    );
    const data = await response.json();

    if (data.Error) {
      return NextResponse.json({ error: data.Error }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
