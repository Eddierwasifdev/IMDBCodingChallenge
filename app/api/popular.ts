import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const defaultQuery = "action"; // Default search query

  try {
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}&s=${defaultQuery}`
    );

    if (response.status === 404) {
      return res.status(404).json({ error: "No movies found" });
    }

    const data = await response.json();
    res.status(200).json(data.Search || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}
