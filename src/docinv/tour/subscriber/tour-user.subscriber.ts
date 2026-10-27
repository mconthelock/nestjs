
import { TOUR_USER } from "src/common/Entities/docinv/table/TOUR_USER.entity";
import { EventSubscriber, EntitySubscriberInterface, UpdateEvent, InsertEvent } from "typeorm";

@EventSubscriber()
export class TourUserSubscriber implements EntitySubscriberInterface<TOUR_USER> {
    listenTo() {
        return TOUR_USER;
    }

    beforeUpdate(event: UpdateEvent<TOUR_USER>) {
        if (event.entity && event.databaseEntity) {
            event.entity.DATEUPDATE = new Date();
        }
    }

    beforeInsert(event: InsertEvent<TOUR_USER>) {
        event.entity.DATEUPDATE = new Date();
    }
}