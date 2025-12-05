CREATE TABLE TSPI_Fowarder (
	Fowarder_Code numeric(5,0) IDENTITY(1,1) NOT NULL,
	Fowarder_Detail nvarchar(250) COLLATE Thai_CI_AS NULL,
	SHPNO int NULL,
	CONSTRAINT PK_TSPI_Fowaeder PRIMARY KEY (Fowarder_Code)
);