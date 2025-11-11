import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'outline';
  iconClassName?: string;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ icon, title, description, variant = 'outline', className, iconClassName, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          'h-auto p-4 justify-start gap-3 border-zinc-800 hover:bg-zinc-800/50 bg-transparent',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0',
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-zinc-50">{title}</p>
          <p className="text-xs text-zinc-500 font-normal">{description}</p>
        </div>
      </Button>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton };
