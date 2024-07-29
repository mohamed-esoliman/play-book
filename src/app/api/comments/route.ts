import { NextResponse } from 'next/server';
import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/database/mongoose';
import CommentModel from '@/lib/database/models/Comment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');
  
  if (!gameId) {
    return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
  }
  
  try {
    await dbConnect();
    
    const comments = await CommentModel.find({ gameId: parseInt(gameId) })
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { gameId, userId, username, content, rating } = body;
    
    if (!gameId || !userId || !content || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await dbConnect();
    
    const comment = new CommentModel({
      gameId,
      userId,
      username,
      content,
      rating,
      createdAt: new Date()
    });
    
    await comment.save();
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
} 