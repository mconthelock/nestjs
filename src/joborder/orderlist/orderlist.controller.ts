import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderListService } from './orderlist.service';
import { SearchOrderListDto } from './dto/search-orderlist.dto';
import { SetRequestDateService } from '../set-request-date/set-request-date.service';
import { numberToAlphabetRevision } from 'src/utils/format';
import pLimit from 'p-limit';

// @UseGuards(AuthGuard('jwt')) // ต้อง login เพื่อได้ cookie ถึงจะมีสิทธิ์เรียกใช้  ถ้าไม่ใช้ @UseGuards จะไม่ต้อง login ก็ได้ แต่จะไม่มีการตรวจสอบสิทธิ์
@Controller('joborder')
export class OrderListController {
  constructor(
    private readonly OrderListService: OrderListService,
    private readonly setRequestDateService: SetRequestDateService,
  ) {}

  @Post('orderlist')
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async orderlist(@Body() dto: SearchOrderListDto) {
    // dto จะเก็บค่าที่ client post มา (body) เช่น { PRNO: "41250732", "MFGNO" : "EXIO18012" }
    return this.OrderListService.orderlist(dto);
  }

  @Post('orderlistNew')
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async orderlistNew(@Body() dto: SearchOrderListDto) {
    // dto จะเก็บค่าที่ client post มา (body) เช่น { PRNO: "41250732", "MFGNO" : "EXIO18012" }
    const orderList = await this.OrderListService.orderlistNew(dto);
    return orderList;
    // ----------------- 1 parallel
    // const limit = pLimit(5); // ควบคุมให้รันพร้อมกันไม่เกิน 5
    // const list = await Promise.all(orderList.map(l =>
    //     limit(async () => {
    //         l.REVISION = [];
    //         if (l.JOP_MFGNO != null) {
    //         const revision = await this.setRequestDateService.getRevisionHistory(
    //             l.JOP_MFGNO, l.JOP_PONO, l.JOP_LINENO
    //         );
    //         l.REVISION = revision.map(r => {
    //             r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
    //             return r;
    //         });
    //         }
    //         return l;
    //     })
    // ));
    // return list;
    // ----------------- 2
    // const list = await Promise.all(orderList.map(async l => {
    //     l.REVISION = [];
    //     if (l.JOP_MFGNO != null) {
    //         const revision = await this.setRequestDateService.getRevisionHistory(l.JOP_MFGNO, l.JOP_PONO, l.JOP_LINENO);
    //         l.REVISION = revision.map(r => {
    //             r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
    //             return r;
    //         });
    //     }
    //     return l;
    // }));
    // return list;
    // ----------------- 3
    // for (const l of orderList) {
    //     l.REVISION = [];
    //     if (l.JOP_MFGNO != null) {
    //         const revision = await this.setRequestDateService.getRevisionHistory(l.JOP_MFGNO, l.JOP_PONO, l.JOP_LINENO);
    //         l.REVISION = revision.map(r => {
    //             r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
    //             return r;
    //         });
    //     }
    // }
    // return orderList;
    const list = await this.getRevisionHistory(orderList);
    return list;
  }

  // ถ้า client ส่ง search, limit, page มา จะต้องมีการจัดการ pagination และ search
  @Post('orderlistByPage')
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async orderlistByPage(@Body() dto: SearchOrderListDto) {
    return this.OrderListService.orderlistByPage(dto);
  }

  @Post('orderlist/confirm')
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async confirm(@Body() dto: SearchOrderListDto) {
    // return this.OrderListService.confirm(dto);
    const orderList = await this.OrderListService.confirm(dto);
    return orderList;
    const list = await this.getRevisionHistory(orderList);
    return list;
  }

  @Post('orderlist/shipment')
  @HttpCode(200) // ตั้งค่าให้ response เป็น 200 OK แทนที่จะเป็น 201 Created
  async shipment(@Body() dto: SearchOrderListDto) {
    // return this.OrderListService.shipment(dto);
    const orderList = await this.OrderListService.shipment(dto);
    return orderList;
    const list = await this.getRevisionHistory(orderList);
    return list;
  }

  // Task หนัก: Loop ใหญ่ที่ block Event Loop
  @Get('heavy')
  async heavyTask() {
    const start = Date.now();
    let sum = 0;

    // วน loop ไปเรื่อย ๆ จนกว่าจะครบ 10 วินาที
    while (Date.now() - start < 10_000) {
      for (let i = 0; i < 1e5; i++) {
        sum += i;
      }
    }
  }

  // If you want to use this as a class method, define it like this:
  // Note: If you need to use 'await', make it async and type the parameter properly.
  // Example usage: await this.getRevisionHistory(list);

  async getRevisionHistory(list: any[]): Promise<any[]> {
    for (const l of list) {
      // console.log(l.JOP_MFGNO);
      // l.REVISION = [];
      if (l.JOP_MFGNO) {
        const revision = await this.setRequestDateService.getRevisionHistory(
          l.JOP_MFGNO,
          l.JOP_PONO,
          l.JOP_LINENO,
        );
        l.REVISION = revision.map((r) => {
          r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
          return r;
        });
      }
    }
    return list;
  }
}
