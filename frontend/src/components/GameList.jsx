"use client";

import { useState } from "react";
import Link from "next/link";
import GameCard from "./GameCard";
import styles from "../styles/components/GameList.module.scss";
import { getGames } from "../services/apiServices";

export default function GameList({ initialGames }) {
  const [games, setGames] = useState(initialGames);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const limitPerPage = 40;

  const loadMoreGames = async () => {
    const nextPage = page + 1;
    const newGames = await getGames(nextPage, limitPerPage);
    if (Array.isArray(newGames)) {
      setGames([...games, ...newGames]);
      setPage(nextPage);
    }
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
        <button onClick={loadMoreGames} disabled={page === totalPages}>
          Load More
        </button>
      </span>
    </>
  );
}
