import { NextResponse } from "next/server";

// Global in-memory cache fallback for serverless instances
const globalSync = globalThis as unknown as { syncCache: Record<string, any> };
if (!globalSync.syncCache) globalSync.syncCache = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch("https://jsonblob.com/api/jsonBlob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const location = res.headers.get("location");
    let id = "";
    if (location) {
      id = location.split("/").pop() || "";
    }
    if (!id) {
      id = "kb_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }
    globalSync.syncCache[id] = body;
    return NextResponse.json({ id });
  } catch (err) {
    const id = "kb_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    return NextResponse.json({ id });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...payload } = body;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    globalSync.syncCache[id] = payload;

    if (!id.startsWith("kb_")) {
      fetch(`https://jsonblob.com/api/jsonBlob/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    if (!id.startsWith("kb_")) {
      try {
        const res = await fetch(`https://jsonblob.com/api/jsonBlob/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          globalSync.syncCache[id] = data;
          return NextResponse.json(data);
        }
      } catch (e) {
        // Fallthrough to memory cache
      }
    }

    if (globalSync.syncCache[id]) {
      return NextResponse.json(globalSync.syncCache[id]);
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
