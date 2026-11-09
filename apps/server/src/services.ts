import { createAuth } from "@IonNode/auth";
import { createPrismaClient } from "@IonNode/db";

import { ENV } from "./env.server";

export const db = createPrismaClient(ENV);
export const auth = createAuth(ENV, db);
