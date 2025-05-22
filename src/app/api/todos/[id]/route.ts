// src/app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/utils/auth';
import prisma from '@/lib/prisma';

// Update a todo
export async function PUT(req: NextRequest) {
  try {
    // Dapatkan ID dari URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const todoId = pathParts[pathParts.length - 1];
    
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

    const { title, description, completed } = await req.json();

    // Validasi input
    if (!title) {
      return NextResponse.json(
        { error: 'Judul diperlukan' },
        { status: 400 }
      );
    }

    // Cek apakah todo ada dan milik user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: user.id
      }
    });

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: {
        title,
        description,
        completed: completed === undefined ? existingTodo.completed : completed
      }
    });

    return NextResponse.json({ 
      message: 'Todo berhasil diperbarui',
      todo: updatedTodo 
    });
  } catch (error) {
    console.error('Update todo error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Delete a todo
export async function DELETE(req: NextRequest) {
  try {
    // Dapatkan ID dari URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const todoId = pathParts[pathParts.length - 1];
    
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

    // Cek apakah todo ada dan milik user
    const existingTodo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: user.id
      }
    });

    if (!existingTodo) {
      return NextResponse.json(
        { error: 'Todo tidak ditemukan' },
        { status: 404 }
      );
    }

    await prisma.todo.delete({
      where: { id: todoId }
    });

    return NextResponse.json({ 
      message: 'Todo berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server: ' + (error as Error).message },
      { status: 500 }
    );
  }
}