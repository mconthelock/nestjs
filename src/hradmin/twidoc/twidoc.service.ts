import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MasterkeyService } from '../masterkey/masterkey.service';
import { Masterkey } from '../masterkey/entities/masterkey.entity';

@Injectable()
export class TwidocService {
  constructor(
    @InjectDataSource('amecConnection')
    private readonly ds: DataSource,
    private keys: MasterkeyService,
  ) {}

  private async getHrAdminCredentials() {
    try {
      const masterKeyRepo = this.ds.getRepository(Masterkey);
      const credentials = await masterKeyRepo.findOneBy({
        KEY_OWNER: '12069',
      });

      if (!credentials) {
        throw new Error('Master key "HRADMIN_CREDS" not found.');
      }

      // 3. ถอดรหัส User/Pass ภายใน Server
      //const user = this.keys.decrypt(credentials.encryptedUsername);
      //const pass = this.keys.decrypt(credentials.encryptedPassword);

      //return { user, pass };
      //return this.keys.decrypt(credentials.KEY_CODE);
    } catch (error) {
      console.error('Failed to get or decrypt HR admin credentials:', error);
      throw new InternalServerErrorException(
        'Could not retrieve master credentials.',
      );
    }
  }

  async findAll() {
    //const masterKeyRepo = this.ds.getRepository(Masterkey);
    const credentials = this.keys.encrypt('HRADMIN_CREDS');
    console.log(credentials);
    console.log(this.keys.decrypt('004a9179b9fcde011bcfe16a01f6d341'));

    return this.getHrAdminCredentials(); //this.keys.find();
  }
}
