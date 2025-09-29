"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, ArrowDownUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/data"

export const columns: ColumnDef<Transaction>[] = [
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
      )
    },
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    accessorKey: "categoryId",
    header: "Categoría",
    cell: ({ row }) => {
        const category = categories.find(c => c.id === row.getValue("categoryId"));
        return category ? <Badge variant="outline">{category?.name}</Badge> : null
    }
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Monto</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const type = row.original.type
      const formatted = formatCurrency(amount)

      return <div className="text-right font-medium">{type === 'Expense' ? '-' : '+'}{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
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
                <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
