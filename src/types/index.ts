export interface Game {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
  first_release_date?: number;
  rating?: number;
  summary?: string;
  platforms?: Array<{
    name: string;
  }>;
  genres?: Array<{
    name: string;
  }>;
  screenshots?: Array<{
    url: string;
  }>;
  storyline?: string;
  videos?: Array<{
    video_id: string;
  }>;
  similar_games?: Array<Game>;
}

export interface Comment {
  _id: string;
  gameId: number;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  photoURL?: string;
  favoriteGames?: number[];
}

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}; 