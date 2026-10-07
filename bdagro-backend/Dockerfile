# ==========================================
# Stage 1: Dependencies & Build Environment
# ==========================================
FROM node:20-alpine AS builder

# ওয়ার্কিং ডিরেক্টরি সেট করা
WORKDIR /app

# শুধুমাত্র package.json এবং package-lock.json কপি করা (ক্যাশিংয়ের সুবিধার জন্য)
COPY package*.json ./

# সব ডিপেন্ডেন্সি (dev dependencies সহ) ইনস্টল করা
RUN npm ci

# সোর্স কোড কপি করা
COPY . .

# টাইপস্ক্রিপ্ট কোড কম্পাইল করে জাভাস্ক্রিপ্টে (dist ফোল্ডারে) রূপান্তর করা
RUN npm run build

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

# প্রোডাকশন এনভায়রনমেন্ট ভ্যারিয়েবল সেট করা
ENV NODE_ENV production

# সিকিউরিটির জন্য রুট ইউজারের বদলে নন-রুট (Non-root) ইউজার তৈরি করা
RUN addgroup -g 1001 -S nodejs && \
    adduser -S expressjs -u 1001

# শুধুমাত্র package.json এবং package-lock.json কপি করা
COPY package*.json ./

# শুধুমাত্র প্রোডাকশন ডিপেন্ডেন্সি ইনস্টল করা (dev dependencies বাদ দিয়ে)
RUN npm ci --omit=dev

# Builder স্টেজ থেকে শুধুমাত্র কম্পাইল করা কোড (dist) কপি করে আনা
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist

# নন-রুট ইউজারে সুইচ করা
USER expressjs

# ব্যাকএন্ড পোর্ট এক্সপোজ করা (আপনার Nginx কনফিগ অনুযায়ী পোর্ট 5000)
EXPOSE 5000

# অ্যাপ্লিকেশন স্টার্ট করার কমান্ড
CMD ["node", "dist/server.js"]
