'use client';

import React, { useState, useEffect } from 'react';

interface Expense {
  _id: string;
  userId: string;
  name: string;
  amount: number;
  date: string;
  category?: string;
  createdAt: string;
}

interface MonthlyData {
  month: string;
  total: number;
}

const MonthlyExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchExpenses(token);
    }
  }, []);

  useEffect(() => {
    if (expenses.length > 0) {
      const processedData = processExpenses(expenses, selectedYear);
      setMonthlyData(processedData);
    }
  }, [expenses, selectedYear]);

  const fetchExpenses = async (token: string): Promise<void> => {
    try {
      const response = await fetch('/api/items', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data: Expense[] | { error: string } = await response.json();
      if (Array.isArray(data)) {
        setExpenses(data);
        const years = getUniqueYears(data);
        setAvailableYears(years);
      } else {
        setError('Failed to fetch expenses');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  const getUniqueYears = (expenses: Expense[]): number[] => {
    const yearsSet = new Set<number>();
    expenses.forEach(expense => {
      const year = new Date(expense.date).getFullYear();
      yearsSet.add(year);
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  };

  const processExpenses = (expenses: Expense[], year: number): MonthlyData[] => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthlyTotals = new Array(12).fill(0);

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === year) {
        monthlyTotals[expenseDate.getMonth()] += expense.amount;
      }
    });

    return monthNames.map((month, index) => ({
      month,
      total: monthlyTotals[index]
    }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg max-w-screen-md">
      <h1 className="text-2xl font-bold text-white mb-6">Monthly Expenses</h1>
      
      <div className="mb-6">
        <label htmlFor="year-select" className="block text-white mb-2">Select Year:</label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 w-full"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <ul className="space-y-2">
        {monthlyData.map((item) => (
          <li key={item.month} className="flex justify-between items-center text-white py-2 border-b border-slate-700">
            <span className="text-lg">{item.month}</span>
            <span className="text-lg font-semibold">₹{item.total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyExpenses;