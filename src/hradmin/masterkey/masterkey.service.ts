import { Masterkey } from './entities/masterkey.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class MasterkeyService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly keyHex = process.env.MASTER_DECRYPTION_KEY;
  private readonly ivHex = process.env.MASTER_DECRYPTION_IV;

  // ตัวแปร 2 ตัวนี้ต้องเป็น Buffer
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(
    @InjectRepository(Masterkey, 'amecConnection')
    private readonly masterkeyRepository: Repository<Masterkey>,
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

  async verify(user: string, pin: string) {
    const decryptedPin = await this.masterkeyRepository.find({
      where: { KEY_OWNER: user },
    });
    const pinCode = this.decrypt(decryptedPin[0].KEY_CODE);
    if (pinCode.split(':')[1] == pin) {
      return `${pinCode.split(':')[0]}:${pinCode.split(':')[1]}`;
    }
    return false;
  }
}
