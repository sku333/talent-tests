CREATE TABLE `users` (
	`anonymous_id` text PRIMARY KEY NOT NULL,
	`source` text DEFAULT 'direct' NOT NULL,
	`first_seen_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anonymous_id` text NOT NULL,
	`event_name` text NOT NULL,
	`source` text DEFAULT 'direct' NOT NULL,
	`test_version` text DEFAULT 'v1' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_events_name_created` ON `events` (`event_name`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_events_user` ON `events` (`anonymous_id`);
--> statement-breakpoint
CREATE TABLE `results` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anonymous_id` text NOT NULL,
	`test_version` text DEFAULT 'v1' NOT NULL,
	`type_name` text NOT NULL,
	`top_one` text NOT NULL,
	`top_two` text NOT NULL,
	`top_three` text NOT NULL,
	`scores_json` text NOT NULL,
	`duration_seconds` integer NOT NULL,
	`completed_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_results_user_version` ON `results` (`anonymous_id`,`test_version`);
--> statement-breakpoint
CREATE INDEX `idx_results_completed` ON `results` (`completed_at`);
