import { cn } from "@/lib/utils";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip";
import { RiMailLine } from "@remixicon/react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback-dialog";
import { User, Bot } from "lucide-react"; // Import User and Bot icons

type ChatMessageProps = {
  isUser?: boolean;
  children: React.ReactNode;
};

export function ChatMessage({ isUser, children }: ChatMessageProps) {
  return (
    <article
      className={cn(
        "flex items-start gap-4 text-[15px] leading-relaxed",
        isUser && "justify-end",
      )}
    >
      {isUser ? (
        <User className="h-8 w-8 rounded-full text-muted-foreground order-1" />
      ) : (
        <Bot className="h-8 w-8 rounded-full border border-black/[0.08] shadow-sm text-muted-foreground" />
      )}
      <div
        className={cn(isUser ? "bg-muted px-4 py-3 rounded-xl" : "space-y-4")}
      >
        <div className="flex flex-col gap-3">
          <p className="sr-only">{isUser ? "You" : "Bart"} said:</p>
          {children}
        </div>
        {!isUser && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="text-muted-foreground/80 cursor-pointer hover:text-foreground transition-colors"
              >
                <RiMailLine size={16} />
                <span className="text-black">Give Feedback</span>
              </Button>
            </DialogTrigger>
            <FeedbackDialog />
          </Dialog>
        )}
      </div>
    </article>
  );
}
