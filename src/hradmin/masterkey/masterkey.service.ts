import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../shared/database.service';
import { DataSource } from 'typeorm';
import * as oracledb from 'oracledb';

@Injectable()
export class MasterkeyService {
  constructor(
    private jwtService: JwtService,
    private dbService: DatabaseService,
  ) {}

  async verify(user: string, pin: string) {
    const keys = await this.dbService.getMasterKey();
    const decryptedPin = await keys.find((k) => k.KEY_OWNER === user);
    if (!decryptedPin) return false;
    const users = this.dbService.decrypt(decryptedPin.KEY_CODE);
    const [pinuser, pinpasskey, pincode, pdfkey] = users.split(':');
    if (pinpasskey == pin) {
      const payload = {
        user: this.dbService.encrypt(
          `${pinuser}:${pinpasskey}:${pincode}:${pdfkey}`,
        ),
        sub: user,
      };
      const token = this.jwtService.sign(payload);
      if (decryptedPin.KEY_EXPIRE < new Date())
        return { status: 'expired', token };
      return { status: true, token };
    }
    return false;
  }

  async findAll() {
    return this.dbService.getMasterKey();
  }

  async updateMasterKey(cer: string, user: string, newpin: string) {
    const credentials = this.jwtService.verify(cer, {
      secret: process.env.JWT_SECRET,
    });

    const code = await this.dbService.getMasterKey();
    const decryptedPin = await code.find((k) => k.KEY_OWNER === user);
    if (!decryptedPin) return false;

    const users = this.dbService.decrypt(decryptedPin.KEY_CODE);
    const [pinuser, pinpasskey, pincode, pdfkey, admin, pwd] = users.split(':');
    const newCredentials = this.dbService.encrypt(
      `${pinuser}:${newpin}:${pincode}:${pdfkey}:${admin}:${pwd}`,
    );

    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(
        credentials.user,
      );
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;
      const result = await conn.execute(
        `UPDATE MASTERKEY
        SET KEY_CODE = :KEY_CODE, KEY_EXPIRE = SYSDATE + 180
        WHERE KEY_OWNER = :KEY_OWNER`,
        {
          KEY_CODE: newCredentials,
          KEY_OWNER: credentials.sub,
        },
      );
      await conn.commit();
      return result;
    } catch (error) {
      console.error('Error fetching Master data:', error);
      throw new InternalServerErrorException('Failed to fetch Master data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }

  async createMasterKey(credentials: any, empno: string, type: string) {
    let hrAdminDataSource: DataSource;
    let conn: oracledb.Connection;
    try {
      const connection = await this.dbService.createConnection(credentials);
      hrAdminDataSource = connection.hrAdminDataSource;
      conn = connection.conn;

      const code = await this.dbService.getMasterKey();
      const decryptedPin = await code.find((k) => k.KEY_OWNER === 'SYSTEM');
      if (!decryptedPin) return false;

      const users = this.dbService.decrypt(decryptedPin.KEY_CODE);
      const [pinuser, pinpasskey, pincode, pdfkey, admin, pwd] =
        users.split(':');
      const newCredentials = this.dbService.encrypt(
        `${empno}:000000:${pincode}:${pdfkey}:${admin}:${pwd}`,
      );

      const result = await conn.execute(
        `INSERT INTO MASTERKEY VALUES (:KEY_OWNER, :KEY_CODE, :KEY_ROLE, SYSDATE -1)`,
        {
          KEY_OWNER: empno,
          KEY_CODE: newCredentials,
          KEY_ROLE: type,
        },
      );
      await conn.commit();
      return result;
    } catch (error) {
      console.error('Error fetching Master data:', error);
      throw new InternalServerErrorException('Failed to fetch Master data.');
    } finally {
      await this.dbService.closeConnection(hrAdminDataSource, conn);
    }
  }
}
