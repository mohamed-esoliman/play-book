import { NextResponse } from 'next/server';
import axios from 'axios';

async function getAccessToken() {
  try {
    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
    );

    return {
      token: response.data.access_token,
      expiry: Date.now() + response.data.expires_in * 1000
    };
  } catch (error) {
    console.error('Error fetching IGDB token:', error);
    throw new Error('Failed to authenticate with IGDB');
  }
}

let tokenCache = {
  token: null as string | null,
  expiry: 0
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { endpoint, query } = body;
    
    if (!endpoint || !query) {
      return NextResponse.json(
        { error: 'Endpoint and query are required' }, 
        { status: 400 }
      );
    }

    if (!tokenCache.token || Date.now() >= tokenCache.expiry) {
      const tokenData = await getAccessToken();
      tokenCache = tokenData;
    }

    const response = await axios.post(`https://api.igdb.com/v4/${endpoint}`, query, {
      headers: {
        'Authorization': `Bearer ${tokenCache.token}`,
        'Client-ID': process.env.IGDB_CLIENT_ID || '',
        'Content-Type': 'text/plain'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('IGDB API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch data from IGDB' }, 
      { status: error.response?.status || 500 }
    );
  }
} 