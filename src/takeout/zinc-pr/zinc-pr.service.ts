import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { MailService } from 'src/common/services/mail/mail.service';
import { ZincPrAs400Repository } from './zinc-pr-as400.repository';
import { ZincPrRepository } from './zinc-pr.repository';
import { ZincPrPendingPreviewEmailDto } from './dto/zinc-pr-pending-preview-email.dto';
import {
  ZincPrInvalidTakeoutDto,
  ZincPrPendingResultDto,
  ZincPrPendingRowDto,
} from './dto/zinc-pr-pending.dto';

@Injectable()
export class ZincPrService {
  constructor(
    private readonly zincPrRepository: ZincPrRepository,
    private readonly zincPrAs400Repository: ZincPrAs400Repository,
    private readonly mailService: MailService,
  ) {}

  private escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return entities[character];
    });
  }

  private async sendInvalidTakeoutsEmail(
    invalidTakeouts: ZincPrInvalidTakeoutDto[],
  ): Promise<'SENT' | 'FAILED' | 'SKIPPED'> {
    if (invalidTakeouts.length === 0) {
      return 'SKIPPED';
    }

    const tableRows = invalidTakeouts
      .map(
        ({ TDETAIL_TAKEOUTNO, PROCESSES }) =>
          `<tr><td>${this.escapeHtml(TDETAIL_TAKEOUTNO)}</td><td>${PROCESSES
            .map((process) => this.escapeHtml(process))
            .join(', ')}</td></tr>`,
      )
      .join('');

    try {
      const result = await this.mailService.sendMail({
        // to: [
        //   'sangjan@MitsubishiElevatorAsia.co.th',
        //   'tepnimit@MitsubishiElevatorAsia.co.th',
        //   'patcharee@MitsubishiElevatorAsia.co.th',
        // ],
        // bcc: 'perapatr@MitsubishiElevatorAsia.co.th',
        to: ['perapatr@MitsubishiElevatorAsia.co.th'],
        subject: '[Zinc PR] Takeout numbers with multiple processes',
        html: `<p>The following takeout numbers were excluded from Zinc PR submission because each contains multiple processes.</p>
          <table border="1" cellpadding="6" cellspacing="0">
            <thead><tr><th>Takeout No.</th><th>Processes</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>`,
      });

      if (result?.rejected?.length) {
        throw new Error(`SMTP rejected: ${result.rejected.join(', ')}`);
      }

      return 'SENT';
    } catch (error) {
      console.error('Failed to send Zinc PR invalid-takeout email', {
        message: error instanceof Error ? error.message : String(error),
      });
      return 'FAILED';
    }
  }

  private async buildPendingResult(date?: string): Promise<{
    payload: ZincPrPendingResultDto[];
    invalidTakeoutsForEmail: ZincPrInvalidTakeoutDto[];
  }> {
    const rows = (await this.zincPrRepository.findPending(date)) as ZincPrPendingRowDto[];
    const processesByTakeoutNo = new Map<string, Set<string>>();

    for (const row of rows) {
      const processes = processesByTakeoutNo.get(row.TDETAIL_TAKEOUTNO) ?? new Set<string>();
      processes.add(row.PROCESS);
      processesByTakeoutNo.set(row.TDETAIL_TAKEOUTNO, processes);
    }

    const invalidTakeoutsForEmail: ZincPrInvalidTakeoutDto[] = Array.from(
      processesByTakeoutNo.entries(),
    )
      .filter(([, processes]) => processes.size > 1)
      .map(([takeoutNo, processes]) => ({
        TDETAIL_TAKEOUTNO: takeoutNo,
        PROCESSES: Array.from(processes),
      }));

    const validRows = rows.filter(
      (row) => processesByTakeoutNo.get(row.TDETAIL_TAKEOUTNO)?.size === 1,
    );
    const remainingByProcess = new Map<string, number>();
    const carriedWeightByProcess = new Map<string, number>();
    const carriedTakeoutNosByProcess = new Map<string, string[]>();

    for (const row of validRows) {
      remainingByProcess.set(
        row.PROCESS,
        (remainingByProcess.get(row.PROCESS) ?? 0) + 1,
      );
    }

    const adjustedRows: ZincPrPendingResultDto[] = [];
    for (const row of validRows) {
      const remainingRows = (remainingByProcess.get(row.PROCESS) ?? 1) - 1;
      remainingByProcess.set(row.PROCESS, remainingRows);

      const takeoutNos = [
        ...(carriedTakeoutNosByProcess.get(row.PROCESS) ?? []),
        row.TDETAIL_TAKEOUTNO,
      ];
      const totalWeight =
        Number(row.TOTAL_WEIGHT_ADJUST ?? 0) +
        (carriedWeightByProcess.get(row.PROCESS) ?? 0);

      if (totalWeight < 1 && remainingRows > 0) {
        carriedWeightByProcess.set(row.PROCESS, totalWeight);
        carriedTakeoutNosByProcess.set(row.PROCESS, takeoutNos);
        continue;
      }

      carriedWeightByProcess.delete(row.PROCESS);
      carriedTakeoutNosByProcess.delete(row.PROCESS);

      if (totalWeight < 1) {
        continue;
      }

      const [takeoutDate, takeoutSequence] = row.TDETAIL_TAKEOUTNO.split('-');
      adjustedRows.push({
        T02PR: 0,
        T02LIN: 0,
        T02CTL: `T${takeoutDate.slice(-6)}${takeoutSequence.slice(-5).padStart(5, '0')}`,
        T02ITM: row.ITEM_MASTER,
        T02TYP: 'B',
        T02CLS: '24',
        T02DWG: row.DWGNO,
        T02DES: row.DESCRIPTION,
        T02VND: 80035,
        T02REQ: totalWeight,
        T02REC: 0,
        T02DUE: ' ',
        T02JOB: row.ITEM,
        T02ORD: ' ',
        T02PRN: 'H',
        T02DEL: ' ',
        T02SCH: row.MAX_PROD,
        T02RMK: ' ',
        T003KP: {
          T03PR: 0,
          T03LIN: 0,
          T03CTL: `T${takeoutDate.slice(-6)}${takeoutSequence.slice(-5).padStart(5, '0')}`,
          T03SEQ: 1,
          T03CUS: row.ITEM_MASTER,
          T03REQ: totalWeight,
          T03REC: 0,
        },
        TDETAIL_TAKEOUTNOS: takeoutNos,
      });
    }

    return { payload: adjustedRows, invalidTakeoutsForEmail };
  }

  async findPending(): Promise<ZincPrPendingResultDto[]> {
    const { payload } = await this.buildPendingResult();
    return payload;
  }

  async sendPendingPreviewEmail(dto: ZincPrPendingPreviewEmailDto) {
    const todayParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const todayPart = (type: string) =>
      todayParts.find((part) => part.type === type)?.value ?? '';
    const date = `${todayPart('year')}-${todayPart('month')}-${todayPart('day')}`;
    const { payload, invalidTakeoutsForEmail } = await this.buildPendingResult(date);

    if (payload.length === 0 && invalidTakeoutsForEmail.length === 0) {
      return {
        status: true,
        message: 'No Zinc PR pending data for today',
        data: {
          date,
          pendingRecords: 0,
          excludedTakeouts: 0,
          emailSent: false,
        },
      };
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Pending ${date}`);

    worksheet.columns = [
      { header: 'Control No.', key: 'controlNo', width: 18 },
      { header: 'Item Master', key: 'itemMaster', width: 18 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Drawing No.', key: 'drawingNo', width: 20 },
      { header: 'Description', key: 'description', width: 36 },
      { header: 'Vendor', key: 'vendor', width: 12 },
      { header: 'Required Weight', key: 'requiredWeight', width: 18 },
      { header: 'Job Item', key: 'jobItem', width: 18 },
      { header: 'Max Production', key: 'maxProduction', width: 18 },
      { header: 'Takeout Nos.', key: 'takeoutNos', width: 32 },
    ];
    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length },
    };

    for (const row of payload) {
      worksheet.addRow({
        controlNo: row.T02CTL,
        itemMaster: row.T02ITM,
        type: row.T02TYP,
        class: row.T02CLS,
        drawingNo: row.T02DWG,
        description: row.T02DES,
        vendor: row.T02VND,
        requiredWeight: row.T02REQ,
        jobItem: row.T02JOB,
        maxProduction: row.T02SCH,
        takeoutNos: row.TDETAIL_TAKEOUTNOS.join(', '),
      });
    }

    const invalidWorksheet = workbook.addWorksheet('Excluded Takeouts');
    invalidWorksheet.columns = [
      { header: 'Takeout No.', key: 'takeoutNo', width: 24 },
      { header: 'Processes', key: 'processes', width: 36 },
    ];
    invalidWorksheet.getRow(1).font = { bold: true };
    for (const takeout of invalidTakeoutsForEmail) {
      invalidWorksheet.addRow({
        takeoutNo: takeout.TDETAIL_TAKEOUTNO,
        processes: takeout.PROCESSES.join(', '),
      });
    }

    const attachment = Buffer.from(
      (await workbook.xlsx.writeBuffer()) as unknown as Uint8Array,
    );
    const filename = `Zinc_PR_Pending_${date}.xlsx`;
    const result = await this.mailService.sendMail({
      to: dto.to,
      subject: `[Zinc PR][TEST] Pending Preview ${date}`,
      html: `<p>Pending Zinc PR preview for ${this.escapeHtml(date)}.</p>
        <p>Records: ${payload.length}; excluded takeout numbers: ${invalidTakeoutsForEmail.length}.</p>
        <p>This is a preview only. No Zinc PR records were inserted and no takeout status was updated.</p>`,
      attachments: [{ filename, content: attachment }],
    });

    if (result?.rejected?.length) {
      throw new Error(`SMTP rejected: ${result.rejected.join(', ')}`);
    }

    return {
      status: true,
      message: 'Zinc PR pending preview email sent',
      data: {
        date,
        pendingRecords: payload.length,
        excludedTakeouts: invalidTakeoutsForEmail.length,
        recipients: dto.to,
      },
    };
  }

  async submitPending() {
    const { payload, invalidTakeoutsForEmail } = await this.buildPendingResult();
    const invalidTakeoutsEmailStatus = await this.sendInvalidTakeoutsEmail(
      invalidTakeoutsForEmail,
    );

    if (payload.length === 0) {
      return {
        status: true,
        message: 'No pending Zinc PR records',
        data: {
          insertedT002: 0,
          insertedT003: 0,
          updatedTakeoutNos: [],
          invalidTakeoutsForEmail,
          invalidTakeoutsEmailStatus,
        },
      };
    }

    const takeoutNos = Array.from(
      new Set(payload.flatMap((row) => row.TDETAIL_TAKEOUTNOS)),
    );
    const inserted = await this.zincPrAs400Repository.insertPending(payload);
    await this.zincPrRepository.markSubmitted(takeoutNos);

    return {
      status: true,
      message: 'Zinc PR records submitted successfully',
      data: {
        ...inserted,
        updatedTakeoutNos: takeoutNos,
        invalidTakeoutsForEmail,
        invalidTakeoutsEmailStatus,
      },
    };
  }
}
