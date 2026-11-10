"use client";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@IonNode/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useTRPC } from "@/utils/trpc";

type TimeRange = "1h" | "6h" | "24h" | "7d";

function formatRelativeTime(date: string | Date | null): string {
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

export default function NodeDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const trpc = useTRPC();
	const [timeRange, setTimeRange] = useState<TimeRange>("24h");

	const { data: node } = useQuery({
		...trpc.nodes.get.queryOptions({ id }),
		refetchInterval: 10_000,
	});

	const { data: latestData } = useQuery({
		...trpc.nodeData.latest.queryOptions({ nodeId: id }),
		refetchInterval: 5000,
	});

	const { data: historyData } = useQuery(
		trpc.nodeData.list.queryOptions({
			limit: 100,
			nodeId: id,
			timeRange,
		})
	);

	if (!node) {
		return (
			<div className="container mx-auto px-4 py-8">
				<p>Loading...</p>
			</div>
		);
	}

	// Transform data for charts
	const chartData = historyData
		? historyData
				.slice()
				.reverse()
				.map((d) => ({
					battery: d.battery,
					humidity: d.humidity,
					temperature: d.temperature,
					time: new Date(d.createdAt).toLocaleTimeString(),
					voltage: d.voltage,
				}))
		: [];

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-2xl">{node.name}</CardTitle>
							<p className="mt-1 font-mono text-muted-foreground text-sm">
								{node.nodeId}
							</p>
						</div>
						<StatusBadge status={node.status} />
					</div>
				</CardHeader>
				<CardContent>
					<dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
						<div>
							<dt className="font-medium text-muted-foreground text-sm">
								Type
							</dt>
							<dd className="mt-1 text-sm">{node.type}</dd>
						</div>
						<div>
							<dt className="font-medium text-muted-foreground text-sm">
								Location
							</dt>
							<dd className="mt-1 text-sm">{node.location || "-"}</dd>
						</div>
						<div>
							<dt className="font-medium text-muted-foreground text-sm">
								Last Seen
							</dt>
							<dd className="mt-1 text-sm">
								{formatRelativeTime(node.lastSeenAt)}
							</dd>
						</div>
						<div>
							<dt className="font-medium text-muted-foreground text-sm">
								Created
							</dt>
							<dd className="mt-1 text-sm">
								{new Date(node.createdAt).toLocaleDateString()}
							</dd>
						</div>
						{node.description && (
							<div className="col-span-2 md:col-span-4">
								<dt className="font-medium text-muted-foreground text-sm">
									Description
								</dt>
								<dd className="mt-1 text-sm">{node.description}</dd>
							</div>
						)}
					</dl>
				</CardContent>
			</Card>

			<h2 className="mb-4 font-semibold text-lg">Real-time Data</h2>
			<div className="mb-6 grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Temperature</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl">
							{latestData?.temperature?.toFixed(1) || "-"} °C
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Humidity</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl">
							{latestData?.humidity?.toFixed(1) || "-"} %
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Voltage</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl">
							{latestData?.voltage?.toFixed(2) || "-"} V
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className="text-sm">Battery</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="font-bold text-2xl">
							{latestData?.battery?.toFixed(0) || "-"} %
						</p>
					</CardContent>
				</Card>
			</div>

			<div className="mb-4 flex items-center justify-between">
				<h2 className="font-semibold text-lg">Historical Data</h2>
				<div className="flex gap-2">
					{(["1h", "6h", "24h", "7d"] as TimeRange[]).map((range) => (
						<button
							className={`rounded px-3 py-1 text-sm ${
								timeRange === range
									? "bg-primary text-primary-foreground"
									: "bg-muted hover:bg-muted/80"
							}`}
							key={range}
							onClick={() => setTimeRange(range)}
							type="button"
						>
							{range}
						</button>
					))}
				</div>
			</div>

			{!chartData || chartData.length === 0 ? (
				<Card>
					<CardContent className="pt-6">
						<div className="py-12 text-center">
							<p className="text-muted-foreground">
								No historical data available
							</p>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>Temperature & Humidity</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer height={250} width="100%">
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="time" fontSize={12} />
									<YAxis fontSize={12} />
									<Tooltip />
									<Legend />
									<Line
										dataKey="temperature"
										name="Temp (°C)"
										stroke="#ef4444"
										strokeWidth={2}
										type="monotone"
									/>
									<Line
										dataKey="humidity"
										name="Humidity (%)"
										stroke="#3b82f6"
										strokeWidth={2}
										type="monotone"
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Voltage & Battery</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer height={250} width="100%">
								<LineChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="time" fontSize={12} />
									<YAxis fontSize={12} />
									<Tooltip />
									<Legend />
									<Line
										dataKey="voltage"
										name="Voltage (V)"
										stroke="#10b981"
										strokeWidth={2}
										type="monotone"
									/>
									<Line
										dataKey="battery"
										name="Battery (%)"
										stroke="#f59e0b"
										strokeWidth={2}
										type="monotone"
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
