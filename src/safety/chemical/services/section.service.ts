import { Injectable } from '@nestjs/common';
import { SectionRepository } from '../repository/section.repository';
import { UpdateChemicalSectionDto } from '../dto/update-chemical-section.dto';
import { RevService } from './rev.service';
@Injectable()
export class SectionService {
    constructor(
        private readonly repo: SectionRepository,
        private readonly revService: RevService,
    ) {}

    async update(dto: UpdateChemicalSectionDto) {
        try {
            const { AMEC_SDS_ID, OWNERCODE, ...data } = dto;
            const condition = {
                AMEC_SDS_ID: dto.AMEC_SDS_ID,
                OWNERCODE: dto.OWNERCODE,
            };
            await this.repo.update(condition, data);
            const revResult = await this.revService.updateRevision(dto.OWNERCODE);
            return {
                status: true,
                message: 'Update Chemical Section Successfully',
                revision: revResult.data
            };
        } catch (error) {
            throw error;
        }
    }
}
