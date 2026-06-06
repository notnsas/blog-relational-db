
postgres=# CREATE TABLE blogs (
postgres(# id SERIAL PRIMARY KEY,
postgres(# author text,
postgres(# url text NOT NULL,
postgres(# title text NOT NULL,
postgres(# likes integer DEFAULT 0
postgres(# );
CREATE TABLE

postgres=# insert into blogs (author, url, title, likes) values ('nara', 'nara.com', 'how to code', 2)
;
INSERT 0 1
postgres=# insert into blogs (author, url, title, likes) values ('seth', 'coding.com', 'how to walk fast', 5);
INSERT 0 1