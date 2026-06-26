import { Injectable } from '@nestjs/common';
import { CreateVpDto } from './dto/create-vp.dto';
import { UpdateVpDto } from './dto/update-vp.dto';
import { VpsRepository } from './vps.repository';

@Injectable()
export class VpsService {
    constructor(private readonly vpsRepository: VpsRepository) {}

    async chkPrint(order: string, packing: string): Promise<boolean> {
        return await this.vpsRepository.chkPrint(order, packing);
    }

    async getDetailPIS(packing: string): Promise<any[]> {
        return await this.vpsRepository.getDetailPIS(packing);
    }

    async insertPrintVPS(
        order: string,
        packing: string,
        qtyPrint: number,
        empno: string,
        ip: string,
    ): Promise<void> {
        const vpsDetail = await this.vpsRepository.getVPSDetail(order, packing);
        const produciton = vpsDetail[0].S01M09;
        const p = vpsDetail[0].M8K02;
        const item = vpsDetail[0].S01M06;
        const partname = vpsDetail[0].S01M05;
        const project = vpsDetail[0].S01M08;
        const sche = vpsDetail[0].SCHEDULE;
        const formattedSche = `${sche.substr(4, 2)}${sche.substr(6)}${sche.substr(2, 2)}`;
        const piscode = `${order.substr(1, order.length - 2)}${packing}`;
        const subPacking = `${packing.substr(0, 3)}-${packing.substr(3, 5)}`;
        const now = new Date();

        // เช็คข้อมูลซ้ำทั้งหมดก่อน insert
        const [chkOrder, chkItemMas, chkItemQty, chkPISinfo] =
            await Promise.all([
                this.vpsRepository.chkOrder(order, packing),
                this.vpsRepository.chkItemMas(order, packing),
                this.vpsRepository.chkItemQty(order, packing),
                this.vpsRepository.chkPISinfo(order, subPacking),
            ]);

        console.log('chkOrder:', chkOrder);
        console.log('chkItemMas:', chkItemMas);
        console.log('chkItemQty:', chkItemQty);
        console.log('chkPISinfo:', chkPISinfo);
        // return;

        await this.vpsRepository.insertPrintlogVps({
            orderNo: order,
            packingNo: packing,
            qty: qtyPrint,
            ip,
            users: empno,
        });

        // insert PRINT_HISTORY (เกิดทุกครั้งที่กดพิมพ์ ไม่เช็คซ้ำ)
        await this.vpsRepository.insertPrintHistory({
            orderNo: order,
            packingNo: packing,
            quantity: qtyPrint,
            users: empno,
        });
        

        // ถ้ายังไม่มี order ใน PACKORDDTL -> เรียก stored proc สร้างให้
        if (!chkOrder) {
            await this.vpsRepository.insPackorddtlByManual(order, packing);
        }else{
            await this.vpsRepository.updatePrintStatus(order, packing);
        }

        // // update printsta พร้อม retry กัน deadlock
        // await this.executeWithRetry(() =>
        //     this.vpsRepository.updatePrintStatus(order, packing),
        // );

        // insert ItemMas ถ้ายังไม่มี
        if (!chkItemMas) {
            await this.vpsRepository.insertItemMas({
                production: produciton,
                p,
                orderno: order,
                seq: '0',
                item,
                partname,
                packshop: 'PC',
                projectno: project,
                schedl: formattedSche,
                packno: packing,
                piscode,
                updteusr: empno,
                updte: now,
            });
        }

        // insert ItemQty ถ้ายังไม่มี
        if (!chkItemQty) {
            await this.vpsRepository.insertItemQty({
                ordrno: order,
                itemno: packing,
                packshop: 'PC',
                qty: qtyPrint,
                ncopy: '1',
                printfg: '1',
                printtype: '0',
                autoprint: '0',
                upuser: empno,
                updte: now,
            });
        }

        // insert PISInfo + VPSInfo วนตามจำนวน qtyPrint ถ้ายังไม่มี PISInfo
        if (!chkPISinfo) {
            for (let i = 1; i <= qtyPrint; i++) {
                const seq = String(i).padStart(4, '0');
                const pis = `${piscode}-${seq}`;

                await this.vpsRepository.insertPISInfo({
                    production: produciton,
                    p,
                    orderno: order,
                    seq: '0',
                    item: subPacking,
                    pis,
                    partname,
                    packshop: 'PC',
                    projectno: project,
                    schedl: formattedSche,
                    itemseq: i,
                    qty: qtyPrint,
                    ncopy: '1',
                    printflg: '0',
                    rdel: '0',
                    upduser: empno,
                    upddate: now,
                    trndata: '0',
                    itemtype: '0',
                    printtype: '0',
                });

                await this.vpsRepository.insertVPSInfo({
                    orderno: order,
                    item: packing,
                    itemseq: i,
                    qty: qtyPrint,
                    pis,
                    ncopy: '1',
                    rdel: '0',
                    itemtype: '0',
                    printtype: '0',
                    printdate: now,
                });
            }
        }

        // insert ItemQtyHistory ปิดท้ายเสมอ
        await this.vpsRepository.insertItemQtyHistory({
            pis: piscode,
            qty: qtyPrint,
            ncopy: '1',
            currnt: '1',
            upuser: empno,
            updte: now,
        });
    }

    async getVPSDetail(order: string, packing: string) {
        return await this.vpsRepository.getVPSDetail(order, packing);
    }
}
