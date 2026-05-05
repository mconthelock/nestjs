import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MachineRepository } from './machine.repository';
import { SearchMachineDto } from './dto/search-machine.dto';
import { MachineResponseDto } from './dto/machine-response.dto';

@Injectable()
export class MachineService {
    constructor(private readonly repo: MachineRepository) {}

    async search(dto: SearchMachineDto): Promise<MachineResponseDto> {
        try {
            const res = await this.repo.findMachine(dto);
            if (!res) {
                return {
                    status: 'ERROR',
                    message: 'ไม่พบข้อมูลเครื่องจักร',
                    data: null
                };
            }

            return {
                status: 'SUCCESS',
                message: null,
                data: {
                    mcType: res.MC_TYPE,
                    mcNo: res.MC_NO,
                    mcDatasource: res.MC_DATASOURCE,
                    mcName: res.MC_NAME
                }
            };
        } catch (err) {
            if (err instanceof NotFoundException) throw err;

            throw new InternalServerErrorException({
                message: 'SEARCH_MACHINE failed',
                error: err?.message
            });
        }
    }
}