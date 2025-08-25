CREATE TABLE `users` (
	`id` varchar(36) DEFAULT UUID(),
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL
);
