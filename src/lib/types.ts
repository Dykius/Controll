

export type DebitAccountType = 'Bank' | 'Cash' | 'Wallet';
export type CreditAccountType = 'Credit Card';
export type AccountType = DebitAccountType | CreditAccountType;

interface BaseAccount {
  id: string;
  name: string;
  currency: 'COP';
}

export interface DebitAccount extends BaseAccount {
  type: DebitAccountType;
  initialBalance: number;
  balance: number;
}

export interface CreditAccount extends BaseAccount {
  type: CreditAccountType;
  creditLimit: number;
  closingDate: number; // Day of the month
  debt: number;
}

export type Account = DebitAccount | CreditAccount;


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
