--------------------------------------------------------
--  File created - Saturday-November-01-2025
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table FLOW
--------------------------------------------------------

CREATE TABLE FLOW (
    NFRMNO INT(3),
    VORGNO VARCHAR(6),
    CYEAR CHAR(2),
    CYEAR2 CHAR(4),
    NRUNNO INT(7),
    CSTEPNO CHAR(2),
    CSTEPNEXTNO CHAR(2),
    CSTART CHAR(1) DEFAULT '0',
    CSTEPST CHAR(1) DEFAULT '1',
    CTYPE CHAR(1),
    VPOSNO VARCHAR(5),
    VAPVNO VARCHAR(12),
    VREPNO VARCHAR(12),
    VREALAPV VARCHAR(12),
    CAPVSTNO CHAR(1),
    DAPVDATE DATE,
    CAPVTIME CHAR(8),
    CEXTDATA CHAR(2),
    CAPVTYPE CHAR(1) DEFAULT '1',
    CREJTYPE CHAR(1) DEFAULT '1',
    CAPPLYALL CHAR(1) DEFAULT '0',
    VURL VARCHAR(1024),
    VREMARK TEXT,
    VREMOTE VARCHAR(15)
);