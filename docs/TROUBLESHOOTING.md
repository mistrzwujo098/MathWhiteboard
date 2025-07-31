# Troubleshooting Guide

## Common Issues and Solutions

### 1. Infinite Recursion in RLS Policies

**Error**: `infinite recursion detected in policy for relation "session_participants"`

**Solution**: 
Run the SQL script to fix the RLS policies:
```sql
-- Execute the fix script
psql -U your_user -d your_database -f supabase/fix_session_participants_rls.sql
```

Or apply directly in Supabase SQL Editor:
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `supabase/fix_session_participants_rls.sql`
3. Execute the query

### 2. DialogContent Missing DialogTitle Error

**Error**: `DialogContent requires a DialogTitle for the component to be accessible`

**Cause**: This error occurs when using Radix UI Dialog component without proper accessibility structure.

**Solution**:
If you encounter this error, ensure all Dialog components have proper structure:

```tsx
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// Option 1: With visible title
<Dialog.Root>
  <Dialog.Content>
    <Dialog.Title>Your Title Here</Dialog.Title>
    {/* content */}
  </Dialog.Content>
</Dialog.Root>

// Option 2: With hidden title for accessibility
<Dialog.Root>
  <Dialog.Content>
    <VisuallyHidden>
      <Dialog.Title>Hidden Title for Screen Readers</Dialog.Title>
    </VisuallyHidden>
    {/* content */}
  </Dialog.Content>
</Dialog.Root>
```

### 3. Missing Environment Variables

**Error**: `Your project's URL and Key are required to create a Supabase client!`

**Solution**:
1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. TypeScript Strict Mode Errors with Fabric.js

**Error**: Various type errors with Fabric.js objects

**Solution**: 
The project uses type assertions (`as any`) to handle Fabric.js v5 type incompatibilities. This is a known issue with Fabric.js TypeScript definitions.

## Getting Help

If you encounter other issues:
1. Check the browser console for detailed error messages
2. Review Supabase logs for backend errors
3. Ensure all dependencies are properly installed: `npm install`
4. Try clearing Next.js cache: `rm -rf .next && npm run dev`