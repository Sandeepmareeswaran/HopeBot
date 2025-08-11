import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
