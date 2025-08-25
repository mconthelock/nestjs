import * as nodemailer from 'nodemailer';

export function createMailTransporter(host?: string, port?: string | number) {
  return nodemailer.createTransport({
    host: host || process.env.MAIL_HOST,
    port: port || Number(process.env.MAIL_PORT),
    secure: false, // ปกติ port 25 ไม่ secure
    tls: {
      rejectUnauthorized: false,
    },
  });
}