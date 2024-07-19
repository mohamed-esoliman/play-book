import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { searchGames } from "@/services/apiServices";
import styles from "@/styles/components/SearchBox.module.scss";

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsLoading(true);
      const results = await searchGames(query, 5);
      setSuggestions(results);
      setIsLoading(false);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = () => {
    setSearchQuery("");
    setSuggestions([]);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const getImageUrl = (imageId) => {
    return `https://images.igdb.com/igdb/image/upload/t_cover_small/${imageId}.jpg`;
  };

  return (
    <div className={styles.searchBox} ref={searchRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search games..."
        className={styles.searchInput}
      />
      {isLoading && <div className={styles.loader}>Loading...</div>}
      {suggestions?.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((game) => (
            <li key={game.id}>
              <Link href={`/game/${game.id}`}>
                <a onClick={handleSuggestionClick}>
                  <div className={styles.suggestionItem}>
                    {game.cover && (
                      <img
                        src={getImageUrl(game.cover.image_id)}
                        alt={game.name}
                        className={styles.gameCover}
                      />
                    )}
                    <div className={styles.gameInfo}>
                      <h3>{game.name}</h3>
                      <p>
                        {game.involved_companies &&
                          game.involved_companies[0] &&
                          game.involved_companies[0].company.name}
                      </p>
                      <p>Released: {formatDate(game.first_release_date)}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
