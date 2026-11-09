#!/usr/bin/env tsx

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface NodeData {
  nodeId: string;
  temperature: number;
  humidity: number;
  voltage: number;
  battery: number;
}

function generateData(): Omit<NodeData, "nodeId"> {
  return {
    temperature: 20 + Math.random() * 15, // 20-35°C
    humidity: 50 + Math.random() * 30, // 50-80%
    voltage: 3.3 + Math.random() * 0.8, // 3.3-4.1V
    battery: 70 + Math.random() * 30, // 70-100%
  };
}

async function reportData(apiUrl: string, data: NodeData): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/trpc/nodeData.report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.ok;
  } catch (error) {
    console.error(`[${data.nodeId}] ✗ Failed to report:`, error);
    return false;
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option("node-id", {
      type: "string",
      demandOption: true,
      describe: "Node ID (e.g., ION-001)",
    })
    .option("interval", {
      type: "number",
      default: 5000,
      describe: "Report interval in milliseconds",
    })
    .option("api-url", {
      type: "string",
      default: "http://localhost:3000",
      describe: "API base URL",
    })
    .help()
    .parse();

  const { nodeId, interval, apiUrl } = argv as {
    nodeId: string;
    interval: number;
    apiUrl: string;
  };

  console.log(`[${nodeId}] Starting simulator...`);
  console.log(`[${nodeId}] API URL: ${apiUrl}`);
  console.log(`[${nodeId}] Interval: ${interval}ms\n`);

  const report = async () => {
    const data = generateData();
    const fullData: NodeData = { nodeId, ...data };

    const success = await reportData(apiUrl, fullData);

    if (success) {
      console.log(
        `[${nodeId}] ✓ Data reported: T=${data.temperature.toFixed(1)}°C H=${data.humidity.toFixed(0)}% V=${data.voltage.toFixed(2)}V B=${data.battery.toFixed(0)}%`
      );
    }
  };

  // Initial report
  await report();

  // Start interval
  const timer = setInterval(report, interval);

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log(`\n[${nodeId}] Stopping simulator...`);
    clearInterval(timer);
    process.exit(0);
  });
}

main().catch(console.error);
