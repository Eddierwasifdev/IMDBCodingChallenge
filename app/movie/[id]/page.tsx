import Link from "next/link";
import MovieDetails from "./MovieDetails";
import SearchBar from "@/components/SearchBar";

export default function MoviePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <SearchBar />
      <MovieDetails id={params.id} />
    </div>
  );
}
