import { Injectable } from '@nestjs/common';
import { FlowService } from './flow.service';
import { showFlowDto } from './dto/show-flow.dto';
import { FormDto } from '../form/dto/form.dto';
import { checkHostTest } from 'src/common/helpers/repo.helper';
import { getBase64ImageFromUrl } from 'src/common/utils/files.utils';
import { formatDate } from 'src/common/utils/dayjs.utils';
import { FlowRepository } from './flow.repository';
import { RepService } from '../rep/rep.service';
import { FormService } from '../form/form.service';

@Injectable()
export class ShowFlowService extends FlowService {
    constructor(
        protected readonly repService: RepService,
        protected readonly repo: FlowRepository,
        private readonly formService: FormService,
    ){
        super(repService, repo);
    }

    async showFlow(dto: showFlowDto) {
        const form = {
            NFRMNO: dto.NFRMNO,
            VORGNO: dto.VORGNO,
            CYEAR: dto.CYEAR,
            CYEAR2: dto.CYEAR2,
            NRUNNO: dto.NRUNNO,
        };
        const flowData = await this.getFlowTree(form);
        if (flowData.length === 0) {
            throw new Error('Flow data not found');
        }
        const html = await this.generateHtml(flowData, dto);
        return {
            status: true,
            html: html,
            data: flowData,
        };
    }

    async generateHtml(flowData: any, form: showFlowDto) {
        const webflow = checkHostTest(process.env.STATE)
            ? 'http://webflow.mitsubishielevatorasia.co.th/formtest/'
            : 'http://webflow.mitsubishielevatorasia.co.th/form/';
        const status = [
            await getBase64ImageFromUrl(
                webflow + 'imgs/stepstatus/stepdie.gif',
            ),
            '',
            await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/wait.gif'),
            await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/ready.gif'),
            await getBase64ImageFromUrl(
                webflow + 'imgs/stepstatus/approver.gif',
            ),
            await getBase64ImageFromUrl(
                webflow + 'imgs/stepstatus/approve.gif',
            ),
            await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/reject.gif'),
            await getBase64ImageFromUrl(webflow + 'imgs/stepstatus/reject.gif'),
            '',
            await getBase64ImageFromUrl(
                webflow + 'imgs/stepstatus/stepdie.gif',
            ),
            '',
        ];
        const showStep = form.showStep ? '' : 'display:none;';

        let html = `
    <div style="display:flex; overflow:auto;">
        <div style="margin-left:auto; margin-right:auto;">
        <table style="width: 100%; padding:15px; border:solid 1px #000;  margin-left: auto; margin-right: auto; border-collapse: collapse;font-size: 0.8rem;">
            <thead style="background: #aaccee; color: #323232;">
                <th colspan="7" style="text-align:center; padding:5px">Flow</th>
            </thead>
            <tbody style="background: #fffff0; color: #626262;">
            <tr>
                <th style="border: 1px solid blue; padding: 5px 8px;"></th>
                <th style="border: 1px solid blue; padding: 5px 8px; ${showStep}">Step</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Emp-no</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Emp-name</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Date</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Time</th>
                <th style="border: 1px solid blue; padding: 5px 8px;">Remark</th>
            </tr>
    `;

        for (const step of flowData) {
            let apv = '';
            let remark = '';
            if (step.VAPVNO != step.VREPNO) {
                if (step.VREALAPV == step.VAPVNO)
                    apv += `<img style="width:23px; display: inline" src="${status[4]}"/>`;
                apv += `<a href="javascript:var winRem = window.open('${webflow}usrInfo.asp?uid=${step.VAPVNO}', 'user info', 'width=600,height=250'); winRem.focus();">${step.VAPVNO}</a>`;
                apv += ' / ';
                if (step.VREALAPV == step.VREPNO)
                    apv += `<img style="width:23px; display: inline" src="${status[4]}"/>`;
                apv += `<a href="javascript:var winRem = window.open('${webflow}usrInfo.asp?uid=${step.VREPNO}', 'user info', 'width=600,height=250'); winRem.focus();">${step.VREPNO}</a>`;
            } else {
                apv += `<a href="javascript:var winRem = window.open('${webflow}usrInfo.asp?uid=${step.VAPVNO}', 'user info', 'width=600,height=250'); winRem.focus();">${step.VAPVNO}</a>`;
            }

            if (step.VREMARK) {
                remark =
                    '<button type="button" style="background-color:#efefef; padding:3px; border:solid 1px #767676; border-radius:5px; color:#000;"  onclick="javascript:var winRem = window.open(\'' +
                    webflow +
                    'showRem.asp?uid=' +
                    step.VAPVNO +
                    '&no=' +
                    step.NFRMNO +
                    '&orgNo=' +
                    step.VORGNO +
                    '&y=' +
                    step.CYEAR +
                    '&y2=' +
                    step.CYEAR2 +
                    '&runNo=' +
                    step.NRUNNO +
                    '&step=' +
                    step.CSTEPNO +
                    "', 'Remark', 'width=600,height=250'); winRem.focus();\">Remark</button>";
            }

            html += `<tr>
            <td style="border: 1px solid blue;">${status[step.CSTEPST] != '' ? `<img style="width:23px;"  src="${status[step.CSTEPST]}"/>` : ''}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap; ${showStep}">${step.VNAME}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap;text-align: center; color:blue;">${apv}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap;">${step.SNAME}</td>
            <td style="border: 1px solid blue; padding: 5px 8px; white-space: nowrap;">${formatDate(step.DAPVDATE, 'DD-MMM-YY') || ''}</td>
            <td style="border: 1px solid blue; padding: 5px 8px;">${step.CAPVTIME || ''}</td>
            <td style="border: 1px solid blue; padding: 5px 8px;">${remark}</td>
        </tr>`;
        }

        html += `<tr><td colspan="7" style="border: 1px solid blue; padding: 5px 8px;text-align: center; background: #fff;"><b>${await this.getFlowStatusName(form)}</b></td></tr>
            </tbody>
        </table>
        </div>
    </div>
    `;

        return html;
    }

    async getFlowStatusName(form: FormDto) {
        const formcst = await this.formService.getCst(form);
        const status = formcst.CST;
        let html = '';
        const msg = '<font color="#000000">Status: </font>';
        switch (status) {
            case this.FLOW_RUNNING:
                html =
                    msg +
                    '&nbsp;<font color="#' +
                    this.flowStatusColor(status) +
                    '">Running</font>';
                break;
            case this.FLOW_APPROVE:
                html =
                    msg +
                    '&nbsp;<font color="#' +
                    this.flowStatusColor(status) +
                    '">Approve</font>';
                break;
            case this.FLOW_REJECT:
                html =
                    msg +
                    '&nbsp;<font color="#' +
                    this.flowStatusColor(status) +
                    '">Reject</font>';
                break;
            default:
                html =
                    msg +
                    '&nbsp;<font color="#' +
                    this.flowStatusColor(status) +
                    '">Unknown!</font>';
        }

        return html;
    }

    flowStatusColor(status: string) {
        let color = '';
        switch (status) {
            case this.FLOW_RUNNING:
                color = '0000FF';
                break;
            case this.FLOW_REJECT:
                color = 'FF0000';
                break;
            case this.FLOW_APPROVE:
                color = '009900';
                break;
        }
        return color;
    }
}
