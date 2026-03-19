import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
  result?: unknown;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const command = args.command as string | undefined;
  const path = args.path as string | undefined;

  if (toolName === "str_replace_editor") {
    if (command === "create") return `Creating ${path}`;
    if (command === "str_replace" || command === "insert") return `Editing ${path}`;
    if (command === "view") return `Reading ${path}`;
  }

  if (toolName === "file_manager") {
    if (command === "rename") return `Renaming ${path}`;
    if (command === "delete") return `Deleting ${path}`;
  }

  return toolName;
}

export function ToolCallBadge({ toolName, args, state, result }: ToolCallBadgeProps) {
  const label = getLabel(toolName, args);
  const isDone = state === "result" && result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
