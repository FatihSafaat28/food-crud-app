interface EmptyStateProps {
  message: string;
  className?: string;
}

/**
 * Reusable empty state component
 */
export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={`col-span-full flex items-center justify-center text-muted-foreground min-h-50 ${className || ""}`}
    >
      {message}
    </div>
  );
}
