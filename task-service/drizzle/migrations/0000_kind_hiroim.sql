CREATE TABLE `todos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `todos_id` PRIMARY KEY(`id`)
);
