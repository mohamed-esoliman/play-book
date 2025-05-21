'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameCard from '@/components/ui/GameCard';
import Pagination from '@/components/ui/Pagination';
import { Game } from '@/types';
import igdbClient from '@/lib/igdb/client';

let gamesCache: { [key: string]: { data: Game[], timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const gamesPerPage = 12;

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      setError('');
      
      const offset = (currentPage - 1) * gamesPerPage;
      const cacheKey = `popular-${offset}-${gamesPerPage}`;
      
      if (
        gamesCache[cacheKey] && 
        Date.now() - gamesCache[cacheKey].timestamp < CACHE_DURATION
      ) {
        setGames(gamesCache[cacheKey].data);
        setIsLoading(false);
        return;
      }
      
      try {
        const data = await igdbClient.getPopularGames(gamesPerPage, offset);
        
        if (data) {
          setTotalPages(Math.ceil(500 / gamesPerPage));
          setGames(data);
          
          gamesCache[cacheKey] = {
            data,
            timestamp: Date.now()
          };
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGames();
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="w-full">
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Popular Games</h1>
        <p className="text-gray-400">Discover the highest-rated and most popular games</p>
      </section>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg">Loading games...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {games.map((game) => (
              <motion.div key={game.id} variants={itemVariants}>
                <GameCard game={game} />
              </motion.div>
            ))}
          </motion.div>
          
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </div>
  );
}
