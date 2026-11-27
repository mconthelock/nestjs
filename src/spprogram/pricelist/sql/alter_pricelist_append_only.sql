-- ============================================================================
-- Migration: Convert SPSYS.PRICELIST to Append-only Price History (Oracle)
-- ============================================================================

-- 1. Create Sequence for PRICE_ID auto-increment
CREATE SEQUENCE SPSYS.SEQ_SP_PRICELIST_ID
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

-- 2. Add PRICE_ID column (nullable first to backfill existing rows)
ALTER TABLE SPSYS.PRICELIST ADD (
    PRICE_ID NUMBER(12)
);

-- 3. Backfill existing rows with sequence values
UPDATE SPSYS.PRICELIST
   SET PRICE_ID = SPSYS.SEQ_SP_PRICELIST_ID.NEXTVAL
 WHERE PRICE_ID IS NULL;

COMMIT;

-- 4. Set PRICE_ID as NOT NULL
ALTER TABLE SPSYS.PRICELIST MODIFY (
    PRICE_ID NUMBER(12) NOT NULL
);

-- 5. Replace old Primary Key (FYYEAR, PERIOD, ITEM) with PRICE_ID
ALTER TABLE SPSYS.PRICELIST DROP PRIMARY KEY;

ALTER TABLE SPSYS.PRICELIST ADD (
    CONSTRAINT PK_SP_PRICELIST PRIMARY KEY (PRICE_ID)
);

-- 6. Create Before-Insert Trigger for auto-increment PRICE_ID
CREATE OR REPLACE TRIGGER SPSYS.TRG_SP_PRICELIST_BI
BEFORE INSERT ON SPSYS.PRICELIST
FOR EACH ROW
WHEN (NEW.PRICE_ID IS NULL)
BEGIN
    SELECT SPSYS.SEQ_SP_PRICELIST_ID.NEXTVAL
      INTO :NEW.PRICE_ID
      FROM DUAL;
END;
/

-- 7. Add ENDIN column (nullable) for recording when a price was superseded
ALTER TABLE SPSYS.PRICELIST ADD (
    ENDIN DATE NULL
);

-- 8. Create Indexes for latest lookup and price history queries
CREATE INDEX SPSYS.IDX_SP_PRICELIST_LATEST
    ON SPSYS.PRICELIST (ITEM, FYYEAR, PERIOD, LATEST);

CREATE INDEX SPSYS.IDX_SP_PRICELIST_HISTORY
    ON SPSYS.PRICELIST (ITEM, STARTIN);
