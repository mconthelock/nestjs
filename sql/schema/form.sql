--------------------------------------------------------
--  File created - Saturday-November-01-2025
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table FORM (MySQL)
--------------------------------------------------------

CREATE TABLE FORM (
    NFRMNO DECIMAL(3,0),
    VORGNO VARCHAR(6) DEFAULT '00',
    CYEAR CHAR(2),
    CYEAR2 CHAR(4),
    NRUNNO DECIMAL(7,0),
    VREQNO VARCHAR(12),
    VINPUTER VARCHAR(12),
    VREMARK TEXT,
    DREQDATE DATE,
    CREQTIME CHAR(8),
    CST CHAR(1) DEFAULT '0',
    VFORMPAGE VARCHAR(1024),
    VREMOTE VARCHAR(15)
);