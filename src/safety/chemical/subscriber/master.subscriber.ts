import { STY_CHEMICAL } from 'src/common/Entities/gpreport/table/STY_CHEMICAL.entity';
import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class MasterSubscriber implements EntitySubscriberInterface<STY_CHEMICAL> {
    listenTo() {
        return STY_CHEMICAL;
    }

    beforeUpdate(event: UpdateEvent<STY_CHEMICAL>) {
        if (event.entity && event.databaseEntity) {
            // ดึงค่าผู้สร้างจาก databaseEntity เพื่อไม่ให้ถูกแก้ไขโดย entity ใหม่
            event.entity.USER_CREATE = event.databaseEntity.USER_CREATE;
        }
        if (event.entity) {
            // ดึงค่าผู้ใช้อัปเดตจาก entity หรือ fallback ไปที่ผู้สร้าง
            event.entity.USER_UPDATE =
                event.entity.USER_UPDATE || event.entity.USER_CREATE;
            // กำหนดค่า UPDATE_DATE เป็นวันที่ปัจจุบัน
            event.entity.UPDATE_DATE = new Date();
        }
    }

    beforeInsert(event: InsertEvent<STY_CHEMICAL>) {
        if (event.entity) {
            event.entity.USER_UPDATE =
                event.entity.USER_UPDATE || event.entity.USER_CREATE;
            event.entity.UPDATE_DATE = new Date();
        }
    }
}
