# What is PostgreSQL?

PostgreSQL is a free and open-source relational database management system focus on scalability and follow the technical standard. It's designed to handle a wide range of workloads, from personal computer to data warehouses or Web services with many concurrent users.  

PostgreSQL is written by C and developed by PostgreSQL Global Development Group.  

# List of useful PostgreSQL SQL query sentences

- Show columns list of the table
```
  SELECT * FROM information_schema.columns
  WHERE 
    table_schema = 'your_schema'
        AND 
    table_name   = 'your_table'

``` 
  
- Show list of users
```
  SELECT * FROM pg_user;

```
  
- Show list of database names and their sizes
```
  SELECT 
    datname, pg_size_pretty(pg_database_size(datname))
  FROM pg_database
  ORDER BY pg_database_size(datname) DESC;

```
  
# Database Management SQL query

- Create database:
```
  CREATE DATABASE <name>
      [ [ WITH ] [ OWNER [=] user_name ]
            [ TEMPLATE [=] template ]
            [ ENCODING [=] encoding ]
            [ LC_COLLATE [=] lc_collate ]
            [ LC_CTYPE [=] lc_ctype ]
            [ TABLESPACE [=] tablespace_name ]
            [ ALLOW_CONNECTIONS [=] allowconn ]
            [ CONNECTION LIMIT [=] connlimit ]
            [ IS_TEMPLATE [=] istemplate ] ]

```
  
- Comment on database:
```
  COMMENT ON DATABASE <name> IS <message>

```
  
- Rename database:
```
  ALTER DATABASE <old_database> RENAME TO <new_database>;

```
  
- Change database owner:
```
  ALTER DATABASE <database> OWNER TO <new_owner>;

```
  
- Change table space:
```
  ALTER DATABASE <database> SET TABLESPACE <new_tablespace>;
```
**Note:** A tablespace is a location on the disk where PostgreSQL stores data files containing database objects e.g., indexes, and tables.  
  
- Delete database:
```
  DROP DATABASE name;
```
**Note:**: If we try to delete the database is being used by other users, we will get the below error:
```
  ERROR: database “mydb” is being accessed by other users
  SQL state: 55006
  Detail: There is 1 other session using the database.
```
*To fix that, we need to do the following steps:*  
```
  /* Delete connection which connect to the database we need delete */
  SELECT
    pg_terminate_backend (pg_stat_activity.pid)
  FROM
    pg_stat_activity
  WHERE
    pg_stat_activity.datname = 'mydb';

  /* Delete the database */
  DROP DATABASE mydb;
```

# Tablespace Management SQL Query

## Introduction to PostgreSQL tablespace

A tablespace is a location on the disk where PostgreSQL stores data files containing database objects e.g., indexes, and tables.  

PostgreSQL uses a tablespace to map a logical name to a physical location on disk.  

PostgreSQL comes with two default tablespaces:  

- pg_defaulttablespace stores user data.

- pg_globaltablespace stores global data.

Tablespaces allow you to control the disk layout of PostgreSQL. There are two main advantages of using tablespaces:  

- First, if a partition on which the cluster was initialized is out of space, you can create a new tablespace on a different partition and use it until you reconfigure the system.

- Second, you can use statistics to optimize database performance. For example, you can place the frequent access indexes or tables on devices that perform very fast e.g., solid-state devices, and put the tables containing archive data which is rarely used on slower devices.

## SQL query sentences
- Create tablespace:
```
  CREATE TABLESPACE <tablespace_name>
  OWNER <owner>
  LOCATION <tablespace_path>;
```
  
- Rename tablespace:
```
  ALTER TABLESPACE name RENAME TO new_name
```
  
- Change owner tablespace:
```
  ALTER TABLESPACE name OWNER TO { new_owner | CURRENT_USER | SESSION_USER }
```
  
- Set tablespace options:
```
  ALTER TABLESPACE name SET ( tablespace_option = value [, ... ] )
```
  
- Reset tablespace options: 
```
  ALTER TABLESPACE name RESET ( tablespace_option [, ... ] )
```
  
- Delete tablespace:
```
  DROP TABLESPACE <pg_test>;
```
**Note:** If we try to delete the tablespace which is not empty (has one or more database), we will get the below error
```
  [Err] ERROR: tablespace “pg_test” is not empty
```
*To fix that, we need move these database to another tablespace before*
```
  ALTER DATABASE mydb SET TABLESPACE = pg_default;

  /* We can delete the tablespace now */
  DROP TABLESPACE <pg_test>;
``
