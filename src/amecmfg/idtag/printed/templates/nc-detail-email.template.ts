type NcDetailEmailTemplateParams = {
    reportDate: string;
    recipientName?: string;
};

export const buildNcDetailEmailTemplate = (
    params: NcDetailEmailTemplateParams,
): string => {
    const { reportDate, recipientName = 'ทีมงานที่เกี่ยวข้อง' } = params;

    return `
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NC Detail Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding: 24px 12px; background-color: #f4f7fb;">
        <tr>
            <td align="center">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 640px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #0c4a6e, #075985); padding: 24px 28px; color: #ffffff;">
                            <div style="font-size: 12px; letter-spacing: 0.08em; opacity: 0.9; text-transform: uppercase;">Automatic Notification</div>
                            <h1 style="margin: 8px 0 0; font-size: 22px; font-weight: 700;">NC Detail Report</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 28px; line-height: 1.65; font-size: 15px;">
                            <p style="margin: 0 0 12px;">เรียน ${recipientName},</p>
                            <p style="margin: 0 0 12px;">ระบบได้จัดเตรียมรายงาน <strong>NC Detail</strong> ประจำวันที่ <strong>${reportDate}</strong> เรียบร้อยแล้ว</p>
                            <p style="margin: 0 0 20px;">กรุณาตรวจสอบไฟล์แนบในอีเมลฉบับนี้เพื่อดูรายละเอียดเพิ่มเติม</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px;">
                                <tr>
                                    <td style="padding: 14px 16px; font-size: 14px; color: #1e3a8a;">
                                        ชื่อรายงาน: NC Detail Report<br />
                                        วันที่รายงาน: ${reportDate}
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 20px 0 0;">Best regards,<br />
                            ID Tag Auto Report System</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 14px 28px; font-size: 12px; color: #64748b; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                            This is an automated email. Please do not reply.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};
