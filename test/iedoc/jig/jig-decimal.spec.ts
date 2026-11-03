import { DataSource } from 'typeorm';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigFormDetail } from 'src/common/Entities/iedoc/table/jig_form_detail.entity';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigCheckpoint } from 'src/common/Entities/iedoc/table/jig_checkpoint.entity';

describe('Oracle JIG decimal hydration', () => {
    const ds = new DataSource({ type: 'oracle', entities: [JigForm, JigFormDetail, JigMaster, JigCheckpoint] });
    beforeAll(async () => { await (ds as any).buildMetadatas(); });
    it.each([JigFormDetail, JigCheckpoint])('preserves decimals when reading %p', (entity) => {
        for (const name of ['MIN', 'MAX', 'MEASURED_VALUE']) {
            const column = ds.getMetadata(entity).findColumnWithPropertyName(name)!;
            expect(column.type).toBe('number');
            expect(column.precision).toBe(12);
            expect(column.scale).toBe(4);
            for (const value of [-0.11, 0.11, -1.2345, 0, 99999999.9999, null]) {
                expect(ds.driver.prepareHydratedValue(value, column)).toBe(value);
            }
        }
    });
});
