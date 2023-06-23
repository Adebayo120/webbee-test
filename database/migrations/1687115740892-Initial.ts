import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1687115740892 implements MigrationInterface {
  name = 'Initial1687115740892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`business_administrator\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bookable_calender\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day\` int UNSIGNED NOT NULL, \`openingHourInMinutes\` int UNSIGNED NULL, \`closingHourInMinutes\` int UNSIGNED NULL, \`available\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`configured_break\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`startHourInMinutes\` int UNSIGNED NOT NULL, \`endHourInMinutes\` int UNSIGNED NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`planned_off\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startDate\` timestamp NOT NULL, \`endDate\` timestamp NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`service\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`bookableDurationInMinutes\` int UNSIGNED NOT NULL, \`breakBetweenSlotsInMinutes\` int UNSIGNED NOT NULL DEFAULT '0', \`futureBookableDays\` bigint UNSIGNED NOT NULL DEFAULT '20', \`bookableAppointmentsPerSlotCount\` bigint UNSIGNED NOT NULL DEFAULT '1', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`businessAdministratorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`appointment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`startDate\` timestamp NOT NULL, \`endDate\` timestamp NOT NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`serviceId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookable_calender\` ADD CONSTRAINT \`FK_01dda61bc5bee564a8358d38b52\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`configured_break\` ADD CONSTRAINT \`FK_20117f91dd4cbaec7e0d56423a3\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`planned_off\` ADD CONSTRAINT \`FK_a50a3320d6429146b1d99281f4f\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`service\` ADD CONSTRAINT \`FK_2869188df5a90d5bb0d9ffc26e7\` FOREIGN KEY (\`businessAdministratorId\`) REFERENCES \`business_administrator\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`appointment\` ADD CONSTRAINT \`FK_cee8b55c31f700609674da96b0b\` FOREIGN KEY (\`serviceId\`) REFERENCES \`service\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`appointment\` DROP FOREIGN KEY \`FK_cee8b55c31f700609674da96b0b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`service\` DROP FOREIGN KEY \`FK_2869188df5a90d5bb0d9ffc26e7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`planned_off\` DROP FOREIGN KEY \`FK_a50a3320d6429146b1d99281f4f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`configured_break\` DROP FOREIGN KEY \`FK_20117f91dd4cbaec7e0d56423a3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bookable_calender\` DROP FOREIGN KEY \`FK_01dda61bc5bee564a8358d38b52\``,
    );
    await queryRunner.query(`DROP TABLE \`appointment\``);
    await queryRunner.query(`DROP TABLE \`service\``);
    await queryRunner.query(`DROP TABLE \`planned_off\``);
    await queryRunner.query(`DROP TABLE \`configured_break\``);
    await queryRunner.query(`DROP TABLE \`bookable_calender\``);
    await queryRunner.query(`DROP TABLE \`business_administrator\``);
  }
}
