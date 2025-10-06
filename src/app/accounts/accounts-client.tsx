
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Landmark, PlusCircle, Trash, Wallet, Coins } from "lucide-react";
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
    Cash: <Coins className="h-8 w-8 text-muted-foreground" />,
}

const AccountCard = ({ account, onDelete }: { account: Account, onDelete: (id: string) => void }) => (
    <Card className="card-glassmorphic flex flex-col justify-between min-h-[150px] rounded-xl">
        <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div className="flex items-start justify-between">
                {accountIcons[account.type]}
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{account.name}</p>
                <p className="text-2xl font-bold font-headline">{formatCurrency(account.balance)}</p>
            </div>
        </CardContent>
        <div className="p-2 flex justify-end items-center text-muted-foreground">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(account.id)}>
                <Trash className="h-4 w-4 text-destructive" />
            </Button>
        </div>
    </Card>
);


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

    const bankAccounts = data.filter(a => a.type === 'Bank');
    const walletAccounts = data.filter(a => a.type === 'Wallet');
    const cashAccounts = data.filter(a => a.type === 'Cash');

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="card-glassmorphic rounded-xl">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Patrimonio Total</CardTitle>
                        <CardDescription>Suma de todas tus cuentas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{formatCurrency(totalPatrimony)}</p>
                    </CardContent>
                </Card>
                 <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full h-full text-lg">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Agregar Nueva Cuenta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="card-glassmorphic">
                        <DialogHeader>
                            <DialogTitle className="font-headline">Nueva Cuenta</DialogTitle>
                        </DialogHeader>
                        <AccountForm onSuccess={handleSuccess} />
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="space-y-6">
                {/* Bank Accounts */}
                {bankAccounts.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold font-headline text-muted-foreground">Cuentas Bancarias</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {bankAccounts.map(account => <AccountCard key={account.id} account={account} onDelete={handleDeleteRequest} />)}
                        </div>
                    </div>
                )}
                
                {/* Wallet Accounts */}
                {walletAccounts.length > 0 && (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold font-headline text-muted-foreground">Billeteras Digitales</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                           {walletAccounts.map(account => <AccountCard key={account.id} account={account} onDelete={handleDeleteRequest} />)}
                        </div>
                    </div>
                )}

                {/* Cash */}
                {cashAccounts.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold font-headline text-muted-foreground">Efectivo</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {cashAccounts.map(account => <AccountCard key={account.id} account={account} onDelete={handleDeleteRequest} />)}
                        </div>
                    </div>
                )}
                
                {data.length === 0 && (
                    <Card className="card-glassmorphic flex items-center justify-center min-h-[150px] border-dashed rounded-xl">
                        <div className="flex flex-col h-auto gap-2 text-muted-foreground items-center">
                            <PlusCircle className="h-8 w-8" />
                            <span>Agrega tu primera cuenta para empezar</span>
                        </div>
                    </Card>
                )}
            </div>

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
