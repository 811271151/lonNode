import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure, router } from "../index";

// Node status type
type NodeStatus = "online" | "offline" | "warning";

// Status calculation logic
function calculateNodeStatus(
  lastSeenAt: Date,
  latestTemperature?: number | null,
): NodeStatus {
  const now = Date.now();
  const lastSeen = lastSeenAt.getTime();
  const diffMs = now - lastSeen;

  // Offline if last seen > 60 seconds ago
  if (diffMs > 60000) {
    return "offline";
  }

  // Warning if temperature > 80°C
  if (latestTemperature !== null && latestTemperature !== undefined && latestTemperature > 80) {
    return "warning";
  }

  return "online";
}

export const nodesRouter = router({
  // List all nodes with optional filters
  list: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          status: z.enum(["online", "offline", "warning"]).optional(),
          type: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const { search, status, type } = input ?? {};

      // Build where clause
      const where: Parameters<typeof ctx.db.node.findMany>[0]["where"] = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { nodeId: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ];
      }

      if (type) {
        where.type = { equals: type };
      }

      // Fetch nodes with latest data point
      const nodes = await ctx.db.node.findMany({
        where,
        include: {
          data: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      // Calculate status and filter if needed
      const nodesWithStatus = nodes.map((node) => {
        const latestData = node.data[0];
        const calculatedStatus = calculateNodeStatus(
          node.lastSeenAt,
          latestData?.temperature,
        );
        return {
          ...node,
          status: calculatedStatus,
          data: undefined, // Remove nested data
        };
      });

      // Filter by status if provided
      if (status) {
        return nodesWithStatus.filter((node) => node.status === status);
      }

      return nodesWithStatus;
    }),

  // Get single node by id
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const node = await ctx.db.node.findUnique({
        where: { id: input.id },
        include: {
          data: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!node) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      const latestData = node.data[0];
      const status = calculateNodeStatus(node.lastSeenAt, latestData?.temperature);

      return {
        ...node,
        status,
        data: undefined,
      };
    }),

  // Create new node
  create: publicProcedure
    .input(
      z.object({
        nodeId: z.string().min(1),
        name: z.string().min(1),
        type: z.string().min(1),
        location: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if nodeId already exists
      const existing = await ctx.db.node.findUnique({
        where: { nodeId: input.nodeId },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Node with ID ${input.nodeId} already exists`,
        });
      }

      const node = await ctx.db.node.create({
        data: {
          nodeId: input.nodeId,
          name: input.name,
          type: input.type,
          location: input.location,
          description: input.description,
          status: "offline",
        },
      });

      return node;
    }),

  // Update existing node
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        type: z.string().min(1).optional(),
        location: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if node exists
      const existing = await ctx.db.node.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      const node = await ctx.db.node.update({
        where: { id },
        data: updateData,
      });

      return node;
    }),

  // Delete node and all its data
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if node exists
      const existing = await ctx.db.node.findUnique({
        where: { id: input.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Node not found",
        });
      }

      // Delete node (cascade will delete data)
      await ctx.db.node.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

