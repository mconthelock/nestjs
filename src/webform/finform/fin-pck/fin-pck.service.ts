import { Injectable } from '@nestjs/common';
// import { FinpckFormRepository } from './finpck_form/finpck_form.repository';
// import { FinpckAssetRepository } from './finpck_asset/finpck_asset.repository';
import { FinpckFormService } from './finpck_form/finpck_form.service';
import { FinpckAssetService } from './finpck_asset/finpck_asset.service';
import { FormService } from 'src/webform/form/form.service';
import { FlowService } from 'src/webform/flow/flow.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { RepService } from 'src/webform/rep/rep.service';
import { DeleteFlowStepService } from 'src/webform/flow/delete-flow-step.service';
import { InsertFlowStepService } from 'src/webform/flow/insert-flow-step.service';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { UsersService } from 'src/amec/users/users.service';
import { PappflowService } from 'src/amec/pappflow/pappflow.service';
import { RequestFinpckFormDto } from './dto/request-fin-pck.dto';
import { UpdateFinPckDto } from './dto/update-fin-pck.dto';
import { In } from 'typeorm';
import { OrgTreeService } from 'src/webform/org-tree/org-tree.service';
import { log } from 'console';


@Injectable()
export class FinPckService {
  constructor(
        // private readonly formRepo: FinpckFormRepository,
        // private readonly assetRepo: FinpckAssetRepository,
         private readonly formpckService: FinpckFormService,
         private readonly assetService: FinpckAssetService,
         protected readonly formService: FormService ,
         protected readonly flowService: FlowService,
         protected readonly formmstService: FormmstService,
         protected readonly repService: RepService,
         protected readonly deleteFlowStepService: DeleteFlowStepService,
         protected readonly insertFlowStepService: InsertFlowStepService,
         private readonly formCreateService: FormCreateService,
         private readonly usrService: UsersService,
         private readonly pappFlowService: PappflowService,
         private readonly orgtree:OrgTreeService
     ) {}
   
     async request(
         dto: RequestFinpckFormDto,
         ip: string,
     ) {
         try {
             const { formData, groupedData } = dto;

             const { REQBY, INPUTBY, REMARK, ...data } = formData;

             const FormResults = [];

            for(const [index,group] of groupedData.entries())
            {
                    // 1. สร้าง Form ก่อน
                    const createForm = await this.formCreateService.create(
                        {
                            NFRMNO: data.NFRMNO,
                            VORGNO: data.VORGNO,
                            CYEAR:  data.CYEAR,
                            REQBY:  REQBY,
                            INPUTBY: INPUTBY,
                            REMARK: REMARK,
                        },
                        ip,
                    );
                    if (!createForm.status) {
                        throw new Error(createForm.message.message);
                    }
                    // create form success
                    const currentForm = {
                        NFRMNO: data.NFRMNO,
                        VORGNO: data.VORGNO,
                        CYEAR: data.CYEAR,
                        CYEAR2: createForm.data.CYEAR2,
                        NRUNNO: createForm.data.NRUNNO,
                    };
                    const finpckForm = {
                        ...currentForm,
                        CCCODE:  group.CCCODE,
                        CCDESC:  group.CCDESC,
                        LOCCODE: group.LOCCODE,
                        LOCNAME: group.LOCNAME,
                    };
                    await this.formpckService.create(finpckForm);
                    await this.assetService.createMultipleAssets(currentForm,group.ASSETS);
                    if (group.INC && String(group.INC).trim() !== '')
                    {
                        let repinc = await this.repService.getRepresent({NFRMNO: data.NFRMNO,
                        VORGNO: data.VORGNO,
                        CYEAR: data.CYEAR,
                        VEMPNO: group.INC});
                        const sposCode =  Number(group.SPOSCODE);
                        await this.flowService.updateFlow({
                             condition: {
                                ...currentForm,
                                 CEXTDATA: '01'
                             },
                                 VAPVNO: group.INC,
                                 VREPNO: repinc,
                        });
                        if(sposCode == 30)
                        {
                            await this.flowService.updateFlow({
                                condition: {
                                    ...currentForm,
                                    CEXTDATA: '03'
                                },
                                    VAPVNO: group.INC,
                                    VREPNO: repinc,
                            });
                           const orgtree = await this.orgtree.getOrgTree(group.INCVORGNO , '21' , group.INC, '30' );
                           if(orgtree && orgtree.length > 0)
                           {
                                repinc = await this.repService.getRepresent({NFRMNO: data.NFRMNO,
                                VORGNO: data.VORGNO,
                                CYEAR: data.CYEAR,
                                VEMPNO: orgtree[0].VEMPNO});
                                await this.flowService.updateFlow({
                                condition: {
                                    ...currentForm,
                                    CEXTDATA: '04'
                                },
                                    VAPVNO: orgtree[0].VEMPNO,
                                    VREPNO: repinc,
                            });
                           }else{
                               await this.deleteFlowStepService.deleteFlowStep({...currentForm,CSTEPNO:'13' });
                           }
                           const orgtree1 = await this.orgtree.getOrgTree(group.INCVORGNO , '20' , group.INC, '30' );
                           if(orgtree1 && orgtree1.length > 0)
                           {
                                repinc = await this.repService.getRepresent({NFRMNO: data.NFRMNO,
                                VORGNO: data.VORGNO,
                                CYEAR: data.CYEAR,
                                VEMPNO: orgtree1[0].VEMPNO});
                                await this.flowService.updateFlow({
                                condition: {
                                    ...currentForm,
                                    CEXTDATA: '05'
                                },
                                    VAPVNO: orgtree1[0].VEMPNO,
                                    VREPNO: repinc,
                            });
                           }
                        }else if(sposCode == 21)
                        {
                            //delete step Form SEM
                            await this.deleteFlowStepService.deleteFlowStep({...currentForm,CSTEPNO:'10' });
                            await this.flowService.updateFlow({
                                condition: {
                                    ...currentForm,
                                    CEXTDATA: '04'
                                },
                                    VAPVNO: group.INC,
                                    VREPNO: repinc,
                            });
                          const orgtree = await this.orgtree.getOrgTree(group.INCVORGNO , '20' , group.INC, '21' );
                           if(orgtree && orgtree.length > 0)
                           {
                                repinc = await this.repService.getRepresent({NFRMNO: data.NFRMNO,
                                VORGNO: data.VORGNO,
                                CYEAR: data.CYEAR,
                                VEMPNO: orgtree[0].VEMPNO});
                                await this.flowService.updateFlow({
                                condition: {
                                    ...currentForm,
                                    CEXTDATA: '05'
                                },
                                    VAPVNO: orgtree[0].VEMPNO,
                                    VREPNO: repinc,
                            });
                           }

                        }else if(sposCode <= 20)
                        {
                            //delete step Form SEM
                            await this.deleteFlowStepService.deleteFlowStep({...currentForm,CSTEPNO:'10' });
                            //delete step Form DDEM
                            await this.deleteFlowStepService.deleteFlowStep({...currentForm,CSTEPNO:'13' });
                            await this.flowService.updateFlow({
                                condition: {
                                    ...currentForm,
                                    CEXTDATA: '05'
                                },
                                    VAPVNO: group.INC,
                                    VREPNO: repinc,
                            });

                        }
                    }
                    FormResults.push(currentForm);

            }
             return {
                 status: true,
                 message: 'Request successful',
                 createdForms:FormResults
             };
         } catch (error) {
      
             throw new Error('Request FIN-PCK Form Error: ' + error.message);
         }
     }
 


  findAll() {
    return `This action returns all finPck`;
  }

  findOne(id: number) {
    return `This action returns a #${id} finPck`;
  }

  update(id: number, updateFinPckDto: UpdateFinPckDto) {
    return `This action updates a #${id} finPck`;
  }

  remove(id: number) {
    return `This action removes a #${id} finPck`;
  }
}
