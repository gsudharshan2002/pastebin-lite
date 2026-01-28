import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { redis } from "@/lib/redis";
import { nowMs } from "@/lib/time";

export async function POST(req: Request) {
  let body: { content: string; ttl_seconds?: number; max_views?: number };

  /* -----------------------------------
     1️⃣ Parse JSON safely
  ----------------------------------- */
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    /* -----------------------------------
       2️⃣ Extract & validate input
    ----------------------------------- */
    const { content, ttl_seconds, max_views } = body;

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be integer >= 1" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be integer >= 1" },
        { status: 400 }
      );
    }

    /* -----------------------------------
       3️⃣ Create paste object
    ----------------------------------- */
    const id = nanoid(8);
    const now = nowMs(req);

    const paste = {
      content,
      created_at: now,
      expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
      max_views: max_views ?? null,
      views: 0,
    };

    /* -----------------------------------
       4️⃣ Save to Redis
    ----------------------------------- */
    await redis.set(`paste:${id}`, paste);

    /* -----------------------------------
       5️⃣ Base URL from ENV (✅ correct way)
    ----------------------------------- */
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_BASE_URL not configured" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id,
        url: `${baseUrl}/p/${id}`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/pastes ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

