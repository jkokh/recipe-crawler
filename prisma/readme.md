Awesome. Here’s a tight, essentials-only **manual to baseline Prisma migrations without losing data** (the flow you just used).

# Baseline Prisma to an existing DB (no data loss)

1. **Sync schema from DB**

```bash
npx prisma db pull
```

2. **Create an init migration folder**

```bash
mkdir -p prisma/migrations/0001_init
```

3. **Generate full init SQL (from empty → current schema)**

```bash
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0001_init/migration.sql
```

4. **Mark as applied (baseline history; don’t run SQL)**

```bash
npx prisma migrate resolve --applied 0001_init
```

5. **Verify & generate client**

```bash
npx prisma migrate status
npx prisma generate
```

> You’re now clean. Future changes = normal:

```bash
# edit schema.prisma
npx prisma migrate dev --name add_something
```

---

## Rules of thumb (essentials)

* **Do not** run `prisma migrate reset` in this flow—it drops data.
* Always run `db pull` first so `schema.prisma` matches the live DB.
* The `0001_init/migration.sql` is a record of how to build your current schema from scratch. You **do not execute** it during baselining—`resolve --applied` just records it in `_prisma_migrations`.
* Folder name passed to `resolve` must exactly match the directory name.

---

## Common follow-ups

**Add constraints later (e.g., FK + UNIQUE):**

```bash
npx prisma migrate dev --create-only --name enforce_constraints
# edit the generated migration.sql if you need custom SQL
npx prisma migrate dev
```

**If drift ever appears again (after manual DB tweaks):**

* Prefer schema-first: change `schema.prisma` → `migrate dev`.
* If you *must* hotfix DB manually, repeat a **tiny** baseline:

    * create `000X_patch_name/` + put only the manual SQL you ran
    * `npx prisma migrate resolve --applied 000X_patch_name`

That’s it—concise and battle-tested.
