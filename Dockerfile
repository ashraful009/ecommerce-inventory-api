# ==========================================
# Stage 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Dependency ক্যাশিং অপটিমাইজেশন
COPY package*.json ./
RUN npm ci

# কোড এবং কনফিগ কপি
COPY tsconfig.json ./
COPY src ./src

# TypeScript বিল্ড
RUN npm run build

# শুধুমাত্র প্রোডাকশন ডিপেন্ডেন্সি রাখা
RUN npm prune --production

# ==========================================
# Stage 2: Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# নন-রুট ইউজার সেটআপ (সিকিউরিটির জন্য)
USER node

# বিল্ডার স্টেজ থেকে ফাইল কপি
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package*.json ./

EXPOSE 5000

CMD ["node", "dist/server.js"]