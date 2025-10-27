import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';

import { MasterkeyService } from '../masterkey/masterkey.service';
import { Masterkey } from '../masterkey/entities/masterkey.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectDataSource('amecConnection')
    private ds: DataSource,
    private keys: MasterkeyService,
  ) {}

  async getHrAdminCredentials(
    credentials: string,
  ): Promise<{ user: string; pass: string; passkey?: string; admin?: string }> {
    try {
      const decryptedCreds = this.keys.decrypt(credentials);
      const pinnumber = decryptedCreds.split(':');
      const masterKeyRepo = this.ds.getRepository(Masterkey);
      const credential = await masterKeyRepo.findOneBy({
        KEY_OWNER: pinnumber[0],
      });

      if (!credential) {
        throw new Error('Master key "HRADMIN_CREDS" not found.');
      }

      const credentialsDecrypted = this.keys.decrypt(credential.KEY_CODE);
      const user = credentialsDecrypted.split(':')[4];
      const pass = credentialsDecrypted.split(':')[5];
      const passkey = credentialsDecrypted.split(':')[2];
      const admin = credentialsDecrypted.split(':')[0];
      return { user, pass, passkey, admin };
    } catch (error) {
      console.error('Failed to get or decrypt HR admin credentials:', error);
      throw new InternalServerErrorException(
        'Could not retrieve master credentials.',
      );
    }
  }

  async createConnection(
    credentials: any,
  ): Promise<{ hrAdminDataSource: DataSource; conn: oracledb.Connection }> {
    const { user, pass } = await this.getHrAdminCredentials(credentials);
    const cfg = this.ds.options as any;

    const hrAdminDataSource = new DataSource({
      type: cfg.type,
      connectString: cfg.connectString,
      extra: cfg.extra,
      username: user,
      password: pass,
    });

    await hrAdminDataSource.initialize();

    const conn = await oracledb.getConnection({
      user,
      password: pass,
      connectString: cfg.connectString,
    });

    return { hrAdminDataSource, conn };
  }

  async closeConnection(
    hrAdminDataSource: DataSource,
    conn?: oracledb.Connection,
  ): Promise<void> {
    if (conn) {
      await conn.close();
    }
    if (hrAdminDataSource && hrAdminDataSource.isInitialized) {
      await hrAdminDataSource.destroy();
    }
  }
}
