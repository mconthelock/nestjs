import { Injectable } from '@nestjs/common';
import { now } from 'src/common/utils/dayjs.utils';
import { joinPaths } from 'src/common/utils/files.utils';
import { log_message, IlogMessage } from 'src/common/utils/transform';
import { COUNTRY_ORIGIN_NOT_SET_VIEW } from 'src/common/Entities/workload/views/COUNTRY_ORIGIN_NOT_SET_VIEW.entity';
import { MailService } from 'src/common/services/mail/mail.service';
import { CountryOriginNotSetViewService } from 'src/workload/country_origin_not_set_view/country_origin_not_set_view.service';
import XlsxPopulate from 'xlsx-populate';

@Injectable()
export class MailAlertPurService {
    constructor(
        private readonly originNotSetService: CountryOriginNotSetViewService,
        private readonly mailService: MailService,
    ) {}

    async main() {
        const logMessage: IlogMessage[] = [log_message('Job started')];
        const runDate = now('YYYY-MM-DD HH:mm:ss');
        let subject: string = `Job Origin Not Set Alert [${process.env.STATE}] - ${runDate}`;
        try {
            const notSetOrigins = await this.originNotSetService.findAll();
            if (notSetOrigins.status) {
                logMessage.push(
                    log_message(
                        `Found ${notSetOrigins.data.length} origins not set`,
                    ),
                );
                // group by planner
                const data = notSetOrigins.data;
                const groupedByPlanner = data.reduce((acc, item) => {
                    if (!acc[item.PLANNER]) {
                        acc[item.PLANNER] = [];
                    }
                    acc[item.PLANNER].push(item);
                    return acc;
                }, {});
                const templatePath = await joinPaths(
                    process.env.AMEC_FILE_PATH,
                    process.env.STATE,
                    'procurement',
                    'template',
                    'country-origin-template.xlsx',
                );
                logMessage.push(
                    log_message(`Using template path: ${templatePath}`),
                );
                for (const planner in groupedByPlanner) {
                    const lists: COUNTRY_ORIGIN_NOT_SET_VIEW[] =
                        groupedByPlanner[planner];
                    const purcode: string[][] = lists.map((item) => [
                        item.PURCODE,
                    ]);
                    const purNames: string = [
                        ...new Set(lists.map((item) => item.PLANNERNAME)),
                    ].join(', ');
                    const purEmails: string =
                        process.env.STATE == 'production'
                            ? [
                                  ...new Set(
                                      lists.map((item) => item.SRECMAIL),
                                  ),
                              ].join(',')
                            : process.env.MAIL_ADMIN;
                    logMessage.push(
                        log_message(
                            `Emails for planner ${planner}: ${purEmails}`,
                        ),
                        log_message(
                            `planner ${planner}: ${lists.length} origins not set`,
                        ),
                    );
                    const workbook: XlsxPopulate.Workbook =
                        await XlsxPopulate.fromFileAsync(templatePath);
                    const sheet: XlsxPopulate.Sheet = workbook.sheet(0);
                    sheet.cell('A2').value(purcode);
                    const buffer: Buffer = await workbook.outputAsync();
                    await this.mailService.sendMail({
                        to: purEmails,
                        from: `PROCUREMENT System<${process.env.MAIL_FROM}>`,
                        subject: `Action Required: Country of Origin Not Set - ${runDate}`,
                        template: 'procurement/country-origin-not-set',
                        context: {
                            to: purNames,
                        },
                        attachments: [
                            {
                                filename: 'country-origin.xlsx',
                                content: buffer,
                            },
                        ],
                    });
                    logMessage.push(
                        log_message(
                            `----------------------------------------------`,
                        ),
                    );
                }
                return {
                    status: true,
                    message: `Job completed successfully ${notSetOrigins.data.length} records`,
                    data: groupedByPlanner,
                };
            }
            return {
                status: true,
                message: notSetOrigins.message,
            };
        } catch (error) {
            subject = 'ERROR: ' + subject;
            logMessage.push(log_message(`Error: ${error.message}`, 'error'));
            throw error;
        } finally {
            logMessage.push(log_message('Job finished'));
            await this.mailService.sendMail({
                to: process.env.MAIL_ADMIN,
                subject: subject,
                template: 'job-log',
                context: logMessage,
            });
        }
    }
}
