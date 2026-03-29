"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Suspense, useState } from "react";
import { CreateChannelModal } from "./create-channel-modal";

export const CreateChannelButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Suspense>
        <CreateChannelModal open={open} setOpen={setOpen} />
      </Suspense>

      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full shrink-0"
      >
        <PlusIcon />
        Add Channel
      </Button>
    </>
  );
};
