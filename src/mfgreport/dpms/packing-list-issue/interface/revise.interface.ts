import { AttachmentDto } from 'src/common/services/mail/dto/attachment.dto';
import { IlogMessage } from 'src/common/utils/transform';
import { IListFilePath } from './issue.interface';



export interface IReviseParams {
    revid: number;
    poid: number;
    order: string;
    logMessage?: IlogMessage[];
    issueDate: string;
    newShippingMark?: string;
}

export interface IReviseResult {
    status: boolean;
    message: string;
    attachments?: AttachmentDto[];
    listFilePath?: IListFilePath[];
    logMessage?: IlogMessage[];
}
