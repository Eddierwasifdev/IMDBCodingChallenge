"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "@/components/SearchBar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Trending from "../components/trending";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/popular")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.Search && Array.isArray(data.Search)) {
          setMovies(data.Search);
        } else {
          console.error("Invalid data format:", data);
        }
        setLoading(false);
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      .catch((error) => {
        console.error("Failed to fetch movies:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center space-x-2">
        <SearchBar />
      </div>
      <h1 className="text-[2rem] font-semibold tracking-wide mb-6 mt-3 pl-2">
        Trending
      </h1>{" "}
      <Trending />
      <h1 className="text-[2rem] font-semibold tracking-wide  mb-6 mt-8 pl-2">
        Latest
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading
          ? // Loading skeletons
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
          : movies.map((movie) => (
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
                          movie.Poster !== "N/A"
                            ? movie.Poster
                            : "/no-poster.jpg"
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
                    <p className="text-xs text-muted-foreground">
                      {movie.Year}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
}
