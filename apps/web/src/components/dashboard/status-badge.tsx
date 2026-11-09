import { cn } from "@IonNode/ui/lib/utils";

type NodeStatus = "online" | "offline" | "warning";

interface StatusBadgeProps {
	className?: string;
	status: NodeStatus;
}

const statusColors: Record<NodeStatus, string> = {
	offline: "bg-gray-400",
	online: "bg-green-500",
	warning: "bg-yellow-500",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
	return (
		<span className={cn("inline-flex items-center gap-2", className)}>
			<span
				aria-label={`Status: ${status}`}
				className={cn("h-2 w-2 rounded-full", statusColors[status])}
				role="status"
			/>
			<span className="capitalize">{status}</span>
		</span>
	);
}
