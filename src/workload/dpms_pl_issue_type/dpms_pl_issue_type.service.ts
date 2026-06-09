import { Injectable } from '@nestjs/common';
import { DpmsPlIssueTypeRepository } from './dpms_pl_issue_type.repository';

@Injectable()
export class DpmsPlIssueTypeService {
    constructor(private readonly repo: DpmsPlIssueTypeRepository) {}

    async findAll() {
        try {
            const result = await this.repo.findAll();
            if (result.length === 0) {
                return {
                    status: false,
                    message: 'No issue types found.',
                };
            }
            return {
                status: true,
                message: `${result.length} issue type(s) found.`,
                data: result,
            };
        } catch (error) {
            throw new Error(
                `Failed to find all issue types. Error: ${error.message}`,
            );
        }
    }

    async findById(id: number) {
        try {
            const result = await this.repo.findById(id);
            if (!result) {
                return {
                    status: false,
                    message: `Issue type with ID ${id} not found.`,
                };
            }
            return {
                status: true,
                message: `Issue type with ID ${id} found.`,
                data: result,
            };
        } catch (error) {
            throw new Error(
                `Failed to find issue type by ID ${id}. Error: ${error.message}`,
            );
        }
    }
}
