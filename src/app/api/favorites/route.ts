import { NextResponse } from 'next/server';
import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/database/mongoose';
import UserModel from '@/lib/database/models/User';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const gameId = searchParams.get('gameId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  try {
    await dbConnect();
    
    if (gameId) {
      const user = await UserModel.findOne({ uid: userId });
      if (!user) {
        return NextResponse.json({ isFavorite: false });
      }
      
      const isFavorite = user.favoriteGames.includes(parseInt(gameId));
      return NextResponse.json({ isFavorite });
    } else {
      const user = await UserModel.findOne({ uid: userId });
      if (!user) {
        return NextResponse.json({ favoriteGames: [] });
      }
      
      return NextResponse.json({ favoriteGames: user.favoriteGames || [] });
    }
  } catch (error) {
    console.error('Error checking favorites:', error);
    return NextResponse.json({ error: 'Failed to check favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { userId, gameId } = body;
    
    if (!userId || !gameId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await dbConnect();
    
    await UserModel.findOneAndUpdate(
      { uid: userId },
      { $addToSet: { favoriteGames: gameId } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions as AuthOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { userId, gameId } = body;
    
    if (!userId || !gameId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await dbConnect();
    
    await UserModel.findOneAndUpdate(
      { uid: userId },
      { $pull: { favoriteGames: gameId } }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
} 