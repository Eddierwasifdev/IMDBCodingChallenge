import MovieDetails from "./MovieDetails";
import SearchBar from "@/components/SearchBar";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  // Await the params to ensure they are resolved
  const { id } = await params;

  return (
    <div className="container mx-auto px-4 py-8 ">
      <SearchBar />
      <MovieDetails id={id} />
    </div>
  );
}
