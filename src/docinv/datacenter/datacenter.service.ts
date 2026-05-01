import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TableCheck } from './entities/table-check.entity';
import * as ftp from 'basic-ftp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DatacenterService {
    constructor(
        @InjectRepository(TableCheck, 'amecConnection')
        private readonly table: Repository<TableCheck>,
    ) {}

    async findAll() {
        return this.table.find();
    }

    async loadReport(
        repType: string,
        repId: string,
    ): Promise<string | undefined> {
        if (repType === 'source') {
            return this.ftpDownload(repId);
        }
    }

    private async ftpDownload(fileName: string): Promise<string> {
        const client = new ftp.Client();
        client.ftp.verbose = false;

        const remotePath = `/home/ogguser/oggos400/dirrpt/${fileName}`;
        const localDir = path.join(process.cwd(), 'public');
        const localPath = path.join(localDir, fileName);

        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true });
        }

        try {
            await client.access({
                host: 'amec400',
                user: 'ogguser',
                password: 'ogguser',
                secure: false,
            });

            await client.downloadTo(localPath, remotePath);
        } finally {
            client.close();
        }

        return localPath;
    }
}
