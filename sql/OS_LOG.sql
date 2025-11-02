ALTER view [dbo].[OS_LOG_VIEW] as
select
cast(os_logdate as date) AS LOG_DATE,
left(cast(os_logdate as time),8) AS LOG_TIME,
os_server as LOG_SERVER,
os_account as LOG_USER,
case when os_domain is null then '' else os_domain END as LOG_DOMAIN,
os_client as LOG_HOST,
os_client_ip as LOG_IP,
os_remark as LOG_MSG
 from os_logs;

 create table OS_LOG_VIEW (
    LOG_DATE date,
    LOG_TIME char(8),
    LOG_SERVER varchar(50),
    LOG_USER varchar(50),
    LOG_DOMAIN varchar(255),
    LOG_HOST varchar(15),
    LOG_IP varchar(20),
    LOG_MSG varchar(4000)
 );