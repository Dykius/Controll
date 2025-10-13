import type {
  Account,
  Budget,
  Category,
  Transaction,
  DebitAccount,
  CreditAccount,
} from "./types";

// --- Transacciones ---

// Obtener transacciones
export async function getTransactions(user_id: number): Promise<Transaction[]> {
  const response = await fetch(`/api/transactions?user_id=${user_id}`);
  if (!response.ok) {
    throw new Error("Error al obtener transacciones");
  }
  return await response.json();
}

// Crear transacción
export async function addTransaction(transaction: Omit<Transaction, 'id'> & { user_id: number }) {
  const newId = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const transactionToAdd = { ...transaction, id: newId };
  
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transactionToAdd),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.details || "Error al crear transacción");
  }
  return await response.json();
}

// Actualizar transacción
export async function updateTransaction(transaction: Transaction) {
    const response = await fetch("/api/transactions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) {
        throw new Error("Error al actualizar transacción");
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

// --- Cuentas ---

// Obtener cuentas de un usuario
export async function getAccounts(user_id: number): Promise<Account[]> {
  const response = await fetch(`/api/accounts?user_id=${user_id}`);
  if (!response.ok) {
    throw new Error("Error al obtener cuentas");
  }
  const accountsFromDB: any[] = await response.json();
  const transactions = await getTransactions(user_id);

  // Calcular balance dinámico
  return accountsFromDB.map(acc => {
    // Asegurarse que los valores iniciales son numéricos
    const initialBalance = Number(acc.initial_balance) || 0;
    const initialDebt = Number(acc.initial_debt) || 0;

    if (acc.type !== 'Credit Card') {
      const balance = transactions.reduce((sum, t) => {
        if (t.accountId === acc.id) {
          if (t.type === 'Income') return sum + Number(t.amount);
          if (t.type === 'Expense') return sum - Number(t.amount);
        }
        return sum;
      }, initialBalance);
      return { ...acc, balance };
    } else {
      const debt = transactions.reduce((sum, t) => {
        if (t.accountId === acc.id) {
          // Para TC, los gastos suman a la deuda, los pagos (ingresos a la TC) restan.
          if (t.type === 'Expense') return sum + Number(t.amount);
          if (t.type === 'Income') return sum - Number(t.amount);
        }
        return sum;
      }, initialDebt);
      return { ...acc, debt };
    }
  });
}

// Crear cuenta
export async function addAccount(accountData: Omit<Account, 'id' | 'balance' | 'debt'> & { user_id: number }) {
  const newId = `acc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const accountToAdd = { ...accountData, id: newId };
  
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountToAdd),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.details || "Error al crear cuenta");
  }
  return await response.json();
}

// Actualizar cuenta (a implementar si es necesario)
export async function updateAccount(account: Account) {
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

// --- Usuarios (Autenticación) ---

// Registrar usuario
export async function registerUser(fullName: string, email: string, password: string) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName, email, password }),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.error || "Error al registrar usuario");
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

// --- Categorías ---

// Obtener categorías
export async function getCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Error al obtener categorías");
  }
  return await response.json();
}

// --- Presupuestos ---

// Obtener presupuestos de un usuario
export async function getBudgets(user_id: number): Promise<Budget[]> {
  const response = await fetch(`/api/budgets?user_id=${user_id}`);
  if (!response.ok) {
    throw new Error("Error al obtener presupuestos");
  }
  return await response.json();
}

// Crear presupuesto
export async function addBudget(budgetData: { categoryId: string; amount: number; month: string; user_id: number; }) {
  const newId = `bud-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const budgetToAdd = { ...budgetData, id: newId };
  
  const response = await fetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budgetToAdd),
  });
  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.details || "Error al crear presupuesto");
  }
  return await response.json();
}

// Actualizar presupuesto
export async function updateBudget(budget: Budget) {
    const response = await fetch("/api/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
    });
    if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.details || "Error al actualizar presupuesto");
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

// --- Dashboard ---

// Dashboard data desde la API
export async function getDashboardData(user_id: number) {
  const [accounts, transactions, categories] = await Promise.all([
    getAccounts(user_id),
    getTransactions(user_id),
    getCategories(),
  ]);

  const totalIncome = transactions
    .filter((t: any) => t.type === "Income")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t: any) => t.type === "Expense")
    .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

  const balance = accounts
    .filter((acc): acc is DebitAccount => acc.type !== "Credit Card")
    .reduce((sum, acc) => sum + acc.balance, 0);

  return {
    totalIncome,
    totalExpense,
    balance,
    transactions,
    categories,
    accounts,
  };
}
