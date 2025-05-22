import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/auth';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Cek apakah path adalah route yang dilindungi
  const isProtectedRoute = path.startsWith('/dashboard');
  
  // Cek apakah path adalah route autentikasi
  const isAuthRoute = path === '/login' || path === '/register';
  
  // Ambil token dari cookies
  const token = request.cookies.get('token')?.value;
  
  // Jika route dilindungi dan tidak ada token, redirect ke login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Jika token ada dan valid
  if (token) {
    const decoded = verifyToken(token);
    
    // Jika token valid dan user mencoba mengakses route autentikasi, redirect ke dashboard
    if (decoded && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

// Konfigurasi path mana yang harus diproses oleh middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};