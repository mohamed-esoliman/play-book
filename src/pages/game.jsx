const Game = () => {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      getGameDetails(gameId).then((res) => {
        setGameData(res);
      });
    }

    return () => (mounted = false);
  }, [gameId]);

  return (
    <div>
      <h1>{gameData.name}</h1>
      <div className={styles.gameDetails}>
        <div className={styles.gameCover}>
          {gameData.cover && (
            <img src={`https:${gameData.cover.url}`} alt={gameData.name} />
          )}
        </div>
        <div className={styles.gameData}>
          <p>Rating: {gameData.rating}</p>
          <p>
            Genres:{" "}
            {gameData.genres &&
              gameData.genres.map((genre) => genre.name).join(", ")}
          </p>
          <p>
            Platforms:{" "}
            {gameData.platforms &&
              gameData.platforms.map((platform) => platform.name).join(", ")}
          </p>
          <p>Summary: {gameData.summary}</p>
        </div>
      </div>
    </div>
  );
};

export default Game;