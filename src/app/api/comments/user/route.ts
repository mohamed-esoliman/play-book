import { NextResponse } from 'next/server';
import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/database/mongoose';
import CommentModel from '@/lib/database/models/Comment';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'You can only view your own comments' }, { status: 403 });
  }
  
  try {
    await dbConnect();
    
    const comments = await CommentModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
} 