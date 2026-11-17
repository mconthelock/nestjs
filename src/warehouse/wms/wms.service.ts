import { Injectable } from '@nestjs/common';
import { WMSRepository } from './wms.repository';
import { WMSTempIssueDto } from './dto/wms-temp-issue.dto';
import { WMSUploadIssueDto } from './dto/wms-upload-issue.dto';
import { WMSUploadIssueResponseDto } from './dto/wms-upload-issue-response.dto';

@Injectable()
export class WMSService {
    constructor(private readonly repo: WMSRepository) {}

    /**
     * Get issue list
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2025-11-24
     * @param   {string} empno Employee ID
     * @return  {Promise<WMSTempIssueDto[]>}
     */
    async getIssueList(empno: string): Promise<WMSTempIssueDto[]> {
        return this.repo.getIssueList(empno);
    }

    /**
     * Upload issue
     * @author  Mr.Pathanapong Sokpukeaw
     * @since   2026-02-24
     * @param   {WMSUploadIssueDto} dto Upload issue data
     * @return  {Promise<WMSUploadIssueResponseDto>}
     */
    async uploadIssue(dto: WMSUploadIssueDto): Promise<WMSUploadIssueResponseDto> {
        return this.repo.uploadIssue(dto);
    }
}