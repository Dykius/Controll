
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Landmark, PlusCircle, Trash, Wallet } from "lucide-react";
import type { Account } from "@/lib/types";
import { deleteAccount } from "@/lib/data-service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AccountForm } from "./account-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AccountsClientProps {
    data: Account[];
    onAccountChange: () => void;
}

const accountIcons = {
    Bank: <Landmark className="h-8 w-8 text-muted-foreground" />,
    Wallet: <Wallet className="h-8 w-8 text-muted-foreground" />,
    Cash: <Wallet className="h-8 w-8 text-muted-foreground" />
}

export const AccountsClient: React.FC<AccountsClientProps> = ({ data, onAccountChange }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

    const totalPatrimony = data.reduce((sum, account) => sum + account.balance, 0);

    const handleDeleteRequest = (accountId: string) => {
        setAccountToDelete(accountId);
        setIsAlertOpen(true);
    };

    const confirmDelete = () => {
        if (accountToDelete) {
            deleteAccount(accountToDelete);
            onAccountChange();
            setAccountToDelete(null);
        }
        setIsAlertOpen(false);
    };
    
    const handleSuccess = () => {
        setIsFormOpen(false);
        onAccountChange();
    }

    return (
        <div className="space-y-8">
            <Card className="card-glassmorphic rounded-xl">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Patrimonio Neto Total</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{formatCurrency(totalPatrimony)}</p>
                </CardContent>
            </Card>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <DialogTrigger asChild>
                        <Card className="card-glassmorphic flex items-center justify-center min-h-[150px] border-dashed rounded-xl cursor-pointer hover:border-primary transition-all">
                            <div className="flex flex-col h-auto gap-2 text-muted-foreground items-center">
                                <PlusCircle className="h-8 w-8" />
                                <span>Agregar Cuenta</span>
                            </div>
                        </Card>
                    </DialogTrigger>
                    {data.map(account => (
                        <Card key={account.id} className="card-glassmorphic flex flex-col justify-between min-h-[150px] rounded-xl">
                            <CardContent className="p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    {accountIcons[account.type]}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{account.name}</p>
                                    <p className="text-2xl font-bold font-headline">{formatCurrency(account.balance)}</p>
                                </div>
                            </CardContent>
                            <div className="p-2 flex justify-end items-center text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-auto ml-2"></span>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleDeleteRequest(account.id);}}>
                                    <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
                 <DialogContent className="card-glassmorphic">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Nueva Cuenta</DialogTitle>
                    </DialogHeader>
                    <AccountForm onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todas sus transacciones asociadas.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Eliminar
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
