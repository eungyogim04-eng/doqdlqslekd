import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Postly/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return NextResponse.json({ error: "Fetch failed" }, { status: 400 });

    const html = await res.text();

    function getMeta(property: string): string {
      // og: property
      const ogMatch = html.match(
        new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")
      );
      if (ogMatch) return ogMatch[1];
      // name= variant
      const nameMatch = html.match(
        new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, "i")
      );
      if (nameMatch) return nameMatch[1];
      // content first variant
      const altMatch = html.match(
        new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, "i")
      );
      return altMatch ? altMatch[1] : "";
    }

    function getTitle(): string {
      const og = getMeta("og:title");
      if (og) return og;
      const tw = getMeta("twitter:title");
      if (tw) return tw;
      const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return t ? t[1].trim() : "";
    }

    const title = getTitle().slice(0, 120);
    const description = (getMeta("og:description") || getMeta("description") || getMeta("twitter:description")).slice(0, 200);
    const image = getMeta("og:image") || getMeta("twitter:image");
    const siteName = getMeta("og:site_name");

    // Make absolute URL for image
    let imageUrl = image;
    if (imageUrl && imageUrl.startsWith("/")) {
      const base = new URL(url);
      imageUrl = `${base.origin}${imageUrl}`;
    }

    return NextResponse.json({ title, description, image: imageUrl, siteName, url });
  } catch {
    return NextResponse.json({ error: "Preview failed" }, { status: 500 });
  }
}
