import axios from 'axios';

// fetch games
export const getGames = async (num) => {
  try{
    const response = await axios.post('http://localhost:5000/games', {
      fields: "name, summary, rating",
      limit: num
    });

    return response.json();
  }
  catch (err){
    console.error(err);
  }
};

