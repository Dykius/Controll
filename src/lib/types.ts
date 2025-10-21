
export type DebitAccountType = 'Bank' | 'Cash' | 'Wallet';
export type CreditAccountType = 'Credit Card';
export type AccountType = DebitAccountType | CreditAccountType;

interface BaseAccount {
  id: string;
  name: string;
  currency: 'COP';
  type: AccountType;
  user_id: number;
}

export interface DebitAccount extends BaseAccount {
  type: DebitAccountType;
  initial_balance: number;
  balance: number; // Campo calculado dinámicamente
}

export interface CreditAccount extends BaseAccount {
  type: CreditAccountType;
  credit_limit: number;
  closing_date: number;
  initial_debt: number;
  debt: number; // Campo calculado dinámicamente
  balance: 0; // Credit cards don't contribute to patrimony
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
  user_id: number;
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
  user_id: number;
};
