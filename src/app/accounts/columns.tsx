"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Account } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <Badge variant="secondary">{row.getValue("type")}</Badge>,
  },
  {
    accessorKey: "initialBalance",
    header: () => <div className="text-right">Balance</div>,
    cell: ({ row }) => <div className="text-right font-medium">{formatCurrency(row.getValue("initialBalance"))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
