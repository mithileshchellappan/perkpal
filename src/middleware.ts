import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that are public (accessible without authentication)
const isPublicRoute = createRouteMatcher([
  '/', // Allow access to the homepage
  '/sign-in(.*)', // Allow access to sign-in and its sub-routes
  '/sign-up(.*)', // Allow access to sign-up and its sub-routes
  '/api/public/(.*)' // Example: if you have public API routes
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, then protect it.
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