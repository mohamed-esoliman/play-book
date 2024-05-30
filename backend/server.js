require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


// get access token and create api client

let accessToken = null;
let apiClient = null;


const getAccessToken = async () => {
  if (!accessToken){
    try{
      const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_ID}&client_secret=${process.env.IGDB_SECRET}&grant_type=client_credentials`);
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
        'Client-ID': process.env.IGDB_ID,
        'Authorization': `Bearer ${accessToken}`,
      },}

      apiClient = axios.create(apiConfig);
  }

  return apiClient;
}

// get games

app.post('/games', async (req, res) => {
  try{
    const apiClient = await getApiClient();
    const response = await apiClient.post('/games', {
      fields: req.body.fields,
      limit: req.body.limit
    });

    res.send(response.data);
  }
  catch (err){
    console.error(err);
  }
});



// start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
