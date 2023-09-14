import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTodo1694715496388 implements MigrationInterface {
    name = 'AddTodo1694715496388';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255), "isDone" boolean NOT NULL DEFAULT (0), "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255), "isDone" boolean NOT NULL DEFAULT (0), "userId" integer, CONSTRAINT "FK_1e982e43f63a98ad9918a86035c" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_todo"("id", "title", "description", "isDone", "userId") SELECT "id", "title", "description", "isDone", "userId" FROM "todo"`);
        await queryRunner.query(`DROP TABLE "todo"`);
        await queryRunner.query(`ALTER TABLE "temporary_todo" RENAME TO "todo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" RENAME TO "temporary_todo"`);
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(100) NOT NULL, "description" varchar(255), "isDone" boolean NOT NULL DEFAULT (0), "userId" integer)`);
        await queryRunner.query(`INSERT INTO "todo"("id", "title", "description", "isDone", "userId") SELECT "id", "title", "description", "isDone", "userId" FROM "temporary_todo"`);
        await queryRunner.query(`DROP TABLE "temporary_todo"`);
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
