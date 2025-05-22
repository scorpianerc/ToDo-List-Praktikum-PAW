'use client';

import { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { useAuth } from '@/contexts/AuthContext';
import { useTodo } from '@/contexts/TodoContext';
import TodoItem from '@/components/TodoItem';
import AddTodoForm from '@/components/AddTodoForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { todos, loading, error, fetchTodos } = useTodo();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      fetchTodos().catch(err => {
        console.error("Error fetching todos:", err);
      });
      setIsInitialLoad(false);
    }
  }, [fetchTodos, isInitialLoad]);

  // Refresh manual
  const handleRefresh = useCallback(() => {
    fetchTodos().catch(err => {
      console.error("Error refreshing todos:", err);
    });
  }, [fetchTodos]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">ToDo App</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Halo, {user?.name || user?.email}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Tambah Tugas Baru</h2>
            <AddTodoForm />
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Daftar Tugas</h2>
              <div className="flex space-x-2">
                {}
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Refresh daftar tugas"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Memuat...' : 'Refresh'}
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    filter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    filter === 'active' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Aktif
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    filter === 'completed' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Selesai
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {filter === 'all' 
                  ? 'Belum ada tugas. Tambahkan tugas baru!' 
                  : filter === 'active' 
                    ? 'Tidak ada tugas aktif.'
                    : 'Tidak ada tugas yang selesai.'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}