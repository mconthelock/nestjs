Create table MS_COUNTRY (
    CTCODE varchar(8),
    CTCODE_ISO varchar(5),
    CTCODE_ISO_SUB varchar(5),
    CTNAME varchar(30),
    CTNAME_ISO varchar(40),
    CTSTATUS varchar(10),
    CTAMECCODE varchar(50),
    CCTLID int,
    EMBG int,
    SPDES int,
    NMETRIS varchar(100),
    MKONE varchar(150),
    NEWTON varchar(40),
    WIC varchar(40),
    REGIONID int,
    POPS int,
    PRIMARY KEY(CTCODE)
);