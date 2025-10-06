
import type { Account, Budget, Category, Transaction } from "./types";
import { categories as defaultCategories } from './data';

type UserData = {
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
}

function getActiveUserEmail(): string | null {
    if (typeof window === 'undefined') return null;
    // The session is now stored in localStorage for client-side access
    const sessionStr = localStorage.getItem('session');
    if (!sessionStr) return null;
    try {
        const session = JSON.parse(sessionStr);
        return session.email || null;
    } catch {
        return null;
    }
}

function getAllUsersData(): Record<string, { data: UserData; password?: string, fullName?: string }> {
     if (typeof window === 'undefined') return {};
    const usersStr = localStorage.getItem('users');
    if (!usersStr) return {};
    try {
        return JSON.parse(usersStr);
    } catch {
        return {};
    }
}

function saveUserData(data: UserData) {
    const email = getActiveUserEmail();
    if (!email) return;

    const allUsers = getAllUsersData();
    const currentUserData = allUsers[email] || {};

    allUsers[email] = {
        ...currentUserData,
        data: data
    };

    localStorage.setItem('users', JSON.stringify(allUsers));
}


function getUserData(): UserData {
    const defaultData = { accounts: [], transactions: [], categories: defaultCategories, budgets: [] };
    if (typeof window === 'undefined') {
        return defaultData;
    }

    const email = getActiveUserEmail();
    if (!email) {
        return defaultData;
    }

    const allUsers = getAllUsersData();
    const user = allUsers[email];
    
    if (user && user.data) {
        if (!user.data.categories || user.data.categories.length === 0) {
            user.data.categories = defaultCategories;
        }
        return user.data;
    }
    
    return defaultData;
}

// NOTE: In a real app, these would be API calls.
// For now, they read from and write to localStorage.

export function getAccounts(): Account[] {
    const data = getUserData();
    // Calculate current balance for each account
    return data.accounts.map(account => {
        const balance = data.transactions
            .filter(t => t.accountId === account.id)
            .reduce((acc, t) => {
                if (t.type === 'Income') return acc + t.amount;
                return acc - t.amount;
            }, account.initialBalance);
        return { ...account, balance };
    });
}

export function addAccount(account: Omit<Account, 'id' | 'currency' | 'balance'>) {
    const data = getUserData();
    const newAccount: Account = {
        ...account,
        id: `acc-${new Date().getTime()}`,
        currency: 'COP',
        balance: account.initialBalance,
    };
    const updatedData = { ...data, accounts: [...data.accounts, newAccount] };
    saveUserData(updatedData);
}

export function deleteAccount(accountId: string) {
    const data = getUserData();
    const updatedAccounts = data.accounts.filter(acc => acc.id !== accountId);
    const updatedTransactions = data.transactions.filter(t => t.accountId !== accountId);
    const updatedData = { ...data, accounts: updatedAccounts, transactions: updatedTransactions };
    saveUserData(updatedData);
}


export function getTransactions(): Transaction[] {
    return getUserData().transactions;
}

export function addTransaction(transaction: Omit<Transaction, 'id'>) {
    const data = getUserData();
    const newTransaction: Transaction = {
        ...transaction,
        id: `txn-${new Date().getTime()}`,
    };
    const updatedData = { ...data, transactions: [...data.transactions, newTransaction] };
    saveUserData(updatedData);
}

export function deleteTransaction(transactionId: string) {
    const data = getUserData();
    const updatedTransactions = data.transactions.filter(t => t.id !== transactionId);
    const updatedData = { ...data, transactions: updatedTransactions };
    saveUserData(updatedData);
}


export function getCategories(): Category[] {
    return getUserData().categories;
}

export function getBudgets(): Budget[] {
    return getUserData().budgets;
}

export function getDashboardData() {
    // This function can only run on the client because it uses localStorage
    if (typeof window === 'undefined') {
        return { totalIncome: 0, totalExpense: 0, balance: 0, transactions: [], categories: [], accounts: [] };
    }

    const accounts = getAccounts();
    const { transactions, categories } = getUserData();
    
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    return { totalIncome, totalExpense, balance, transactions, categories, accounts };
}
