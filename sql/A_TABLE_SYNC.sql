CREATE OR REPLACE FORCE EDITIONABLE VIEW "AMECMFG"."A_TABLE_SYNC" ("GROUP_NAME", "SEQNO", "RBA", "AUDIT_TS", "LAST_UPDATE", "ROWNUMS") AS
  WITH ROWN AS (
    select group_name, seqno, rba, audit_ts, to_char(last_update_ts, 'yyyy-mm-dd hh24:mi:ss') as last_update
    , ROW_NUMBER() OVER( PARTITION BY group_name ORDER BY last_update_ts DESC) AS ROWNUMS
    from (
        select * from AMEC_STAGING.OGG_CHECKPOINT
        union
        SELECT * FROM gguser.chkpt
    )
)
SELECT "GROUP_NAME","SEQNO","RBA","AUDIT_TS","LAST_UPDATE","ROWNUMS" FROM ROWN WHERE ROWNUMS = 1;