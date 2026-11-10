"use client";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@IonNode/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { memo, useCallback } from "react";

import { useTRPC } from "../../utils/trpc";
import { StatusBadge } from "./status-badge";

function getRelativeTime(date: string | Date | null): string {
	const now = Date.now();
	const diffMs = now - new Date(date || 0).getTime();

	if (diffMs < 60_000) {
		return `${Math.floor(diffMs / 1000)}s ago`;
	}
	if (diffMs < 3_600_000) {
		return `${Math.floor(diffMs / 60_000)}m ago`;
	}
	if (diffMs < 86_400_000) {
		return `${Math.floor(diffMs / 3_600_000)}h ago`;
	}
	return `${Math.floor(diffMs / 86_400_000)}d ago`;
}

interface NodeRowProps {
	node: {
		id: string;
		name: string;
		type: string;
		status: "online" | "offline" | "warning";
		lastSeenAt: string | null;
	};
	onRowClick?: (nodeId: string) => void;
}

const NodeRow = memo(function NodeRowComponent({
	node,
	onRowClick,
}: NodeRowProps) {
	const handleClick = useCallback(() => {
		onRowClick?.(node.id);
	}, [node.id, onRowClick]);

	return (
		<tr
			className={
				onRowClick
					? "cursor-pointer border-b transition-colors hover:bg-muted/50"
					: "border-b"
			}
			key={node.id}
			onClick={onRowClick ? handleClick : undefined}
		>
			<td className="px-4 py-3 text-sm">{node.name}</td>
			<td className="px-4 py-3 text-sm">{node.type}</td>
			<td className="px-4 py-3 text-sm">
				<StatusBadge status={node.status} />
			</td>
			<td className="px-4 py-3 text-sm">
				{node.lastSeenAt ? getRelativeTime(node.lastSeenAt) : "Never"}
			</td>
		</tr>
	);
});

interface NodeStatusTableProps {
	onRowClick?: (nodeId: string) => void;
}

export function NodeStatusTable({ onRowClick }: NodeStatusTableProps) {
	const trpc = useTRPC();
	const { data: nodes, isLoading } = useQuery({
		...trpc.nodes.list.queryOptions({}),
		refetchInterval: 10_000,
	});

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Device Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center py-8">
						<p className="text-muted-foreground">Loading...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!nodes || nodes.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Device Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-muted-foreground">No nodes found</p>
						<p className="mt-2 text-muted-foreground text-sm">
							Add your first node to get started
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Device Status</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b">
								<th className="px-4 py-3 text-left font-medium text-sm">
									Node
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Type
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Status
								</th>
								<th className="px-4 py-3 text-left font-medium text-sm">
									Last Seen
								</th>
							</tr>
						</thead>
						<tbody>
							{nodes.map((node: (typeof nodes)[number]) => (
								<NodeRow key={node.id} node={node} onRowClick={onRowClick} />
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
