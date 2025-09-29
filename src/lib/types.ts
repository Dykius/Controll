export type Account = {
  id: string;
  name: string;
  type: 'Bank' | 'Cash' | 'Wallet';
  initialBalance: number;
  currency: 'COP';
};

export type Transaction = {
  id: string;
  accountId: string;
  date: string; // ISO 8601 string
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  categoryId: string;
};

export type Category = {
  id:string;
  name: string;
  type: 'Income' | 'Expense';
  icon: string; // lucide-react icon name
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: string; // YYYY-MM
};
