import React, { useState, useEffect } from "react";

interface Expense {
  _id: string;
  name: string;
  amount: number;
  date: string;
}

interface ExpenseListProps {
  token: string;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-white text-lg mb-4 text-center">
          Are you sure you want to delete "{itemName}"?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ExpenseList: React.FC<ExpenseListProps> = ({ token }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    item: Expense | null;
  }>({
    isOpen: false,
    item: null,
  });

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("/api/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        const today = new Date().toDateString();
        const todayExpenses = data.filter(
          (item) => new Date(item.date).toDateString() === today,
        );
        setExpenses(todayExpenses);
        setTotal(todayExpenses.reduce((acc, item) => acc + item.amount, 0));
      } else {
        setError("Failed to fetch expenses");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleDeleteClick = (item: Expense) => {
    setConfirmDialog({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.item) return;

    try {
      const response = await fetch(`/api/items/${confirmDialog.item._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchExpenses();
      } else {
        setError("Failed to delete item");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
    setConfirmDialog({ isOpen: false, item: null });
  };

  const handleDeleteCancel = () => {
    setConfirmDialog({ isOpen: false, item: null });
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
              onClick={() => handleDeleteClick(item)}
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
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={confirmDialog.item?.name || ""}
      />
    </div>
  );
};

export default ExpenseList;
