"use client";

import * as React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";

export function FeedbackDialog() {
  const [message, setMessage] = React.useState("");
  const adminEmail = "admmhs@bundamulia.ac.id";

  const handleSendFeedback = () => {
    const subject = encodeURIComponent("Feedback / Question from User");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Feedback / Question</DialogTitle>
        <DialogDescription>
          Provide your feedback or ask a question to the admin.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            placeholder="Type your feedback or question here."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSendFeedback}>
          Send
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}