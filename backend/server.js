require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const IGDB_ID = process.env.IGDB_ID;
const IGDB_SECRET = process.env.IGDB_SECRET;

