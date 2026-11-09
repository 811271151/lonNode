"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/utils/trpc";
import { NodeStatusTable } from "@/components/dashboard/node-status-table";
import { StatCard } from "@/components/dashboard/stat-card";

export default function Home() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: nodes } = useQuery({
    ...trpc.nodes.list.queryOptions({}),
    refetchInterval: 10000,
  });

  const stats = useMemo(() => {
    if (!nodes) {
      return { total: 0, online: 0, offline: 0, warning: 0 };
    }

    return {
      total: nodes.length,
      online: nodes.filter((n) => n.status === "online").length,
      offline: nodes.filter((n) => n.status === "offline").length,
      warning: nodes.filter((n) => n.status === "warning").length,
    };
  }, [nodes]);

  const handleRowClick = (nodeId: string) => {
    router.push(`/dashboard/nodes/${nodeId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">IonNode Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Monitor and manage your IoT devices
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Nodes" value={stats.total} />
        <StatCard title="Online" value={stats.online} />
        <StatCard title="Offline" value={stats.offline} />
        <StatCard title="Warning" value={stats.warning} />
      </div>

      <div>
        <NodeStatusTable onRowClick={handleRowClick} />
      </div>
    </div>
  );
}
