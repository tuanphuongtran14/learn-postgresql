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

_To fix that, we need to do the following steps:_

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

_To fix that, we need move these database to another tablespace before_

```
  ALTER DATABASE mydb SET TABLESPACE = pg_default;

  /* We can delete the tablespace now */
  DROP TABLESPACE <pg_test>;
```

# Table Management SQL Query

- Create table:

```
  CREATE TABLE table_name (
    column_name TYPE column_constraint,
    table_constraint table_constraint
  ) INHERITS existing_table_name;
  WITH (
    <options>
  )
  TABLESPACE <tablespace_name>;
```

**Example**

```
  CREATE TABLE public.groups
  (
      group_id integer NOT NULL,
      group_name character varying COLLATE pg_catalog."default" NOT NULL,
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone,
      deleted_at timestamp without time zone,
      CONSTRAINT groups_pkey PRIMARY KEY (group_id)
  )
  WITH (
      OIDS = FALSE
  )
  TABLESPACE pg_default;
```

- Rename table:

```
  ALTER TABLE name RENAME TO new_name
```

- Change table's schema:

```
  ALTER TABLE name SET SCHEMA new_schema
```

- Change column name:

```
  ALTER TABLE [ ONLY ] name [ * ] RENAME [ COLUMN ] column TO new_column
```

- Add new column:

```
  ALTER TABLE table_name ADD COLUMN new_column_name TYPE;
```

- Delete column:

```
  ALTER TABLE table_name DROP COLUMN column_name;
```

- Other actions:

```
  ADD [ COLUMN ] column data_type [ COLLATE collation ] [ column_constraint [ ... ] ]
  DROP [ COLUMN ] [ IF EXISTS ] column [ RESTRICT | CASCADE ]
  ALTER [ COLUMN ] column [ SET DATA ] TYPE data_type [ COLLATE collation ] [ USING expression ]
  ALTER [ COLUMN ] column SET DEFAULT expression
  ALTER [ COLUMN ] column DROP DEFAULT
  ALTER [ COLUMN ] column { SET | DROP } NOT NULL
  ALTER [ COLUMN ] column SET STATISTICS integer
  ALTER [ COLUMN ] column SET ( attribute_option = value [, ... ] )
  ALTER [ COLUMN ] column RESET ( attribute_option [, ... ] )
  ALTER [ COLUMN ] column SET STORAGE { PLAIN | EXTERNAL | EXTENDED | MAIN }
  ADD table_constraint [ NOT VALID ]
  ADD table_constraint_using_index
  VALIDATE CONSTRAINT constraint_name
  DROP CONSTRAINT [ IF EXISTS ] constraint_name [ RESTRICT | CASCADE ]
  DISABLE TRIGGER [ trigger_name | ALL | USER ]
  ENABLE TRIGGER [ trigger_name | ALL | USER ]
  ENABLE REPLICA TRIGGER trigger_name
  ENABLE ALWAYS TRIGGER trigger_name
  DISABLE RULE rewrite_rule_name
  ENABLE RULE rewrite_rule_name
  ENABLE REPLICA RULE rewrite_rule_name
  ENABLE ALWAYS RULE rewrite_rule_name
  CLUSTER ON index_name
  SET WITHOUT CLUSTER
  SET WITH OIDS
  SET WITHOUT OIDS
  SET ( storage_parameter = value [, ... ] )
  RESET ( storage_parameter [, ... ] )
  INHERIT parent_table
  NO INHERIT parent_table
  OF type_name
  NOT OF
  OWNER TO new_owner
  SET TABLESPACE new_tablespace
```

- Delete table:

```
  DROP TABLE [ IF EXISTS ] <table_name> [, ...] [ CASCADE | RESTRICT ]
```

# PostgreSQL Sequences

## What is PostgreSQL Sequences?

A sequence in PostgreSQL is a user-defined schema-bound object that generates a sequence of integers based on a specified specification

## PostgreSQL Sequences SQL Query Sentences

- Create sequences:

```
  CREATE [ TEMPORARY | TEMP ] SEQUENCE [ IF NOT EXISTS ] <sequence_name>
  [ AS <data_type> ]
  [ INCREMENT [ BY ] <increment >]
  [ MINVALUE <minvalue> | NO MINVALUE ] [ MAXVALUE <maxvalue> | NO MAXVALUE ]
  [ START [ WITH ] start ] [ CACHE cache ] [ [ NO ] CYCLE ]
  [ OWNED BY { table_name.column_name | NONE } ]
```

**Note:**

- **<data_type>** is the type of sequences (can be smallint, integer or bigint) and the default value is bigint.

- **<increment>** can be positive or negative number, the default value is 1.

- **<minvalue>** is the min value of sequences. If set it to NO MINVALUE, the default value is used. The default value for an ascending
  series is 1. The default value for a descending series is the minimum value of the data type.

- **<maxvalue>** is the max value of sequences. If set it to NO MAXVALUE, the default value is used. The default value for an ascending
  sequence is the maximum value of the data type. The default value for a descending series is -1.

- **<start>** is the start value of the string. The default value is start as minvalue for ascending series and maxvalue for descending
  series.

- Show sequences list:

```
  SELECT
    relname sequence_name
  FROM 
    pg_class 
  WHERE 
    relkind = 'S';
```

- Delete sequences:

```
  DROP SEQUENCE [ IF EXISTS ] <squence_name> [, …] [ CASCADE | RESTRICT ]
```

# Truncate table (delete all data of the table)

- Syntax: 

```
  TRUNCATE [ TABLE ] [ ONLY ] <table_name> [ * ] [, ... ]
  [ RESTART IDENTITY | CONTINUE IDENTITY ] [ CASCADE | RESTRICT ]
```

**Note:**

- **RESTART IDENTIT** restart sequence column value.

- **CONTINUE IDENTITY** not restart sequence column value. 

# PostgreSQL Constraints

## Primary key

### What is the primary key?

- A primary key is a column or group of columns used to uniquely identify a row in a table.

### Define the primary key

There are two way to define the primary key:  

- The first way: define the primary key while creating the table.

```
  CREATE TABLE public.groups
  (
    group_id integer NOT NULL PRIMARY KEY,
    group_name character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
  )
  
  -- Or create by using CONSTRAINT keyword:

  CREATE TABLE public.groups
  (
    group_id integer NOT NULL,
    group_name character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    CONSTRAINT groups_pkey PRIMARY KEY (group_id)
  )

  -- Or just like below:

  CREATE TABLE product (
    product_no INTEGER,
    item_no INTEGER,   
    qty INTEGER,
    price NUMERIC,
    PRIMARY KEY (product_no, item_no)
  );
```

- The second ways: define/add the primary key after define the table by using ALTER TABLE keywords.

```
  CREATE TABLE products (
    product_no_1 INTEGER,
    product_no_2 INTEGER,
    description TEXT
  );
  ALTER TABLE public.products ADD PRIMARY KEY (product_no_1, product_no_2);
```

## Remove the primary key

To remove the primary key from the table, we use the following syntax:

```
  ALTER TABLE table_name DROP CONSTRAINT primary_key_constraint;
```

# Foreign Key Constraint

## What is the foreign key?

A foreign key is a column or a group of columns in a table that reference the primary key of another table.  

The table that contains the foreign key is called the referencing table or child table. And the table referenced by the foreign key is called the referenced table or parent table.  

A table can have multiple foreign keys depending on its relationships with other tables.  

In PostgreSQL, you define a foreign key using the foreign key constraint. The foreign key constraint helps maintain the referential integrity of data between the child and parent tables.  

A foreign key constraint indicates that values in a column or a group of columns in the child table equal the values in a column or a group of columns of the parent table.  

## Define the foreign key

There are two way to define the foreign key:

- The first way: define the foreign key while creating the table

**Syntax**

```
  CREATE TABLE <table_name_1> (
    <column_name_1> <data_type> REFERENCES <table_name_2>(<column_name_2>),
  );
```

```
  CREATE TABLE public.users
  (
    user_id integer NOT NULL,
    group_id integer REFERENCES groups(group_id),
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
  );

  -- Or using the FOREIGN KEY keyword

  CREATE TABLE public.users
  (
    user_id integer NOT NULL,
    group_id integer NOT NULL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    FOREIGN KEY (group_id) REFERENCES groups(group_id)
  )
```

- The second ways: define/add the foreign key after define the table by using ALTER TABLE keywords.

**Note:**

```
  ALTER TABLE child_table
  ADD CONSTRAINT constraint_name FOREIGN KEY (child_column_1) REFERENCES parent_table (parent_column_1);
```

```
  ALTER TABLE employee ADD CONSTRAINT fk_group_id FOREIGN KEY (group_id) REFERENCES groups(group_id);
```

# Other constraints

## Check constraints

**Syntax:**

```
  CREATE TABLE <table_name> (
    <column_name> <data_type> CHECK (<check_condition>)
  );

  -- Or using the CONSTRAINT keyword

  CREATE TABLE <table_name> (
    <column_name> <data_type> CONSTRAINT <constraint_name> CHECK (<check_condition>)
  );

  -- Or add check constraint to the exist table

  ALTER TABLE <table_name> ADD CONSTRAINT <constraint_name> CHECK (
    <check_condition>
  );
```

**Example:**

```
  CREATE TABLE employees (
    employee_id serial PRIMARY KEY,
    fullname character varying,
    salary numeric CHECK(salary > 0),
    age smallint CONSTRAINT check_min_age CHECK (age > 18),
  );

  ALTER TABLE employees
  ADD CONSTRAINT check_max_age CHECK (age < 80);
```

## Not null constraints

**Syntax:**

```
  CREATE TABLE <table_name> (
    <column_name> <data_type> NOT NULL
  );

  -- Or add not nul constraint to the exist table

  ALTER TABLE table_name
  ALTER COLUMN column_name SET NOT NULL;
```

**Example:**

```
  CREATE TABLE cars
  (
    car_id serial NOT NULL PRIMARY KEY,
    name character varying NOT NULL,
    description text
  )

  ALTER TABLE cars
  ALTER COLUMN description SET NOT NULL;
```

## Unique constraints

**Syntax:**

```
  CREATE TABLE <table_name> (
    <column_name> <data_type> UNIQUE
  );

  -- Or add unique constraint for many columns

  CREATE TABLE <table_name> (
    <column_name_1> <data_type>
    <column_name_2> <data_type>
    UNIQUE(column_name_1, column_name_2)
  );

  -- Or add unique constraint to the exist table

  ALTER TABLE table_name
  ADD CONSTRAINT constraint_name UNIQUE(column_name, ...)
```

**Example:**

```
  CREATE TABLE users
  (
    user_id serial NOT NULL PRIMARY KEY,
    username character varying UNIQUE,
    password character varying,
    email character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
  );

  ALTER TABLE users
  ADD CONSTRAINT unique_email UNIQUE(email);
```