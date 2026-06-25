import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsBoolean,
    IsOptional,
    IsArray,
    ValidateIf,
} from 'class-validator';
import {
    AttributeType,
    OptionSource,
} from 'src/common/Entities/pursys/table/CATEGORY_ATTRIBUTES.entity';

export class CreateAttributeDto {
    @IsString()
    @IsNotEmpty({ message: 'กรุณาระบุชื่อ Attribute' })
    ATTNAME: string;

    @IsEnum(AttributeType)
    DATA_TYPE: AttributeType;

    @IsBoolean() // TypeORM Oracle เราใช้ Number(1) แต่ตอนรับจาก API ให้รับเป็น Boolean ตามปกติของ JSON ครับ
    @IsOptional()
    IS_REQUIRED?: boolean;

    @IsEnum(OptionSource)
    @IsOptional()
    OPTION_SOURCE?: OptionSource;

    // บังคับให้ต้องส่ง array มา ถ้า optionSource เป็น FIXED
    @ValidateIf((o) => o.optionSource === OptionSource.FIXED)
    @IsArray({ message: 'ต้องระบุตัวเลือก (fixedOptions) เป็น Array' })
    @IsString({ each: true, message: 'ตัวเลือกต้องเป็นข้อความ' })
    FIXED_OPTIONS?: string[];

    // บังคับให้ส่งชื่อ Function มา ถ้า optionSource เป็น FUNCTION
    @ValidateIf((o) => o.optionSource === OptionSource.FUNCTION)
    @IsString()
    @IsNotEmpty({ message: 'ต้องระบุชื่อ Function' })
    FUNCTION_NAME?: string;
}
