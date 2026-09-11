import { COUNTRY_ORIGIN } from "src/common/Entities/workload/table/COUNTRY_ORIGIN.entity";
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, InsertEvent } from "typeorm";

@EventSubscriber()
export class CountryOriginSubscriber implements EntitySubscriberInterface<COUNTRY_ORIGIN> {
    listenTo() {
        return COUNTRY_ORIGIN;
    }

    beforeUpdate(event: UpdateEvent<COUNTRY_ORIGIN>) {
        if (event.entity && event.databaseEntity) {
            // โยก CREATEBY ที่ส่งมา → UPDATEBY แล้วใช้ CREATEBY เดิมจาก DB
            event.entity.UPDATEBY = event.entity.CREATEBY;
            event.entity.CREATEBY = event.databaseEntity.CREATEBY;
            event.entity.UPDATEDATE = new Date();
        }
    }

    beforeInsert(event: InsertEvent<COUNTRY_ORIGIN>) {
        event.entity.UPDATEDATE = new Date();
    }
}