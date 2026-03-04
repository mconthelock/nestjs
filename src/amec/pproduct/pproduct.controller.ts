import { Controller, Get, Post, Body, Patch, Param, Delete , Query } from '@nestjs/common';
import { PproductService } from './pproduct.service';
import { CreatePproductDto } from './dto/create-pproduct.dto';
import { UpdatePproductDto } from './dto/update-pproduct.dto';
import { SearchPproductDto } from './dto/search-pproduct.dto';

@Controller('amec/pproduct')
export class PproductController {
  constructor(private readonly pproductService: PproductService) {}

  // @Post()
  // create(@Body() createPproductDto: CreatePproductDto) {
  //   return this.pproductService.create(createPproductDto);
  // }

  @Get('getproduct')
  findAll() {
    return this.pproductService.findAll();
  }

  @Get('getsprodcode/:id')
  findOne(@Param('id') id: string) {
    return this.pproductService.findOne(id);
  }

  // @Get('gsearch')
  // gsearch(@Query('sprodcode') sprodcode?: string , @Query('prodname') prodname?: string) {
  //   return this.pproductService.search(sprodcode,prodname);
  // }

  // @Post('psearch')
  // search(@Body() body: { sprodcode?: string; prodname?: string }) {
  //   return this.pproductService.search(body.sprodcode, body.prodname);
  // }

  @Post('psearch')
  search(@Body() searchDto: SearchPproductDto) {
    //return this.pproductService.search(searchDto);
    return this.pproductService.findVendorByProductCode(searchDto);

  }

  @Post('searchpage')
  searchpg(@Body() searchDto: SearchPproductDto , @Query('page') page: number =1 , @Query('limit') limit: number = 10) {
    //return this.pproductService.search(searchDto);
    return this.pproductService.getProductsPagination(searchDto,page,limit);
  }

  @Post('newproduct')
  create(@Body() craeteDto: CreatePproductDto) {
        return this.pproductService.createproduct(craeteDto);
  }

  @Post('updateproduct')
    update(@Body() updatePproductDto: UpdatePproductDto) {

    return this.pproductService.update(updatePproductDto.SPRODCODE, updatePproductDto);

  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePproductDto: UpdatePproductDto) {
  //   return this.pproductService.update(+id, updatePproductDto);
  // }

  @Post('delete')
  remove(@Body() updatePproductDto: UpdatePproductDto) {
    return this.pproductService.remove(updatePproductDto.SPRODCODE);
  }
}
