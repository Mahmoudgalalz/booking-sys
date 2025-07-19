import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1752888000000 implements MigrationInterface {
    name = 'CreateInitialTables1752888000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create roles table
        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"),
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);

        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "password" character varying NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "roleId" integer NOT NULL,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Create services table
        await queryRunner.query(`
            CREATE TABLE "services" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" text NOT NULL,
                "price" numeric(10,2) NOT NULL,
                "category" character varying,
                "image" character varying,
                "isActive" boolean NOT NULL DEFAULT true,
                "duration" integer NOT NULL DEFAULT '60',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "providerId" integer NOT NULL,
                CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id")
            )
        `);

        // Create time_slots table
        await queryRunner.query(`
            CREATE TABLE "time_slots" (
                "id" SERIAL NOT NULL,
                "startTime" TIMESTAMP NOT NULL,
                "endTime" TIMESTAMP NOT NULL,
                "isAvailable" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "serviceId" integer NOT NULL,
                CONSTRAINT "PK_988edce9123b6e9c5a8718ff1bb" PRIMARY KEY ("id")
            )
        `);

        // Create bookings table
        await queryRunner.query(`
            CREATE TABLE "bookings" (
                "id" SERIAL NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "notes" text,
                "reminderSent" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer NOT NULL,
                "timeSlotId" integer NOT NULL,
                CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id")
            )
        `);

        // Create provider_profiles table
        await queryRunner.query(`
            CREATE TABLE "provider_profiles" (
                "id" SERIAL NOT NULL,
                "businessName" character varying NOT NULL,
                "description" text,
                "address" character varying,
                "phone" character varying,
                "website" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer NOT NULL,
                CONSTRAINT "REL_6a0b8ea6e64dd6fcc68f6176b1" UNIQUE ("userId"),
                CONSTRAINT "PK_d9fa2f0ad55765a4be4532aa333" PRIMARY KEY ("id")
            )
        `);

        // Add foreign keys
        await queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "services" ADD CONSTRAINT "FK_2e03d6f1a7fe969ebd3f3684dda" FOREIGN KEY ("providerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "time_slots" ADD CONSTRAINT "FK_c9e0c9e7e8e094749d8c79c343a" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "bookings" ADD CONSTRAINT "FK_38a69a58a323647f8480e96796c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "bookings" ADD CONSTRAINT "FK_4c9119fc0f2477e8cca7d75ad80" FOREIGN KEY ("timeSlotId") REFERENCES "time_slots"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        
        await queryRunner.query(`
            ALTER TABLE "provider_profiles" ADD CONSTRAINT "FK_6a0b8ea6e64dd6fcc68f6176b1a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        await queryRunner.query(`ALTER TABLE "provider_profiles" DROP CONSTRAINT "FK_6a0b8ea6e64dd6fcc68f6176b1a"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_4c9119fc0f2477e8cca7d75ad80"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_38a69a58a323647f8480e96796c"`);
        await queryRunner.query(`ALTER TABLE "time_slots" DROP CONSTRAINT "FK_c9e0c9e7e8e094749d8c79c343a"`);
        await queryRunner.query(`ALTER TABLE "services" DROP CONSTRAINT "FK_2e03d6f1a7fe969ebd3f3684dda"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        
        // Drop tables
        await queryRunner.query(`DROP TABLE "provider_profiles"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TABLE "time_slots"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }
}
