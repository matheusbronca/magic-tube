import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "react-day-picker";

interface SubscriptionButtonProps {
  onClick: ButtonProps["onClick"];
  disabled: boolean;
  isSubscribed: boolean;
  className?: string;
  size?: ButtonProps["size"];
}

export const SubscriptionButton = ({
  onClick,
  disabled,
  isSubscribed,
  className,
  size,
}: SubscriptionButtonProps) => {
  return (
    <Button
      size={size}
      variant={isSubscribed ? "secondary" : "default"}
      className={cn("rounded-full cursor-pointer", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  );
};
