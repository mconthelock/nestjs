import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';
import * as crypto from 'crypto';
import { Masterkey } from '../masterkey/entities/masterkey.entity';

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
  ) {
    if (!this.keyHex || !this.ivHex) {
      throw new Error(
        'MASTER_DECRYPTION_KEY and MASTER_DECRYPTION_IV must be set in .env',
      );
    }

    this.key = Buffer.from(this.keyHex, 'hex');
    this.iv = Buffer.from(this.ivHex, 'hex');

    if (this.key.length !== 32) {
      throw new Error(
        'MASTER_DECRYPTION_KEY must be a 64-character hex string (32 bytes)',
      );
    }
    if (this.iv.length !== 16) {
      // <-- IV ต้องยาว 16 bytes
      throw new Error(
        'MASTER_DECRYPTION_IV must be a 32-character hex string (16 bytes)',
      );
    }
  }

  async getMasterKey() {
    const masterKeyRepo = this.ds.getRepository(Masterkey);
    return await masterKeyRepo.find();
  }

  //: Promise<{ user: string; pass: string; passkey?: string; admin?: string }>
  async getHrAdminCredentials(credentials: string) {
    try {
      const decryptedCreds = this.decrypt(credentials);
      const [pinuser] = decryptedCreds.split(':');
      const masterKeyRepo = await this.getMasterKey();
      const credential = await masterKeyRepo.find(
        (k) => k.KEY_OWNER === pinuser,
      ).KEY_CODE;

      if (!credential) {
        throw new Error('Master key "HRADMIN_CREDS" not found.');
      }

      const decryptedCredsMaster = this.decrypt(credential);
      const [user, pinpass, passcode, pdfpass, admin, password] =
        decryptedCredsMaster.split(':');
      return { user, pinpass, passcode, pdfpass, admin, password };
    } catch (error) {
      console.error('Failed to get or decrypt HR admin credentials:', error);
      throw new InternalServerErrorException(
        'Could not retrieve master credentials.',
      );
    }
  }

  //: Promise<{ hrAdminDataSource: DataSource; conn: oracledb.Connection }>
  async createConnection(credentials: any) {
    const { admin, password, passcode } =
      await this.getHrAdminCredentials(credentials);
    const cfg = this.ds.options as any;
    const hrAdminDataSource = new DataSource({
      type: cfg.type,
      connectString: cfg.connectString,
      extra: cfg.extra,
      username: admin,
      password: password,
    });
    await hrAdminDataSource.initialize();
    const conn = await oracledb.getConnection({
      user: admin,
      password: password,
      connectString: cfg.connectString,
    });

    return { hrAdminDataSource, conn, passcode };
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
