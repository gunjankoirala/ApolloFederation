import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

//const mysqlTable = mysqlTableCreator((tableName=>tableName));
export const user = mysqlTable('user', {
  id: varchar({ length: 36 }).default(sql`UUID()`),
  email: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
});