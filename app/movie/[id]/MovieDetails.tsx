"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Clock, Film } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import Image from "next/image";

interface MovieDetails {
  Title?: string;
  Year?: string;
  Plot?: string;
  Poster?: string;
  Director?: string;
  Actors?: string;
  imdbRating?: string;
  Genre?: string;
  Runtime?: string;
}

export default function MovieDetails({ id }: { id: string }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      // Only fetch if id starts with 'tt'
      if (!id.toString().startsWith("tt")) {
        setError("Invalid movie ID format");
        return;
      }

      fetch(`/api/movie?id=${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.Error) {
            setError(data.Error);
            setMovie(null);
          } else {
            setMovie(data);
            setError(null);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch movie details:", err);
          setError("Failed to fetch movie details");
          setMovie(null);
        });
    }
  }, [id]);

  if (error) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="text-red-500 flex items-center justify-center">
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!movie) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const genres = movie.Genre ? movie.Genre.split(", ") : [];

  return (
    <Card className="w-full max-w-3xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center justify-between">
          <span>
            {movie.Title}{" "}
            <span className="text-muted-foreground">({movie.Year})</span>
          </span>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            <span className="text-xl">{movie.imdbRating}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {movie.Poster ? (
            <Image
              src={movie.Poster || "/no-poster.jpg"}
              alt={movie.Title || "Movie Poster"}
              width={300}
              height={450}
              className="rounded-lg shadow-lg object-cover w-full md:w-[300px] h-[450px]"
              priority // Optional: Use if the image is above the fold
            />
          ) : (
            <div className="rounded-lg shadow-lg w-full md:w-[300px] h-[450px] bg-gray-200 flex items-center justify-center">
              <span className="text-muted-foreground">No Poster Available</span>
            </div>
          )}
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{movie.Runtime}</span>
            </div>

            <div className="space-y-4">
              <p className="text-lg leading-relaxed">{movie.Plot}</p>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">Director:</span>
                  <span>{movie.Director}</span>
                </div>

                <div>
                  <span className="font-semibold">Cast:</span>
                  <p className="mt-1">{movie.Actors}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
