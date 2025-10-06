
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";
import { es } from 'date-fns/locale';

interface MonthSelectorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export default function MonthSelector({ selectedDate, onDateChange }: MonthSelectorProps) {
    const handlePrevMonth = () => {
        onDateChange(subMonths(selectedDate, 1));
    };

    const handleNextMonth = () => {
        onDateChange(addMonths(selectedDate, 1));
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-36 text-center capitalize">
                {format(selectedDate, "MMMM yyyy", { locale: es })}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
