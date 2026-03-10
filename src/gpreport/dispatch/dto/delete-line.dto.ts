import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteLineDto {
   @IsNotEmpty()
    @IsString()
    dispatch_id: string;
  
    @IsNotEmpty()
    @IsString()
    busid : string;
  
    @IsString()
    update_by: string;
}


