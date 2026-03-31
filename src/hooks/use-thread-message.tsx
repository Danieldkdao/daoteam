"use client";

import { SetterType } from "@/lib/types";
import { createContext, useContext, useState, type ReactNode } from "react";

type ThreadMessageContextType = {
  currentThreadMessage: string | null;
  setCurrentThreadMessage: SetterType<string | null>;
};

const ThreadMessageContext = createContext<ThreadMessageContextType | null>(
  null,
);

export const ThreadMessageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [currentThreadMessage, setCurrentThreadMessage] = useState<
    string | null
  >(null);

  const values: ThreadMessageContextType = {
    currentThreadMessage,
    setCurrentThreadMessage,
  };

  return (
    <ThreadMessageContext.Provider value={values}>
      {children}
    </ThreadMessageContext.Provider>
  );
};

export const useThreadMessage = () => {
  const context = useContext(ThreadMessageContext);
  if (!context) {
    throw new Error(
      "Thread message context must be used inside the thread message context provider.",
    );
  }
  return context;
};
