import React, { useState , useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "../api/axios";
import { Link } from "react-router-dom";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]); // ✅ Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentQueries, setRecentQueries] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
  const fetchRecentQueries = async () => {
    try {
      // ✅ Ensure correct base URL
      const res = await axios.get("/api/movies/recent-queries");
      console.log("Recent queries:", res.data);
      setRecentQueries(res.data || []);
    } catch (err) {
      console.error("Error fetching recent queries:", err);
    }
  };

  fetchRecentQueries();
}, []);


  const searchMovies = async (e) => {
     e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/movies/search?query=${encodeURIComponent(query)}`);
      const data = res.data.search;
    console.log(data);
      // ✅ Ensure movies is always an array
      if (Array.isArray(data)) {
        setMovies(data);
      } else if (Array.isArray(data.results)) {
        setMovies(data.results);
      } else {
        setMovies([]);
        setError("No results found");
      }
    } catch (err) {
      setError("Error fetching movies");
    }
    setLoading(false);
  };

const handleSelectQuery = (selected) => {
    setQuery(selected);
    setShowDropdown(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🎬 Movie Search</h2>

      <form className="d-flex mb-4" onSubmit={searchMovies}>
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => {setQuery(e.target.value);
            setShowDropdown(e.target.value.length > 0);
        }}
         onFocus={() => setShowDropdown(query.length > 0)}
        />
        {showDropdown && recentQueries.length > 0 && (
          <ul className="list-group position-absolute w-70 mt-4" style={{ zIndex: 1000 }}>
            {recentQueries
              .filter(q => q.queryText.toLowerCase().includes(query.toLowerCase()))
              .map((q, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action mt-2"
                  onClick={() => handleSelectQuery(q.queryText)}
                  style={{ cursor: "pointer" }}
                >
                  {q.queryText}
                </li>
              ))}
          </ul>
        )}
        <button className="btn btn-primary">Search</button>
      </form>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {Array.isArray(movies) && movies.map((movie, index) => (
          <div key={index} className="col-md-4 mb-3">
            <div className="card h-100">
              {movie.poster && movie.poster !== "N/A" && (
                <img src={movie.poster} className="card-img-top" alt={movie.title} />
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.Year}</p>
                <Link to={`/movies/${movie.imdbID}`} className="btn btn-outline-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


