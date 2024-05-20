import { Migration } from '@mikro-orm/migrations';

export class Migration20240520072841 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null default gen_random_uuid(), "updated_by" uuid not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "updated_by_user_id" uuid not null, "created_at" timestamptz not null, "created_by" uuid not null, "created_by_user_id" uuid not null, "name" varchar(255) not null, constraint "user_pkey" primary key ("id"));');

    this.addSql('create table "tournament" ("id" uuid not null default gen_random_uuid(), "updated_by" uuid not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, "updated_by_user_id" uuid not null, "created_at" timestamptz not null, "created_by" uuid not null, "created_by_user_id" uuid not null, "name" varchar(255) not null, "host_id" uuid not null, constraint "tournament_pkey" primary key ("id"));');

    this.addSql('alter table "user" add constraint "user_updated_by_user_id_foreign" foreign key ("updated_by_user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "user" add constraint "user_created_by_user_id_foreign" foreign key ("created_by_user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "tournament" add constraint "tournament_updated_by_user_id_foreign" foreign key ("updated_by_user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "tournament" add constraint "tournament_created_by_user_id_foreign" foreign key ("created_by_user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "tournament" add constraint "tournament_host_id_foreign" foreign key ("host_id") references "user" ("id") on update cascade;');
  }

}
