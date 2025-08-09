import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

function MovieDetails() {
  const { imdbID } = useParams();
 //console.log(imdbID);
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (imdbID) {
      fetchMovieDetails();
    }
  }, [imdbID]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`/api/movies/details/${imdbID}`);
      console.log(res.data);
      setMovie(res.data);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to fetch movie details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Loading movie details...</p>;
  }

  if (error) {
    return <div className="alert alert-danger mt-4 text-center">{error}</div>;
  }

  if (!movie) {
    return <p className="text-center mt-4">No movie found.</p>;
  }

  return (
    <div className="container mt-4">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-3">
        ← Back to Search
      </button>

      <div className="card shadow-sm">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={movie.poster || 'https://via.placeholder.com/400x600?text=No+Image'}
              className="img-fluid rounded-start"
              alt={movie.title}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">{movie.title}</h3>
              <p><strong>Year:</strong> {movie.year}</p>
              <p><strong>Genre:</strong> {movie.genre}</p>
              <p><strong>Plot:</strong> {movie.plot}</p>
              <p><strong>Director:</strong> {movie.director}</p>
              <p><strong>Actors:</strong> {movie.actors}</p>
              <p className="text-muted">IMDB Rating: {movie.imdbRating}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
