# ── BUILD STAGE ──
FROM node:20-alpine AS builder
WORKDIR /app

# Install system utilities needed for building node dependencies if any
RUN apk add --no-cache libc6-compat

# Copy package descriptors
COPY package*.json ./
COPY prisma ./prisma/

# ── Switch Prisma provider to postgresql for production build ──
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' /app/prisma/schema.prisma

# Install dependencies (including devDependencies for tsc)
RUN npm ci

# Copy codebase and compile
COPY . .
# Re-apply the switch in case COPY . . overwrote it
RUN sed -i 's/provider = "sqlite"/provider = "postgresql"/' /app/prisma/schema.prisma

RUN npm run db:generate
RUN npm run build

# Remove development dependencies to keep final layer slim
RUN npm prune --omit=dev

# ── RUNTIME STAGE ──
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Create secure system user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy essential runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER expressjs

EXPOSE 5000

# Run DB migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
