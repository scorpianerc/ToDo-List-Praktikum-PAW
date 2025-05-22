// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { comparePasswords, generateToken } from '@/utils/auth';
import prisma from '@/lib/prisma'; // Gunakan Prisma Client yang diimpor

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("Login attempt for:", email);

    // Validasi input
    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    // Cari user dengan error handling yang lebih baik
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      return NextResponse.json(
        { error: 'Database error: ' + (prismaError as Error).message },
        { status: 500 }
      );
    }

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email });
    console.log("Login successful, token generated");

    // Buat response dengan cookie
    const response = NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
    
    // Set cookie untuk token
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server: ' + (error as Error).message },
      { status: 500 }
    );
  }
}