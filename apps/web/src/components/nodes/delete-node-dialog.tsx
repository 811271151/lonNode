"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@IonNode/ui/components/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DeleteNodeDialogProps {
	node: {
		id: string;
		name: string;
	};
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function DeleteNodeDialog({
	open,
	onOpenChange,
	node,
}: DeleteNodeDialogProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/trpc/nodes.delete`,
				{
					body: JSON.stringify({ id }),
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					method: "POST",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete node");
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

	const handleDelete = async () => {
		await deleteMutation.mutateAsync(node.id);
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Node</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete <strong>{node.name}</strong>? This
						will permanently delete this node and all its data. This action
						cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={deleteMutation.isPending}>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={deleteMutation.isPending}
						onClick={handleDelete}
					>
						{deleteMutation.isPending ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
