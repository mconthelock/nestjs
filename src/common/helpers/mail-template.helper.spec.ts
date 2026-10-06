import { renderMailTemplate } from './mail-template.helper';

describe('renderMailTemplate', () => {
    it('renders the reset password email with a clickable token link', async () => {
        const html = await renderMailTemplate('auth/reset-password', {
            recipientName: 'Sutthipong',
            resetLink: 'https://example.com/reset-password?token=abc123',
            expiresAt: '2026-08-15 18:00',
            companyName: 'Mitsubishi Elevator Asia',
        });

        expect(html).toContain('Reset Password');
        expect(html).toContain('https://example.com/reset-password?token');
    });
});
