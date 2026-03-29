# Backend Server.ts Error Fixes

## Status: Editing Complete

### Step 1: ✅ Fix database.ts - Added mongoose.connect() + dotenv
### Step 2: ✅ Update package.json - Upgraded @types/mongoose ^8.0.11, @types/express ^4.17.21
### Step 3: ✅ Fix server.ts - Removed manual `updatedAt = new Date()` from all 4 cart routes (add/update/remove/clear)
### Step 4: ✅ Created .env.example with MONGO_URI template
### Step 5: [TODO] Mark original backend/TODO.md items done
### Step 6: Test: cd backend && npm install && npm run build && npm run dev
### Step 7: [TODO] Create/run seed script if needed

**Next commands to run**:
```
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI (install MongoDB locally or use Atlas)
npm install
npm run build
npm run dev
```
Test: curl http://localhost:5000/api/health

**Original TODO.md items fixed**: Cart schema redundancy resolved.
