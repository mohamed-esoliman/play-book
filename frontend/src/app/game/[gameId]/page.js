import GameDetails from '../../../components/GameDetails';

export const metadata = {
  title: 'Game Details - Play-Book',
  description: 'Showing details for a specific game',
}

export default function gamePage({ params }){
  const gameId = params.gameId;
  return <GameDetails gameId={gameId} />;
};