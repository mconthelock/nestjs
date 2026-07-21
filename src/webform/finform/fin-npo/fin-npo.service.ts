import { BadRequestException, Injectable } from '@nestjs/common';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { DoactionFlowService } from 'src/webform/flow/doaction.service';
import { FinnpoRepository } from './fin-npo.repository';

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

    async create(dto: CreateFinnpoDto, ip: string) {
        this.validateCreateDto(dto);

        const invoices = this.parseInvoices(dto.DATA);
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
            REMARK: dto.REMARK || '',
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

        return {
            status: true,
            message: 'Create FIN-NPO success',
            data: { form, head, invoices: savedInvoices },
        };
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
