interface MovieDetailsProps {
  id: string; // Ensure the type matches what you're passing
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ id }) => {
  // Fetch movie details using the id
  return <div>{/* Render movie details for ID: {id} */}</div>;
};

export default MovieDetails;
