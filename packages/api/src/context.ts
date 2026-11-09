import type { Session } from "@IonNode/auth";
import type { Database } from "@IonNode/db";

export type Context = {
  session: Session | null;
  db: Database;
};
