--------------------------------------------------------
--  File created - Saturday-November-01-2025
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table FLOWMST
--------------------------------------------------------

CREATE TABLE FLOWMST (
    NFRMNO INT(3),
    VORGNO VARCHAR(6),
    CYEAR CHAR(2),
    CSTEPNO CHAR(2),
    CSTEPNEXTNO CHAR(2),
    VPOSNO VARCHAR(3),
    VAPVNO VARCHAR(12),
    VAPVORGNO VARCHAR(6),
    VURL VARCHAR(1024),
    CSTART CHAR(1) DEFAULT '0',
    CTYPE CHAR(1),
    CEXTDATA CHAR(2),
    CAPVTYPE CHAR(1) DEFAULT '1',
    CREJTYPE CHAR(1) DEFAULT '1',
    CAPPLYALL CHAR(1) DEFAULT '0'
);