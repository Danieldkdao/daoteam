import { auth } from "@/lib/auth/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export type Context = {
  auth: {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      plan: string;
    };
  } | null;
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCContext = cache(async (): Promise<Context> => {
  return { auth: await auth.api.getSession({ headers: await headers() }) };
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx?.auth?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  if (!ctx?.auth?.user.emailVerified) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Email not verified",
    });
  }

  return next({
    ctx: { auth: ctx.auth },
  });
});

const isAuthedNoVerify = t.middleware(({ next, ctx }) => {
  if (!ctx?.auth?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: { auth: ctx.auth },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const authedProcedure = t.procedure.use(isAuthedNoVerify);
