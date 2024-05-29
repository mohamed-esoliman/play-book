import React, { useEffect } from 'react';
import { useState } from 'react';
import { getGames } from '../services/apiService';



function Home() {
    const [games, setGames] = useState([]);
    useEffect(() => {
        getGames(5).then((data) => {
            setGames(data);
        });
    }
    , []);



    return (
        <div>
            <h1>Welcome to the Homepage!</h1>
            <p>This is a simple homepage template.</p>
            {/* {games.map((game) => (
                <div className="gameCard" key={game.id}>
                    <h2>{game.title}</h2>
                    <p>{game.description}</p>
                </div>
            ))} */}
        </div>
    );
}

export default Home;