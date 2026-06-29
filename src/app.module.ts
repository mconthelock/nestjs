import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

//Middleware & Interceptor
import { HttpLoggingInterceptor } from './common/logger/http-logging.interceptor';
import { IpLoggerMiddleware } from './middleware/ip-logger.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { RequestContextMiddleware } from './middleware/request-context.middleware';

//Modules List
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { AmecMfgModule } from './amecmfg/amecmfg.module';
import { AmecModule } from './amec/amec.module';
import { DocinvModule } from './docinv/docinv.module';
import { gpreportModule } from './gpreport/gpreport.module';
import { WebformModule } from './webform/webform.module';
import { SpModule } from './spprogram/sp.module';
import { MktModule } from './marketing/mkt.module';
import { JobOrderModule } from './joborder/joborder.module';
import { ESCSModule } from './escs/escs.module';
import { AutomationModule } from './automation/automation.module';
import { HradminModule } from './hradmin/hradmin.module';
import { InvoiceModule } from './invoice/invoice.module';
import { IdsModule } from './ids/ids.module';
import { ElmesModule } from './elmes/elmes.module';
// import { ItgcModule } from './itgc/itgc.module';
import { AS400Module } from './as400/as400.module';
import { PackingModule } from './packing/packing.module';
import { HbdModule } from './hbd/hbd.module';
import { EarlyHeadMiddleware } from './middleware/early-head.middleware';
import { SafetyModule } from './safety/safety.module';
import { EbudgetModule } from './ebudget/ebudget.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from './common/interceptors/transaction.interceptor';
import { PursysModule } from './pursys/pursys.module';
import { WorkloadModule } from './workload/workload.module';
import { DatacenterModule } from './datacenter/datacenter.module';
import { GeneralPartListModule } from './general-part-list/general-part-list.module';
import { MfgEdrModule } from './webform/mfgform/mfg-edr/mfg-edr.module';
import { MfgOrModule } from './webform/mfgform/mfg-or/mfg-or.module';
import { MfgReportModule } from './mfgreport/mfgreport.module';
// FIN-PCK
import { FinpckFormModule } from './webform/finform/fin-pck/finpck_form/finpck_form.module';
import { FinpckAssetModule } from './webform/finform/fin-pck/finpck_asset/finpck_asset.module';
import { FxaGrpmstModule } from './webform/finform/fxa_grpmst/fxa_grpmst.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CommonModule,

        //BB8 💣
        AuthModule,
        AmecModule,
        AmecMfgModule,
        DocinvModule,
        gpreportModule,
        WebformModule,
        SpModule,
        MktModule,
        ElmesModule,
        AS400Module,
        AutomationModule,
        HradminModule,
        //JB 🤴
        JobOrderModule,
        ESCSModule,
        PackingModule,
        InvoiceModule,
        IdsModule,
        // ItgcModule,
        SafetyModule,
        HbdModule,
        EbudgetModule,
        WarehouseModule,
        PursysModule,
        WorkloadModule,
        DatacenterModule,
        GeneralPartListModule,

        // OMG
        MfgEdrModule,
        MfgReportModule,
        MfgOrModule,
        //FIN-PCK
        FinpckFormModule,
        FinpckAssetModule,
        FxaGrpmstModule,
    ],
    providers: [
        HttpLoggingInterceptor,
        {
            provide: APP_INTERCEPTOR,
            useClass: TransactionInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                EarlyHeadMiddleware,
                RequestIdMiddleware,
                RequestContextMiddleware,
                IpLoggerMiddleware,
            )
            .forRoutes('*');
    }
}
