import styles from "../styles/Home.module.scss";
import GameList from "../components/GameList";
import { getGames } from "../services/apiServices";

export const metadata = {
  title: 'Play-Book - Game List',
  description: 'Browse our collection of games',
}

export default async function Home() {
  const initialGames = await getGames(1, 40);

  return (
    <div className={styles.container}>
      <GameList initialGames={initialGames} />
    </div>
  );
}