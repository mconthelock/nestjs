--------------------------------------------------------
--  File created - Saturday-November-01-2025
--------------------------------------------------------
--------------------------------------------------------
--  DDL for Table FORMMST
--------------------------------------------------------

CREATE TABLE FORMMST (
    NNO INT(3),
    VORGNO VARCHAR(6) DEFAULT '00',
    CYEAR CHAR(2),
    NRUNNO INT(4),
    VNAME VARCHAR(80),
    VANAME VARCHAR(20),
    VDESC VARCHAR(256),
    DCREDATE DATE,
    CCRETIME CHAR(8),
    VAUTHPAGE VARCHAR(1024) DEFAULT NULL,
    VFORMPAGE VARCHAR(1024) DEFAULT NULL,
    VDIR VARCHAR(255),
    NLIFETIME INT(3) DEFAULT 6,
    CSTATUS CHAR(1) DEFAULT '2'
);