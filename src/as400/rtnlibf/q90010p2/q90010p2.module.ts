import { Module } from '@nestjs/common';
import { Q90010p2Service } from './q90010p2.service';
import { Q90010p2Controller } from './q90010p2.controller';

@Module({
  controllers: [Q90010p2Controller],
  providers: [Q90010p2Service],
})
export class Q90010p2Module {}
