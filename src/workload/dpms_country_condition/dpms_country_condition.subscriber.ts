import { DPMS_COUNTRY_CONDITION } from 'src/common/Entities/workload/table/DPMS_COUNTRY_CONDITION.entity';
import {
    EventSubscriber,
    EntitySubscriberInterface,
    UpdateEvent,
    InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class DpmsCountryConditionSubscriber implements EntitySubscriberInterface<DPMS_COUNTRY_CONDITION> {
    listenTo() {
        return DPMS_COUNTRY_CONDITION;
    }

    beforeUpdate(event: UpdateEvent<DPMS_COUNTRY_CONDITION>) {
        if (event.entity && event.databaseEntity) {
            // โยก CREATEBY ที่ส่งมา → UPDATEBY แล้วใช้ CREATEBY เดิมจาก DB
            event.entity.UPDATEBY = event.entity.CREATEBY;
            event.entity.CREATEBY = event.databaseEntity.CREATEBY;
            event.entity.UPDATEDATE = new Date();
        }
    }

    beforeInsert(event: InsertEvent<DPMS_COUNTRY_CONDITION>) {
        event.entity.UPDATEDATE = new Date();
    }
}
