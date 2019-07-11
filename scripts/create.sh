#!/usr/bin/env bash

PGPASSWORD="" psql -h "localhost" -p "5432" -U "jeffmiller" -f scripts/create.sql -f scripts/notify_trigger.sql -f scripts/create_triggers.sql