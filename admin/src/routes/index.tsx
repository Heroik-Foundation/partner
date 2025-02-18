import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSignIn } from "@/hooks/mutation/auth";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/")({
  component: Page,
});

function Page() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { mutate, isPending } = useSignIn({
    email: form.email,
    password: form.password,
  });

  return (
    <div className="w-ful flex items-center h-[100vh]">
      <div className="w-full lg:w-[50%] h-screen flex flex-col justify-center items-center p-5 space-y-5">
        <img src="/logo.png" alt="" className="w-[300px] h-[300px]" />
        <form
          className="min-w-[300px] max-w-md space-y-5"
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (form.email !== "" && form.password !== "") {
              mutate();
            }
          }}
        >
          <h1 className="text-4xl font-semibold">Log in</h1>
          <p className="text-muted-foreground pb-1">
            Welcome back! Please enter your details
          </p>
          <div className="space-y-1">
            <Label className="text-neutral-600">Email</Label>
            <Input
              value={form.email}
              name="email"
              type="email"
              required
              placeholder="Email"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                setForm((prev) => ({
                  ...prev,
                  [event.target.name]: event.target.value,
                }));
              }}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-neutral-600">Password</Label>
            <Input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                event.preventDefault();
                setForm((prev) => ({
                  ...prev,
                  [event.target.name]: event.target.value,
                }));
              }}
            />
          </div>
          <Button className="w-full" isLoading={isPending} type="submit">
            Login
          </Button>
        </form>
      </div>
      <div
        className="hidden lg:block lg:w-[50%] h-screen rounded-l-[60px]"
        style={{
          background:
            "url('https://images.unsplash.com/photo-1677067156159-a0e5b8de52ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D')",
        }}
      ></div>
    </div>
  );
}
