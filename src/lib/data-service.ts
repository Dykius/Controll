import type { Account, Budget, Category, Transaction } from "./types";

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

function getAllUsersData(): Record<string, { data: UserData }> {
     if (typeof window === 'undefined') return {};
    const usersStr = localStorage.getItem('users');
    if (!usersStr) return {};
    try {
        return JSON.parse(usersStr);
    } catch {
        return {};
    }
}

function getUserData(): UserData {
    const email = getActiveUserEmail();
    if (!email) return { accounts: [], transactions: [], categories: [], budgets: [] };

    const allUsers = getAllUsersData();
    const user = allUsers[email];
    
    // If user exists and has data, return it. Otherwise, return empty state.
    if (user && user.data) {
        return user.data;
    }

    return { accounts: [], transactions: [], categories: [], budgets: [] };
}

// NOTE: In a real app, these would be API calls.
// For now, they read from and write to localStorage.

export function getAccounts(): Account[] {
    return getUserData().accounts;
}

export function getTransactions(): Transaction[] {
    return getUserData().transactions;
}

export function getCategories(): Category[] {
    return getUserData().categories;
}

export function getBudgets(): Budget[] {
    return getUserData().budgets;
}

export function getDashboardData() {
    const { transactions, categories, accounts } = getUserData();
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance, transactions, categories, accounts };
}
