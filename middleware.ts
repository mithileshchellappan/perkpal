import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that are public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/', // Allow access to the homepage
  '/sign-in(.*)',
  '/sign-up(.*)', 
]);

export default clerkMiddleware(async (auth, req) => {
  // if (!isPublicRoute(req)) {
  //   await auth.protect(); // Use auth.protect() directly
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}; 