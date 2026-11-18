import { fileURLToPath } from "node:url";

import { defineConfig } from "tsdown";

export default defineConfig({
	alias: {
		"./env.server": fileURLToPath(
			new URL("./src/env.lambda.ts", import.meta.url)
		),
	},
	clean: true,
	deps: {
		alwaysBundle: [
			/^@IonNode\//,
			/^@hono\//,
			/^@trpc\//,
			/^hono(?:\/|$)/,
			/^zod(?:\/|$)/,
			/^better-auth(?:\/|$)/,
			/^@opentelemetry\//,
		],
		neverBundle: ["pg-native"],
	},
	entry: ["./src/lambda.ts"],
	format: "esm",
	outDir: "./dist-lambda",
	platform: "node",
	target: "node24",
});
