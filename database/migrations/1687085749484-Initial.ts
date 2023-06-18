import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1687085749484 implements MigrationInterface {
    name = 'Initial1687085749484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`business_administrator\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`bookable_calender\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day\` int NOT NULL, \`opening_hour_in_minutes\` int NULL, \`closing_hour_in_minutes\` int NULL, \`available\` tinyint NOT NULL DEFAULT 1, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, UNIQUE INDEX \`IDX_40794217a11c530cec95ccb889\` (\`day\`), UNIQUE INDEX \`IDX_87e2fe0a19f0f94787d717eb00\` (\`opening_hour_in_minutes\`), UNIQUE INDEX \`IDX_73f07e9262c3f6c125cc966aef\` (\`closing_hour_in_minutes\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`configured_break\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`start_hour_in_minutes\` int NOT NULL, \`end_hour_in_minutes\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, UNIQUE INDEX \`IDX_dd0f4252a6e486aea0624a511d\` (\`start_hour_in_minutes\`), UNIQUE INDEX \`IDX_f3207a8b12836b944b1f8adbf8\` (\`end_hour_in_minutes\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`planned_off\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`bookable_duration_in_minutes\` int NOT NULL, \`break_between_slots_in_minutes\` int NOT NULL DEFAULT '0', \`future_bookable_days\` bigint NOT NULL DEFAULT '20', \`bookable_appointments_per_slot_count\` bigint NOT NULL DEFAULT '1', \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`businessAdministratorId\` int NULL, UNIQUE INDEX \`IDX_101c2585c3abe5d448a62c71e7\` (\`bookable_duration_in_minutes\`), UNIQUE INDEX \`IDX_64576a834794e42df45e89ab53\` (\`break_between_slots_in_minutes\`), UNIQUE INDEX \`IDX_35bb2b5bdf52c5f19a98f0d850\` (\`future_bookable_days\`), UNIQUE INDEX \`IDX_b57295e0c2021ef9916ea93e46\` (\`bookable_appointments_per_slot_count\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`bookable_calender\` ADD CONSTRAINT \`FK_01dda61bc5bee564a8358d38b52\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`configured_break\` ADD CONSTRAINT \`FK_20117f91dd4cbaec7e0d56423a3\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`planned_off\` ADD CONSTRAINT \`FK_a50a3320d6429146b1d99281f4f\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service\` ADD CONSTRAINT \`FK_2869188df5a90d5bb0d9ffc26e7\` FOREIGN KEY (\`businessAdministratorId\`) REFERENCES \`business_administrator\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_cee8b55c31f700609674da96b0b\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_cee8b55c31f700609674da96b0b\``);
        await queryRunner.query(`ALTER TABLE \`service\` DROP FOREIGN KEY \`FK_2869188df5a90d5bb0d9ffc26e7\``);
        await queryRunner.query(`ALTER TABLE \`planned_off\` DROP FOREIGN KEY \`FK_a50a3320d6429146b1d99281f4f\``);
        await queryRunner.query(`ALTER TABLE \`configured_break\` DROP FOREIGN KEY \`FK_20117f91dd4cbaec7e0d56423a3\``);
        await queryRunner.query(`ALTER TABLE \`bookable_calender\` DROP FOREIGN KEY \`FK_01dda61bc5bee564a8358d38b52\``);
        await queryRunner.query(`DROP TABLE \`appointment\``);
        await queryRunner.query(`DROP INDEX \`IDX_b57295e0c2021ef9916ea93e46\` ON \`service\``);
        await queryRunner.query(`DROP INDEX \`IDX_35bb2b5bdf52c5f19a98f0d850\` ON \`service\``);
        await queryRunner.query(`DROP INDEX \`IDX_64576a834794e42df45e89ab53\` ON \`service\``);
        await queryRunner.query(`DROP INDEX \`IDX_101c2585c3abe5d448a62c71e7\` ON \`service\``);
        await queryRunner.query(`DROP TABLE \`service\``);
        await queryRunner.query(`DROP TABLE \`planned_off\``);
        await queryRunner.query(`DROP INDEX \`IDX_f3207a8b12836b944b1f8adbf8\` ON \`configured_break\``);
        await queryRunner.query(`DROP INDEX \`IDX_dd0f4252a6e486aea0624a511d\` ON \`configured_break\``);
        await queryRunner.query(`DROP TABLE \`configured_break\``);
        await queryRunner.query(`DROP INDEX \`IDX_73f07e9262c3f6c125cc966aef\` ON \`bookable_calender\``);
        await queryRunner.query(`DROP INDEX \`IDX_87e2fe0a19f0f94787d717eb00\` ON \`bookable_calender\``);
        await queryRunner.query(`DROP INDEX \`IDX_40794217a11c530cec95ccb889\` ON \`bookable_calender\``);
        await queryRunner.query(`DROP TABLE \`bookable_calender\``);
        await queryRunner.query(`DROP TABLE \`business_administrator\``);
    }

}
