import { CreateInquiryInput } from './create-inquiry.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInquiryInput extends PartialType(CreateInquiryInput) {
  @Field(() => Int)
  id: number;
}
