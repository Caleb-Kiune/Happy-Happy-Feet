"use client";

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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "destructive" | "default";
    isLoading?: boolean;
    loadingText?: string;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "destructive",
    isLoading = false,
    loadingText,
}: ConfirmationModalProps) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="bg-white border-gray-100 shadow-2xl rounded-3xl gap-6 md:p-8">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-[#111111]">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500 text-base leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 sm:gap-0">
                    <AlertDialogCancel
                        disabled={isLoading}
                        className="rounded-full h-11 px-6 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={isLoading}
                        className={`rounded-full h-11 px-6 transition-all shadow-sm ${variant === "destructive"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-[#111111] hover:bg-black text-white"
                            }`}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading && loadingText ? loadingText : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
