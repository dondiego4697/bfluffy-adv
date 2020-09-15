# Local launch

## Migrate schema:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION pg_trgm;
```

```sh
make migrate-db
make migrate-test-db
```

## Dump/Restore database:

```sh
# dump testing
# pg_dump --file=/tmp/dump.sql --format=p --clean --no-owner --no-privileges -U store_testing --host=c-mdb0va3tpuk88lobktvk.rw.db.yandex.net -p 6432 -d store_testing2

# dump production
# pg_dump --file=/tmp/dump.sql --format=p --clean --no-owner --no-privileges -U store_production --host=c-mdbak1odjpt6cpgg8h8e.rw.db.yandex.net -p 6432 -d store_production2

# restore
psql --file=/tmp/dump.sql -d 'postgresql://postgres:password@localhost:6432/petstore'
```
