import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CreateOrgTreeDto } from './dto/create-org-tree.dto';
import { UpdateOrgTreeDto } from './dto/update-org-tree.dto';

@Injectable()
export class OrgTreeService {
  constructor(
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}
  create(createOrgTreeDto: CreateOrgTreeDto) {
    return 'This action adds a new orgTree';
  }

  findAll() {
    return `This action returns all orgTree`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orgTree`;
  }

  update(id: number, updateOrgTreeDto: UpdateOrgTreeDto) {
    return `This action updates a #${id} orgTree`;
  }

  remove(id: number) {
    return `This action removes a #${id} orgTree`;
  }

  async getOrgTree(orgno: string, vposno: string, empno: string, emppos: string) {
    const sql = `
        SELECT *
        FROM ORGPOS
        WHERE VORGNO IN (
        SELECT DISTINCT VORGNO
        FROM ORGTREE
        START WITH VORGNO = :1
        CONNECT BY VORGNO = PRIOR vParent
        )
        AND VPOSNO = :2
        AND VEMPNO IN (
        SELECT headNo
        FROM sequenceOrg
        START WITH empNo = :3
            AND sPosCode = :4
            AND cCo = '0'
        CONNECT BY PRIOR headNo = empNo
            AND PRIOR sPosCode1 = sPosCode
        )
    `;
    const res = await this.dataSource.query(sql, [orgno, vposno, empno, emppos]);
    return res;
  }
}
