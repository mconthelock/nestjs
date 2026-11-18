import { STY_FILES } from 'src/common/Entities/gpreport/table/STY_FILES.entity';
import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class StyFilesSubscriber implements EntitySubscriberInterface<STY_FILES> {
    listenTo() {
        return STY_FILES;
    }

    beforeUpdate(event: UpdateEvent<STY_FILES>) {
        if (event.entity && event.databaseEntity) {
            // ดึงค่าผู้สร้างจาก databaseEntity เพื่อไม่ให้ถูกแก้ไขโดย entity ใหม่
            event.entity.FILE_USERCREATE = event.databaseEntity.FILE_USERCREATE;
        }
        if (event.entity) {
            // ดึงค่าผู้ใช้อัปเดตจาก entity หรือ fallback ไปที่ผู้สร้าง
            event.entity.FILE_USERUPDATE =
                event.entity.FILE_USERUPDATE || event.entity.FILE_USERCREATE;
            // กำหนดค่า UPDATE_DATE เป็นวันที่ปัจจุบัน
            event.entity.FILE_DATEUPDATE = new Date();
        }
    }

    beforeInsert(event: InsertEvent<STY_FILES>) {
        if (event.entity) {
            event.entity.FILE_USERUPDATE =
                event.entity.FILE_USERUPDATE || event.entity.FILE_USERCREATE;
            event.entity.FILE_USERCREATE =
                event.entity.FILE_USERCREATE || event.entity.FILE_USERUPDATE;
            event.entity.FILE_DATEUPDATE = new Date();
        }
    }
}
