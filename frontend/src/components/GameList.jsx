'use client'

import { useState, useEffect, useMemo} from "react";
import GameCard from "./GameCard";
import styles from "../styles/components/GameList.module.scss";
import { getGames } from "../services/apiServices";

const GameList = ({ initialGames }) => {

  const [games, setGames] = useState(initialGames || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limitPerPage = 40;

  const gameCache = useMemo(() => ({}), []);

  useEffect(() => {
    const fetchGames = async () => {
      if (gameCache[page]) {
        setGames(gameCache[page]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const newGames = await getGames(page, limitPerPage);
        if (Array.isArray(newGames)) {
          setGames(newGames);
          gameCache[page] = newGames;
        } else {
          throw new Error("Received invalid data from the API");
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (page !== 1 || !initialGames) {
      fetchGames();
    }
  }, [page, initialGames]);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading games...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <>
      <div className={styles.gameList}>
        {games && games.length > 0 ? (
          games.map((game) => (
            <GameCard game={game} />
          ))
        ) : (
          <div className={styles.noGames}>No games available.</div>
        )}
      </div>
      <span className={styles.changePage}>
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <p>{`Page ${page} of ${totalPages}`}</p>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </span>
    </>
  );
}

export default GameList;