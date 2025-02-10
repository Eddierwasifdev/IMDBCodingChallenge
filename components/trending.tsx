"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface TrendingMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  imdb_id?: string;
}

export default function Trending() {
  const [trending, setTrending] = useState<TrendingMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const moviesPerPage = {
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  };

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const trendingResponse = await fetch(
          "https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=1",
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
            },
          }
        );

        if (!trendingResponse.ok) {
          throw new Error(`HTTP error! status: ${trendingResponse.status}`);
        }

        const trendingData = await trendingResponse.json();

        const moviesWithImdbIds = await Promise.all(
          trendingData.results.map(async (movie: TrendingMovie) => {
            const detailsResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/external_ids`,
              {
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
                },
              }
            );
            const details = await detailsResponse.json();
            return {
              ...movie,
              imdb_id: details.imdb_id,
            };
          })
        );

        setTrending(moviesWithImdbIds);
      } catch (err) {
        console.error("Error fetching trending:", err);
        setError("Failed to load trending movies");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const nextPage = () => {
    setCurrentPage(
      (prev) => (prev + 1) % Math.ceil(trending.length / moviesPerPage.xl)
    );
  };

  const prevPage = () => {
    setCurrentPage(
      (prev) =>
        (prev - 1 + Math.ceil(trending.length / moviesPerPage.xl)) %
        Math.ceil(trending.length / moviesPerPage.xl)
    );
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (loading) return <div>Loading trending movies...</div>;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentPage * 100}%)` }}
      >
        {trending.map((movie) => (
          <Link
            href={`/movie/${movie.imdb_id}`}
            key={movie.id}
            className="flex-none w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 px-2"
          >
            <Card className="h-full">
              <div className="relative pt-[150%]">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg"
                  }
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover rounded-t-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
                {movie.release_date && (
                  <p className="text-sm text-gray-500">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-between pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto"
          onClick={prevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="pointer-events-auto"
          onClick={nextPage}
          disabled={
            currentPage === Math.ceil(trending.length / moviesPerPage.xl) - 1
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
