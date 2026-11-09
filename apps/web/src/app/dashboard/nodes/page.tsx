"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@IonNode/ui/components/card";
import { Button } from "@IonNode/ui/components/button";
import { Input } from "@IonNode/ui/components/input";

import { useTRPC } from "@/utils/trpc";
import { StatusBadge } from "@/components/dashboard/status-badge";

export default function NodesPage() {
  const trpc = useTRPC();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: nodes } = useQuery({
    ...trpc.nodes.list.queryOptions({ search }),
    refetchInterval: 10000,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nodes</h1>
        <Button onClick={() => router.push("/dashboard/nodes/new")}>
          + Add Node
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Node ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nodes?.map((node) => (
                  <tr
                    key={node.id}
                    className="cursor-pointer border-b transition-colors hover:bg-muted/50"
                    onClick={() => router.push(`/dashboard/nodes/${node.id}`)}
                  >
                    <td className="px-4 py-3 text-sm">{node.name}</td>
                    <td className="px-4 py-3 text-sm font-mono">{node.nodeId}</td>
                    <td className="px-4 py-3 text-sm">{node.type}</td>
                    <td className="px-4 py-3 text-sm">{node.location || "-"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={node.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Delete functionality
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
