// src/contexts/TodoContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  addTodo: (title: string, description?: string) => Promise<void>;
  updateTodo: (id: string, data: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchTodos = useCallback(async () => {
    if (!token) {
      console.log("No token available, skipping fetch");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data todo');
      }
      
      setTodos(data.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addTodo = async (title: string, description?: string) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menambahkan todo');
      }
      
      // Update state dengan cara yang memicu re-render
      setTodos(prevTodos => [data.todo, ...prevTodos]);
      
      // Refresh data untuk memastikan konsistensi
      await fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menambahkan todo');
      throw error; // Re-throw error untuk ditangani oleh komponen
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, data: Partial<Todo>) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Gagal memperbarui todo');
      }
      
      // Update state dengan cara yang memicu re-render
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? responseData.todo : todo)
      );
      
      // Refresh data untuk memastikan konsistensi
      await fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui todo');
      throw error; // Re-throw error untuk ditangani oleh komponen
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
  if (!token) return;
  
  // Temukan todo yang akan diupdate
  const todoToUpdate = todos.find(todo => todo.id === id);
  
  if (!todoToUpdate) {
    console.error("Todo not found for toggling completion");
    return;
  }
  
  await updateTodo(id, { 
    completed,
    title: todoToUpdate.title 
  });
};

  const deleteTodo = async (id: string) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus todo');
      }
      
      // Update state dengan cara yang memicu re-render
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      // Refresh data untuk memastikan konsistensi
      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus todo');
      throw error; // Re-throw error untuk ditangani oleh komponen
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos saat token berubah
  useEffect(() => {
    if (token) {
      console.log("Token available, fetching todos");
      fetchTodos().catch(err => {
        console.error("Initial fetch error:", err);
      });
    }
  }, [token, fetchTodos]);

  return (
    <TodoContext.Provider 
      value={{ 
        todos, 
        loading, 
        error, 
        fetchTodos, 
        addTodo, 
        updateTodo, 
        deleteTodo, 
        toggleComplete 
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export function useTodo() {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
}