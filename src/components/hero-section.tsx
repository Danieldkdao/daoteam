import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import { AnimationGeneratorType } from "motion/react";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as AnimationGeneratorType,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 isolate hidden opacity-65 contain-strict lg:block"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24 md:pt-36">
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="mask-b-from-35% mask-b-to-90% absolute inset-0 top-56 -z-20 lg:top-32"
            >
              <div className="hidden size-full bg-[radial-gradient(circle_at_top,rgba(123,92,255,0.18),transparent_36%),radial-gradient(circle_at_78%_18%,rgba(36,199,165,0.16),transparent_24%),linear-gradient(180deg,color-mix(in_oklch,var(--color-muted)_60%,transparent)_0%,transparent_52%,var(--color-background)_100%)] dark:block" />
            </AnimatedGroup>

            <div
              aria-hidden
              className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"
            />

            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="/sign-up"
                    className="hover:bg-card bg-muted/70 group mx-auto flex w-fit items-center gap-4 rounded-full border border-border/70 p-1 pl-4 shadow-md shadow-primary/5 transition-colors duration-300"
                  >
                    <span className="text-foreground text-sm">
                      Built for channels, members, billing, and AI
                    </span>
                    <span className="block h-4 w-0.5 border-l border-border bg-border"></span>

                    <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                      <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                        <span className="flex size-6">
                          <ArrowRight className="m-auto size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-5xl max-md:font-semibold md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  All your conversations, members, and AI in one place.
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="text-muted-foreground mx-auto mt-8 max-w-2xl text-balance text-lg"
                >
                  Manage channels, stay in sync with your team, and move faster
                  with AI compose and thread summaries in one clean workspace.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-primary/12 rounded-[calc(var(--radius-xl)+0.125rem)] border border-primary/20 p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/sign-up">
                        <span className="text-nowrap">Create a Workspace</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="/sign-in">
                      <span className="text-nowrap">Sign In</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>

            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                  <Image
                    className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                    src="/hero-image.png"
                    alt="DaoTeam workspace preview"
                    width="3420"
                    height="1784"
                  />
                  <Image
                    className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                    src="/hero-image.png"
                    alt="DaoTeam workspace preview"
                    width="3420"
                    height="1784"
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="/"
                className="block text-sm duration-150 hover:opacity-75"
              >
                <span> Teams building on DaoTeam</span>

                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14 md:grid-cols-4">
              <div className="flex items-center">
                <Image
                  src="/vercel-logo.svg"
                  alt="Vercel"
                  width={120}
                  height={28}
                  className="mx-auto h-5 w-full object-contain dark:opacity-90"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/neon-logo.png"
                  alt="Neon"
                  width={160}
                  height={45}
                  className="mx-auto h-5 w-full object-contain"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/vercel-logo.svg"
                  alt="Vercel"
                  width={120}
                  height={28}
                  className="mx-auto h-5 w-full object-contain dark:opacity-90"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/neon-logo.png"
                  alt="Neon"
                  width={160}
                  height={45}
                  className="mx-auto h-5 w-full object-contain"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/vercel-logo.svg"
                  alt="Vercel"
                  width={120}
                  height={28}
                  className="mx-auto h-5 w-full object-contain dark:opacity-90"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/neon-logo.png"
                  alt="Neon"
                  width={160}
                  height={45}
                  className="mx-auto h-5 w-full object-contain"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/vercel-logo.svg"
                  alt="Vercel"
                  width={120}
                  height={28}
                  className="mx-auto h-5 w-full object-contain dark:opacity-90"
                />
              </div>

              <div className="flex items-center">
                <Image
                  src="/neon-logo.png"
                  alt="Neon"
                  width={160}
                  height={45}
                  className="mx-auto h-5 w-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
