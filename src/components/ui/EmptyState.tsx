import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    title: string;
    description: string;
    icon: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ title, description, icon: Icon, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm",
            className
        )}>
            <div className="bg-gray-50 p-4 rounded-full mb-6">
                <Icon className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans text-lg font-bold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="font-sans text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="bg-[#E07A8A] hover:bg-[#D66A7A] text-white rounded-full px-8 shadow-sm hover:shadow-md transition-all duration-200"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
