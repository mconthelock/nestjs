import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import * as crypto from 'crypto';

// import { MasterkeyService } from '../masterkey/masterkey.service';
// import { Masterkey } from '../masterkey/entities/masterkey.entity';

@Injectable()
export class DatabaseService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly keyHex = process.env.MASTER_DECRYPTION_KEY;
  private readonly ivHex = process.env.MASTER_DECRYPTION_IV;

  // ตัวแปร 2 ตัวนี้ต้องเป็น Buffer
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(
    @InjectDataSource('amecConnection')
    private ds: DataSource,
    // private keys: MasterkeyService,
  ) {}

  async getMasterKey() {
    // const masterKeyRepo = this.ds.getRepository(Masterkey);
    // return await masterKeyRepo.find();
  }

  //: Promise<{ user: string; pass: string; passkey?: string; admin?: string }>
  async getHrAdminCredentials(credentials: string) {
    try {
      //   const decryptedCreds = this.decrypt(credentials);
      //   const code = decryptedCreds.split(':');
      //   const masterKeyRepo = this.ds.getRepository(Masterkey);
      //   const credential = await masterKeyRepo.findOneBy({
      //     KEY_OWNER: pinnumber[0],
      //   });
      //   if (!credential) {
      //     throw new Error('Master key "HRADMIN_CREDS" not found.');
      //   }
      //   const credentialsDecrypted = this.decrypt(credential.KEY_CODE);
      //   const user = credentialsDecrypted.split(':')[4];
      //   const pass = credentialsDecrypted.split(':')[5];
      //   const passkey = credentialsDecrypted.split(':')[2];
      //   const admin = credentialsDecrypted.split(':')[0];
      return { user: null, pass: null, passkey: null, admin: null };
    } catch (error) {
      console.error('Failed to get or decrypt HR admin credentials:', error);
      throw new InternalServerErrorException(
        'Could not retrieve master credentials.',
      );
    }
  }

  //: Promise<{ hrAdminDataSource: DataSource; conn: oracledb.Connection }>
  async createConnection(credentials: any) {
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

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      Buffer.from(this.key),
      Buffer.from(this.iv),
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  decrypt(encryptedText: string): string {
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      Buffer.from(this.iv),
    );
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
