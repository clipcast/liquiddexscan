# ============================================================
# Stage 1: Build frontend (Next.js static export)
# ============================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/ ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Build backend + serve everything
# ============================================================
FROM node:22-alpine

WORKDIR /app

COPY backend/package.json backend/tsconfig.json ./
RUN npm install

COPY backend/src/ ./src/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/out /app/frontend/out

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["npx", "tsx", "src/server.ts"]
