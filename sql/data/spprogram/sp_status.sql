--------------------------------------------------------
--  File created - Thursday-October-09-2025   
--------------------------------------------------------
REM INSERTING into SPSYS.SP_STATUS
SET DEFINE OFF;
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (4,'Return/Reject','FIN Return',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (1,'Draft','Draft',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (2,'Created','New',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (3,'Updated','Revised',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (10,'Assign','Sale Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (11,'Declared','Sale Confirmed',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (12,'Foreward to DE','Sale Confirmed',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (20,'Designing','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (21,'Assign','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (22,'Designing','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (23,'Testing BM','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (24,'Declared','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (25,'Checking','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (26,'Checked','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (27,'Checker Reject','Design Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (28,'Design Completed','Design Completed',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (30,'Add AS400','Pending Pre-BM',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (31,'BM Complete','BM Complete',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (40,'Cost Inputting','Finance Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (41,'Cost Confirmed','Finance Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (42,'MAR Return','MAR Return',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (43,'FIN Checked','Finance Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (44,'FIN Checker Reject','Finance Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (45,'Cost Rejected','Finance Processing',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (46,'Cost Approved','Price Approved',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (50,'Other Supplier','Other Supplier',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (97,'Cancelled','Cancelled',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (98,'Unable Issue Quotation','Unable Issue',1);
Insert into SPSYS.SP_STATUS (STATUS_ID,STATUS_ACTION,STATUS_DESC,STATUS_TYPE) values (99,'Issue Quotation','Finish',1);
