'use client';

import { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';

export default function AddTodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { addTodo, loading } = useTodo();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim()) return;
  
  try {
    await addTodo(title, description);
    setTitle('');
    setDescription('');
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Judul Tugas*
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black"
          placeholder="Masukkan judul tugas"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi (Opsional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-black"
          placeholder="Masukkan deskripsi tugas"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Menambahkan...' : 'Tambah Tugas'}
      </button>
    </form>
  );
}