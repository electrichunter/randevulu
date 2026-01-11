"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CustomAlertProps {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    className?: string;
    onClose?: () => void;
    isVisible?: boolean;
}

export function CustomAlert({
    type,
    title,
    message,
    className,
    onClose,
    isVisible = true
}: CustomAlertProps) {
    const [visible, setVisible] = useState(isVisible);

    useEffect(() => {
        setVisible(isVisible);
    }, [isVisible]);

    if (!visible) return null;

    const handleClose = () => {
        setVisible(false);
        onClose?.();
    };

    const styles = {
        success: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
            iconColor: "text-green-500",
            icon: CheckCircle2
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-800",
            iconColor: "text-red-500",
            icon: AlertCircle
        },
        warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-800",
            iconColor: "text-yellow-600",
            icon: AlertCircle
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
            iconColor: "text-blue-500",
            icon: AlertCircle
        }
    };

    const style = styles[type];
    const Icon = style.icon;

    return (
        <div className={cn(
            "relative rounded-lg border p-4 shadow-sm transition-all duration-300",
            style.bg,
            style.border,
            className
        )}>
            <div className="flex items-start gap-4">
                <Icon className={cn("h-5 w-5 mt-0.5", style.iconColor)} />
                <div className="flex-1">
                    <h3 className={cn("text-sm font-medium", style.text)}>
                        {title}
                    </h3>
                    <div className={cn("mt-1 text-sm opacity-90", style.text)}>
                        {message}
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className={cn("rounded-md p-1.5 hover:bg-white/50 transition-colors", style.text)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Kapat</span>
                </button>
            </div>
        </div>
    );
}
