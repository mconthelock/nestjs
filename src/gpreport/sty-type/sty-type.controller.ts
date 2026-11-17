import { Controller, Get, Param } from '@nestjs/common';
import { StyTypeService } from './sty-type.service';

@Controller('gpreport/sty-type')
export class StyTypeController {
    constructor(private readonly styTypeService: StyTypeService) {}

    @Get('findByTypeCode/:typecode')
    findByTypeCode(@Param('typecode') typecode: string) {
        return this.styTypeService.findByTypeCode(typecode);
    }

    @Get('class')
    getClass() {
        return this.styTypeService.findByTypeCode('PTC');
    }

    @Get('chemical/class')
    getChemicalClass() {
        return this.styTypeService.findByTypeCode('CMC');
    }

    /**
     * @api {get} /gpreport/sty-type/findOneByCode/:code Find one by code
     * @apiName FindOneByCode
     * @apiGroup StyType
     * @apiParam {String} code Type code
     * @apiSuccess {Boolean} status Status of the response
     * @apiSuccess {String} message Response message
     * @apiSuccess {Object} data Type data
     */
    @Get('findOneByCode/:code')
    findOneByCode(@Param('code') code: string) {
        return this.styTypeService.findOneByCode(code);
    }
}
