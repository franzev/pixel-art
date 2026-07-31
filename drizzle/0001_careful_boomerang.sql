CREATE TABLE `catalog_state` (
	`id` integer PRIMARY KEY NOT NULL,
	`version` text NOT NULL,
	`synced_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
