// src/pages/SearchResults.js

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import './SearchResults.css'; // Import the CSS file

const SearchResults = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    setSearchQuery(query);

    const fetchResults = async () => {
      try {
        const response = await axios.get("https://your-api-endpoint/search", {
          params: { q: query }
        });
        setResults(response.data.results); // Adjust based on your API response
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [location.search]);

  return (
    <div className="search-results">
      <h1>Search Results for "{searchQuery}"</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((result, index) => (
            <li key={index}>{result.title}</li> // Adjust based on your data structure
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;



