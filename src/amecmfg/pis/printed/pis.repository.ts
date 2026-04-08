import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { PisFiles } from 'src/common/Entities/workload/table/pis-files.entity';
import { PisPages } from 'src/common/Entities/workload/table/pis-pages.entity';
import { PisLabel } from 'src/common/Entities/workload/views/pis-label.entity';

import { SearchPisFilesDto } from './dto/search-pis-file.dto';
import { CreatePisPagesDto } from './dto/create-pis-pages.dto';
import { CreatePisFilesDto } from './dto/create-pis-files.dto';
import { UpdatePisFilesDto } from './dto/update-pis-file.dto';
import { UpadatePisPagesDto } from './dto/update-pis-pages.dto';

@Injectable()
export class PisRepository extends BaseRepository {
    constructor(
        @InjectDataSource('workloadConnection') ds: DataSource,
        ) {
        super(ds);
    }

    async findAllFiles(dto: SearchPisFilesDto) {
        const qb = await this.manager.createQueryBuilder(PisFiles, 'files');
        await applyDynamicFilters(qb, dto, 'files');
        return qb.getMany();
    }

    async findAllPagess(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(PisPages, 'pages');
        this.applyFilters(qb, 'pages', dto, ['FILES_ID']);
        return qb.getMany();
    }

    async findAllLabel(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(PisLabel, 'lable');
        this.applyFilters(qb, 'lable', dto, ['FILES_ID']);
        return qb.getMany();
    }

    async createPrintedFile(
        fileData: CreatePisFilesDto,
        pagesData: Omit<CreatePisPagesDto, 'FILES_ID'>[],
    ) {
        const savedFile = await this.manager.save(PisFiles, fileData);
        const pageEntities = pagesData.map((pageData) =>
            this.manager.create(PisPages, {
                ...pageData,
                FILES_ID: savedFile.FILES,
                PAGE_NUM: Number(pageData.PAGE_NUM),
                PAGE_STATUS: pageData.PAGE_STATUS ?? '0',
            }),
        );

        if (pageEntities.length)
            await this.manager.insert(PisPages, pageEntities);
        return savedFile;
    }

    async updateFiles(fileData: UpdatePisFilesDto) {
        return await this.manager.update(
            PisFiles,
            { FILES: fileData.FILES },
            fileData,
        );
    }

    async updatePages(
        pagesData: Array<
            Omit<UpadatePisPagesDto, 'FILES_ID' | 'PAGE_NUM'> &
                Pick<CreatePisPagesDto, 'FILES_ID' | 'PAGE_NUM'>
        >,
    ) {
        const updatePromises = pagesData.map((pageData) => {
            const { FILES_ID, PAGE_NUM, ...updateData } = pageData;
            return this.manager.update(
                PisPages,
                { FILES_ID, PAGE_NUM },
                updateData,
            );
        });
        await Promise.all(updatePromises);
        return { updated: updatePromises.length };
    }

    async deleteFiles(filesId: number) {
        const file = await this.manager.delete(PisFiles, { FILES: filesId });
        const pages = await this.manager.delete(PisPages, {
            FILES_ID: filesId,
        });
        return { file, pages };
    }

    async deletePages(pagesId: number) {
        return this.manager.delete(PisPages, { PAGE_ID: pagesId });
    }
}
