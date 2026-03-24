import { Request } from 'express';
import { DataSource } from 'typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { IdtagList } from '../../../common/Entities/workload/table/idtag-list.entity';
import { IdtagFiles } from '../../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../../common/Entities/workload/table/idtag-pages.entity';
import { IdtagImages } from '../../../common/Entities/workload/views/idtag-images.entity';
import { IdtagCnData } from '../../../common/Entities/workload/views/idtag-cndata.entity';
import { IdtagNcDetail } from '../../../common/Entities/workload/views/idtag-ncdetail.entity';

import { CreateIdtagFilesDto } from './dto/create-idtag-files.dto';
import { CreateIdtagPagesDto } from './dto/create-idtag-pages.dto';
import { SearchIdtagFilesDto } from './dto/search-idtag-file.dto';

@Injectable({ scope: Scope.REQUEST })
export class IdTagRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request);
    }

    async findAllList(dto?: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagList, 'L');
        if (dto)
            await this.applyFilters(qb, 'L', dto, [
                'MST_DIR',
                'MST_FILE',
                'MST_STATUS',
            ]);
        return qb.getMany();
    }

    async findAllFiles(dto: SearchIdtagFilesDto) {
        const qb = await this.manager.createQueryBuilder(IdtagFiles, 'files');
        await applyDynamicFilters(qb, dto, 'files');
        return qb.getMany();
    }

    async findAllPagess(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagPages, 'pages');
        this.applyFilters(qb, 'pages', dto, ['FILES_ID', 'PAGE_CN']);
        return qb.getMany();
    }

    async findAllImage(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagImages, 'img');
        this.applyFilters(qb, 'img', dto, ['FILES_ID', 'PAGE_IMG']);
        return qb.getMany();
    }

    async findAllCn(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagCnData, 'cn');
        this.applyFilters(qb, 'cn', dto, ['FILES_ID', 'PAGE_CN']);
        return qb.getMany();
    }

    async findAllNc(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagNcDetail, 'nc');
        this.applyFilters(qb, 'nc', dto, ['FILES_ID', 'PAGE_CN']);
        return qb.getMany();
    }

    async createPrintedFile(
        fileData: CreateIdtagFilesDto,
        pagesData: Omit<CreateIdtagPagesDto, 'FILES_ID'>[],
    ) {
        const savedFile = await this.manager.save(IdtagFiles, fileData);
        const pageEntities = pagesData.map((pageData) =>
            this.manager.create(IdtagPages, {
                ...pageData,
                FILES_ID: savedFile.FILES,
                PAGE_NUM: Number(pageData.PAGE_NUM),
                PAGE_STATUS: pageData.PAGE_STATUS ?? '0',
            }),
        );

        if (pageEntities.length)
            await this.manager.insert(IdtagPages, pageEntities);
        return savedFile;
    }

    async createFiles() {}

    async createPages() {}

    async updateFiles() {}

    async updatePages() {}

    async deelteFiles() {}

    async dedletePages() {}

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

    async updatePrintFileStatus(files: number, status: number, page?: number) {
        return this.getRepository(IdtagFiles).update(
            {
                FILES: files,
            },
            {
                FILE_STATUS: status,
                PRINTED_DATE: status == 3 ? new Date() : null,
                FILE_PRINTEDPAGE: page || 0,
            },
        );
    }

    async updatePrintPagesStatus(files: number, status: number) {
        return this.manager
            .createQueryBuilder()
            .update(IdtagPages)
            .set({ PAGE_STATUS: status })
            .where('FILES_ID = :files', { files })
            .execute();
    }

    async updateNcPagesStatus(files: number, status: string) {
        return this.manager
            .createQueryBuilder()
            .update(IdtagPages)
            .set({ PAGE_NC: status })
            .where('FILES_ID = :files', { files })
            .execute();
    }

    async updateNcPagesStatusByPageNums(
        files: number,
        pageNums: number[],
        status: string,
    ) {
        if (!pageNums.length) return;

        return this.manager
            .createQueryBuilder()
            .update(IdtagPages)
            .set({ PAGE_NC: status })
            .where('FILES_ID = :files', { files })
            .andWhere('PAGE_NUM IN (:...pageNums)', { pageNums })
            .execute();
    }

    // async findAllFiles(dto: SearchIdtagFilesDto) {
    //     const qb = this.manager.createQueryBuilder(IdtagFiles, 'files');
    //     await applyDynamicFilters(qb, dto, 'files');
    //     return qb.getMany();
    // }

    async deletePdf(filesId: number) {
        const file = this.manager.delete(IdtagFiles, { FILES: filesId });
        const pages = await this.manager.delete(IdtagPages, {
            FILES_ID: filesId,
        });
        return { file, pages };
    }

    // NC Detail
    async findNcDetail(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(IdtagNcDetail, 'N');
        this.applyFilters(qb, 'N', dto, ['TASKNAME', 'PAGE_TAG']);
        qb.orderBy('N.FILES_ID', 'ASC')
            .addOrderBy('SEQNO', 'ASC')
            .addOrderBy('N.PAGE_NUM', 'ASC');
        return qb.getMany();
    }
}
