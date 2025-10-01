import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Transaction, Category, Account } from "@/lib/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
}

export function RecentTransactions({ transactions, categories, accounts }: RecentTransactionsProps) {
  const recent = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Card className="card-glassmorphic rounded-xl">
      <CardHeader>
        <CardTitle className="font-headline">Transacciones Recientes</CardTitle>
        <CardDescription>Tus 5 transacciones más recientes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead className="hidden sm:table-cell">Categoría</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((txn) => {
              const category = categories.find(c => c.id === txn.categoryId);
              return (
                <TableRow key={txn.id}>
                  <TableCell>
                    <div className="font-medium">{txn.description}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {accounts.find(a => a.id === txn.accountId)?.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {category && <Badge variant="outline" className="rounded-full">{category?.name}</Badge>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(txn.date)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {txn.type === 'Income' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
