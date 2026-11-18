import { defineConfig, env } from "prisma/config";

const url = env("IONNODE_MIGRATION_URL");
const target = new URL(url);

if (
  target.hostname !== "127.0.0.1" ||
  target.port !== "15432" ||
  target.pathname !== "/ionnode" ||
  target.username !== "postgres"
) {
  throw new Error("迁移目标必须是本地隧道 127.0.0.1:15432/ionnode，用户 postgres");
}

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});