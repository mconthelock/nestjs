import { Injectable } from '@nestjs/common';
import { KanbanRequestRepository } from './kanban_request.repository';
import { CreateKanbanRequestDto } from './dto/create-kanban_request.dto';
import { MailService } from 'src/common/services/mail/mail.service';
import { Psection } from 'src/amec/psection/entities/psection.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KanbanRequestService {
    constructor(
        private readonly kanbanRequestRepository: KanbanRequestRepository,
        private readonly mailService: MailService,
        @InjectRepository(Psection, 'amecConnection')
        private sectionRepo: Repository<Psection>,
    ) {}

    async getPKC_Product() {
        return this.kanbanRequestRepository.getPKC_Product();
    }

    async getProdGroup(itemcode: string) {
        return this.kanbanRequestRepository.getProdGroup(itemcode);
    }

    async insertIssueKanban(dto: CreateKanbanRequestDto) {
        const { EMPNO, REQ_SECTION, STATUS, DETAIL } = dto;
        const head = await this.kanbanRequestRepository.insertIssueKanban([
            {
                REQ_SECTION,
                REQ_BY: EMPNO,
                STATUS,
                PRODUCT_CAT: dto.PRODUCT_CAT,
            },
        ]);

        const detailRecords = DETAIL.map((item) => ({
            IK_ID: head,
            ITEM_CODE: item.ITEM_CODE,
            QTY_REQ: item.QTY_REQ,
            QTY_PR: item.QTY_REQ,
            REMARK: item.REMARK,
        }));
        await this.kanbanRequestRepository.insertIssueKanbanDetail(
            detailRecords,
        );

        const date = new Date();
        const issueDate = this.formatDate(date);

        // ✅ ใช้ Promise.all เพื่อ resolve array ของ promise ก่อนส่งเข้า mailContext
        const items = await Promise.all(
            DETAIL.map(async (item) => {
                const productDetail = await this.getProductDetail(
                    item.ITEM_CODE,
                );
                return {
                    itemCode: item.ITEM_CODE,
                    itemName: productDetail[0]?.SEPRODNAME ?? '',
                    quantity: item.QTY_REQ,
                    issueDate,
                };
            }),
        );

        const section = await this.sectionRepo.findOne({
            where: { SSECCODE: REQ_SECTION },
            order: {
                SSECCODE: 'ASC',
            },
        });

        const mailContext = {
            department: section?.SSEC ?? '',
            items,
        };

        await this.mailService.sendMail({
            from: `PC Section<${process.env.MAIL_FROM}>`,
            to: ['chanida@mitsubishielevatorasia.co.th','benjamad@MitsubishiElevatorAsia.co.th'],
            subject: `Order carton box issue ${issueDate}`,
            template: 'mfgmonitor/kanban_request/issue-kanban',
            context: mailContext,
            bcc: 'perapatr@mitsubishielevatorasia.co.th'
        });

        return { message: 'Insert Issue Kanban success', IK_ID: head };
    }

    private formatDate(d: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    }

    async getProductDetail(itemcode: string) {
        return this.kanbanRequestRepository.getProductDetail(itemcode);
    }
}
