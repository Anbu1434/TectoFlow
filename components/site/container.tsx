import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-7xl container-px', className)}
      {...props}
    >
      {children}
    </div>
  );
}
