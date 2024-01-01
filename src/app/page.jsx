"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  query,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [total, setTotal] = useState(0);

  const handleDelete = (item) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${item.name}?`);

    if (confirmed) {
      deleteItem(item.id);
    }
  };

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.price !== "") {
      const currentDate = new Date();
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: newItem.price,
        date: currentDate.toISOString(),
      });
      setNewItem({ name: "", price: "" });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      let todayItemsArr = [];

      querySnapshot.forEach((doc) => {
        const itemData = { ...doc.data(), id: doc.id };
        itemsArr.push(itemData);

        // Check if the item"s date matches today"s date
        const itemDate = new Date(itemData.date);
        const today = new Date();
        if (itemDate.toDateString() === today.toDateString()) {
          todayItemsArr.push(itemData);
        }
      });

      setItems(todayItemsArr);

      const calculateTotal = (items) => {
        const totalPrice = items.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };

      calculateTotal(todayItemsArr);
    });

    return () => unsubscribe();
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm ">
        <h1 className="text-4xl p-4 text-center">Money Minder</h1>
        <div className="bg-slate-800 p-4 rounded-lg max-w-screen-md mx-auto">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border rounded-md"
              type="text"
              placeholder="Item/Activity"
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="col-span-2 p-3 border mx-3 rounded-md"
              type="number"
              placeholder="Amount(₹)"
            />
            <button
              onClick={addItem}
              className="text-white bg-green-500 hover:bg-green-600 p-3 text-normal rounded-md"
              type="submit"
            >
              Add
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full flex justify-between bg-slate-950 rounded-md"
              >
                <div className="p-4 w-full flex justify-between items-center">
                  <span className="text-white capitalize">{item.name}</span>
                  <span className="text-white">₹{item.price}</span>
                  <span className="text-white">
                    {console.log(item.date)}
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="ml-4 p-4 border-l-2 border-slate-900 hover:bg-slate-900 text-white rounded-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            <div className="flex justify-between pt-2">
              <span>No items added today</span>
            </div>
          ) : (
            <div className="flex justify-between p-2">
              <span>Today"s total</span>
              <span>₹{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
