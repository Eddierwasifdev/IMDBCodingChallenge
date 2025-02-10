"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("query") ?? "";
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/search?query=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data.Search || []);
          setError(null);
        })
        .catch((err) => {
          setError("Failed to fetch search results");
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchBar />

      <h1 className="text-3xl font-bold mb-6 mt-8">
        Search Results for &quot;{query}&quot;
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="h-[225px] w-full" />
              </CardContent>
              <CardFooter className="p-2 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </CardFooter>
            </Card>
          ))
        ) : error ? (
          <div className="text-red-500 col-span-full">{error}</div>
        ) : (
          results.map((movie) => (
            <Link
              key={movie.imdbID}
              href={`/movie/${movie.imdbID}`}
              className="block transition-all duration-200 hover:scale-[1.02]"
            >
              <Card className="overflow-hidden border hover:border-primary">
                <CardContent className="p-0">
                  <div className="relative w-full pt-[150%]">
                    <Image
                      src={
                        movie.Poster !== "N/A" ? movie.Poster : "/no-poster.jpg"
                      }
                      alt={movie.Title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-2 flex flex-col items-start">
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {movie.Title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{movie.Year}</p>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>
      {!loading && !error && results.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No movies found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
