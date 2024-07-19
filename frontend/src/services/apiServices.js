import axios from 'axios';

// fetch games
export const getGames = async (pageNumber, limitPerPage) => {
  try{
    const offset = (pageNumber - 1) * limitPerPage;
    const popularityQuery = `fields game_id, value; sort value desc; limit ${limitPerPage}; offset ${offset};`;

    const response = await axios.post('http://localhost:5000/games', {
      fields: "id, name, cover.image_id, first_release_date, platforms.name, rating, rating_count",
      page_number: pageNumber,
      limit_per_page: limitPerPage,
      popularityQuery: popularityQuery
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
    const query = `fields *; where id = ${id};`;
    const response = await axios.post('http://localhost:5000/games/specificGame', {
      query: query
    });

    return response.data[0];
  }
  catch (err){
    console.error(err)
  }
};


// search games
export const searchGames = async (query, limit = 10) => {
  try {
    const response = await axios.get('http://localhost:5000/games/search', {
      params: {
        query: query,
        limit: limit,
        fields: 'id,name,cover.image_id,involved_companies.company.name,first_release_date'
      }
    });
    return response.data;
  } catch (err) {
    console.error(err);
  }
};