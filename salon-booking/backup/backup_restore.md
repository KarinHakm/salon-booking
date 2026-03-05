# Backup and Restore

## Creating a backup

Use PostgreSQL’s `pg_dump` utility to create a full database dump. From a
terminal where the database is accessible:

```bash
pg_dump salon_booking > backup/backup_$(date +%F).sql
# e.g. backup/backup_2026-03-03.sql
```

The file in this repository is a placeholder representing the output of the
above command.

## Restoring data

To simulate a restore, first remove some data or drop a table:

```sql
-- connect with psql to salon_booking
DELETE FROM appointments WHERE id > 10;
-- or: DROP TABLE staff_availability;
```

Then import the backup file:

```bash
psql salon_booking < backup/backup_2026-03-03.sql
```

After running the restore command you can verify that the deleted rows or the
dropped table reappear. For example:

```sql
SELECT COUNT(*) FROM appointments;
-- before restore: 10, after restore: 42 (as in dump)
```

Screenshots of these queries with their results should be captured and
submitted as part of the assignment.
