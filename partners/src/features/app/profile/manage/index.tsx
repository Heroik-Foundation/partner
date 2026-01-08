import { Button } from "@/modules/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/ui/dialog";
import { Input } from "@/modules/ui/input";
import { Label } from "@/modules/ui/label";
import { toast } from "sonner";
import {
  getActiveSession,
  setActiveSession,
  removeSession,
  clearAllSessions,
  getAllSessions,
} from "@/lib/session";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAddSessionMutation } from "./hooks";
import { Header } from "../../global/header";
import { truncateText } from "@/helpers/text";
import { Plus, Trash2 } from "lucide-react";
import { FormPassword } from "@/features/auth/global/form";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { motion, PanInfo } from "motion/react";
import { ManageProfileMenu } from "./modules/menu";

// const dummySessions = [
//   {
//     sessionToken: "token_001",
//     name: "Alice Johnson",
//     email: "alice.johnson@example.com",
//   },
//   {
//     sessionToken: "token_002",
//     name: "Bob Smith",
//     email: "bob.smith@example.com",
//   },
//   {
//     sessionToken: "token_003",
//     name: "Charlie Brown",
//     email: "charlie.brown@example.com",
//   },
// ];

interface SwipeableSessionItemProps {
  session: {
    email: string;
    name: string;
  };
  onSwitch: (email: string) => void;
  onRemove: (email: string) => void;
}

function SwipeableSessionItem({
  session,
  onSwitch,
  onRemove,
}: SwipeableSessionItemProps) {
  const [isSwiping, setIsSwiping] = useState(false);
  const [dragX, setDragX] = useState(0);
  const DELETE_THRESHOLD = 150;

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const swipeDistance = Math.abs(info.offset.x);

    if (swipeDistance > DELETE_THRESHOLD) {
      onRemove(session.email);
    }

    setDragX(0);
    setIsSwiping(false);
  };

  const handleDrag = (_event: any, info: PanInfo) => {
    setDragX(info.offset.x);
    setIsSwiping(true);
  };

  const handleClick = () => {
    if (!isSwiping && Math.abs(dragX) < 10) {
      onSwitch(session.email);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-rose-500 flex items-center justify-end pr-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: Math.min(Math.abs(dragX) / DELETE_THRESHOLD, 1) }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <Trash2 className="h-5 w-5 text-white" />
      </motion.div>

      {/* Swipeable item */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onDragStart={() => setIsSwiping(true)}
        style={{ x: dragX }}
        animate={{ x: dragX }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
        whileTap={{ cursor: "grabbing" }}
        className="relative bg-background cursor-grab active:cursor-grabbing"
        onClick={handleClick}
      >
        <div className="flex p-3.5 items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${session.name}`}
              />
              <AvatarFallback>{session.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session.name}</p>
              <p className="text-xs font-medium text-muted-foreground">
                {truncateText(session.email, 25)}
              </p>
            </div>
          </div>

          {/* Swipe indicator */}
          <motion.div
            className="flex items-center gap-1 text-muted-foreground"
            initial={{ opacity: 0.5 }}
            animate={{
              opacity: isSwiping ? 0 : 0.5,
              x: isSwiping ? 10 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export function ManageProfiles() {
  const sessions = getAllSessions();
  const activeSession = getActiveSession();
  const { mutate: addSession, isPending } = useAddSessionMutation();
  const { navigate } = useRouter();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAddAccount = () => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    addSession(
      { email, password },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setEmail("");
          setPassword("");
          toast.success("Account added and switched successfully");
        },
      }
    );
  };

  const handleSwitchAccount = (sessionEmail: string) => {
    const success = setActiveSession(sessionEmail);
    if (success) {
      toast.success("Switched account");
      navigate({ to: "/app" });
    }
  };

  const handleRemoveAccount = (sessionEmail: string) => {
    if (isDeleting === sessionEmail) return;

    setIsDeleting(sessionEmail);

    if (sessions.length === 1) {
      clearAllSessions();
      toast.success("Logged out");
      navigate({ to: "/auth/login" });
      return;
    }

    setTimeout(() => {
      removeSession(sessionEmail);
      toast.success(
        activeSession?.email === sessionEmail
          ? "Logged out of this account"
          : "Account removed"
      );
      setIsDeleting(null);
    }, 300);
  };

  return (
    <div className="bg-background space-y-5">
      <Header
        header={{
          title: truncateText(String(activeSession?.email || "Profile"), 22),
          position: "inline",
        }}
        addOns={{
          content: (
            <Button
              className="relative"
              variant="secondary"
              onClick={() => setDrawerOpen(true)}
            >
              <Plus />
            </Button>
          ),
        }}
      />

      <div className="flex flex-col items-center space-y-2.5 text-center">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${activeSession?.name}`}
          alt="User avatar"
          className="w-20 h-20 rounded-full"
        />
        <p className="text-lg font-semibold">
          Hi, {truncateText(String(activeSession?.name || "User"))}
        </p>
      </div>

      <div className="rounded-xl bg-primary/10 space-y-4">
        <div className="p-3.5 flex items-center justify-center">
          <span className="font-semibold text-primary">Switch account</span>
        </div>

        {sessions.length > 1 ? (
          <ul className="">
            {sessions
              .filter((s) => s.email !== activeSession?.email)
              .map((session) => (
                <motion.li
                  className="border-y border-white first:border-b-0 last:border-y-0"
                  key={session.email}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: isDeleting === session.email ? 0 : 1,
                    scale: isDeleting === session.email ? 0.9 : 1,
                  }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.2 },
                  }}
                >
                  <SwipeableSessionItem
                    session={session}
                    onSwitch={handleSwitchAccount}
                    onRemove={handleRemoveAccount}
                  />
                </motion.li>
              ))}
          </ul>
        ) : (
          <ItemNotFound
            message="No other existing accounts"
            className="bg-primary/15 text-primary rounded-t-2xl"
          />
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary font-semibold">
              Add another account
            </DialogTitle>
            <DialogDescription className="font-semibold text-primary/50">
              Add an existing account to your profiles
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-password">Password</Label>
              <FormPassword
                id="add-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddAccount()}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              onClick={handleAddAccount}
              isPending={isPending}
            >
              Add account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ManageProfileMenu
        open={drawerOpen}
        setOpen={setDrawerOpen}
        primaryCTAFn={() => {
          navigate({
            to: "/auth/signup",
          });
        }}
        secondaryCTAFn={() => {
          setDrawerOpen(false);
          setDialogOpen(true);
        }}
      />
    </div>
  );
}

export default ManageProfiles;
