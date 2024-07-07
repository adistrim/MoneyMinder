import React, { useState, useEffect } from 'react';

interface Expense {
  _id: string;
  name: string;
  amount: number;
  date: string;
}

interface ExpenseListProps {
  token: string;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ token }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/items', {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setExpenses(data);
        setTotal(data.reduce((acc, item) => acc + item.amount, 0));
      } else {
        setError('Failed to fetch expenses');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleDelete = async (item: Expense) => {
    try {
      const response = await fetch(`/api/items/${item._id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        setError('Failed to delete item');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg max-w-screen-md mx-auto mt-4">
      <ul>
        {expenses.map((item, id) => (
          <li
            key={id}
            className="my-4 w-full flex justify-between bg-slate-950 rounded-md"
          >
            <div className="p-4 w-full flex justify-between items-center">
              <span className="text-white capitalize">{item.name}</span>
              <span className="text-white">₹{item.amount}</span>
              <span className="text-white">
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
      {expenses.length < 1 ? (
        <div className="flex justify-between pt-2">
          <span>No items added today</span>
        </div>
      ) : (
        <div className="flex justify-between p-2">
          <span>Today's total</span>
          <span>₹{total}</span>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ExpenseList;
