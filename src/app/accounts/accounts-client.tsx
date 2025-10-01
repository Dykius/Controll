"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Landmark, PlusCircle, Trash, Wallet } from "lucide-react";
import type { Account } from "@/lib/types";

interface AccountsClientProps {
    data: Account[];
}

const accountIcons = {
    Bank: <Landmark className="h-8 w-8 text-muted-foreground" />,
    Wallet: <Wallet className="h-8 w-8 text-muted-foreground" />,
    Cash: <Wallet className="h-8 w-8 text-muted-foreground" />
}

export const AccountsClient: React.FC<AccountsClientProps> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="card-glassmorphic flex items-center justify-center min-h-[150px] border-dashed rounded-xl">
                <Button variant="ghost" className="flex flex-col h-auto gap-2 text-muted-foreground hover:text-foreground">
                    <PlusCircle className="h-8 w-8" />
                    <span>Agregar Cuenta</span>
                </Button>
            </Card>
            {data.map(account => (
                <Card key={account.id} className="card-glassmorphic flex flex-col justify-between min-h-[150px] rounded-xl">
                    <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                            {accountIcons[account.type]}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">{account.name}</p>
                            <p className="text-2xl font-bold font-headline">{formatCurrency(account.initialBalance)}</p>
                        </div>
                    </CardContent>
                    <div className="p-2 flex justify-end items-center text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-auto ml-2"></span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};