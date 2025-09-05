// src/common/logger/typeorm-winston.logger.ts
import { Logger } from 'winston';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import chalk from 'chalk';
import { normalizeSqlAliases, extractSubqueries } from './transform-sql';

export class TypeOrmWinstonLogger implements TypeOrmLogger {
  constructor(private readonly logger: Logger) {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    let sql = query.trim();
    const subqueries = extractSubqueries(sql);
    for (let sub of subqueries) {
      let newInner = normalizeSqlAliases(sub.inner);
      sql = sql.replace(sub.full, `(${newInner})`);
    }
    sql = normalizeSqlAliases(sql);

    // Highlight main SQL keyword
    sql = sql.replace(
      /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i,
      (match) => chalk.cyan.bold(match),
    );

    // Highlight table names (FROM/INTO/UPDATE/JOIN)
    sql = sql.replace(
      /\b(FROM|INTO|UPDATE|JOIN|LEFT JOIN|DISTINCT)\s+("[^"]+"|\S+)/gi,
      (_, keyword, table) =>
        `${chalk.white.bgBlue(keyword)} ${chalk.hex('#000000').bgMagentaBright(table)}`,
    );

    // Highlight columns (quoted schema/table + column)
    sql = sql.replace(
      /("[^"]+"\.)?"?([a-zA-Z0-9_]+)"?(?=\s*(=|,|\sAS))/g,
      (_, prefix, col) => chalk.whiteBright(`${prefix || ''}${col}`),
    );

    // Highlight alias (AS "xxx" or AS xxx)
    sql = sql.replace(
      /\bAS\s+("[^"]+"|[a-zA-Z0-9_]+)/gi,
      (_, alias) => `AS ${chalk.yellowBright(alias)}`,
    );

    // Highlight keywords WHERE, SET, VALUES, AND, OR
    sql = sql.replace(
      /\b(WHERE|SET|VALUES|AND|OR|ON|GROUP BY|ORDER BY|LIMIT)\b/gi,
      (match) => chalk.greenBright(match),
    );

    // Parameters at the end
    const paramText =
      parameters && parameters.length
        ? chalk.hex('#FFA500')(` -- Parameters: ${JSON.stringify(parameters)}`) // สีส้ม
        : '';

    this.logger.debug(`[QUERY] ${sql}${paramText}`);
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.error(chalk.red(`[QUERY ERROR] ${error}`));
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.warn(chalk.magenta(`[SLOW QUERY ${time}ms] ${query}`));
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.info(chalk.blue(`[SCHEMA BUILD] ${message}`));
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.info(chalk.cyan(`[MIGRATION] ${message}`));
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'warn') {
      this.logger.warn(chalk.yellow(message));
    } else {
      this.logger.info(chalk.white(message));
    }
  }
}
