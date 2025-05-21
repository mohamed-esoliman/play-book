import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Game } from '@/types';

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'TBA';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '/images/placeholder.svg';
    return url.replace('t_thumb', 't_cover_big');
  };

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/games/${game.id}`} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={getImageUrl(game.cover?.url)}
            alt={game.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white truncate">{game.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-400">
              {formatDate(game.first_release_date)}
            </div>
            {game.rating && (
              <div className="bg-blue-600 text-white text-sm font-bold rounded-full px-2 py-1">
                {Math.round(game.rating)}%
              </div>
            )}
          </div>
          {game.platforms && game.platforms.length > 0 && (
            <div className="mt-2 text-xs text-gray-400 truncate">
              {game.platforms.slice(0, 3).map((platform) => platform.name).join(', ')}
              {game.platforms.length > 3 && '...'}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default GameCard; 