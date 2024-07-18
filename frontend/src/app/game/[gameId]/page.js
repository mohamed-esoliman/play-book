import GameDetails from '@/components/GameDetails';

export default function gamePage({ params }){
  const gameId = params.gameId;
  return <GameDetails gameId={gameId} />;
};