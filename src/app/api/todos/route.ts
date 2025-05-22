import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/utils/auth';
import prisma from '@/lib/prisma';

// Dapatkan todo untuk user (login)
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Autentikasi diperlukan' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Get todos error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Buat todo baru
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Autentikasi diperlukan' },
        { status: 401 }
      );
    }

    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token tidak valid' },
        { status: 401 }
      );
    }

    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Judul diperlukan' },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        userId: user.id
      }
    });

    return NextResponse.json({ 
      message: 'Todo berhasil dibuat',
      todo 
    }, { status: 201 });
  } catch (error) {
    console.error('Create todo error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server: ' + (error as Error).message },
      { status: 500 }
    );
  }
}