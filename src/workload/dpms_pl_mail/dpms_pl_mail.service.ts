import { Injectable } from '@nestjs/common';
import { CreateDpmsPlMailDto } from './dto/create-dpms_pl_mail.dto';
import { UpdateDpmsPlMailDto } from './dto/update-dpms_pl_mail.dto';
import { DpmsPlMailRepository } from './dpms_pl_mail.repository';

@Injectable()
export class DpmsPlMailService {
    constructor(private readonly repo: DpmsPlMailRepository) {}
    async create(dto: CreateDpmsPlMailDto) {
        try {
            const res = await this.repo.create(
                dto.VDISPLAY_NAME,
                dto.VEMAIL_ADDRESS,
            );
            if (!res) {
                return {
                    status: false,
                    message: 'Save email address failed',
                };
            }
            return {
                status: true,
                message: 'Email address added successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to add email address: ${error.message}`);
        }
    }

    async findAll() {
        try {
            const res = await this.repo.findAll();
            if (!res || res.length === 0) {
                return {
                    status: false,
                    message: 'No email addresses found',
                };
            }
            return {
                status: true,
                message: `Email addresses ${res.length} found`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to retrieve email addresses: ${error.message}`,
            );
        }
    }

    async remove(id: number) {
        try {
            const res = await this.repo.delete(id);
            if (res.affected === 0) {
                return {
                    status: false,
                    message: 'Failed to delete email address',
                };
            }
            return {
                status: true,
                message: 'Email address deleted successfully',
            };
        } catch (error) {
            throw new Error(`Failed to delete email address: ${error.message}`);
        }
    }
}
