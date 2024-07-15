'use client'

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import GameCard from "./GameCard";
import styles from "../styles/components/GameList.module.scss";
import { getGames } from "../services/apiServices";

export default function GameList({ initialGames }) {
  const [games, setGames] = useState(initialGames);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const limitPerPage = 40;
  const [cachedPages, setCachedPages] = useState({ 1: initialGames });

  const fetchGames = useCallback(
    async (pageNumber) => {
      if (cachedPages[pageNumber]) {
        setGames(cachedPages[pageNumber]);
      } else {
        const newGames = await getGames(pageNumber, limitPerPage);
        if (Array.isArray(newGames)) {
          setGames(newGames);
          setCachedPages((prevCache) => ({
            ...prevCache,
            [pageNumber]: newGames,
          }));
        }
      }
    },
    [cachedPages]
  );

  useEffect(() => {
    fetchGames(page);
  }, [page, fetchGames]);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <>
      <div className={styles.gameList}>
        {games.map((game) => (
          <Link href={`/game/${game.id}`} key={game.id}>
            <GameCard game={game} />
          </Link>
        ))}
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
