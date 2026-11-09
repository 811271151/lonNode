"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@IonNode/ui/components/card";

import { useTRPC } from "@/utils/trpc";
import { StatusBadge } from "@/components/dashboard/status-badge";

export default function NodeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trpc = useTRPC();

  const { data: node } = useQuery(trpc.nodes.get.queryOptions({ id }));
  const { data: latestData } = useQuery(trpc.nodeData.latest.queryOptions({ nodeId: id }));

  if (!node) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{node.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{node.nodeId}</p>
            </div>
            <StatusBadge status={node.status} />
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Type</dt>
              <dd className="text-sm">{node.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Location</dt>
              <dd className="text-sm">{node.location || "-"}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {latestData?.temperature?.toFixed(1) || "-"} °C
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Humidity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {latestData?.humidity?.toFixed(1) || "-"} %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Voltage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {latestData?.voltage?.toFixed(2) || "-"} V
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {latestData?.battery?.toFixed(0) || "-"} %
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
