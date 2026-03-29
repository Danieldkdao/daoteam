import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./routers/_app";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetProcedureOutput<
  T extends keyof RouterOutput,
  K extends keyof RouterOutput[T],
> = RouterOutput[T][K];
