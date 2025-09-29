import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { accounts, categories, transactions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function RecentTransactions() {
  const recent = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <Card className="card-glassmorphic">
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>Your 5 most recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
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
                    {category && <Badge variant="outline">{category?.name}</Badge>}
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
