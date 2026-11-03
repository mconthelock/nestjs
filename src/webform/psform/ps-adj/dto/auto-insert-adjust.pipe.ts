import {
    BadRequestException,
    Injectable,
    PipeTransform,
    ValidationPipe,
} from '@nestjs/common';
import { AutoInsertAdjustDto } from './auto-insert-adjust.dto';

@Injectable()
export class AutoInsertAdjustPipe implements PipeTransform {
    private readonly validation = new ValidationPipe({
        transform: true,
        whitelist: true,
    });

    async transform(
        value: unknown,
    ): Promise<AutoInsertAdjustDto | AutoInsertAdjustDto[]> {
        const batch = Array.isArray(value);
        const items = batch ? value : [value];
        if (!items.length)
            throw new BadRequestException('Request array must not be empty');
        const result: AutoInsertAdjustDto[] = [];
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            if (!item || typeof item !== 'object' || Array.isArray(item)) {
                throw new BadRequestException({
                    message: 'Each item must be an object',
                    index,
                });
            }
            try {
                result.push(
                    await this.validation.transform(item, {
                        type: 'body',
                        metatype: AutoInsertAdjustDto,
                    }),
                );
            } catch (error) {
                throw new BadRequestException({
                    message: 'Invalid adjust item',
                    index,
                    details: error.getResponse?.(),
                });
            }
        }
        return batch ? result : result[0];
    }
}
