import {
  emailOTPClient,
  inferAdditionalFields,
  organizationClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { stripeClient } from "@better-auth/stripe/client";

export const authClient = createAuthClient({
  plugins: [
    emailOTPClient(),
    organizationClient(),
    inferAdditionalFields<typeof auth>(),
    stripeClient({
      subscription: true,
    }),
  ],
});
