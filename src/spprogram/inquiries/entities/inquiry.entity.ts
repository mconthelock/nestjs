import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Inquiry {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
