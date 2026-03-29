import { BanIcon } from "lucide-react";

const ChannelPage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="p-10 border-2 border-dashed flex flex-col items-center gap-2 w-100 bg-card rounded-lg">
        <div className="bg-primary/20 rounded-full p-2">
          <BanIcon className="text-primary size-10" />
        </div>
        <h1 className="text-2xl font-bold text-center">No Channel Selected</h1>
        <p className="text-sm font-medium text-muted-foreground w-full max-w-100 text-center">
          Begin or resume your conversations by selecting a channel from the
          list on the left. If you don't see any, you can create a new one to
          get started.
        </p>
      </div>
    </div>
  );
};

export default ChannelPage;
