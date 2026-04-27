import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChecksheetRepository } from './checksheet.repository';
import { InCheckDto } from './dto/in-check.dto';
import { SaveDto } from './dto/save.dto';
import { DeleteDto } from './dto/delete.dto';
import { ChecksheetResponseDto } from './dto/response.dto';
import { ChecksheetProc } from './enums/proc.enum';

@Injectable()
export class ChecksheetService {
    constructor(private readonly repo: ChecksheetRepository) {}

    /**
     * Inspector check data checksheet for ready save.
     * Validate data before allowing save action from Excel Add-in.
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-25
     * @param   {InCheckDto} dto Input data from Excel Add-in
     * @return  {Promise<ChecksheetResponseDto>} Result of IN_CHECK procedure
     */
    async inCheck(dto: InCheckDto): Promise<ChecksheetResponseDto> {
        try {
            const res = await this.repo.getInCheck(dto);
            return {
                status: 'SUCCESS',
                message: res.length ? null : 'No data found',
                data: res,
            };
        } catch (err) {
            throw new InternalServerErrorException('IN_CHECK failed');
        }
    }

    /**
     * User save data and excel file.
     * Handle save workflow (draft / submit / edit).
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-25
     * @param   {SaveDto} dto Input data from Excel Add-in
     * @return  {Promise<ChecksheetResponseDto>}
     */
    async save(dto: SaveDto): Promise<ChecksheetResponseDto> {
        try {
            const proc = this.fnAction(dto.action);
            await this.repo.saveAction(proc, dto);
            return {
                status: 'SUCCESS',
                message: null,
                data: null,
            };
        } catch (err) {
            throw new InternalServerErrorException('SAVE failed');
        }
    }

    /**
     * Delete file from SharePoint system.
     * (Temporary mock implementation - will integrate SharePoint service later)
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-04-25
     * @param   {DeleteDto} dto Input data for delete operation
     * @return  {Promise<ChecksheetResponseDto>}
     */
    async delete(dto: DeleteDto): Promise<ChecksheetResponseDto> {
        return {
            status: 'SUCCESS',
            message: `Deleted ${dto.filename}`,
            data: null,
        };
    }

    /**
     * Get function mapping.
     */
    private fnAction(action: string): string {
        switch (action) {
            case 'draft':
                return ChecksheetProc.IN_DRAFT;
            case 'submit':
                return ChecksheetProc.IN_SUBMIT;
            case 'edit':
                return ChecksheetProc.FL_EDIT;
            default:
                throw new Error(`Invalid action: ${action}`);
        }
    }
}