CREATE TABLE `renders` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_hash` text NOT NULL,
	`path` text NOT NULL,
	`url` text NOT NULL,
	`name` text NOT NULL,
	`filename` text NOT NULL,
	`category` text NOT NULL,
	`collection` text NOT NULL,
	`lifecycle_status` text NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`source_available` integer DEFAULT false NOT NULL,
	`suggested_tags_json` text DEFAULT '[]' NOT NULL,
	`discovered_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_seen_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `renders_path_unique` ON `renders` (`path`);--> statement-breakpoint
CREATE INDEX `renders_asset_hash_idx` ON `renders` (`asset_hash`);--> statement-breakpoint
CREATE INDEX `renders_category_idx` ON `renders` (`category`);--> statement-breakpoint
CREATE INDEX `renders_collection_idx` ON `renders` (`collection`);--> statement-breakpoint
CREATE TABLE `review_defects` (
	`render_id` text NOT NULL,
	`defect_key` text NOT NULL,
	`label` text NOT NULL,
	`severity` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`render_id`, `defect_key`),
	FOREIGN KEY (`render_id`) REFERENCES `renders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `review_defects_severity_idx` ON `review_defects` (`severity`);--> statement-breakpoint
CREATE TABLE `review_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`render_id` text NOT NULL,
	`event_type` text NOT NULL,
	`payload_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`render_id`) REFERENCES `renders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `review_events_render_idx` ON `review_events` (`render_id`);--> statement-breakpoint
CREATE TABLE `review_tags` (
	`render_id` text NOT NULL,
	`tag_key` text NOT NULL,
	`label` text NOT NULL,
	`tag_group` text NOT NULL,
	`source` text NOT NULL,
	`confidence` integer NOT NULL,
	`state` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`render_id`, `tag_key`),
	FOREIGN KEY (`render_id`) REFERENCES `renders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `review_tags_state_idx` ON `review_tags` (`state`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`render_id` text PRIMARY KEY NOT NULL,
	`overall_rating` integer,
	`concept_rating` integer,
	`execution_rating` integer,
	`direction_rating` integer,
	`decision` text,
	`note` text DEFAULT '' NOT NULL,
	`correction_note` text DEFAULT '' NOT NULL,
	`duplicate_of` text,
	`deletion_state` text DEFAULT 'none' NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`reviewed_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`render_id`) REFERENCES `renders`(`id`) ON UPDATE no action ON DELETE cascade
);
