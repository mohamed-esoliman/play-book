import axios from 'axios';

// fetch games
export const getGames = async (pageNumber, limitPerPage) => {
  try{
    const response = await axios.post('http://localhost:5000/games', {
      fields: "id, name, cover.url, first_release_date, platforms.name, rating, rating_count",
      page_number: pageNumber,
      limit_per_page: limitPerPage,
    });

    console.log(response.data);
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

    return response.data[0];
  }
  catch (err){
    console.error(err)
  }
};