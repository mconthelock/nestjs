--------------------------------------------------------
--  File created - Sunday-November-02-2025   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table STEPMST
--------------------------------------------------------

  CREATE TABLE "WEBFORM"."STEPMST" 
   (	"CNO" CHAR(2 BYTE), 
	"VNAME" VARCHAR2(30 BYTE), 
	"VDESC" VARCHAR2(256 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 16384 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "WEBFORM" ;
  GRANT SELECT ON "WEBFORM"."STEPMST" TO "WEBFORMTS";
REM INSERTING into WEBFORM.STEPMST
SET DEFINE OFF;
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('40','GP Adviser',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('41','DE DEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('42','R&D DEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('43','Part Evaluation Engineer','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('44','Safety Function Engineer','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('45','QE SEM Approver1','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('46','QE SEM Approver2','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('47','Authorized Person Approver1','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('48','ELE/ESE SEM','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('49','Authorized Person Approver2','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('50','Senior Authorized Person','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('51','QA Staff','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('56','Receive',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('60','Attached Cover Sheet','Cover Sheet for Melina''s approval attachment');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('62','HRM SEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('37','WSD SEM','This step is for e-knowledge requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('38','IS DEM','This step is for e-knowledge requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('39','HRM Staff',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('63','SUP','Supervisor');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('31','Room owner','Room owner in Finger Print Door Access Control Registration');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('07','Foreman',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('32','G/S DEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('33','RAF DIM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('34','G/A staff',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('35','RAF DDIM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('36','HR Staff',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('57','Concern Approver1',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('58','Concern Approver2',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('59','Concern Approver3',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('64','HRM Staff','HRM Staff');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('-1','Manager','Special');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('01','P','President');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('02','DIM','Division Manager');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('03','DDIM','Deputy Division Manager');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('04','DEM','Department Manager');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('05','DDEM','Deputy Department Manager');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('06','SEM','Section Manager');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('13','Form DDEM','Refer to form owner');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('08','Admin','General form administrator');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('09','DIR','Director');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('10','Form SEM','Refer to form owner');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('00','Final step','Not use');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('--','Requester',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('11','Form DEM','Refer to form owner');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('12','Form DDIM','Refer to form owner');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('14','Form DIM','Refer to form owner');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('15','Form DIR','Refer to form owner');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('16','Accessory Controller','Form admin for Computer Accessories Requisition');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('17','Directory owner','Directory owner in File Server User Registration');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('18','Main Approval',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('19','Job Controller',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('20','IE Staff','This step is for budget requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('21','FIN DEM','This step is for budget requisition');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('22','LEADER',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('23','FOREMAN',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('24','MELINA','MELINA registration till software setting');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('25','Email Supporter','Manage user ID and password for
EMail requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('26','Assigned Person','Assigned by Job controller');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('27','HRM staff',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('28','Acknowledgement','IS DEM');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('30','HR DEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('29','VP','Vice President');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('52','Technician',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('53','Production Shift Engineer','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('54','Deeply Process Engineer','This step is for RQ requisition.');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('55','GM','GENERAL MANAGER');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('61','Job monitor',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('71','DPL','DPL');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('76','EP DIM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('84','DEM Approve2','DEM Approve2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('85','SEM Checker 1','SEM Checker 1');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('86','SEM Checker 2','SEM Checker 2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('89','SEM Concern 2','SEM Concern 2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('90','Assign Concern 1','Assign Concern 1');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('92','SEM Concern 4','SEM Concern 4');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('66','T/D Staff',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('67','T/D SEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('68','QES SEM Approver1','QES SEM');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('69','QES SEM Approver2','QES SEM');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('72','Assigned Person2','Assigned by Job controller2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('75','PUR Staff','PUR Staff');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('78','IS SEM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('80','DDEM Approver1','DDEM Approver1');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('81','DEM Approver 1','DEM Approver 1');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('82','SEM Approve 2','SEM Approve 2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('83','DDEM Approve2','DDEM Approve2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('88','SEM Concern 1','SEM Concern 1');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('70','DES/ESE Staff','DES/ESE Staff');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('77','EP DDIM',null);
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('87','Assign Checker 1','Assign Checker 1');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('91','SEM Concern 3','SEM Concern 3');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('93','Assign Concern 2','Assign Concern 2');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('94','SEM Concern 5','SEM Concern 5');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('95','SEM Concern 6','SEM Concern 6');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('96','Assign Concern 3','Assign Concern 3');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('97','SEM Concern 7','SEM Concern 7');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('98','SEM Concern 8','SEM Concern 8');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('99','Assign Concern 4','Assign Concern 4');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('65','EVC Eng.','EVC Eng');
Insert into WEBFORM.STEPMST (CNO,VNAME,VDESC) values ('79','IS DDEM',null);
--------------------------------------------------------
--  DDL for Index SYS_C0032846
--------------------------------------------------------

  CREATE UNIQUE INDEX "WEBFORM"."SYS_C0032846" ON "WEBFORM"."STEPMST" ("CNO") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "WEBFORM" ;
--------------------------------------------------------
--  Constraints for Table STEPMST
--------------------------------------------------------

  ALTER TABLE "WEBFORM"."STEPMST" ADD PRIMARY KEY ("CNO")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "WEBFORM"  ENABLE;
