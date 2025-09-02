import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";

//const mysqlTable = mysqlTable((tableName=>tableName));
export const todo = mysqlTable("todo", {
  id: int().autoincrement().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
  userId: varchar({ length: 255 }).notNull(),
});