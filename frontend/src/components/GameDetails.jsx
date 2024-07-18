"use client"

import React, { useState, useEffect } from "react";
import { getGameDetails } from "@/services/apiServices";
import styles from "@/styles/components/GameDetails.module.scss";

const GameDetails = ({ gameId }) => {
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (gameId) {
        setLoading(true);
        const data = await getGameDetails(gameId);
        setGameData(data);
        setLoading(false);
      }
    };
    fetchGameDetails();
  }, [gameId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!gameData)
    return <div className={styles.noData}>No game data available</div>;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGenreName = (id) => {
    const genreMap = {
      31: "Adventure",
      32: "Indie",
      34: "Visual Novel",
    };
    return genreMap[id] || "Unknown Genre";
  };

  const getPlatformName = (id) => {
    const platformMap = {
      3: "Linux",
      6: "PC (Microsoft Windows)",
      14: "Mac",
    };
    return platformMap[id] || "Unknown Platform";
  };

  const getThemeName = (id) => {
    const themeMap = {
      19: "Horror",
      44: "Mature",
    };
    return themeMap[id] || "Unknown Theme";
  };

  return (
    <div className={styles.gameDetails}>
      <header className={styles.gameHeader}>
        <h1 className={styles.gameTitle}>{gameData.name}</h1>
        <div className={styles.gameCover}>
          {gameData.cover && (
            <img
              src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.cover}.jpg`}
              alt={gameData.name}
            />
          )}
        </div>
      </header>

      <nav className={styles.tabNav}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "info" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("info")}
        >
          Info
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "media" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("media")}
        >
          Media
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "ratings" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("ratings")}
        >
          Ratings
        </button>
      </nav>

      <div className={styles.tabContent}>
        {activeTab === "info" && (
          <section className={styles.infoTab}>
            <h2>Game Information</h2>
            <div className={styles.infoGrid}>
              <div>
                <h3>Release Date</h3>
                <p>{formatDate(gameData.first_release_date)}</p>
              </div>
              <div>
                <h3>Genres</h3>
                <ul>
                  {gameData.genres.map((genreId) => (
                    <li key={genreId}>{getGenreName(genreId)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Platforms</h3>
                <ul>
                  {gameData.platforms.map((platformId) => (
                    <li key={platformId}>{getPlatformName(platformId)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Game Modes</h3>
                <p>
                  {gameData.game_modes.includes(1)
                    ? "Single Player"
                    : "Unknown"}
                </p>
              </div>
            </div>
            <div className={styles.summary}>
              <h3>Summary</h3>
              <p>{gameData.summary}</p>
            </div>
            <div className={styles.storyline}>
              <h3>Storyline</h3>
              <p>{gameData.storyline}</p>
            </div>
          </section>
        )}

        {activeTab === "media" && (
          <section className={styles.mediaTab}>
            <h2>Media</h2>
            {gameData.videos && gameData.videos.length > 0 && (
              <div className={styles.gameTrailer}>
                <h3>Trailer</h3>
                <div className={styles.videoWrapper}>
                  <iframe
                    src={`https://www.youtube.com/embed/${gameData.videos[0]}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
            {gameData.screenshots && gameData.screenshots.length > 0 && (
              <div className={styles.gameScreenshots}>
                <h3>Screenshots</h3>
                <div className={styles.screenshotGrid}>
                  {gameData.screenshots.map((screenshotId, index) => (
                    <img
                      key={index}
                      src={`https://images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshotId}.jpg`}
                      alt={`Screenshot ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "ratings" && (
          <section className={styles.ratingsTab}>
            <h2>Ratings and Reviews</h2>
            <div className={styles.ratingGrid}>
              <div className={styles.ratingItem}>
                <h3>IGDB User Rating</h3>
                <div
                  className={styles.ratingBar}
                  style={{ width: `${gameData.rating}%` }}
                ></div>
                <p>
                  {gameData.rating.toFixed(1)} / 100 ({gameData.rating_count}{" "}
                  votes)
                </p>
              </div>
              {gameData.aggregated_rating && (
                <div className={styles.ratingItem}>
                  <h3>Critic Rating</h3>
                  <div
                    className={styles.ratingBar}
                    style={{ width: `${gameData.aggregated_rating}%` }}
                  ></div>
                  <p>
                    {gameData.aggregated_rating.toFixed(1)} / 100 (
                    {gameData.aggregated_rating_count} reviews)
                  </p>
                </div>
              )}
              {gameData.total_rating && (
                <div className={styles.ratingItem}>
                  <h3>Total Rating</h3>
                  <div
                    className={styles.ratingBar}
                    style={{ width: `${gameData.total_rating}%` }}
                  ></div>
                  <p>
                    {gameData.total_rating.toFixed(1)} / 100 (
                    {gameData.total_rating_count} total)
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <section className={styles.additionalInfo}>
        <h2>Additional Information</h2>
        {gameData.themes && gameData.themes.length > 0 && (
          <div className={styles.themes}>
            <h3>Themes</h3>
            <ul>
              {gameData.themes.map((themeId) => (
                <li key={themeId}>{getThemeName(themeId)}</li>
              ))}
            </ul>
          </div>
        )}
        {gameData.websites && gameData.websites.length > 0 && (
          <div className={styles.websites}>
            <h3>Websites</h3>
            <ul>
              {gameData.websites.map((websiteId, index) => (
                <li key={index}>
                  <a
                    href={`https://www.igdb.com/games/${gameData.slug}/website/${websiteId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Website {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default GameDetails;