import styles from "../styles/components/GameCard.module.scss";

const GameCard = ({ game }) => {
  return (
    <div className={styles.gameCard}>
      <div className={styles.gameCard}>
        <img src={game.cover.url} alt={game.name} />
      </div>
      <div className={styles.gameInfo}>
        <span className={styles.gameRating}>{(game.rating / 10).toFixed(1)}</span>
        <h2>{game.name}</h2>
        <span className={styles.gameReleased}>{game.released}</span>
        <button className={styles.expandGame}></button>
      </div>
    </div>
  );
}

export default GameCard;