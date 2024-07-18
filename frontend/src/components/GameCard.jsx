import Link from "next/link";
import styles from "@/styles/components/GameCard.module.scss";

const GameCard = ({ game }) => {
  const toDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.getFullYear();
  };

  const getHigherResolution = (imageId) => {
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
  };

  return (
    <Link href={`/game/${game.id}`}>
      <div className={styles.gameCard}>
        <div className={styles.gameImage}>
          {game.cover && (
            <img
              src={getHigherResolution(game.cover.image_id)}
              alt={game.name}
            />
          )}
        </div>
        <div className={styles.gameInfo}>
          <span className={styles.gameRating}>
            <p className={styles.rating}>{(game.rating / 10).toFixed(1)}</p>
            <p className={styles.ratingCount}> votes</p>
          </span>
          <h2>{game.name}</h2>
          <span className={styles.gameReleased}>
            {toDate(game.first_release_date)}
          </span>
          <span className={styles.gamePlatforms}>
            {game.platforms.map((platform, index) => (
              <span key={index}>{platform.name}</span>
            ))}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
