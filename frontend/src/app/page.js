import dynamic from 'next/dynamic'
import styles from "../styles/Home.module.scss";
import { getGames } from "../services/apiServices";

export const metadata = {
  title: 'Play-Book - Game List',
  description: 'Browse our collection of games',
}

const DynamicGameList = dynamic(() => import('../components/GameList'), {
  ssr: false,
})

export default async function HomePage() {
  const initialGames = await getGames(1, 40);

  return (
    <div className={styles.container}>
      <DynamicGameList initialGames={initialGames} />
    </div>
  );
}