import { Injectable } from '@nestjs/common';
import { CreateFinDDto, CreateFinDFormdto } from './dto/create-fin-d.dto';
import { UpdateFinDDto } from './dto/update-fin-d.dto';
import { FinDsRepository } from './fin-ds.repository';

import { FormmstService } from 'src/webform/formmst/formmst.service';
import { FormCreateService } from 'src/webform/form/create-form.service';

@Injectable()
export class FinDsService {
    constructor(private readonly repo: FinDsRepository,
                private readonly FormmstService: FormmstService,
                private readonly FormCreateService: FormCreateService

    ) {}

    findAll() {
        return this.repo.findall();
    }
    // create(createFinDDto: CreateFinDFormdto,files:Express.Multer.File[]) {

    async create(
        createFinDDto: CreateFinDFormdto,
        files: Express.Multer.File[],
        ip: string,
    ) {
        try {

            console.log('dto', createFinDDto);
            
            const formmst = await this.FormmstService.getFormMasterByVaname('FIN-DS'); 
            console.log('form master', formmst);
            

             const createForm = await this.FormCreateService.create(
                {
                    NFRMNO: formmst.NNO,
                    VORGNO: formmst.VORGNO,
                    CYEAR: formmst.CYEAR,
                    REQBY: createFinDDto.REQBY,
                    INPUTBY: createFinDDto.INPUTBY,
                    REMARK: createFinDDto.REMARK,

                },
                ip,
            );

            
            console.log(createForm);
            
            const form = {
                 NFRMNO: createForm.data.NFRMNO,
                VORGNO: createForm.data.VORGNO,
                CYEAR:  createForm.data.CYEAR,
                CYEAR2: createForm.data.CYEAR, // x
                NRUNNO: createForm.data.NRUNNO, // x
            };

            const head = await this.repo.createHead({
                ...form,
                OPTION_CODE: createFinDDto.OPTION_CODE,
                EFFECTIVE_DATE: createFinDDto.EFFECTIVE_DATE,
                DATE_RECEIVE: createFinDDto.DATE_RECEIVE,
                LOCATION: createFinDDto.LOCATION,
            });
            console.log('Created head:', head);

            for (const DetailDATA of createFinDDto.DATA) {

                
                console.log('DetailDATA', DetailDATA);
                const detail = await this.repo.createdetail({
                    ...form,
                    LINEID: DetailDATA.LINE_ID,
                    REASON: DetailDATA.REASON,
                    DUTY_VALUE: DetailDATA.AMT,
                    QTY: DetailDATA.QTY,
                    
                });
                console.log('detail', detail);
                
                
            }

                //     for (const DetailDATA of createFinDDto.DATA) {
                //     console.log('DetailDATA', DetailDATA);
                //     const detail = await this.repo.createdetail({
                //         ...form,
                //         LINEID: DetailDATA.LINE_ID,
                //         REASON: DetailDATA.REASON,
                //         DUTY_VALUE: DetailDATA.AMT,
                //         QTY: DetailDATA.QTY,
                //     });
                //     console.log('Created Detail Data:', detail);
                // }
                            

            // const object = {
            //         ...form,
            //         LINEID: DetailDATA.LINE_ID,
            //         REASON: DetailDATA.REASON,
            //         DUTY_VALUE: DetailDATA.AMT,
            //         QTY: DetailDATA.QTY,
            //     }

            //     const array = [
            //         {
            //         ...form,
            //         LINEID: DetailDATA.LINE_ID,
            //         REASON: DetailDATA.REASON,
            //         DUTY_VALUE: DetailDATA.AMT,
            //         QTY: DetailDATA.QTY,
            //     },
            //     {
            //         ...form,
            //         LINEID: DetailDATA.LINE_ID,
            //         REASON: DetailDATA.REASON,
            //         DUTY_VALUE: DetailDATA.AMT,
            //         QTY: DetailDATA.QTY,
            //     }
            //     ]

            //     array[0].QTY

                


            // throw new Error('test');
                // });
        } catch (error) {
            console.error('Error creating FinD form:', error);
            throw error; // Rethrow the error to be handled by the controller or global exception filter
        }

        // findOne(id: number) {
        //   return `This action returns a #${id} finD`;
        // }

        // update(id: number, updateFinDDto: UpdateFinDDto) {
        //   return `This action updates a #${id} finD`;
        // }

        // remove(id: number) {
        //   return `This action removes a #${id} finD`;
        // }
    }
}
