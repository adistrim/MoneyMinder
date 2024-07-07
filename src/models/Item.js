import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for the expense']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount']
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);