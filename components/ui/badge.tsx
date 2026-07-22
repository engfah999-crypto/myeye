import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex rounded-full border border-slate-200 px-3 py-1 text-sm font-medium", className)} {...props} />;
}
