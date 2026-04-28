import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';

export async function renderMailTemplate(
    templateName: string,
    data: Record<string, any> = {},
): Promise<string> {
    const candidates = [
        join(
            process.cwd(),
            'src',
            'common',
            'services',
            'mail',
            'templates',
            `${templateName}.mjml.hbs`,
        ),
        join(
            process.cwd(),
            'dist',
            'src',
            'common',
            'services',
            'mail',
            'templates',
            `${templateName}.mjml.hbs`,
        ),
    ];

    const templatePath = candidates.find((p) => existsSync(p));
    if (!templatePath) {
        throw new Error(`Mail template not found: ${templateName}.mjml.hbs`);
    }

    // console.log('TEMPLATE PATH:', templatePath);
    // console.log('TEMPLATE DATA:', data);
    const source = await readFile(templatePath, 'utf-8');

    // 1) HBS render
    const mjmlMarkup = Handlebars.compile(source, { strict: true })(data);
    // console.log('MJML MARKUP:', mjmlMarkup);

    // 2) MJML -> HTML
    const { html, errors } = await mjml2html(mjmlMarkup, {
        validationLevel: 'soft',
    });

    // console.log('MJML ERRORS:', errors);
    // console.log('HTML OUTPUT:', html);
    if (errors?.length) {
        throw new Error(
            `MJML render error: ${errors.map((e) => e.formattedMessage).join(' | ')}`,
        );
    }

    return html;
}
