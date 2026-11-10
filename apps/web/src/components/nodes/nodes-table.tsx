"use client";
import { Button } from "@IonNode/ui/components/button";
import { StatusBadge } from "@/components/dashboard/status-badge";

interface Node {
	createdAt: string;
	description?: string | null;
	id: string;
	lastSeenAt: string | null;
	location: string | null;
	name: string;
	nodeId: string;
	status: "online" | "offline" | "warning";
	type: string;
}

interface NodesTableProps {
	nodes: Node[];
	onDelete: (node: { id: string; name: string }, e: React.MouseEvent) => void;
	onEdit: (node: Node, e: React.MouseEvent) => void;
	onRowClick: (nodeId: string) => void;
}

function formatRelativeTime(date: string | null): string {
	if (!date) {
		return "Never";
	}

	const now = Date.now();
	const target = new Date(date).getTime();
	const diffMs = now - target;
	const diffSec = Math.floor(diffMs / 1000);

	if (diffSec < 60) {
		return `${diffSec}s ago`;
	}
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) {
		return `${diffMin}m ago`;
	}
	const diffHour = Math.floor(diffMin / 60);
	if (diffHour < 24) {
		return `${diffHour}h ago`;
	}
	const diffDay = Math.floor(diffHour / 24);
	return `${diffDay}d ago`;
}

export function NodesTable({
	nodes,
	onRowClick,
	onEdit,
	onDelete,
}: NodesTableProps) {
	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead>
					<tr className="border-b">
						<th className="px-4 py-3 text-left font-medium text-sm">Name</th>
						<th className="px-4 py-3 text-left font-medium text-sm">Node ID</th>
						<th className="px-4 py-3 text-left font-medium text-sm">Type</th>
						<th className="px-4 py-3 text-left font-medium text-sm">
							Location
						</th>
						<th className="px-4 py-3 text-left font-medium text-sm">Status</th>
						<th className="px-4 py-3 text-left font-medium text-sm">
							Last Seen
						</th>
						<th className="px-4 py-3 text-left font-medium text-sm">
							Created At
						</th>
						<th className="px-4 py-3 text-left font-medium text-sm">Actions</th>
					</tr>
				</thead>
				<tbody>
					{nodes.map((node) => (
						<tr
							className="cursor-pointer border-b transition-colors hover:bg-muted/50"
							key={node.id}
							onClick={() => onRowClick(node.id)}
						>
							<td className="px-4 py-3 text-sm">{node.name}</td>
							<td className="px-4 py-3 font-mono text-sm">{node.nodeId}</td>
							<td className="px-4 py-3 text-sm">{node.type}</td>
							<td className="px-4 py-3 text-sm">{node.location || "-"}</td>
							<td className="px-4 py-3">
								<StatusBadge status={node.status} />
							</td>
							<td className="px-4 py-3 text-sm">
								{formatRelativeTime(node.lastSeenAt)}
							</td>
							<td className="px-4 py-3 text-sm">
								{new Date(node.createdAt).toLocaleDateString()}
							</td>
							<td className="px-4 py-3">
								<div className="flex gap-2">
									<Button
										onClick={(e) => onEdit(node, e)}
										size="sm"
										variant="ghost"
									>
										Edit
									</Button>
									<Button
										onClick={(e) =>
											onDelete({ id: node.id, name: node.name }, e)
										}
										size="sm"
										variant="ghost"
									>
										Delete
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
