// src/components/TodoItem.tsx
'use client';

import { useState } from 'react';
import { useTodo } from '@/contexts/TodoContext';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const { updateTodo, deleteTodo, toggleComplete } = useTodo();

  const handleUpdate = async () => {
    if (title.trim() === '') return;
    
    setIsLoading(true);
    try {
      await updateTodo(todo.id, { 
        title, 
        description: description || undefined 
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await toggleComplete(todo.id, !todo.completed);
    } catch (error) {
      console.error("Error toggling todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;
    
    setIsLoading(true);
    try {
      await deleteTodo(todo.id);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedDate = format(new Date(todo.createdAt), 'dd MMM yyyy HH:mm');

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
          placeholder="Judul tugas"
          disabled={isLoading}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:ring-indigo-500 focus:border-indigo-500 text-black"
          placeholder="Deskripsi (opsional)"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            disabled={isLoading || !title.trim()}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={isLoading}
            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border ${todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'} rounded-lg p-4 shadow-sm hover:shadow transition`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggleComplete}
            disabled={isLoading}
            className={`h-5 w-5 text-indigo-600 rounded mt-1 focus:ring-indigo-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <div>
            <h3 className={`text-lg font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {todo.description}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Dibuat pada: {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className={`text-indigo-600 hover:text-indigo-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Edit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className={`text-red-600 hover:text-red-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Hapus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="mt-2 flex items-center justify-center">
          <div className="animate-pulse text-xs text-gray-500">Memproses...</div>
        </div>
      )}
    </div>
  );
}