"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction, Category, Account } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, ArrowDownUp } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Badge } from "@/components/ui/badge";

type ActionCellProps = {
  row: any;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
};

const ActionCell: React.FC<ActionCellProps> = ({ row, onEdit, onDelete }) => {
  const transaction = row.original as Transaction;

  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onEdit(transaction)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(transaction.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const getColumns = (
  onEdit: (transaction: Transaction) => void,
  onDelete: (transactionId: string) => void,
  categories: Category[],
  accounts: Account[]
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const category = categories.find((c) => c.id === row.original.categoryId);
      const account = accounts.find((a) => a.id === row.original.accountId);
      return (
        <div className="flex items-center gap-3">
          <div className="bg-secondary p-2 rounded-full h-10 w-10 flex items-center justify-center">
            <span className="font-bold text-sm">
              {category?.name.charAt(0) || "?"}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.getValue("description")}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{account?.name}</span>
              {category && (
                <Badge
                  variant="outline"
                  className="rounded-full hidden sm:inline-flex"
                >
                  {category.name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowDownUp className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {formatDate(row.getValue("date"))}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Monto</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type;

      const sign = type === "Income" ? "+" : "-";
      const formatted = formatCurrency(amount);

      return (
        <div
          className={cn(
            "text-right font-bold",
            type === "Income"
              ? "text-[hsl(var(--chart-1))]"
              : "text-[hsl(var(--chart-2))]"
          )}
        >
          {sign} {formatted}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: (props) => (
      <ActionCell {...props} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];
