import { updateNotifications } from "@/lib/cron/notification-cron";
import { NextResponse, NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    await updateNotifications();
    return NextResponse.json({ message: 'Cron job initialized' });
}