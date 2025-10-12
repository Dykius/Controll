import type {
  Account,
  Budget,
  Category,
  Transaction,
  DebitAccount,
  CreditAccount,
} from "./types";
import { categories as defaultCategories } from "./data";

// Crear transacción
export async function createTransaction(transaction: any) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
  if (!response.ok) {
    throw new Error("Error al crear transacción");
  }
  return await response.json();
}

// Eliminar transacción
export async function deleteTransaction(id: string) {
  const response = await fetch("/api/transactions", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Error al eliminar transacción");
  }
  return await response.json();
}

// Obtener cuentas de un usuario
export async function getAccounts(user_id: number) {
  const response = await fetch(`/api/accounts?user_id=${user_id}`);
  if (!response.ok) {
    throw new Error("Error al obtener cuentas");
  }
  return await response.json();
}

// Crear cuenta
export async function createAccount(account: any) {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error("Error al crear cuenta");
  }
  return await response.json();
}

// Actualizar cuenta
export async function updateAccount(account: any) {
  const response = await fetch("/api/accounts", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(account),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar cuenta");
  }
  return await response.json();
}

// Eliminar cuenta
export async function deleteAccount(id: string) {
  const response = await fetch("/api/accounts", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Error al eliminar cuenta");
  }
  return await response.json();
}

// Registrar usuario
export async function registerUser(
  fullName: string,
  email: string,
  password: string
) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  if (!response.ok) {
    throw new Error("Error al registrar usuario");
  }
  return await response.json();
}

// Obtener usuario por email
export async function getUserByEmail(email: string) {
  const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
  if (!response.ok) {
    throw new Error("Error al obtener usuario");
  }
  return await response.json();
}

// Obtener categorías
export async function getCategories() {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Error al obtener categorías");
  }
  return await response.json();
}

// Obtener presupuestos de un usuario
export async function getBudgets(user_id: number) {
  const response = await fetch(`/api/budgets?user_id=${user_id}`);
  if (!response.ok) {
    throw new Error("Error al obtener presupuestos");
  }
  return await response.json();
}

// Crear presupuesto
export async function createBudget(budget: {
  id: string;
  category_id: string;
  user_id: number;
  amount: number;
  month: string;
}) {
  const response = await fetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budget),
  });
  if (!response.ok) {
    throw new Error("Error al crear presupuesto");
  }
  return await response.json();
}

// Eliminar presupuesto
export async function deleteBudget(id: string) {
  const response = await fetch("/api/budgets", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) {
    throw new Error("Error al eliminar presupuesto");
  }
  return await response.json();
}

// Obtener transacciones
export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions");
  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }
  return await response.json();
}

// Dashboard data desde la API
export async function getDashboardData(user_id: number) {
  // Obtiene cuentas, transacciones y categorías desde la API
  const [accounts, transactions, categories] = await Promise.all([
    getAccounts(user_id),
    getTransactions(),
    getCategories(),
  ]);

  const totalIncome = transactions
    .filter((t: any) => t.type === "Income")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t: any) => t.type === "Expense")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
  const balance = accounts
    .filter((acc: any) => acc.type !== "Credit Card")
    .reduce(
      (sum: number, acc: any) => sum + Number(acc.initial_balance ?? 0),
      0
    );

  return {
    totalIncome,
    totalExpense,
    balance,
    transactions,
    categories,
    accounts,
  };
}
