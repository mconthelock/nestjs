import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { QainsForm } from 'src/webform/qaform/qa-ins/qains_form/entities/qains_form.entity';
import { QaFile } from 'src/webform/qaform/qa_file/entities/qa_file.entity';
import { QaType } from 'src/webform/qaform/qa_type/entities/qa_type.entity';
import { QainsOperatorAuditor } from 'src/webform/qaform/qa-ins/qains_operator_auditor/entities/qains_operator_auditor.entity';
import { Rep } from 'src/webform/rep/entities/rep.entity';
import { SequenceOrg } from 'src/webform/sequence-org/entities/sequence-org.entity';
import { Orgpos } from 'src/webform/orgpos/entities/orgpos.entity';
import { OrgTree } from 'src/webform/org-tree/entities/org-tree.entity';

let webformConfig: TypeOrmModuleAsyncOptions;

if (process.env.STATE === 'development') {
  webformConfig = {
    name: 'webformConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      console.log(config.get('WEBFORM_TEST_USER'));
      console.log(config.get('WEBFORM_TEST_PASSWORD'));
      console.log(config.get('WEBFORM_TEST_CONNECTION'));
      return {
        type: 'oracle',
        host: config.get('WEBFORM_TEST_HOST'),
        port: config.get<number>('WEBFORM_TEST_PORT'),
        username: config.get('WEBFORM_TEST_USER'),
        password: config.get('WEBFORM_TEST_PASSWORD'),
        database: config.get('WEBFORM_TEST_DATABASE'),
        serviceName: config.get('WEBFORM_TEST_SERVICE'),
        // entities:[],
        entities: [QainsForm, QaFile, QaType, QainsOperatorAuditor, Rep, SequenceOrg, Orgpos, OrgTree],
        synchronize: false,
      };
    },
  };
} else {
  webformConfig = {
    name: 'webformConnection',
    imports: [],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      type: 'oracle',
      host: config.get('WEBFORM_HOST'),
      port: config.get<number>('WEBFORM_PORT'),
      username: config.get('WEBFORM_USER'),
      password: config.get('WEBFORM_PASSWORD'),
      database: config.get('WEBFORM_DATABASE'),
      serviceName: config.get('WEBFORM_SERVICE'),
      entities: [],
      synchronize: false,
    }),
  };
}

export default webformConfig;
