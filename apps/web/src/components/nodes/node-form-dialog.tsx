"use client";
import { Button } from "@IonNode/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@IonNode/ui/components/dialog";
import { Input } from "@IonNode/ui/components/input";
import { Label } from "@IonNode/ui/components/label";
import { Textarea } from "@IonNode/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface NodeFormData {
	description?: string;
	location?: string;
	name: string;
	nodeId: string;
	type: string;
}

interface NodeFormDialogProps {
	node?: {
		id: string;
		nodeId: string;
		name: string;
		type: string;
		location?: string | null;
		description?: string | null;
	};
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function NodeFormDialog({
	open,
	onOpenChange,
	node,
}: NodeFormDialogProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState<NodeFormData>({
		description: node?.description || "",
		location: node?.location || "",
		name: node?.name || "",
		nodeId: node?.nodeId || "",
		type: node?.type || "",
	});

	const createMutation = useMutation({
		mutationFn: async (data: NodeFormData) => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/trpc/nodes.create`,
				{
					body: JSON.stringify(data),
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					method: "POST",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to create node");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["nodes", "list"],
			});
			onOpenChange(false);
			router.refresh();
		},
	});

	const updateMutation = useMutation({
		mutationFn: async (data: {
			id: string;
			name: string;
			type: string;
			location?: string;
			description?: string;
		}) => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/trpc/nodes.update`,
				{
					body: JSON.stringify(data),
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					method: "POST",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to update node");
			}
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["nodes", "list"],
			});
			onOpenChange(false);
			router.refresh();
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (node) {
			await updateMutation.mutateAsync({
				description: formData.description,
				id: node.id,
				location: formData.location,
				name: formData.name,
				type: formData.type,
			});
		} else {
			await createMutation.mutateAsync(formData);
		}
	};

	const isLoading = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>{node ? "Edit Node" : "Add New Node"}</DialogTitle>
				</DialogHeader>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="nodeId">Node ID *</Label>
						<Input
							disabled={!!node || isLoading}
							id="nodeId"
							onChange={(e) =>
								setFormData({ ...formData, nodeId: e.target.value })
							}
							placeholder="ION-001"
							required
							value={formData.nodeId}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							disabled={isLoading}
							id="name"
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="温度节点 001"
							required
							value={formData.name}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="type">Type *</Label>
						<Input
							disabled={isLoading}
							id="type"
							onChange={(e) =>
								setFormData({ ...formData, type: e.target.value })
							}
							placeholder="Temperature Sensor"
							required
							value={formData.type}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="location">Location</Label>
						<Input
							disabled={isLoading}
							id="location"
							onChange={(e) =>
								setFormData({ ...formData, location: e.target.value })
							}
							placeholder="南京工厂 1 号车间"
							value={formData.location}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							disabled={isLoading}
							id="description"
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="生产线温度采集设备"
							rows={3}
							value={formData.description}
						/>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							disabled={isLoading}
							onClick={() => onOpenChange(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={isLoading} type="submit">
							{isLoading ? "Saving..." : node ? "Update" : "Create"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
