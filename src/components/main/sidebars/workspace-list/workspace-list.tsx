import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getWorkspaces } from "@/lib/actions/workspace.action";
import { cn, getColorCombination } from "@/lib/utils";
import Link from "next/link";

export const WorkspaceList = async () => {
  const workspaces = await getWorkspaces();

  return (
    <div className="flex flex-col gap-2 w-full overflow-auto">
      {workspaces.map((w) => (
        <Link key={w.id} href={`/workspace/${w.id}`} className="w-full">
          <Tooltip>
            <TooltipTrigger className="w-full cursor-pointer">
              <div
                className={cn(
                  "rounded-xl w-full h-20 flex items-center justify-center transition-colors duration-150",
                  getColorCombination(w.id),
                )}
              >
                <span className="text-3xl font-bold">
                  {w.name[0].toUpperCase()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent align="center" side="right">
              {w.name}
            </TooltipContent>
          </Tooltip>
        </Link>
      ))}
    </div>
  );
};
