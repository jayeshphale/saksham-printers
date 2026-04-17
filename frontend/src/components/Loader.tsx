import { Loader2 } from 'lucide-react';
import { cn } from './Button';

interface LoaderProps {
    className?: string;
    size?: number;
}

export function Loader({ className, size = 24 }: LoaderProps) {
    return (
        <div className="flex justify-center items-center p-4">
            <Loader2
                className={cn("animate-spin text-primary-600", className)}
                size={size}
            />
        </div>
    );
}
