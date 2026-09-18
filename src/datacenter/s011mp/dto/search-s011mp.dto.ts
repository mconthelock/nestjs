import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchPackingDto {
    @IsNotEmpty()
    @IsString()
    ORDER: string;
    
    @IsOptional()
    @IsString()
    ITEM?: string;
}

export class SearchPackingItemsDto extends SearchPackingDto {
    @IsNotEmpty()
    @IsString()
    ITEM: string;
}
