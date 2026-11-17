export interface MailListItem {
    formno: string;
    link: string;
    diffDay: number;
    diffWeek: number;
}

export interface MailList {
    mail: string;
    name: string;
    list: MailListItem[];
}
