"use client";
import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsLoggedIn(false);
  };

  const handleAddItem = () => {
    // This will trigger the ExpenseList to refresh
    // You can add more logic here if needed
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Money Minder</h1>
        {showRegister ? (
          <Register onRegister={handleLogin} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <button 
          className="mt-4 text-blue-500 underline" 
          onClick={() => setShowRegister(!showRegister)}
        >
          {showRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl p-4 text-center">Money Minder</h1>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded mb-4" 
          onClick={handleLogout}
        >
          Logout
        </button>
        <ExpenseForm token={token} onAddItem={handleAddItem} />
        <ExpenseList token={token} />
      </div>
    </main>
  );
}
