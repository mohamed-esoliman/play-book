import React, { useEffect } from 'react';


function Home({ gameList }) {

    return (
        <div>
            <h1>Welcome to the Homepage!</h1>
            <p>This is a simple homepage template.</p>
            <div className="gameList">
                {gameList.map((game) => {
                    return (
                        <div className="gameCard" key={game.id}>
                            <div className="gameCover">
                                {game.cover && <img src={`https:${game.cover.url}`} alt={game.name} />}
                            </div>
                            <div className="gameData">
                                <h2>{game.name}</h2>
                                <p>Rating: {game.rating}</p>
                                <p>Released: {game.released}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;