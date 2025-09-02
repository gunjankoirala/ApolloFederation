RENAME TABLE `todos` TO `todo`;--> statement-breakpoint
ALTER TABLE `todo` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `todo` ADD PRIMARY KEY(`id`);