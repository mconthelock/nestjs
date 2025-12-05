--------------------------------------------------------
--  File created - Sunday-November-02-2025   
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table STEPSTATUS
--------------------------------------------------------

  CREATE TABLE "WEBFORM"."STEPSTATUS" 
   (	"CNO" CHAR(1 BYTE), 
	"VNAME" VARCHAR2(30 BYTE) DEFAULT 'unknown'
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 
 NOCOMPRESS LOGGING
  STORAGE(INITIAL 16384 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "WEBFORM" ;
REM INSERTING into WEBFORM.STEPSTATUS
SET DEFINE OFF;
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('0','Not use');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('1','Use/Normal');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('2','Coming');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('3','Wait for approval');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('4','Fetched by co-worker');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('5','Approve');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('6','Reject');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('7','Skip (Done by another)');
Insert into WEBFORM.STEPSTATUS (CNO,VNAME) values ('8','Disable step');
--------------------------------------------------------
--  DDL for Index SYS_C0031388
--------------------------------------------------------

  CREATE UNIQUE INDEX "WEBFORM"."SYS_C0031388" ON "WEBFORM"."STEPSTATUS" ("CNO") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "WEBFORM" ;
--------------------------------------------------------
--  Constraints for Table STEPSTATUS
--------------------------------------------------------

  ALTER TABLE "WEBFORM"."STEPSTATUS" ADD PRIMARY KEY ("CNO")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
  BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "WEBFORM"  ENABLE;
