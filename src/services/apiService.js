import axios from "axios";

let accessToken = null;
let apiClient = null;



const getAccessToken = async () => {
  if (!accessToken){
    try{
      const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_IGDB_ID}&client_secret=${process.env.REACT_APP_IGDB_SECRET}&grant_type=client_credentials`);
      accessToken = response.data.access_token;
    }

    catch (err){
      console.error(err);
    }
  }
  
  return accessToken;
};


const getApiClient = async () => {
  if (!apiClient){
    const accessToken = await getAccessToken();

    const apiConfig = {
      baseURL: "https://api.igdb.com/v4",
      headers: {
        'Client-ID': process.env.REACT_APP_IGDB_ID,
        'Authorization': `Bearer ${accessToken}`,
      },}

      apiClient = axios.create(apiConfig);
  }

  return apiClient;
}


// fetch games
export const getGames = async (num) => {
  try{
    const apiClient = await getApiClient();
    const response = await apiClient.post('/games', {
    fields: 'id, name, cover.url, first_release_date, genres.name, platforms.name, rating, summary',
    limit: num
    });
    
    console.log(accessToken);
    console.log(apiClient);
    console.log(response.data);
    return response.data;
  }
  catch (err){
    console.error(err);
  }
};




export default apiClient;