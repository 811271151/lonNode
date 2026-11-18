import { defineConfig } from "tsdown";

export default defineConfig({
	clean: true,
	deps: {
		alwaysBundle: [
			/@IonNode\/.*/,
			/^@hono\//,
			/^@trpc\//,
			"hono",
			"zod",
			"better-auth",
		],
	},
	entry: ["./src/index.ts", "./src/lambda.ts"],
	format: "esm",
	outDir: "./dist",
});
