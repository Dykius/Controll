

import type { Account, Budget, Category, Transaction, DebitAccount, CreditAccount } from "./types";
import { categories as defaultCategories } from './data';

type UserData = {
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
}

function getActiveUserEmail(): string | null {
    if (typeof window === 'undefined') return null;
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
        if (!user.data.budgets) {
            user.data.budgets = [];
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
        const relatedTransactions = data.transactions.filter(t => t.accountId === account.id);

        if (account.type === 'Credit Card') {
            const creditAccount = account as CreditAccount;
            const debt = relatedTransactions.reduce((acc, t) => {
                // Expenses increase debt, Income (payments) decrease debt
                if (t.type === 'Expense') return acc + t.amount;
                if (t.type === 'Income') return acc - t.amount;
                return acc;
            }, 0);
            return { ...creditAccount, debt: Math.max(0, debt) };
        } else {
            const debitAccount = account as DebitAccount;
            const balance = relatedTransactions.reduce((acc, t) => {
                if (t.type === 'Income') return acc + t.amount;
                return acc - t.amount;
            }, debitAccount.initialBalance);
             return { ...debitAccount, balance };
        }
    });
}

export function addAccount(account: Omit<Account, 'id' | 'currency' | 'balance' | 'debt'>) {
    const data = getUserData();
    
    const newAccount: Account = {
        ...account,
        id: `acc-${new Date().getTime()}`,
        currency: 'COP',
    } as Account;

    if (newAccount.type === 'Credit Card') {
        (newAccount as CreditAccount).debt = 0;
    } else {
        (newAccount as DebitAccount).balance = (newAccount as DebitAccount).initialBalance;
    }

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

export function updateTransaction(updatedTransaction: Transaction) {
    const data = getUserData();
    const updatedTransactions = data.transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
    );
    const updatedData = { ...data, transactions: updatedTransactions };
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

export function addBudget(budget: Omit<Budget, 'id'>) {
    const data = getUserData();
    const newBudget: Budget = {
        ...budget,
        id: `bud-${new Date().getTime()}`,
    };
    const updatedData = { ...data, budgets: [...data.budgets, newBudget] };
    saveUserData(updatedData);
}

export function updateBudget(updatedBudget: Budget) {
    const data = getUserData();
    const updatedBudgets = data.budgets.map(b => b.id === updatedBudget.id ? updatedBudget : b);
    const updatedData = { ...data, budgets: updatedBudgets };
    saveUserData(updatedData);
}

export function deleteBudget(budgetId: string) {
    const data = getUserData();
    const updatedBudgets = data.budgets.filter(b => b.id !== budgetId);
    const updatedData = { ...data, budgets: updatedBudgets };
    saveUserData(updatedData);
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
    
    const balance = accounts.filter(acc => acc.type !== 'Credit Card').reduce((sum, acc) => sum + (acc as DebitAccount).balance, 0);
    
    return { totalIncome, totalExpense, balance, transactions, categories, accounts };
}
