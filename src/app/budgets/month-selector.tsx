
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths, startOfMonth, isAfter, isBefore } from "date-fns";
import { es } from 'date-fns/locale';

interface MonthSelectorProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

export default function MonthSelector({ selectedDate, onDateChange, minDate, maxDate }: MonthSelectorProps) {
    const handlePrevMonth = () => {
        onDateChange(subMonths(selectedDate, 1));
    };

    const handleNextMonth = () => {
        onDateChange(addMonths(selectedDate, 1));
    };

    const isNextDisabled = maxDate ? isAfter(startOfMonth(addMonths(selectedDate, 1)), startOfMonth(maxDate)) : false;
    const isPrevDisabled = minDate ? isBefore(startOfMonth(subMonths(selectedDate, 1)), startOfMonth(minDate)) : false;


    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth} disabled={isPrevDisabled}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold w-36 text-center capitalize">
                {format(selectedDate, "MMMM yyyy", { locale: es })}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth} disabled={isNextDisabled}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
