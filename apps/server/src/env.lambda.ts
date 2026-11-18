import { z } from "zod";

import type { CoercedEnvSchema } from "./env";

const schema = z.object({
	BETTER_AUTH_SECRET: z.string().min(32),
	BETTER_AUTH_URL: z.url(),
	CORS_ORIGIN: z.url(),
	DATABASE_URL: z.string().min(1),
	NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
});

const result = schema.safeParse(process.env);

if (!result.success) {
	const fields = result.error.issues
		.map((issue) => issue.path.join("."))
		.join(", ");

	throw new Error(`Lambda 环境变量缺失或格式错误：${fields}`);
}

export const ENV: Readonly<CoercedEnvSchema> = result.data;
