import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../index";

// Time range to milliseconds mapping
const TIME_RANGE_MAP = {
  "1h": 60 * 60 * 1000,
  "6h": 6 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
} as const;

export const nodeDataRouter = router({
  // Report data from a node
  report: publicProcedure
    .input(
      z.object({
        nodeId: z.string(), // Can be node.id or node.nodeId
        temperature: z.number().optional(),
        humidity: z.number().optional(),
        voltage: z.number().optional(),
        battery: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { nodeId, ...dataFields } = input;

      // Find node by id or nodeId
      const node = await ctx.db.node.findFirst({
        where: {
          OR: [{ id: nodeId }, { nodeId }],
        },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Node not found: ${nodeId}`,
        });
      }

      // Create data record
      const nodeData = await ctx.db.nodeData.create({
        data: {
          nodeId: node.id,
          temperature: dataFields.temperature,
          humidity: dataFields.humidity,
          voltage: dataFields.voltage,
          battery: dataFields.battery,
        },
      });

      // Update node's lastSeenAt
      const now = new Date();
      let status = "online";

      // Check if temperature is in warning range
      if (
        dataFields.temperature !== undefined &&
        dataFields.temperature > 80
      ) {
        status = "warning";
      }

      await ctx.db.node.update({
        where: { id: node.id },
        data: {
          lastSeenAt: now,
          status,
        },
      });

      return nodeData;
    }),

  // Get historical data for a node
  list: publicProcedure
    .input(
      z.object({
        nodeId: z.string(),
        timeRange: z.enum(["1h", "6h", "24h", "7d"]).default("1h"),
        limit: z.number().min(1).max(1000).default(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Find node by id or nodeId
      const node = await ctx.db.node.findFirst({
        where: {
          OR: [{ id: input.nodeId }, { nodeId: input.nodeId }],
        },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Node not found: ${input.nodeId}`,
        });
      }

      // Calculate time threshold
      const timeMs = TIME_RANGE_MAP[input.timeRange];
      const threshold = new Date(Date.now() - timeMs);

      // Query data
      const data = await ctx.db.nodeData.findMany({
        where: {
          nodeId: node.id,
          createdAt: {
            gte: threshold,
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });

      return data;
    }),

  // Get the latest data point for a node
  latest: publicProcedure
    .input(z.object({ nodeId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Find node by id or nodeId
      const node = await ctx.db.node.findFirst({
        where: {
          OR: [{ id: input.nodeId }, { nodeId: input.nodeId }],
        },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Node not found: ${input.nodeId}`,
        });
      }

      // Get latest data point
      const latestData = await ctx.db.nodeData.findFirst({
        where: { nodeId: node.id },
        orderBy: { createdAt: "desc" },
      });

      return latestData;
    }),
});
