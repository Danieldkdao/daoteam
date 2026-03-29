import { ReactNode } from "react";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-svh py-10 px-6 flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
