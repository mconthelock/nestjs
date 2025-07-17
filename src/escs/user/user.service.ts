import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { EscsUser } from './entities/user.entity';
import { SearchDto } from './dto/search.dto';
import { getSelectNestedFields, getSafeFields } from '../../utils/Fields';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EscsUser, 'amecConnection')
    private userRepo: Repository<EscsUser>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource
  ) {}

//   private selectfields = {
//         USR_ID: true,
//         USR_NO: true,
//         USR_NAME: true,
//         USR_EMAIL: true,
//         USR_REGISTDATE: true,
//         USR_USERUPDATE: true,
//         USR_DATEUPDATE: true,
//         GRP_ID: true,
//         USR_STATUS: true,
//         SEC_ID: true,
//         user: {
//           SEMPNO: true,
//           SNAME: true,
//           SRECMAIL: true,
//           SSECCODE: true,
//           SSEC: true,
//           SDEPCODE: true,
//           SDEPT: true,
//           SDIVCODE: true,
//           SDIV: true,
//           SPOSCODE: true,
//           SPOSNAME: true,
//           SPASSWORD1: true,
//           CSTATUS: true,
//           SEMPENCODE: true,
//           MEMEML: true,
//           STNAME: true,
//         }
//     };

  private escs = this.dataSource.getMetadata(EscsUser).columns.map(c => c.propertyName);
  private user = this.dataSource.getMetadata('AMECUSERALL').columns.map(c => c.propertyName);
  private allowFields = [...this.escs, ...this.user];



  getUserAll() {
    return this.userRepo.find({
      order: {
        USR_ID: 'ASC',
      },
    });
  }

  getUserByID(id: number) {
    return this.userRepo.findOne({
      where: { USR_ID: id },
      order: {
        USR_ID: 'ASC',
      },
    });
  }

  getUser(searchDto: SearchDto) {
    const { USR_ID, USR_NO, GRP_ID, USR_STATUS, SEC_ID, fields = [] } = searchDto;
    const query = this.dataSource.createQueryBuilder().from('ESCS_USERS','A');

    // console.log('escs:', this.escs);
    // console.log('user:', this.user);
    // console.log('allowFields:', this.allowFields);
    

    if( USR_ID) query.andWhere('A.USR_ID = :USR_ID', { USR_ID });
    if( USR_NO) query.andWhere('A.USR_NO = :USR_NO', { USR_NO });
    if( GRP_ID) query.andWhere('A.GRP_ID = :GRP_ID', { GRP_ID });
    if( USR_STATUS) query.andWhere('A.USR_STATUS = :USR_STATUS', { USR_STATUS });
    if( SEC_ID) query.andWhere('A.SEC_ID = :SEC_ID', { SEC_ID });

    let select = [];
    if (fields.length > 0) {
        select = getSafeFields(fields, this.allowFields);
    }else{
        select = this.allowFields;
    }
    // console.log('Selected fields:', select);
    
    select.forEach((f)=>{
        // console.log('Field:', f);
        
        if (this.user.includes(f)) {
            query.addSelect(`B.${f}`, f);
        } else {
            query.addSelect(`A.${f}`, f);
        }
    });
    query.leftJoin('AMECUSERALL', 'B', "A.USR_NO = B.SEMPNO");
    return query.getRawMany();


    // const selected = getSelectNestedFields(fields, this.selectfields);
    // console.log('Selected fields:', selected);
    
    // return this.userRepo.find({
    //   where: [{ USR_ID, USR_NO, GRP_ID, USR_STATUS, SEC_ID }],
    //   order: {
    //     USR_ID: 'ASC',
    //   },
    //   relations: ['user'],
    //   select: selected,
    // });
  }
  
}
