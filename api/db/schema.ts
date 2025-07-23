import * as t from "drizzle-orm/pg-core";

export const students = t.pgTable("students", {
  studentId: t.varchar({ length: 8 }).primaryKey(),
  name: t.varchar({ length: 255 }).notNull(),
  lastname: t.varchar({ length: 255 }).notNull(),
  birthday: t.timestamp().notNull(),
  gender: t.varchar({ length: 10 }).notNull(),
});
