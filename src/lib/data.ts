import type { Account, Transaction, Category, Budget } from './types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Salario', type: 'Income', icon: 'Briefcase' },
  { id: 'cat-2', name: 'Mercado', type: 'Expense', icon: 'ShoppingCart' },
  { id: 'cat-3', name: 'Arriendo', type: 'Expense', icon: 'Home' },
  { id: 'cat-4', name: 'Transporte', type: 'Expense', icon: 'Car' },
  { id: 'cat-5', name: 'Entretenimiento', type: 'Expense', icon: 'Ticket' },
  { id: 'cat-6', name: 'Freelance', type: 'Income', icon: 'Laptop' },
  { id: 'cat-7', name: 'Servicios', type: 'Expense', icon: 'Lightbulb' },
  { id: 'cat-8', name: 'Salud', type: 'Expense', icon: 'HeartPulse' },
];

export const accounts: Account[] = [
  { id: 'acc-1', name: 'Bancolombia Ahorros', type: 'Bank', initialBalance: 5000000, currency: 'COP' },
  { id: 'acc-2', name: 'Davivienda Corriente', type: 'Bank', initialBalance: 2500000, currency: 'COP' },
  { id: 'acc-3', name: 'Efectivo', type: 'Cash', initialBalance: 300000, currency: 'COP' },
  { id: 'acc-4', name: 'Nequi', type: 'Wallet', initialBalance: 750000, currency: 'COP'},
];

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const getDate = (day: number) => new Date(currentYear, currentMonth, day).toISOString();

export const transactions: Transaction[] = [
  { id: 'txn-1', accountId: 'acc-1', date: getDate(2), description: 'Salario Mensual', amount: 4500000, type: 'Income', categoryId: 'cat-1' },
  { id: 'txn-2', accountId: 'acc-1', date: getDate(3), description: 'Mercado Carrefour', amount: 350000, type: 'Expense', categoryId: 'cat-2' },
  { id: 'txn-3', accountId: 'acc-2', date: getDate(5), description: 'Pago Arriendo', amount: 1200000, type: 'Expense', categoryId: 'cat-3' },
  { id: 'txn-4', accountId: 'acc-3', date: getDate(7), description: 'Viaje en taxi', amount: 25000, type: 'Expense', categoryId: 'cat-4' },
  { id: 'txn-5', accountId: 'acc-4', date: getDate(10), description: 'Noche de cine', amount: 80000, type: 'Expense', categoryId: 'cat-5' },
  { id: 'txn-6', accountId: 'acc-2', date: getDate(12), description: 'Proyecto diseño web', amount: 1500000, type: 'Income', categoryId: 'cat-6' },
  { id: 'txn-7', accountId: 'acc-2', date: getDate(15), description: 'Factura de electricidad', amount: 150000, type: 'Expense', categoryId: 'cat-7' },
  { id: 'txn-8', accountId: 'acc-1', date: getDate(16), description: 'Farmacia', amount: 60000, type: 'Expense', categoryId: 'cat-8' },
  { id: 'txn-9', accountId: 'acc-4', date: getDate(18), description: 'Cena con amigos', amount: 120000, type: 'Expense', categoryId: 'cat-5' },
  { id: 'txn-10', accountId: 'acc-1', date: getDate(20), description: 'Mercado semanal', amount: 180000, type: 'Expense', categoryId: 'cat-2' },
];

export const budgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-2', amount: 800000, month: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}` },
  { id: 'bud-2', categoryId: 'cat-4', amount: 200000, month: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}` },
  { id: 'bud-3', categoryId: 'cat-5', amount: 400000, month: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}` },
  { id: 'bud-4', categoryId: 'cat-7', amount: 250000, month: `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}` },
];
