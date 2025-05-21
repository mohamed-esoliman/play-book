'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Game, Comment } from '@/types';
import GameCard from '@/components/ui/GameCard';
import igdbClient from '@/lib/igdb/client';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (status !== 'authenticated' || !session?.user?.id) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const favResponse = await fetch(`/api/favorites?userId=${session.user.id}`);
        
        if (favResponse.ok) {
          const { favoriteGames: gameIds } = await favResponse.json();
          
          if (gameIds.length > 0) {
            const gameDetailsPromises = gameIds.map((id: number) => 
              igdbClient.getGameById(id)
            );
            
            const gameDetailsResponses = await Promise.all(gameDetailsPromises);
            const games = gameDetailsResponses
              .filter(response => response && response.length > 0)
              .map(response => response[0]);
            
            setFavoriteGames(games);
          }
        }
        
        const commentsResponse = await fetch(`/api/comments/user?userId=${session.user.id}`);
        
        if (commentsResponse.ok) {
          const comments = await commentsResponse.json();
          setUserComments(comments);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [session, status]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">You must be signed in to view your profile</h1>
        <Link href="/auth/signin" className="text-blue-500 hover:text-blue-400">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden relative">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl">
              {session?.user?.name?.[0] || 'U'}
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-center sm:text-left">{session?.user?.name}</h1>
          <p className="text-gray-400 text-center sm:text-left">{session?.user?.email}</p>
        </div>
      </div>
      
      <div className="border-b border-gray-700 mb-6">
        <div className="flex -mb-px">
          <button
            className={`py-2 px-4 ${activeTab === 'favorites' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorite Games
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'comments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('comments')}
          >
            My Reviews
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4">Loading data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {favoriteGames.length > 0 ? `Your Favorite Games (${favoriteGames.length})` : 'No Favorite Games Yet'}
              </h2>
              
              {favoriteGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">You haven't added any games to your favorites yet.</p>
                  <Link href="/" className="text-blue-500 hover:underline">
                    Browse Popular Games
                  </Link>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'comments' && (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {userComments.length > 0 ? `Your Reviews (${userComments.length})` : 'No Reviews Yet'}
              </h2>
              
              {userComments.length > 0 ? (
                <div className="space-y-4">
                  {userComments.map((comment) => (
                    <div key={comment._id} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <Link href={`/games/${comment.gameId}`} className="font-bold text-blue-400 hover:underline">
                          Game #{comment.gameId}
                        </Link>
                        <div className="text-gray-400 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-yellow-400 mb-2">
                        {'★'.repeat(comment.rating)}
                        {'☆'.repeat(5 - comment.rating)}
                      </div>
                      
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">You haven't written any reviews yet.</p>
                  <Link href="/" className="text-blue-500 hover:underline">
                    Browse Games to Review
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 