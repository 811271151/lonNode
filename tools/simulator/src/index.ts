#!/usr/bin/env node

import minimist from "minimist";

interface SimulatorOptions {
  nodeId: string;
  interval: number;
  apiUrl: string;
}

interface SensorData {
  nodeId: string;
  temperature: number;
  humidity: number;
  voltage: number;
  battery: number;
}

function parseArgs(): SimulatorOptions {
  const args = minimist(process.argv.slice(2));

  if (!args["node-id"]) {
    console.error("Error: --node-id is required");
    console.log("\nUsage:");
    console.log("  pnpm simulator --node-id ION-001 [options]");
    console.log("\nOptions:");
    console.log("  --node-id    Node ID (required)");
    console.log("  --interval   Report interval in ms (default: 5000)");
    console.log("  --api-url    API URL (default: http://localhost:3000)");
    process.exit(1);
  }

  return {
    nodeId: args["node-id"],
    interval: args.interval || 5000,
    apiUrl: args["api-url"] || "http://localhost:3000",
  };
}

function generateSensorData(nodeId: string): SensorData {
  return {
    nodeId,
    temperature: Number((20 + Math.random() * 15).toFixed(1)),
    humidity: Number((50 + Math.random() * 30).toFixed(1)),
    voltage: Number((3.3 + Math.random() * 0.8).toFixed(2)),
    battery: Number((70 + Math.random() * 30).toFixed(0)),
  };
}

async function reportData(
  apiUrl: string,
  data: SensorData
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${apiUrl}/trpc/nodeData.report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${text}` };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const options = parseArgs();

  console.log(`[${options.nodeId}] Starting simulator...`);
  console.log(`[${options.nodeId}] API URL: ${options.apiUrl}`);
  console.log(`[${options.nodeId}] Interval: ${options.interval}ms`);
  console.log(`[${options.nodeId}] Press Ctrl+C to stop\n`);

  let running = true;
  let reportCount = 0;

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log(`\n[${options.nodeId}] Stopping simulator...`);
    console.log(`[${options.nodeId}] Total reports sent: ${reportCount}`);
    running = false;
    process.exit(0);
  });

  // Main loop
  while (running) {
    const data = generateSensorData(options.nodeId);

    console.log(
      `[${options.nodeId}] Generated: Temp=${data.temperature}°C Humidity=${data.humidity}% Voltage=${data.voltage}V Battery=${data.battery}%`
    );

    const result = await reportData(options.apiUrl, data);

    if (result.success) {
      reportCount++;
      console.log(`[${options.nodeId}] ✓ Data reported successfully (#${reportCount})`);
    } else {
      console.error(`[${options.nodeId}] ✗ Failed to report: ${result.error}`);
    }

    console.log("");

    // Wait for the next interval
    await new Promise((resolve) => setTimeout(resolve, options.interval));
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
