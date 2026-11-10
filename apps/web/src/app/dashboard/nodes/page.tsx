"use client";
import { Button } from "@IonNode/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@IonNode/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DeleteNodeDialog } from "@/components/nodes/delete-node-dialog";
import { Filters } from "@/components/nodes/filters";
import { NodeFormDialog } from "@/components/nodes/node-form-dialog";
import { NodesTable } from "@/components/nodes/nodes-table";
import { useTRPC } from "@/utils/trpc";

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

export default function NodesPage() {
	const trpc = useTRPC();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [formOpen, setFormOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [selectedNode, setSelectedNode] = useState<Node | null>(null);
	const [editMode, setEditMode] = useState(false);

	const { data: nodes } = useQuery({
		...trpc.nodes.list.queryOptions({}),
		refetchInterval: 10_000,
	});

	const nodeTypes = useMemo(() => {
		if (!nodes) {
			return [];
		}
		return Array.from(new Set(nodes.map((n) => n.type)));
	}, [nodes]);

	const filteredNodes = useMemo(() => {
		if (!nodes) {
			return [];
		}

		return nodes.filter((node) => {
			const matchesSearch =
				search === "" ||
				node.name.toLowerCase().includes(search.toLowerCase()) ||
				node.nodeId.toLowerCase().includes(search.toLowerCase()) ||
				(node.location &&
					node.location.toLowerCase().includes(search.toLowerCase()));

			const matchesStatus =
				statusFilter === "all" || node.status === statusFilter;
			const matchesType = typeFilter === "all" || node.type === typeFilter;

			return matchesSearch && matchesStatus && matchesType;
		});
	}, [nodes, search, statusFilter, typeFilter]);

	const handleEdit = (node: Node, e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedNode(node);
		setEditMode(true);
		setFormOpen(true);
	};

	const handleDelete = (
		node: { id: string; name: string },
		e: React.MouseEvent
	) => {
		e.stopPropagation();
		setSelectedNode(node as Node);
		setDeleteOpen(true);
	};

	const handleAddNew = () => {
		setSelectedNode(null);
		setEditMode(false);
		setFormOpen(true);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-bold text-3xl">Nodes</h1>
				<Button onClick={handleAddNew}>+ Add Node</Button>
			</div>

			<Filters
				nodeTypes={nodeTypes}
				onSearchChange={setSearch}
				onStatusChange={setStatusFilter}
				onTypeChange={setTypeFilter}
				search={search}
				statusFilter={statusFilter}
				typeFilter={typeFilter}
			/>

			<Card>
				<CardHeader>
					<CardTitle>All Devices</CardTitle>
				</CardHeader>
				<CardContent>
					{!filteredNodes || filteredNodes.length === 0 ? (
						<div className="py-12 text-center">
							<p className="text-muted-foreground">No nodes found</p>
							<p className="mt-2 text-muted-foreground text-sm">
								{nodes && nodes.length > 0
									? "Try adjusting your filters"
									: 'Click "Add Node" to create your first device'}
							</p>
						</div>
					) : (
						<NodesTable
							nodes={filteredNodes}
							onDelete={handleDelete}
							onEdit={handleEdit}
							onRowClick={(id) => router.push(`/dashboard/nodes/${id}`)}
						/>
					)}
				</CardContent>
			</Card>

			<NodeFormDialog
				node={
					editMode && selectedNode
						? {
								description: selectedNode.description,
								id: selectedNode.id,
								location: selectedNode.location,
								name: selectedNode.name,
								nodeId: selectedNode.nodeId,
								type: selectedNode.type,
							}
						: undefined
				}
				onOpenChange={setFormOpen}
				open={formOpen}
			/>

			{selectedNode && (
				<DeleteNodeDialog
					node={selectedNode}
					onOpenChange={setDeleteOpen}
					open={deleteOpen}
				/>
			)}
		</div>
	);
}
