import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryInput } from './dto/create-inquiry.input';
import { UpdateInquiryInput } from './dto/update-inquiry.input';

@Resolver(() => Inquiry)
export class InquiriesResolver {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Mutation(() => Inquiry)
  createInquiry(@Args('createInquiryInput') createInquiryInput: CreateInquiryInput) {
    return this.inquiriesService.create(createInquiryInput);
  }

  @Query(() => [Inquiry], { name: 'inquiries' })
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Query(() => Inquiry, { name: 'inquiry' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.inquiriesService.findOne(id);
  }

  @Mutation(() => Inquiry)
  updateInquiry(@Args('updateInquiryInput') updateInquiryInput: UpdateInquiryInput) {
    return this.inquiriesService.update(updateInquiryInput.id, updateInquiryInput);
  }

  @Mutation(() => Inquiry)
  removeInquiry(@Args('id', { type: () => Int }) id: number) {
    return this.inquiriesService.remove(id);
  }
}
