"use client";
import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

interface HeaderProps {
  token: string;
  onLogout: () => void;
}

interface User {
  name: string;
  email: string;
  createdAt: string;
}

const Header: React.FC<HeaderProps> = ({ token, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          console.error("Failed to fetch user profile:", data.error);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [token]);

  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div></div>
      <h1 className="text-xl">Money Minder</h1>
      <button onClick={toggleMenu} className="text-2xl">
        <FaBars />
      </button>
      <div
        className={`fixed inset-0 z-50 transition-transform transform ${menuOpen ? "translate-x-0" : "translate-x-full"} bg-white text-black p-4`}
      >
        <button onClick={toggleMenu} className="text-2xl mb-4">
          <FaTimes />
        </button>
        <div className="flex flex-col items-center">
          <CgProfile className="w-16 h-16 mb-4" />
          {user ? (
            <>
              <p className="mb-2">{user.name}</p>
              <p className="mb-2">{user.email}</p>
              <p>Joined on: {new Date(user.createdAt).toLocaleDateString()}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
          <button
            onClick={onLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
