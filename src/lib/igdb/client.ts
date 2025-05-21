import axios from 'axios';

class IGDBClient {
  private static instance: IGDBClient;
  private token: string | null = null;
  private tokenExpiry: number = 0;

  private constructor() {}

  public static getInstance(): IGDBClient {
    if (!IGDBClient.instance) {
      IGDBClient.instance = new IGDBClient();
    }
    return IGDBClient.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const clientId = process.env.IGDB_CLIENT_ID;
      const clientSecret = process.env.IGDB_CLIENT_SECRET;

      const response = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
      );

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
      return this.token as string;
    } catch (error) {
      console.error('Error fetching IGDB token:', error);
      throw new Error('Failed to authenticate with IGDB');
    }
  }

  public async makeRequest(endpoint: string, query: string): Promise<any> {
    try {
      const token = await this.getAccessToken();
      const response = await axios.post(`https://api.igdb.com/v4/${endpoint}`, query, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Client-ID': process.env.IGDB_CLIENT_ID || '',
          'Content-Type': 'text/plain'
        }
      });
      return response.data;
    } catch (error) {
      console.error('IGDB API Error:', error);
      throw error;
    }
  }

  public async getPopularGames(limit: number = 20, offset: number = 0): Promise<any> {
    const query = `
      fields name, cover.url, platforms.name, first_release_date, rating, summary, slug;
      where rating > 70 & cover != null & platforms != null;
      sort rating desc;
      limit ${limit};
      offset ${offset};
    `;
    return this.makeRequest('games', query);
  }

  public async getGameById(id: number): Promise<any> {
    const query = `
      fields name, cover.url, platforms.name, first_release_date, rating, summary, storyline, 
      genres.name, involved_companies.company.name, screenshots.url, videos.video_id, similar_games.name, similar_games.cover.url;
      where id = ${id};
    `;
    return this.makeRequest('games', query);
  }

  public async searchGames(searchTerm: string, limit: number = 10): Promise<any> {
    const query = `
      fields name, cover.url, platforms.name, first_release_date, rating;
      search "${searchTerm}";
      where cover != null;
      limit ${limit};
    `;
    return this.makeRequest('games', query);
  }
}

export default IGDBClient.getInstance(); 