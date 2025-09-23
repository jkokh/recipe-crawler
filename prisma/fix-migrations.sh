npx prisma db pull && \
mkdir -p migrations/0001_init && \
npx prisma migrate diff --from-empty --to-schema-datamodel schema.prisma --script > migrations/0001_init/migration.sql && \
npx prisma migrate resolve --applied 0001_init && \
npx prisma migrate status && \
npx prisma generate
