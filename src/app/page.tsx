import Link from 'next/link';
import Image from 'next/image';
import todoImage from '@/img/todo.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-indigo-600 p-8 md:p-12 flex items-center justify-center">
              <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">ToDo App</h1>
                <p className="text-indigo-200 mb-6">
                  Kelola tugas-tugas Anda dengan mudah dan efisien
                </p>
                <Image
                  src={todoImage}
                  alt="ToDo Illustration"
                  width={256}
                  height={256}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Selamat Datang di ToDo App
              </h2>
              <p className="text-gray-600 mb-8">
                Aplikasi ini membantu Anda mengelola tugas-tugas harian dengan mudah.
                Anda dapat membuat, mengedit, dan menyelesaikan tugas dengan antarmuka yang intuitif.
              </p>
              <div className="space-y-4">
                <Link
                  href="/login"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full bg-white hover:bg-gray-100 text-indigo-600 font-bold py-3 px-4 rounded-lg border border-indigo-600 text-center transition duration-300"
                >
                  Register
                </Link>
              </div>
              <div className="mt-8 text-center text-gray-600 text-sm">
                <p>© 2025 ToDo App - Praktikum PAW.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}