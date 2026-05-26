#!/usr/bin/env bash
# ─── Kafaale Qaad — One-click SQLite → PostgreSQL migration ───────────────
# Usage: SUPABASE_URL="postgresql://..." bash migrate-to-postgres.sh
set -e

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ ERROR: Set SUPABASE_URL first:"
  echo '   export SUPABASE_URL="postgresql://postgres:PASSWORD@db.XXX.supabase.co:5432/postgres"'
  exit 1
fi

echo "⚡ Switching Kafaale backend to PostgreSQL..."

# 1. Backup current .env
cp .env .env.sqlite.backup
echo "✅ .env backed up to .env.sqlite.backup"

# 2. Switch schema to postgresql
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
echo "✅ schema.prisma → postgresql"

# 3. Delete SQLite migrations (incompatible with PostgreSQL)
rm -rf prisma/migrations
echo "✅ Old SQLite migrations removed"

# 4. Set DATABASE_URL for migration
export DATABASE_URL="$SUPABASE_URL"

# 5. Run fresh migration on Supabase
echo "🔄 Running Prisma migration on Supabase..."
npx prisma migrate dev --name init

# 6. Generate Prisma client
npx prisma generate

# 7. Seed the database
echo "🌱 Seeding production database..."
npx prisma db seed

# 8. Update .env for production use
cat > .env.production << EOF
PORT=5000
NODE_ENV=production
DATABASE_URL=${SUPABASE_URL}
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ANTHROPIC_API_KEY=
BASE_URL=
FRONTEND_URL=
EOF

echo ""
echo "✅ Migration complete!"
echo "   - PostgreSQL connected to Supabase"
echo "   - All tables created with indexes"
echo "   - Default users seeded"
echo ""
echo "📋 Default login credentials:"
echo "   super_admin → superadmin@kafaale.org / Kafaale123!"
echo "   admin       → admin@kafaale.org / Kafaale123!"
echo "   field_agent → agent@kafaale.org / Kafaale123!"
echo "   donor       → donor@kafaale.org / Kafaale123!"
echo ""
echo "⚠️  IMPORTANT: Change all passwords after first login!"
echo "   Production .env saved to .env.production"
echo "   Copy variables to Railway dashboard."
