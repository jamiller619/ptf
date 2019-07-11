CREATE DATABASE ptf;

\c ptf

CREATE TABLE nodes (
  id SERIAL PRIMARY KEY,
  name VARCHAR (55),
  upper_bound SMALLINT NOT NULL,
  lower_bound SMALLINT NOT NULL,
  children_length SMALLINT CHECK (
    children_length > 0
    AND children_length < 16
  ),
  times_generated SMALLINT
);