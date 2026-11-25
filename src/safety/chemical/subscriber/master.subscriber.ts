import { STY_CHEMICAL } from 'src/common/Entities/gpreport/table/STY_CHEMICAL.entity';
import { STY_CHEMICAL_REV } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_REV.entity';
import { STY_CHEMICAL_SECTION } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_SECTION.entity';
import {
    alphabetToNumberRevision,
    numberToAlphabetRevision,
} from 'src/common/utils/format.utils';
import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    InsertEvent,
    In,
} from 'typeorm';

@EventSubscriber()
export class MasterSubscriber implements EntitySubscriberInterface<STY_CHEMICAL> {
    listenTo() {
        return STY_CHEMICAL;
    }
    private nextRevision(revision: string): string {
        return numberToAlphabetRevision(alphabetToNumberRevision(revision) + 1);
    }

    async beforeUpdate(event: UpdateEvent<STY_CHEMICAL>) {
        if (event.entity && event.databaseEntity) {
            // ดึงค่าผู้สร้างจาก databaseEntity เพื่อไม่ให้ถูกแก้ไขโดย entity ใหม่
            event.entity.USER_CREATE = event.databaseEntity.USER_CREATE;
            // ตรวจสอบว่ามีการเปลี่ยนแปลงวันที่ได้รับ SDS หรือไม่ หากเปลี่ยน update ทุกแผนกที่ใช้
            const receivedSdsDate = event.entity.RECEIVED_SDS_DATE;
            const databaseReceivedSdsDate =
                event.databaseEntity.RECEIVED_SDS_DATE;
            const databaseRev = event.databaseEntity.REV;

            const receivedSdsDateChanged =
                receivedSdsDate?.getTime() !==
                databaseReceivedSdsDate?.getTime();

            // เพิ่มค่า REV ของสารเคมี ขึ้น 1
            if (!event.entity.REV) {
                event.entity.REV = this.nextRevision(databaseRev);
            }

            // เพิ่มค่า REV ของ Master ขึ้น 1
            const masterRev = await event.manager.findOne(STY_CHEMICAL_REV, {
                where: { OWNERCODE: '999999' },
            });
            await event.manager.update(
                STY_CHEMICAL_REV,
                { OWNERCODE: '999999' },
                { REV: this.nextRevision(masterRev.REV) },
            );

            // เพิ่มค่า REV ของทุกแผนกที่ใช้สารเคมี ขึ้น 1
            const chmSecs = await event.manager.find(STY_CHEMICAL_SECTION, {
                where: { AMEC_SDS_ID: event.databaseEntity.AMEC_SDS_ID },
            });
            if (chmSecs.length > 0) {
                const ownerCodes = chmSecs.map((chmSec) => chmSec.OWNERCODE);
                const sectionRevs = await event.manager.find(STY_CHEMICAL_REV, {
                    where: { OWNERCODE: In(ownerCodes) },
                });
                for (const sectionRev of sectionRevs) {
                    await event.manager.update(
                        STY_CHEMICAL_REV,
                        { OWNERCODE: sectionRev.OWNERCODE },
                        { REV: this.nextRevision(sectionRev.REV) },
                    );
                }
            }

            // อัปเดตวันที่ได้รับ SDS ของทุกแผนกที่ใช้สารเคมี หากมีการเปลี่ยนแปลง
            if (receivedSdsDateChanged) {
                await event.manager.update(
                    STY_CHEMICAL_SECTION,
                    { AMEC_SDS_ID: event.databaseEntity.AMEC_SDS_ID },
                    { RECEIVED_SDS_DATE: receivedSdsDate },
                );
            }
        }
        if (event.entity) {
            // ดึงค่าผู้ใช้อัปเดตจาก entity หรือ fallback ไปที่ผู้สร้าง
            event.entity.USER_UPDATE =
                event.entity.USER_UPDATE || event.entity.USER_CREATE;
            // กำหนดค่า UPDATE_DATE เป็นวันที่ปัจจุบัน
            event.entity.UPDATE_DATE = new Date();
        }
    }

    async beforeInsert(event: InsertEvent<STY_CHEMICAL>) {
        if (event.entity) {
            event.entity.USER_UPDATE =
                event.entity.USER_UPDATE || event.entity.USER_CREATE;
            event.entity.USER_CREATE =
                event.entity.USER_CREATE || event.entity.USER_UPDATE;
            event.entity.UPDATE_DATE = new Date();

            // เพิ่มค่า REV ของ Master ขึ้น 1
            const masterRev = await event.manager.findOne(STY_CHEMICAL_REV, {
                where: { OWNERCODE: '999999' },
            });
            await event.manager.update(
                STY_CHEMICAL_REV,
                { OWNERCODE: '999999' },
                { REV: this.nextRevision(masterRev.REV) },
            );
        }
    }
}
