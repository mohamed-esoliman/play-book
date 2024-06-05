import axios from 'axios';

// fetch games
export const getGames = async (pageNumber, limit) => {
  try{
    const response = await axios.post('http://localhost:5000/games', {
      fields: "id, name, cover.url, genres.name, platforms.name, rating",
      pageNumber: pageNumber,
      limit: limit,
      sort: "rating desc",
    });

    return response.data;
  }
  catch (err){
    console.error(err);
  }
};


// fetch game details
export const getGameDetails = async(id) => {
  try{
    const response = await axios.post('http://localhost:5000/specificGame', {
      gameId: id
    });

    return response.data;
  }
  catch (err){
    console.error(err)
  }
};
