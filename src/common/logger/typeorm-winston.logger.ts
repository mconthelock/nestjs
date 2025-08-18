// src/common/logger/typeorm-winston.logger.ts
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger } from 'winston';
import chalk from 'chalk';

export class TypeOrmWinstonLogger implements TypeOrmLogger {
  constructor(private readonly logger: Logger) {}

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const replaceHashTableAliases = (sql: string): string => {
      const tableAliasMap = new Map<string, string>();
      let aliasCounter = 1;
      // Regex หาชื่อ table + alias
      const tableAliasRegex = /\b(FROM|JOIN)\s+"[^"]+"\s+"([^"]+)"/gi;
      sql = sql.replace(tableAliasRegex, (_match, joinType, tableAlias) => {
        if (!tableAliasMap.has(tableAlias)) {
          tableAliasMap.set(tableAlias, `T${aliasCounter++}`);
        }
        const newAlias = tableAliasMap.get(tableAlias)!;
        return `${joinType} "${newAlias}"`;
      });

      // Replace column references ตาม table alias ใหม่
      tableAliasMap.forEach((newAlias, oldAlias) => {
        // กรณี "Inquiry".INQ_ID → "T1".INQ_ID
        const columnRegex = new RegExp(`"${oldAlias}"\\.`, 'g');
        sql = sql.replace(columnRegex, `"${newAlias}".`);
      });

      return sql;
    };

    const replaceHashColumnAliases = (sql: string): string => {
      let colCounter = 1;
      const hashColumnMap = new Map<string, string>();
      const hashAliasRegex = /\bAS\s+"?([0-9a-f]{8,})"?/gi;
      sql = sql.replace(hashAliasRegex, (_match, alias) => {
        if (!hashColumnMap.has(alias)) {
          hashColumnMap.set(alias, `c${colCounter++}`);
        }
        return `AS "${hashColumnMap.get(alias)}"`;
      });

      hashColumnMap.forEach((newAlias, oldAlias) => {
        // กรณีถูกเรียกใช้แบบ "0681241698b5f1ea6b3b562087efa". หรือ 0681241698b5f1ea6b3b562087efa.
        const refRegex = new RegExp(`"${oldAlias}"`, 'g');
        sql = sql.replace(refRegex, `"${newAlias}"`);
      });

      return sql;
    };

    const normalizeSqlAliases = (sql: string): string => {
      const tableAliasMap = new Map<string, string>();
      let tableCounter = 1;

      // 1️⃣ Replace table alias เป็น T1,T2...
      const tableAliasRegex = /\b(FROM|JOIN)\s+"[^"]+"\s+"([^"]+)"/gi;
      sql = sql.replace(tableAliasRegex, (_match, joinType, tableAlias) => {
        if (!tableAliasMap.has(tableAlias)) {
          tableAliasMap.set(tableAlias, `T${tableCounter++}`);
        }
        const newAlias = tableAliasMap.get(tableAlias)!;
        return `${joinType} "${newAlias}"`;
      });

      // 2️⃣ Replace column alias เป็น tableAlias+columnName
      const columnAliasRegex = /"([^"]+)"\."([^"]+)"\s+AS\s+"?([^",\s]+)"?/gi;
      sql = sql.replace(columnAliasRegex, (_match, table, column, alias) => {
        const newTable = tableAliasMap.get(table) || table;
        const newAlias = `${newTable}${column}`;
        return `"${newTable}"."${column}" AS "${newAlias}"`;
      });

      return sql;
    };

    let sql = query.trim();
    //sql = replaceHashTableAliases(sql);
    // sql = normalizeSqlAliases(sql);
    // sql = replaceHashColumnAliases(sql);

    // Highlight main SQL keyword
    sql = sql.replace(
      /^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i,
      (match) => chalk.cyan.bold(match),
    );

    // Highlight table names (FROM/INTO/UPDATE/JOIN)
    sql = sql.replace(
      /\b(FROM|INTO|UPDATE|JOIN)\s+("[^"]+"|\S+)/gi,
      (_, keyword, table) =>
        `${chalk.blueBright(keyword)} ${chalk.magentaBright(table)}`,
    );

    // Highlight columns (quoted schema/table + column)
    sql = sql.replace(
      /("[^"]+"\.)?"?([a-zA-Z0-9_]+)"?(?=\s*(=|,|\sAS))/g,
      (_, prefix, col) => chalk.gray(`${prefix || ''}${col}`),
    );

    // Highlight alias (AS "xxx" or AS xxx)
    sql = sql.replace(
      /\bAS\s+("[^"]+"|[a-zA-Z0-9_]+)/gi,
      (_, alias) => `AS ${chalk.dim(alias)}`,
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

    this.logger.debug(`${sql}${paramText}`);
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
