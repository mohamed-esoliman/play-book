'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Game, Comment } from '@/types';
import Button from '@/components/ui/Button';
import GameCard from '@/components/ui/GameCard';
import igdbClient from '@/lib/igdb/client';

export default function GameDetailsPage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const { data: session, status } = useSession();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchGameDetails = async () => {
      setIsLoading(true);
      try {
        const data = await igdbClient.getGameById(gameId);
        if (data && data.length > 0) {
          setGame(data[0]);
        } else {
          setError('Game not found');
        }
      } catch (err) {
        console.error('Error fetching game details:', err);
        setError('Failed to load game details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchComments = async () => {
        try {
          const res = await fetch(`/api/comments?gameId=${gameId}`);
          if (res.ok) {
            const data = await res.json();
            setComments(data);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

      const checkFavorite = async () => {
        try {
          const res = await fetch(`/api/favorites?userId=${session.user.id}&gameId=${gameId}`);
          if (res.ok) {
            const { isFavorite } = await res.json();
            setIsFavorite(isFavorite);
          }
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      };

      fetchComments();
      checkFavorite();
    }
  }, [gameId, session, status]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'TBA';
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageUrl = (url?: string, size: string = 't_cover_big') => {
    if (!url) return '/images/placeholder.jpg';
    return url.replace('t_thumb', size);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          userId: session.user.id,
          username: session.user.name || 'Anonymous',
          content: commentText,
          rating,
        }),
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
        setCommentText('');
        setRating(5);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      return;
    }
    
    setIsFavLoading(true);
    
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          gameId,
        }),
      });
      
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsFavLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-400 px-6 py-4 rounded-md">
        <p>{error || 'Game not found'}</p>
        <Link href="/" className="mt-4 inline-block text-blue-400 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden">
            <Image
              src={getImageUrl(game.cover?.url, 't_cover_big')}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {status === 'authenticated' && (
            <Button
              onClick={handleToggleFavorite}
              className="w-full mt-4"
              variant={isFavorite ? "secondary" : "primary"}
              isLoading={isFavLoading}
              icon={
                <svg className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              }
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          )}
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold">{game.name}</h1>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {game.genres?.map(genre => (
              <span key={genre.name} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm">
                {genre.name}
              </span>
            ))}
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-gray-400 text-sm">Release Date</h3>
              <p>{formatDate(game.first_release_date)}</p>
            </div>
            
            {game.rating && (
              <div>
                <h3 className="text-gray-400 text-sm">Rating</h3>
                <div className="flex items-center">
                  <div className="bg-blue-600 text-white font-bold px-2 py-1 rounded-md mr-2">
                    {Math.round(game.rating)}%
                  </div>
                </div>
              </div>
            )}
            
            {game.platforms && (
              <div className="col-span-2">
                <h3 className="text-gray-400 text-sm">Platforms</h3>
                <p>{game.platforms.map(p => p.name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-700 mb-6">
        <div className="flex -mb-px">
          <button
            className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'media' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('media')}
          >
            Media
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'comments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400 hover:text-gray-300'}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'details' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <p className="text-gray-300 whitespace-pre-line mb-8">{game.summary}</p>
              
              {game.storyline && (
                <>
                  <h2 className="text-xl font-bold mb-4">Storyline</h2>
                  <p className="text-gray-300 whitespace-pre-line mb-8">{game.storyline}</p>
                </>
              )}
              
              {game.similar_games && game.similar_games.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-4">Similar Games</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {game.similar_games.slice(0, 4).map((similarGame) => (
                      <GameCard key={similarGame.id} game={similarGame} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'media' && (
            <div>
              {game.screenshots && game.screenshots.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-4">Screenshots</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {game.screenshots.slice(0, 6).map((screenshot, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={screenshot.url.replace('t_thumb', 't_screenshot_big')}
                          alt={`${game.name} screenshot ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {game.videos && game.videos.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-4">Videos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {game.videos.slice(0, 2).map((video, index) => (
                      <div key={index} className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.video_id}`}
                          title={`${game.name} video ${index + 1}`}
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'comments' && (
            <div>
              {status === 'authenticated' ? (
                <form onSubmit={handleSubmitComment} className="bg-gray-800 p-4 rounded-lg mb-6">
                  <h2 className="text-xl font-bold mb-4">Add Your Review</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-2xl"
                        >
                          {star <= rating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-gray-300 mb-2">
                      Your Comment
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your thoughts about this game..."
                      required
                    ></textarea>
                  </div>
                  
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={!commentText.trim()}
                  >
                    Post Comment
                  </Button>
                </form>
              ) : (
                <div className="bg-gray-800 p-4 rounded-lg mb-6 text-center">
                  <p>Sign in to leave a comment</p>
                  <Link href="/auth/signin" className="text-blue-400 hover:underline mt-2 inline-block">
                    Sign In
                  </Link>
                </div>
              )}
              
              <h2 className="text-xl font-bold mb-4">
                {comments.length > 0 ? `Comments (${comments.length})` : 'No Comments Yet'}
              </h2>
              
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-800 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="font-bold">{comment.username}</div>
                      <div className="text-yellow-400 ml-2">
                        {'★'.repeat(comment.rating)}
                        {'☆'.repeat(5 - comment.rating)}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}