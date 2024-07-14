import Layout from "../layout/layout";
import styles from "../styles/pages/Home.module.scss";
import { useEffect, useState } from "react";
import { getGames } from "../services/apiServices";
import Link from "next/link";
import GameCard from "../components/GameCard";

const Home = () => {

  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const limitPerPage = 40;

  
  useEffect(() => {
      let mounted = true;
      if (mounted){
      getGames(page, limitPerPage).then((res) => {
        if (Array.isArray(res)) {
          setGames(res);
        }
      });
      }

      return () => mounted = false;
  }, [page]);

        

  return (
    <Layout>
        <div className={styles.container}>
          <div className={styles.gameList}>
              {games.map((game) => {
                  return (
                      <Link href={`/game/${game.id}`} key={game.id}>
                          <GameCard game={game} />
                      </Link>
                  );
              })}
          </div>
          <span className={styles.changePage}>
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
              <p>{`page ${page}`}</p>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
          </span>
        </div>
    </Layout>
  );
}


export default Home;