import SetupPassword from "@/features/auth/signup/password";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const verificationLinkSchema = z.object({
  verificationCode: z.string().nonempty(),
});

// type VerificationCode = z.infer<typeof verificationLinkSchema>;

export const Route = createFileRoute("/auth/signup/password/")({
  component: SetupPassword,
  validateSearch: verificationLinkSchema,
});
