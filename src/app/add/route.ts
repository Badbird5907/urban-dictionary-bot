import { env } from "@/env.mjs";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  return NextResponse.redirect(`https://discord.com/oauth2/authorize?client_id=${env.DISCORD_APP_ID}`)
}