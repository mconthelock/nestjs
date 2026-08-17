import { BadRequestException, Injectable } from '@nestjs/common';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FinnpoRepository } from './fin-npo.repository';
import { UsersService } from 'src/amec/users/users.service';
import { HandleFileFormService } from 'src/webform/handle-file-form/handle-file-form.service';
import { deleteFile } from 'src/common/utils/files.utils';
import * as path from 'path';

export interface CreateFinnpoInvoiceDto {
    INVOICE_DATE: string;
    INVOICE_NO?: string;
    INVOICE_No?: string;
    LINE_ID: number;
    NET_PRICE: number;
    VAT_RATE_ID: number;
    TOTAL_AMT: number;
    SCURCODE: string;
}

export interface CreateFinnpoDto {
    INPUTBY: string;
    REQBY: string;
    SUBJECT: string;
    VENDOR_CODE: string | number;
    EXPENSE_CODE: number;
    REMARK?: string;
    DATA: CreateFinnpoInvoiceDto[] | string;
    AIR_SALES_BY?: string[] | string;
}

export interface ActionFinnpoDto {
    NFRMNO: number;
    VORGNO: string;
    CYEAR: string;
    CYEAR2?: string;
    NRUNNO: number;
    EMPNO: string;
    ACTION: string;
    REMARK?: string;
    CEXTDATA?: string;
    SUBJECT?: string;
    EXPENSE_CODE?: number;
    VENDOR_CODE?: string | number;
    AIR_SALES_BY?: string[] | string;
    DATA?: Array<{
        ID?: number;
        LINE_ID?: number;
        INVOICE_DATE?: string;
        INVOICE_NO?: string;
        NET_PRICE?: number;
        VAT_RATE_ID?: number;
        TOTAL_AMT?: number;
        SCURCODE?: string;
        WHT?: number | null;
    }> | string;
}

export interface FinnpoReportFilterDto {
    formDateFrom?: string;
    formDateTo?: string;
    invoiceDateFrom?: string;
    invoiceDateTo?: string;
    expenseCode?: number | string;
    vendorCode?: string;
    costCenter?: string;
}

@Injectable()
export class FinnpoService {
    constructor(
        private readonly repo: FinnpoRepository,
        private readonly formmstService: FormmstService,
        private readonly formCreateService: FormCreateService,
        private readonly doactionFlowService: DoactionFlowService,
        private readonly usersService: UsersService,
        private readonly handleFileFormService: HandleFileFormService,
    ) {}

    findAll() {
        return this.repo.findAllExpense();
    }

    async findAllExpenseForShow() {
        return {
            status: true,
            message: 'Get FIN-NPO expense success',
            data: await this.repo.findAllExpense(),
        };
    }

    async findAllVendorForShow() {
        return {
            status: true,
            message: 'Get FIN-NPO vendor success',
            data: await this.repo.findAllVendor(),
        };
    }

    async findAllCurrencyForShow() {
        return {
            status: true,
            message: 'Get FIN-NPO currency success',
            data: await this.repo.findAllCurrency(),
        };
    }

    async findAllCostCenterForShow() {
        return {
            status: true,
            message: 'Get FIN-NPO cost center success',
            data: await this.repo.findAllCostCenter(),
        };
    }

    async findOneForShow(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        const data = await this.repo.findOneForShow(
            nfrmno,
            vorgno,
            cyear,
            cyear2,
            nrunno,
        );

        if (!data.head) {
            return {
                status: false,
                message: 'FIN-NPO data not found',
                data: null,
            };
        }

        return {
            status: true,
            message: 'Get FIN-NPO data success',
            data,
        };
    }

    async findReport(dto: FinnpoReportFilterDto = {}) {
        const filters = {
            formDateFrom: this.validateReportDate(dto.formDateFrom, 'formDateFrom'),
            formDateTo: this.validateReportDate(dto.formDateTo, 'formDateTo'),
            invoiceDateFrom: this.validateReportDate(
                dto.invoiceDateFrom,
                'invoiceDateFrom',
            ),
            invoiceDateTo: this.validateReportDate(dto.invoiceDateTo, 'invoiceDateTo'),
            expenseCode:
                dto.expenseCode === undefined ||
                dto.expenseCode === null ||
                dto.expenseCode === ''
                    ? undefined
                    : Number(dto.expenseCode),
            vendorCode: String(dto.vendorCode || '').trim() || undefined,
            costCenter: String(dto.costCenter || '').trim() || undefined,
        };

        if (
            filters.expenseCode !== undefined &&
            !Number.isFinite(filters.expenseCode)
        ) {
            throw new BadRequestException('expenseCode must be a number');
        }
        if (
            filters.formDateFrom &&
            filters.formDateTo &&
            filters.formDateFrom > filters.formDateTo
        ) {
            throw new BadRequestException(
                'formDateFrom must not be later than formDateTo',
            );
        }
        if (
            filters.invoiceDateFrom &&
            filters.invoiceDateTo &&
            filters.invoiceDateFrom > filters.invoiceDateTo
        ) {
            throw new BadRequestException(
                'invoiceDateFrom must not be later than invoiceDateTo',
            );
        }

        return {
            status: true,
            message: 'Get FIN-NPO report success',
            data: await this.repo.findReport(filters),
        };
    }

    async action(dto: ActionFinnpoDto, ip: string) {
        await this.updateData(dto);

        const result = await this.doactionFlowService.doAction(
            {
                ...dto,
                NFRMNO: Number(dto.NFRMNO),
                CYEAR2: dto.CYEAR2 || dto.CYEAR,
                NRUNNO: Number(dto.NRUNNO),
                EMPNO: String(dto.EMPNO),
            },
            ip,
        );

        if (!result.status) {
            throw new BadRequestException(
                result.message || 'Cannot process FIN-NPO workflow action',
            );
        }

        return {
            status: true,
            message: result.message || 'FIN-NPO action success',
        };
    }

    findFileById(fileId: number) {
        return this.repo.findFileById(fileId);
    }

    async update(dto: ActionFinnpoDto, files: Express.Multer.File[] = []) {
        await this.updateData(dto);

        if (files.length) {
            const form = {
                NFRMNO: Number(dto.NFRMNO),
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2 || dto.CYEAR,
                NRUNNO: Number(dto.NRUNNO),
            };
            const existingFiles = await this.repo.findFilesByForm(
                form.NFRMNO,
                form.VORGNO,
                form.CYEAR,
                form.CYEAR2,
                form.NRUNNO,
            );
            const savedFiles = await this.handleFileFormService.insertFiles(
                {
                    ...form,
                    FORM_TYPE: 'FIN',
                    CREATEBY: String(dto.EMPNO),
                },
                files,
            );

            if (!savedFiles?.status) {
                throw new BadRequestException('Cannot update FIN-NPO attachment');
            }

            await this.repo.deleteFilesByIds(
                existingFiles.map((file) => Number(file.FILE_ID)),
            );
            await Promise.allSettled(
                existingFiles.map((file) =>
                    deleteFile(path.join(file.FILE_PATH, file.FILE_FNAME)),
                ),
            );
        }

        return {
            status: true,
            message: 'Update FIN-NPO success',
        };
    }

    private async updateData(dto: ActionFinnpoDto) {
        const invoices = this.parseActionInvoices(dto.DATA);

        if (invoices.length) {
            await this.repo.updateInvoices(
                dto.CYEAR2 || dto.CYEAR,
                Number(dto.NRUNNO),
                invoices,
            );
        }

        if (
            dto.SUBJECT !== undefined ||
            dto.EXPENSE_CODE !== undefined ||
            dto.VENDOR_CODE !== undefined
        ) {
            await this.repo.updateHead(
                Number(dto.NFRMNO),
                dto.VORGNO,
                dto.CYEAR,
                dto.CYEAR2 || dto.CYEAR,
                Number(dto.NRUNNO),
                {
                    ...(dto.SUBJECT !== undefined && {
                        SUBJECT: String(dto.SUBJECT).trim(),
                    }),
                    ...(dto.EXPENSE_CODE !== undefined && {
                        EXPENSE_CODE: Number(dto.EXPENSE_CODE),
                    }),
                    ...(dto.VENDOR_CODE !== undefined && {
                        VENDOR_CODE: String(dto.VENDOR_CODE),
                    }),
                },
            );
        }

        if (dto.AIR_SALES_BY !== undefined) {
            const employeeCodes = this.parseAirSalesBy(dto.AIR_SALES_BY);
            const costCenters = await Promise.all(
                employeeCodes.map(async (reqno) => {
                    const employee = await this.usersService.findEmp(reqno);
                    const costCode = [
                        employee?.SSECCODE,
                        employee?.SDEPCODE,
                        employee?.SDIVCODE,
                    ]
                        .map((value) => String(value ?? '').trim())
                        .find(Boolean);

                    if (!costCode) {
                        throw new BadRequestException(
                            `Cost center was not found for employee ${reqno}`,
                        );
                    }

                    return {
                        CYEAR2: dto.CYEAR2 || dto.CYEAR,
                        NRUNNO: Number(dto.NRUNNO),
                        REQNO: reqno,
                        COSTCODE: costCode,
                    };
                }),
            );
            await this.repo.replaceCostCenters(
                dto.CYEAR2 || dto.CYEAR,
                Number(dto.NRUNNO),
                costCenters,
            );
        }
    }

    async create(
        dto: CreateFinnpoDto,
        files: Express.Multer.File[],
        ip: string,
    ) {
        this.validateCreateDto(dto);

        const invoices = this.parseInvoices(dto.DATA);
        const airSalesBy = this.parseAirSalesBy(dto.AIR_SALES_BY);
        const vendorCode = String(dto.VENDOR_CODE);
        const expenseCode = Number(dto.EXPENSE_CODE);
        const vendor = await this.repo.findVendorByCode(vendorCode);
        const expense = await this.repo.findExpenseByCode(expenseCode);

        if (!vendor) {
            throw new BadRequestException(
                `VENDOR_CODE ${vendorCode} was not found`,
            );
        }

        if (!expense) {
            throw new BadRequestException(
                `EXPENSE_CODE ${dto.EXPENSE_CODE} was not found`,
            );
        }

        const formmst = await this.formmstService.getFormMasterByVaname('FIN-NPO');
        const createdForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: String(dto.REQBY),
                INPUTBY: String(dto.INPUTBY),
                REMARK: dto.REMARK,
            },
            ip,
        );

        const form = {
            NFRMNO: createdForm.data.NFRMNO,
            VORGNO: createdForm.data.VORGNO,
            CYEAR: createdForm.data.CYEAR,
            CYEAR2: createdForm.data.CYEAR2 || createdForm.data.CYEAR,
            NRUNNO: createdForm.data.NRUNNO,
        };

        const head = await this.repo.createHead({
            ...form,
            SUBJECT: dto.SUBJECT,
            VENDOR_CODE: vendorCode,
            EXPENSE_CODE: expenseCode,
        });

        const invoiceEntities = invoices.map((invoice) => ({
            CYEAR2: form.CYEAR2,
            NRUNNO: form.NRUNNO,
            ID: Number(invoice.LINE_ID),
            INVOICE_DATE: new Date(invoice.INVOICE_DATE),
            INVOICE_NO: invoice.INVOICE_NO || invoice.INVOICE_No,
            NET_PRICE: Number(invoice.NET_PRICE),
            VAT_RATE_ID: Number(invoice.VAT_RATE_ID),
            TOTAL_AMT: Number(invoice.TOTAL_AMT),
            SCURCODE: invoice.SCURCODE,
        }));
        const savedInvoices = await this.repo.createInvoices(invoiceEntities);

        const costCenterEntities = await Promise.all(
            airSalesBy.map(async (reqno) => {
                const employee = await this.usersService.findEmp(reqno);
                const employeeCostCodes = [
                    employee?.SSECCODE,
                    employee?.SDEPCODE,
                    employee?.SDIVCODE,
                ].map((value) => String(value ?? '').trim());
                const costCode =
                    employeeCostCodes.find(
                        (value) => value !== '' && !/^0+$/.test(value),
                    ) || '';

                if (!employee || !costCode) {
                    throw new BadRequestException(
                        `Employee ${reqno} or employee cost center was not found`,
                    );
                }

                return {
                    CYEAR2: form.CYEAR2,
                    NRUNNO: form.NRUNNO,
                    REQNO: reqno,
                    COSTCODE: costCode,
                };
            }),
        );
        const savedCostCenters = costCenterEntities.length
            ? await this.repo.createCostCenters(costCenterEntities)
            : [];

        const savedFiles = files?.length
            ? await this.handleFileFormService.insertFiles(
                  {
                      ...form,
                      FORM_TYPE: 'FIN',
                      CREATEBY: String(dto.INPUTBY),
                  },
                  files,
              )
            : null;

        if (savedFiles && !savedFiles.status) {
            throw new BadRequestException('Cannot save FIN-NPO attachment');
        }

        return {
            status: true,
            message: 'Create FIN-NPO success',
            data: {
                form,
                head,
                invoices: savedInvoices,
                costCenters: savedCostCenters,
                files: savedFiles,
            },
        };
    }

    private parseActionInvoices(data: ActionFinnpoDto['DATA']) {
        if (!data) return [];

        const invoices = typeof data === 'string' ? JSON.parse(data) : data;

        if (!Array.isArray(invoices)) {
            throw new BadRequestException('DATA must be an array');
        }

        return invoices.map((invoice) => {
            const id = Number(invoice.ID ?? invoice.LINE_ID);
            const wht = invoice.WHT === undefined
                ? undefined
                : invoice.WHT === null
                  ? null
                  : Number(invoice.WHT);

            if (!Number.isInteger(id) || id <= 0) {
                throw new BadRequestException('Invoice ID is invalid');
            }
            if (
                wht !== undefined &&
                wht !== null &&
                (!Number.isFinite(wht) || wht < 0)
            ) {
                throw new BadRequestException('WHT must be zero or a positive number');
            }

            return {
                ID: id,
                ...(wht !== undefined && { WHT: wht }),
                ...(invoice.INVOICE_DATE !== undefined && {
                    INVOICE_DATE: new Date(invoice.INVOICE_DATE),
                    INVOICE_NO: String(invoice.INVOICE_NO || '').trim(),
                    NET_PRICE: Number(invoice.NET_PRICE),
                    VAT_RATE_ID: Number(invoice.VAT_RATE_ID),
                    TOTAL_AMT: Number(invoice.TOTAL_AMT),
                    SCURCODE: String(invoice.SCURCODE || '').trim(),
                }),
            };
        });
    }

    private parseAirSalesBy(data: CreateFinnpoDto['AIR_SALES_BY']) {
        let values: unknown[] = [];

        if (Array.isArray(data)) {
            values = data;
        } else if (typeof data === 'string' && data.trim()) {
            try {
                const parsed = JSON.parse(data);
                values = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                values = [data];
            }
        } else if (data) {
            values = [data];
        }

        return [
            ...new Set(
                values
                    .map((value) => String(value || '').trim())
                    .filter(Boolean),
            ),
        ];
    }

    private parseInvoices(data: CreateFinnpoDto['DATA']) {
        let invoices: CreateFinnpoInvoiceDto[];

        try {
            invoices = typeof data === 'string' ? JSON.parse(data) : data;
        } catch {
            throw new BadRequestException('DATA must be a valid JSON array');
        }

        if (!Array.isArray(invoices) || invoices.length === 0) {
            throw new BadRequestException('DATA must contain at least one invoice');
        }

        invoices.forEach((invoice, index) => {
            const invoiceNo = invoice.INVOICE_NO || invoice.INVOICE_No;
            const date = new Date(invoice.INVOICE_DATE);
            const numericValues = [
                invoice.LINE_ID,
                invoice.NET_PRICE,
                invoice.VAT_RATE_ID,
                invoice.TOTAL_AMT,
            ].map(Number);

            if (
                !invoiceNo ||
                !invoice.SCURCODE ||
                Number.isNaN(date.getTime()) ||
                numericValues.some((value) => Number.isNaN(value))
            ) {
                throw new BadRequestException(`Invalid invoice at DATA[${index}]`);
            }
        });

        return invoices;
    }

    private validateCreateDto(dto: CreateFinnpoDto) {
        if (!dto?.INPUTBY || !dto?.REQBY || !dto?.SUBJECT) {
            throw new BadRequestException(
                'INPUTBY, REQBY and SUBJECT are required',
            );
        }

        if (dto.VENDOR_CODE === undefined || dto.VENDOR_CODE === null) {
            throw new BadRequestException('VENDOR_CODE is required');
        }

        if (
            dto.EXPENSE_CODE === undefined ||
            dto.EXPENSE_CODE === null ||
            Number.isNaN(Number(dto.EXPENSE_CODE))
        ) {
            throw new BadRequestException('EXPENSE_CODE is required');
        }
    }

    private validateReportDate(value: string | undefined, field: string) {
        if (!value) return undefined;
        const date = String(value).trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new BadRequestException(`${field} must use YYYY-MM-DD format`);
        }

        const parsed = new Date(`${date}T00:00:00Z`);
        if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
            throw new BadRequestException(`${field} is not a valid date`);
        }
        return date;
    }
}
