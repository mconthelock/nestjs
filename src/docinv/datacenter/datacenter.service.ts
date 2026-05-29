import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TableCheck } from '../../common/Entities/docinv/table/table-check.entity';
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
            return this.ftpDownloadAs400(repId);
        } else if (repType === 'target') {
            return this.ftpDownloadAmecDc(repId, `/u02_gg/dirrpt/`);
        } else if (repType === 'desc') {
            return this.ftpDownloadAmecDc(repId, `/u02_gg/dirrpt/AS400/`);
        }
    }

    private async ftpDownloadAs400(fileName: string): Promise<string> {
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
                host: process.env.AS400_HOST,
                user: process.env.AS400_USER,
                password: process.env.AS400_PASSWORD,
                secure: false,
            });

            await client.downloadTo(localPath, remotePath);
        } finally {
            client.close();
        }

        return localPath;
    }

    private async ftpDownloadAmecDc(
        fileName: string,
        dir: string,
    ): Promise<string> {
        const client = new ftp.Client();
        client.ftp.verbose = false;
        const remotePath = `${dir}${fileName}`;
        const localDir = path.join(process.cwd(), 'public/u02_gg');
        const localPath = path.join(localDir, fileName);
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true });
        }

        try {
            await client.access({
                host: process.env.AMECDC_HOST,
                user: process.env.AMECDC_USER,
                password: process.env.AMECDC_PASSWORD,
                secure: false,
            });

            await client.downloadTo(localPath, remotePath);
        } finally {
            client.close();
        }

        return localPath;
    }
    private async ftpDownloadIso(fileName: string): Promise<string> {
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
                host: process.env.AS400_HOST,
                user: process.env.AS400_USER,
                password: process.env.AS400_PASSWORD,
                secure: false,
            });

            await client.downloadTo(localPath, remotePath);
        } finally {
            client.close();
        }

        return localPath;
    }

    private async ftpDownloadAmecVan(fileName: string): Promise<string> {
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
                host: process.env.AS400_HOST,
                user: process.env.AS400_USER,
                password: process.env.AS400_PASSWORD,
                secure: false,
            });

            await client.downloadTo(localPath, remotePath);
        } finally {
            client.close();
        }

        return localPath;
    }
}
