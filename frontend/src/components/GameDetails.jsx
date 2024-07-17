'use client'

import { useState, useEffect } from "react";
import styles from "../styles/components/GameDetails.module.scss";
import { getGameDetails } from "../services/apiServices";

const GameDetails = ({gameId}) => {

  const [gameData, setGameData] = useState({});
  console.log(gameId);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (gameId) {
        const data = await getGameDetails(gameId);
        setGameData(data);
      }
    };
    fetchGameDetails();
  }, [gameId]);

  return (
    <div className={styles.gameDetails}>
      <h1>{gameData.name}</h1>
      <div className={styles.gameContent}>
        <div className={styles.gameCover}>
          {gameData.cover && (
            <img src={`https:${gameData.cover.url}`} alt={gameData.name} />
          )}
        </div>
        <div className={styles.gameInfo}>
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
          {gameData.videos && (
            <div className={styles.gameTrailer}>
              <video controls>
                <source src={gameData.videos[0].video_id} type="video/mp4" />
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
