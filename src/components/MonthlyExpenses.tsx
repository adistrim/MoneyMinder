"use client";

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
  expenses: Expense[];
}

const MonthlyExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
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
    
    const monthlyData: MonthlyData[] = monthNames.map(month => ({
      month,
      total: 0,
      expenses: []
    }));

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === year) {
        const monthIndex = expenseDate.getMonth();
        monthlyData[monthIndex].total += expense.amount;
        monthlyData[monthIndex].expenses.push(expense);
      }
    });

    return monthlyData;
  };

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month === selectedMonth ? null : month);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-slate-800 min-h-screen w-full pb-20">
      <div className="p-4">
        <h1 className="text-xl font-bold text-white mb-4">Monthly Expenses</h1>
        
        <div className="mb-4">
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
        
        <ul className="space-y-2 overflow-y-auto">
          {monthlyData.map((item) => (
            <li key={item.month} className="bg-slate-700 rounded-lg mb-2">
              <div 
                className="flex justify-between items-center text-white p-3 cursor-pointer"
                onClick={() => handleMonthClick(item.month)}
              >
                <span className="text-lg">{item.month}</span>
                <span className="text-lg font-semibold">₹{item.total.toFixed(2)}</span>
              </div>
              {selectedMonth === item.month && (
                <ul className="mt-2 space-y-2 p-3 bg-slate-600 rounded-b-lg">
                  {item.expenses.map((expense) => (
                    <li key={expense._id} className="text-white">
                      <div className="flex justify-between items-center">
                        <span>{expense.name}</span>
                        <span>₹{expense.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-slate-300">{formatDate(expense.date)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MonthlyExpenses;