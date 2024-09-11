"use client";
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Login from "../components/Login";
import Register from "../components/Register";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn(false);
  };

  const handleAddItem = () => {
    // This will trigger the ExpenseList to refresh
    // You can add more logic here if needed
  };

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-4xl p-4 text-center">Money Minder</h1>
        {showRegister ? (
          <Register onRegister={handleLogin} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <button
          className="mt-4 text-blue-500 underline"
          onClick={() => setShowRegister(!showRegister)}
        >
          {showRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    );
  }

  return (
    <>
      <Header token={token} onLogout={handleLogout} />
      <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4 pb-16">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
          <div>
            <ExpenseForm token={token} onAddItem={handleAddItem} />
            <ExpenseList token={token} />
          </div>
        </div>
      </main>
    </>
  );
}