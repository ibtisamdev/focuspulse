# Scripts

This directory contains utility scripts for the FocusPulse web application.

## seed-sessions.ts

Generates mock session data for testing the History page functionality.

### What it creates

- **~80-100 sessions** spread over the past 30 days
- **10-day active streak** (most recent 10 days with multiple sessions each)
- **Sporadic sessions** from 11-30 days ago
- **Mix of planned and ad-hoc sessions** (70% planned, 30% ad-hoc)
- **Realistic durations** (30 minutes to 3 hours)
- **Break times** (0-15% of total duration)
- **Session notes** (some sessions have notes, some don't)
- **Various times of day** (8 AM to 6 PM) for testing insights

### Usage

```bash
# From the web package directory
cd packages/web
bun run seed:sessions your-email@example.com

# Or from the root directory
cd packages/web && bun run scripts/seed-sessions.ts your-email@example.com
```

### Prerequisites

1. **Prisma Client must be generated**:
   ```bash
   bun prisma generate
   ```
2. **Database URL configured**: Ensure `DATABASE_URL` is set in your `.env` file
3. You must be **signed up and signed in** to the application at least once
4. Use the **same email** you signed up with
5. The user must be synced to the database (happens automatically on first sign-in)

### Example

```bash
bun run seed:sessions john.doe@example.com
```

### Output

The script will:
1. Find your user account in the database
2. Check for existing sessions (warns if any exist)
3. Create ~80-100 new sessions
4. Display statistics:
   - Total sessions created
   - Total hours
   - Planned vs Ad-hoc breakdown
   - Average session duration

### Notes

- Running the script multiple times will **add more sessions** to existing data
- It does **not** delete existing sessions
- All sessions are marked as `completed: true`
- The script creates a realistic 10-day streak for testing streak functionality
- Break times are automatically calculated and excluded from focus time

### Testing the History Page

After running the seed script:

1. Visit `/dashboard/history` in your browser
2. You should see:
   - **Stats cards** with real numbers
   - **Weekly overview** with actual hours per day
   - **Session timeline** with all your sessions
   - **Insights** showing your best day, peak hours, and completion rate
3. Test the filters and search functionality
4. Try the "Load More" button to see pagination in action

### Troubleshooting

**Script hangs at "Looking for user..." or "Connecting to database..."**
- **First time?** Wait 30-45 seconds - Neon serverless database needs time to wake up from suspension
- Run `bun prisma generate` if you haven't already - this generates the Prisma Client
- Verify `DATABASE_URL` is set correctly in your `.env` file
- Check your Neon dashboard to ensure the database is active
- The script now has a 45-second timeout and will show an error if connection fails

**Error: "No user found with email"**
- Make sure you've signed in to the application at least once
- Check that you're using the correct email address
- Verify the user exists in the database (use `bun run db:studio` to check)
- Ensure Clerk webhook has synced your user to the database

**Error: "Please provide your email address"**
- You forgot to pass your email as an argument
- Use: `bun run seed:sessions your-email@example.com`

**Error: "DATABASE_URL is not set"**
- Add `DATABASE_URL=your-connection-string` to your `.env` file
- Get the connection string from your Neon dashboard
- The .env file should be in the `packages/web/` directory
