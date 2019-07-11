#!/usr/bin/env bash

PGPASSWORD="" psql -h "localhost" -p "5432" -U "jeffmiller" -c $'DROP DATABASE ptf'
