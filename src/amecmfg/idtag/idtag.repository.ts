import { Request } from 'express';
import { DataSource } from 'typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';

import { IdtagFiles } from '../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../common/Entities/workload/table/idtag-pages.entity';
import { IdtagImages } from '../../common/Entities/workload/views/idtag-images.entity';

import { CreateIdtagFilesDto } from './dto/create-idtag-files.dto';
import { CreateIdtagPagesDto } from './dto/create-idtag-pages.dto';

@Injectable({ scope: Scope.REQUEST })
export class IdTagRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request);
    }

    async createPrint(
        fileData: CreateIdtagFilesDto,
        pagesData: Omit<CreateIdtagPagesDto, 'FILES_ID'>[],
    ) {
        return this.manager.transaction(async (manager) => {
            const savedFile = await manager.save(IdtagFiles, fileData);

            const pageEntities = pagesData.map((pageData) =>
                manager.create(IdtagPages, {
                    ...pageData,
                    FILES_ID: savedFile.FILES,
                    PAGE_NUM: Number(pageData.PAGE_NUM),
                    PAGE_STATUS: pageData.PAGE_STATUS ?? '0',
                }),
            );

            const savedPages = pageEntities.length
                ? await manager.save(IdtagPages, pageEntities)
                : [];

            return {
                file: savedFile,
                pages: savedPages,
            };
        });
    }

    async findImage(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagImages, 'I');
        this.applyFilters(qb, 'I', dto, ['FILES_ID', 'PAGE_IMG']);
        return qb.getMany();
    }

    async updatePageImage(filesId: number, pageNum: number, pageImg: string) {
        return this.getRepository(IdtagPages).update(
            {
                FILES_ID: filesId,
                PAGE_NUM: pageNum,
            },
            {
                PAGE_IMG: '1',
            },
        );
    }
}
