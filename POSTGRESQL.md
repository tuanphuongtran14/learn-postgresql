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

# SQL Query Sentences

## Select Query

**Syntax:**

```
  [ WITH [ RECURSIVE ] with_query [, ...] ]
  SELECT [ ALL | DISTINCT [ ON ( expression [, ...] ) ] ]
  [ * | expression [ [ AS ] output_name ] [, ...] ]
  [ FROM from_item [, ...] ]
  [ WHERE condition ]
  [ GROUP BY grouping_element [, ...] ]
  [ HAVING condition [, ...] ]
  [ WINDOW window_name AS ( window_definition ) [, ...] ]
  [ { UNION | INTERSECT | EXCEPT } [ ALL | DISTINCT ] select ]
  [ ORDER BY expression [ ASC | DESC | USING operator ] [ NULLS { FIRST | LAST } ] [, ...] ]
  [ LIMIT { count | ALL } ]
  [ OFFSET start [ ROW | ROWS ] ]
  [ FETCH { FIRST | NEXT } [ count ] { ROW | ROWS } ONLY ]
  [ FOR { UPDATE | NO KEY UPDATE | SHARE | KEY SHARE } [ OF table_name [, ...] ] [ NOWAIT | SKIP LOCKED ] [...] ]
```

**Note:**

- It is not a good practice to use the asterisk (\*) in the SELECT statement when you embed SQL statements in the application code like *Python, Java, Node.js, or PHP* due to the following reasons:

  ...1. *Database performance.* Suppose you have a table with many columns and a lot of data, the SELECT statement with the asterisk (\*) shorthand will select data from all the columns of the table, which may not be necessary to the application.

  ...2. *Application performance.* Retrieving unnecessary data from the database increases the traffic between the database server and application server. In consequence, your applications may be slower to respond and less scalable.

- PostgreSQL evaluates the FROM clause before the SELECT clause n the SELECT statement.

```
  FROM => SELECT
```

- PostgreSQL evaluates the clauses in the SELECT statement in the following order: FROM, SELECT, and ORDER BY.

```
  FROM => SELECT => ORDER BY
```

- PostgreSQL evaluates the WHERE clause after the FROM clause and before the SELECT and ORDER BY clause:

```
  FROM => WHERE => SELECT => ORDER BY
```

**Get more details at here:** [https://www.postgresqltutorial.com/postgresql-select/](https://www.postgresqltutorial.com/postgresql-select/)

# PostgreSQL Column Aliases

A column alias allows you to assign a column or an expression in the select list of a SELECT statement a temporary name. The column alias exists temporarily during the execution of the query.  

The following illustrates the syntax of using a column alias:  

```
  SELECT column_name AS alias_name
  FROM table_name;

  -- Or

  SELECT column_name alias_name
  FROM table_name;

  -- Or we can use alias name to an expression

  SELECT expression AS alias_name
  FROM table_name;
```

**Example:**

```
  -- Show full name based on first name and last name
  SELECT first_name || ' ' || last_name AS full_name FROM employee
```

# PostgreSQL FETCH clause

To constrain the number of rows returned by a query, you often use the LIMIT clause. The LIMIT clause is widely used by many relational database management systems such as MySQL, H2, and HSQLDB. However, the LIMIT clause is not a SQL-standard.  

To conform with the SQL standard, PostgreSQL supports the FETCH clause to retrieve a number of rows returned by a query. Note that the FETCH clause was introduced in SQL: 2008.  

**Syntax:**

```
  OFFSET start { ROW | ROWS }
  FETCH { FIRST | NEXT } [ row_count ] { ROW | ROWS } ONLY
```

- ROW is the synonym for ROWS, FIRST is the synonym for NEXT . SO you can use them interchangeably

- The start is an integer that must be zero or positive. By default, it is zero if the OFFSET clause is not specified. In case the start is greater than the number of rows in the result set, no rows are returned;

- The row_count is 1 or greater. By default, the default value of row_count is 1 if you do not specify it explicitly.

**Example**

```
  SELECT * FROM employee FETCH FIRST 2 ROWS ONLY
```
**Note:**

> *The FETCH clause is functionally equivalent to the LIMIT clause. If you plan to make your application compatible with other database systems, you should use the FETCH clause because it follows the standard SQL.*


# PostgreSQL LIKE and NOT LIKE operator

You construct a pattern by combining literal values with wildcard characters and use the LIKE or NOT LIKE operator to find the matches. PostgreSQL provides you with two wildcards:

- Percent sign (%) matches any sequence of zero or more characters.

- Underscore sign (_)  matches any single character.

**Example:**

```
  SELECT
    'foo' LIKE 'foo', -- true
    'foo' LIKE 'f%', -- true
    'foo' LIKE '_o_', -- true
    'bar' LIKE 'b_'; -- false

  SELECT
    'foo' NOT LIKE 'foo', -- false
    'foo' NOT LIKE 'f%', -- false
    'foo' NOT LIKE '_o_', -- false
    'bar' NOT LIKE 'b_'; -- true
```

# PostgreSQL Joins

## Setting up sample tables

```
  CREATE TABLE basket_a (
      a INT PRIMARY KEY,
      fruit_a VARCHAR (100) NOT NULL
  );

  CREATE TABLE basket_b (
      b INT PRIMARY KEY,
      fruit_b VARCHAR (100) NOT NULL
  );

  INSERT INTO basket_a (a, fruit_a)
  VALUES
      (1, 'Apple'),
      (2, 'Orange'),
      (3, 'Banana'),
      (4, 'Cucumber');

  INSERT INTO basket_b (b, fruit_b)
  VALUES
      (1, 'Orange'),
      (2, 'Apple'),
      (3, 'Watermelon'),
      (4, 'Pear');
```

## PostgreSQL inner join

The following statement joins the first table (basket_a) with the second table (basket_b) by matching the values in the fruit_a and fruit_b columns:

```
  SELECT
    a,
    fruit_a,
    b,
    fruit_b
  FROM
    basket_a
  INNER JOIN basket_b
    ON fruit_a = fruit_b;
```

**Important:**

> *The inner join examines each row in the first table (basket_a). It compares the value in the fruit_a column with the value in the fruit_b column of each row in the second table (basket_b). If these values are equal, the inner join creates a new row that contains columns from both tables and adds this new row the result set.*


## PostgreSQL left join

The following statement uses the left join clause to join the basket_a table with the basket_b table. In the left join context, the first table is called the left table and the second table is called the right table.  

```
  SELECT
      a,
      fruit_a,
      b,
      fruit_b
  FROM
      basket_a
  LEFT JOIN basket_b 
    ON fruit_a = fruit_b;
```

**Important**

> *The left join starts selecting data from the left table. It compares values in the fruit_a column with the values in the fruit_b column in the basket_b table.*  

> *If these values are equal, the left join creates a new row that contains columns of both tables and adds this new row to the result set.*

> **In case the values do not equal, the left join also creates a new row that contains columns from both tables and adds it to the result set. However, it fills the columns of the right table (basket_b) with null.*

**Note:**

> *The LEFT JOIN is the same as the LEFT OUTER JOIN so you can use them interchangeably.* 

## PostgreSQL right join

The following statement uses the right join clause to join the basket_a table with the basket_b table. In the right join context, the first table is called the left table and the second table is called the right table.  

```
  SELECT
    a,
    fruit_a,
    b,
    fruit_b
  FROM
      basket_a
  RIGHT JOIN basket_b ON fruit_a = fruit_b;
```

**Important**

> *The right join is a reversed version of the left join. The right join starts selecting data from the right table. It compares each value in the fruit_b column of every row in the right table with each value in the fruit_a column of every row in the fruit_a table.*

> *If these values are equal, the right join creates a new row that contains columns from both tables.*

> *In case these values are not equal, the right join also creates a new row that contains columns from both tables. However, it fills the columns in the left table with NULL.*

**Note:**

> *The RIGHT JOIN is the same as the RIGHT OUTER JOIN so you can use them interchangeably.*  

## PostgreSQL full outer join

> *The full outer join or full join returns a result set that contains all rows from both left and right tables, with the matching rows from both sides if available. In case there is no match, the columns of the table will be filled with NULL.*

```
  SELECT
    a,
    fruit_a,
    b,
    fruit_b
  FROM
    basket_a
  FULL OUTER JOIN basket_b 
    ON fruit_a = fruit_b;
```

## PostgreSQL cross join

A CROSS JOIN clause allows you to produce a Cartesian Product of rows in two or more tables.  

Different from other join clauses such as LEFT JOIN  or INNER JOIN, the CROSS JOIN clause does not have a join predicate.  

**Syntax**

```
  SELECT select_list
  FROM T1
  CROSS JOIN T2;

  -- Or

  SELECT select_list
  FROM T1, T2;

  -- Or 

  SELECT *
  FROM T1
  INNER JOIN T2 ON true;
```

## PostgreSQL natural join

A natural join is a join that creates an implicit join based on the same column names in the joined tables.

**Syntax**

```
  SELECT select_list
  FROM T1
  NATURAL [INNER, LEFT, RIGHT] JOIN T2;
```

A natural join can be an inner join, left join, or right join. If you do not specify a join explicitly e.g., INNER JOIN, LEFT JOIN, RIGHT JOIN, PostgreSQL will use the INNER JOIN by default.

If you use the asterisk (*) in the select list, the result will contain the following columns:

- All the common columns, which are the columns from both tables that have the same name.

- Every column from both tables, which is not a common column.

# PostgreSQL GROUP BY

The GROUP BY clause divides the rows returned from the SELECT statement into groups. For each group, you can apply an aggregate function e.g.,  SUM() to calculate the sum of items or COUNT() to get the number of items in the groups.  

The following statement illustrates the basic syntax of the GROUP BY clause:  

```
  SELECT 
    column_1, 
    column_2,
    ...,
    aggregate_function(column_3)
  FROM 
    table_name
  GROUP BY 
    column_1,
    column_2,
    ...;
```

In this syntax:  

- First, select the columns that you want to group e.g., column1 and column2, and column that you want to apply an aggregate function (column3).

- Second, list the columns that you want to group in the GROUP BY clause.

The statement clause divides the rows by the values of the columns specified in the GROUP BY clause and calculates a value for each group.

**Note:**

> *PostgreSQL evaluates the GROUP BY clause after the FROM and WHERE clauses and before the HAVING SELECT, DISTINCT, ORDER BY and LIMIT clauses.*

```
  FROM => WHERE => GROUP BY => HAVING => SELECT => DISTINCT => ORDER BY => LIMIT
```

# PostgreSQL UNION operator

The UNION operator combines result sets of two or more SELECT statements into a single result set.  

**Syntax**

```
  SELECT select_list_1
  FROM table_expresssion_1
  UNION
  SELECT select_list_2
  FROM table_expression_2
```

**Note**

To combine the result sets of two queries using the UNION operator, the queries must conform to the following rules:

- The number and the order of the columns in the select list of both queries must be the same.

- The data types must be compatible.

The UNION operator removes all duplicate rows from the combined data set. To retain the duplicate rows, you use the the UNION ALL instead.

# PostgreSQL INTERSECT operator

Like the UNION and EXCEPT operators, the PostgreSQL INTERSECT operator combines result sets of two or more SELECT statements into a single result set.  

The INTERSECT operator returns any rows that are available in both result sets.

**Syntax:**

```
  SELECT select_list
  FROM A
  INTERSECT
  SELECT select_list
  FROM B;
```

**Note:**

To use the INTERSECT operator, the columns that appear in the SELECT statements must follow the following rules:

- The number of columns and their order in the SELECT clauses must be the same.

- The data types of the columns must be compatible.

# PostgreSQL EXCEPT operator

Like the UNION and INTERSECT operators, the EXCEPT operator returns rows by comparing the result sets of two or more queries.  

The EXCEPT operator returns distinct rows from the first (left) query that are not in the output of the second (right) query.  

**Syntax:**

```
  SELECT select_list
  FROM A
  EXCEPT 
  SELECT select_list
  FROM B;
```

**Note:**

The queries that involve in the EXCEPT need to follow these rules:

- The number of columns and their orders must be the same in the two queries.

- The data types of the respective columns must be compatible.

# PostgreSQL GROUPING SETS

## GROUPING SETS operator

The GROUPING SETS allows you to define multiple grouping sets in the same query.  

The general syntax of the GROUPING SETS is as follows:  

```
  SELECT
      c1,
      c2,
      aggregate_function(c3)
  FROM
      table_name
  GROUP BY
      GROUPING SETS (
          (c1, c2),
          (c1),
          (c2),
          ()
  );
```

## GROUPING function

The GROUPING() function accepts an argument which can be a column name or an expression:  

```
GROUPING( column_name | expression)
```

The column_name or expression must match with the one specified in the GROUP BY clause.  

The GROUPING() function returns bit 0 if the argument is a member of the current grouping set and 1 otherwise.  

# PostgreSQL CUBE

PostgreSQL CUBE is a subclause of the GROUP BY clause. The CUBE allows you to generate multiple grouping sets.  

A grouping set is a set of columns to which you want to group. For more information on the grouping sets, check it out the GROUPING SETS tutorial.  

The following illustrates the syntax of the CUBE subclause:

```
  SELECT
    c1,
    c2,
    c3,
    aggregate (c4)
  FROM
    table_name
  GROUP BY
    CUBE (c1, c2, c3);
```

**In this syntax:**

- First, specify the CUBE subclause in the the GROUP BY clause of the SELECT statement.

- Second, in the select list, specify the columns (dimensions or dimension columns) which you want to analyze and aggregation function expressions.

- Third, in the GROUP BY clause, specify the dimension columns within the parentheses of the CUBE subclause.

**Important:**  

The query generates all possible grouping sets based on the dimension columns specified in CUBE. The CUBE subclause is a short way to define multiple grouping sets so the following are equivalent:  

```
CUBE(c1,c2,c3) 

GROUPING SETS (
  (c1,c2,c3), 
  (c1,c2),
  (c1,c3),
  (c2,c3),
  (c1),
  (c2),
  (c3), 
  ()
 ) 
```

In general, if the number of columns specified in the CUBE is n, then you will have 2^n combinations.

# PostgreSQL ROLLUP

The PostgreSQL ROLLUP is a subclause of the GROUP BY clause that offers a shorthand for defining multiple grouping sets. A grouping set is a set of columns by which you group. Check out the grouping sets tutorial for the detailed information.  

Different from the CUBE subclause, ROLLUP does not generate all possible grouping sets based on the specified columns. It just makes a subset of those.  

The ROLLUP assumes a hierarchy among the input columns and generates all grouping sets that make sense considering the hierarchy. This is the reason why ROLLUP is often used to generate the subtotals and the grand total for reports.  

For example, the CUBE (c1,c2,c3) makes all eight possible grouping sets:  

```
  (c1, c2, c3)
  (c1, c2)
  (c2, c3)
  (c1,c3)
  (c1)
  (c2)
  (c3)
  ()
```

However, the ROLLUP(c1,c2,c3) generates only four grouping sets, assuming the hierarchy c1 > c2 > c3 as follows:  

```
  (c1, c2, c3)
  (c1, c2)
  (c1)
  ()
```

A common use of  ROLLUP is to calculate the aggregations of data by year, month, and date, considering the hierarchy year > month > date.  

