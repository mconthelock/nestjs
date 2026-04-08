import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    getBase64Image,
    moveFileFromMulter,
} from 'src/common/utils/files.utils';

import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { AppsgroupsService } from '../appsgroups/appsgroups.service';

interface groupData {
    GROUP_ID: number;
    GROUP_DESC: string;
    GROUP_CODE: string;
    GROUP_STATUS: number;
    GROUP_HOME?: string;
    GROUP_REMARK?: string;
    UPDATE_DATE: Date;
    PROGRAM: number;
}

@Injectable()
export class ApplicationService {
    private readonly fileType = {
        iconfile: 1,
        posterfile: 2,
    } as const;

    private readonly docinvDirectory = `${process.env.AMEC_FILE_PATH}${process.env.STATE}/docinv/`;

    constructor(
        @InjectRepository(Application, 'docinvConnection')
        private readonly apps: Repository<Application>,
        private grp: AppsgroupsService,
    ) {}

    async getAppsByID(id: number) {
        const app = await this.apps.findOne({ where: { APP_ID: id } });
        if (!app) {
            throw new NotFoundException(`Application with id ${id} not found`);
        }

        return this.mapApplicationFiles(app);
    }

    async findAll() {
        const apps = await this.apps.find();
        return Promise.all(apps.map((app) => this.mapApplicationFiles(app)));
    }

    async create(
        data: CreateApplicationDto,
        files: Partial<
            Record<keyof typeof this.fileType, Express.Multer.File[]>
        >,
    ) {
        for (const key in files) {
            const file = files[key as keyof typeof this.fileType]?.[0];
            if (file) {
                const type = this.fileType[key as keyof typeof this.fileType];
                const moved = await moveFileFromMulter({
                    file,
                    destination: this.docinvDirectory,
                });
                if (type === 1) data.APP_ICON = moved.newName;
                if (type === 2) data.APP_POSTER = moved.newName;
            }
        }
        const app = await this.apps.save(data);
        if (data.APP_LOGIN == '0') {
            const grngroup: groupData = {
                GROUP_ID: 0,
                GROUP_DESC: 'General Users',
                GROUP_CODE: 'GRN',
                GROUP_STATUS: 1,
                UPDATE_DATE: new Date(),
                PROGRAM: app.APP_ID,
            };
            await this.grp.create(grngroup);
        }
        return this.getAppsByID(app.APP_ID);
    }

    async update(
        id: number,
        data: UpdateApplicationDto,
        files: Partial<
            Record<keyof typeof this.fileType, Express.Multer.File[]>
        >,
    ) {
        const app = await this.apps.findOneBy({ APP_ID: id });
        if (!app) {
            throw new NotFoundException(`Application with id ${id} not found`);
        }

        for (const key in files) {
            const file = files[key as keyof typeof this.fileType]?.[0];
            if (file) {
                const type = this.fileType[key as keyof typeof this.fileType];
                const moved = await moveFileFromMulter({
                    file,
                    destination: this.docinvDirectory,
                });
                if (type === 1) data.APP_ICON = moved.newName;
                if (type === 2) data.APP_POSTER = moved.newName;
            }
        }

        Object.assign(app, data);
        await this.apps.save(app);
        return this.getAppsByID(id);
    }

    private async mapApplicationFiles(app: Application) {
        const [appIcon, appPoster] = await Promise.all([
            this.toBase64(app.APP_ICON),
            this.toBase64(app.APP_POSTER),
        ]);

        return {
            ...app,
            APP_ICON: appIcon,
            APP_POSTER: appPoster,
        };
    }

    private async toBase64(fileName?: string) {
        if (!fileName) {
            return '';
        }

        return getBase64Image(`${this.docinvDirectory}${fileName}`);
    }
}
