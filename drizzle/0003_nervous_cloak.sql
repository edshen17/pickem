CREATE TABLE IF NOT EXISTS "host-clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "host-club-members" (
	"host_club_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "host-club-members_host_club_id_user_id_pk" PRIMARY KEY("host_club_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_id" serial PRIMARY KEY NOT NULL,
	"role" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host-club-members" ADD CONSTRAINT "host-club-members_host_club_id_host-clubs_id_fk" FOREIGN KEY ("host_club_id") REFERENCES "public"."host-clubs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host-club-members" ADD CONSTRAINT "host-club-members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "host-club-members" ADD CONSTRAINT "host-club-members_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
