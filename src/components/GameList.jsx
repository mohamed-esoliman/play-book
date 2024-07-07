import styles from "../styles/GameList.module.scss";

const games = [
  { id: 1, name: "Game One", description: "Description for game one." },
  { id: 2, name: "Game Two", description: "Description for game two." },
];

const GameList = () => {
  return (
    <div className={styles.gameList}>
      {games.map((game) => (
        <div key={game.id} className={styles.gameItem}>
          <h3>{game.name}</h3>
          <p>{game.description}</p>
        </div>
      ))}
    </div>
  );
};

export default GameList;
