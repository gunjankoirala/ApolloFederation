import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";

export const todos = mysqlTable("todos", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  completed: boolean("completed").notNull().default(false),
  userId: varchar("user_id", { length: 255 }).notNull(),
});
