import React, { useState } from 'react';

interface ExpenseFormProps {
  token: string;
  onAddItem: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ token, onAddItem }) => {
  const [newItem, setNewItem] = useState({ name: '', price: '', date: new Date().toISOString() });
  const [error, setError] = useState('');

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newItem.name, amount: parseFloat(newItem.price), date: newItem.date }),
      });
      const data = await response.json();
      if (data.success) {
        setNewItem({ name: '', price: '', date: new Date().toISOString() });
        onAddItem();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg max-w-screen-md mx-auto">
      <form className="grid grid-cols-6 items-center text-black" onSubmit={addItem}>
        <input
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="col-span-3 p-3 border rounded-md"
          type="text"
          placeholder="Item/Activity"
          required
        />
        <input
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="col-span-2 p-3 border mx-3 rounded-md"
          type="number"
          placeholder="Amount(₹)"
          required
        />
        <button
          className="text-white bg-green-500 hover:bg-green-600 p-3 text-normal rounded-md"
          type="submit"
        >
          Add
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ExpenseForm;
