import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";
import { Paste } from "@/lib/types";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const key = `paste:${id}`;

  const paste = await redis.get<Paste>(key);

  if (!paste) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const now = nowMs(req);

  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    return NextResponse.json({ error: "expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await redis.set(key, paste);

  return NextResponse.json(
    {
      content: paste.content,
      remaining_views:
        paste.max_views === null ? null : paste.max_views - paste.views,
      expires_at: paste.expires_at,
    },
    { status: 200 }
  );
}
