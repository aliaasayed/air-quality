import { MigrationInterface, QueryRunner } from 'typeorm';

export class AirQuality1691581675547 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE air_quality (
      id              BIGINT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
      aqius           SMALLINT        NOT NULL,
      aqicn           SMALLINT        NOT NULL,
      city            VARCHAR(255)    NOT NULL,
      time            VARCHAR(255)    NOT NULL,
      date            VARCHAR(255)    NOT NULL,
      timestamp       DATETIME        NOT NULL,
      created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP

    ) DEFAULT CHARSET=utf8mb3;
  `);

    await queryRunner.query(
      'ALTER TABLE `air_quality` ADD INDEX `idx_air_quality_index` (aqicn DESC);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE air_quality;');
  }
}
