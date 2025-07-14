"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateUserNotificationInitMutation } from "../hooks/mutation";
import { toast } from "sonner";
import { MessageCircleReply } from "lucide-react";

export function CreateNotificationDialog({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { mutate, isPending, isSuccess } =
    useCreateUserNotificationInitMutation();

  const handleSubmit = () => {
    if (title && message && id) {
      mutate({
        title,
        message,
        recipient: id,
      });
    } else {
      toast.error("Please complete the form and try again");
    }
  };

  const handleClose = () => {
    setTitle("");
    setMessage("");
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setOpen(false);
      setMessage("");
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-1.5" size="sm" onClick={() => setOpen(true)}>
          <MessageCircleReply size={14} />
          <span>Send notification</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription>
            Fill in the title and message to notify the user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="notification-title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="notification-title"
              placeholder="e.g. Account Update"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="notification-message"
              className="text-sm font-medium text-foreground"
            >
              Message
            </label>
            <Textarea
              id="notification-message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              onClick={handleClose}
            >
              Close
            </Button>
          </DialogClose>
          <Button
            isLoading={isPending}
            onClick={handleSubmit}
            disabled={isPending}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
