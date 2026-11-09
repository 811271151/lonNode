import { protectedProcedure, publicProcedure, router } from "../index";
import { nodeDataRouter } from "./node-data";
import { nodesRouter } from "./nodes";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
  // IonNode routers
  nodes: nodesRouter,
  nodeData: nodeDataRouter,
});
export type AppRouter = typeof appRouter;
