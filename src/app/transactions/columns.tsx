"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Transaction } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, ArrowDownUp, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getCategories, getAccounts } from "@/lib/data-service";
import { cn } from "@/lib/utils"


const IconMap = {
    'Comida': 'Utensils',
    'Salario': 'Briefcase',
    'Transporte': 'Car',
    'Arriendo': 'Home',
    'Freelance': 'Laptop',
    'Servicios': 'Lightbulb',
    'Salud': 'HeartPulse',
    'Entretenimiento': 'Ticket',
    'Default': 'ShoppingCart',
};

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
        const categories = getCategories();
        const accounts = getAccounts();
        const category = categories.find(c => c.id === row.original.categoryId);
        const account = accounts.find(a => a.id === row.original.accountId);
        // This is a placeholder, you'd need a component that maps string to icon
        // const Icon = category ? IconMap[category.name] || IconMap['Default'] : IconMap['Default'];
        return (
             <div className="flex items-center gap-3">
                 <div className="bg-secondary p-2 rounded-full">
                    {/* <Icon className="h-5 w-5" /> Placeholder for dynamic icons */}
                    <span className="h-5 w-5 flex items-center justify-center font-bold">{category?.name.charAt(0)}</span>
                 </div>
                 <div>
                    <div className="font-medium">{row.getValue("description")}</div>
                    <div className="text-sm text-muted-foreground">{account?.name}</div>
                 </div>
            </div>
        )
    }
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
      )
    },
    cell: ({ row }) => <div className="text-muted-foreground">{formatDate(row.getValue("date"))}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Monto</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const type = row.original.type
      const formatted = formatCurrency(amount)

      return (
        <div className="flex items-center justify-end gap-2">
            <div className={cn("text-right font-bold", type === 'Income' ? 'text-[hsl(var(--chart-1))]' : 'text-[hsl(var(--chart-2))]')}>
                {formatted}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <PlusCircle className="h-4 w-4" />
            </Button>
        </div>
      )
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
