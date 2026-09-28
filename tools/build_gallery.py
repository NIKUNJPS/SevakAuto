"""Build the reel gallery, the home-page top 10, video structured data and sitemap.xml.

Reads tools/reels.json and media/video/sevak-<id>.mp4, writes posters to
media/poster/ and rewrites the marked blocks in gallery.html and index.html.

    python tools/build_gallery.py

Needs ffmpeg/ffprobe on PATH (or set FFMPEG_DIR).
"""
import html
import json
import os
import re
import subprocess
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.sevakauto.in/"
FF_DIR = os.environ.get("FFMPEG_DIR", "")
FFMPEG = os.path.join(FF_DIR, "ffmpeg") if FF_DIR else "ffmpeg"
FFPROBE = os.path.join(FF_DIR, "ffprobe") if FF_DIR else "ffprobe"

PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z"/></svg>'
MUTED = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/></svg>'


def esc(s):
    return html.escape(s, quote=True)


def probe(path):
    out = subprocess.check_output([FFPROBE, "-v", "error", "-show_entries", "format=duration",
                                   "-of", "csv=p=0", path])
    return float(out.strip())


def poster(src, dst, t):
    if os.path.exists(dst):
        return
    subprocess.run([FFMPEG, "-nostdin", "-v", "error", "-y", "-ss", "%.2f" % t, "-i", src,
                    "-frames:v", "1", "-q:v", "5", dst], check=True)


def mmss(sec):
    sec = int(round(sec))
    return "%d:%02d" % (sec // 60, sec % 60)


def iso_dur(sec):
    return "PT%dS" % int(round(sec))


def replace_block(text, name, content):
    pat = re.compile(r"(<!-- %s:START -->)(.*?)(<!-- %s:END -->)" % (name, name), re.S)
    if not pat.search(text):
        raise SystemExit("marker %s not found" % name)
    return pat.sub(lambda m: m.group(1) + "\n" + content + "\n" + m.group(3), text)


def main():
    data = json.load(open(os.path.join(ROOT, "tools", "reels.json"), encoding="utf-8"))
    cats = data["categories"]
    os.makedirs(os.path.join(ROOT, "media", "poster"), exist_ok=True)

    reels = []
    for r in data["reels"]:
        vid = "media/video/sevak-%s.mp4" % r["id"]
        vpath = os.path.join(ROOT, vid)
        if not os.path.exists(vpath):
            print("missing", vid)
            continue
        d = probe(vpath)
        pst = "media/poster/sevak-%s.jpg" % r["id"]
        poster(vpath, os.path.join(ROOT, pst), d * r.get("poster", 0.25))
        reels.append(dict(r, video=vid, poster_img=pst, dur=d, tag=cats[r["cat"]]))

    # ---------- gallery ----------
    counts = {k: sum(1 for r in reels if r["cat"] == k) for k in cats}
    filt = ['<button class="filter is-active" type="button" data-filter="all">All videos <span>%d</span></button>' % len(reels)]
    for k, label in cats.items():
        if counts[k]:
            filt.append('<button class="filter" type="button" data-filter="%s">%s <span>%d</span></button>' % (k, esc(label), counts[k]))
    grid = []
    for r in reels:
        grid.append(
            '<button class="reel" type="button" data-reel data-cat="{cat}" data-src="{v}" data-title="{t}" data-tag="{tag}">'
            '<img src="{p}" alt="{t} — Sevak Auto, Nashik" width="540" height="960" loading="lazy" decoding="async">'
            '<span class="reel__play">{play}</span><span class="reel__dur">{d}</span>'
            '<span class="reel__meta"><span class="reel__tag">{tag}</span><b>{t}</b></span></button>'.format(
                cat=r["cat"], v=r["video"], p=r["poster_img"], t=esc(r["title"]), tag=esc(r["tag"]),
                play=PLAY, d=mmss(r["dur"])))

    def video_ld(r):
        return {
            "@type": "VideoObject",
            "name": r["title"],
            "description": r["desc"] + " Filmed at Sevak Auto, Balram Nagar, Nashik.",
            "thumbnailUrl": SITE + r["poster_img"],
            "contentUrl": SITE + r["video"],
            "uploadDate": r["date"] + "T10:00:00+05:30",
            "duration": iso_dur(r["dur"]),
            "publisher": {"@id": SITE + "#business"},
        }

    gal_ld = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Sevak Auto workshop videos — Nashik",
        "numberOfItems": len(reels),
        "itemListElement": [dict(position=i + 1, item=video_ld(r), **{"@type": "ListItem"}) for i, r in enumerate(reels)],
    }

    gpath = os.path.join(ROOT, "gallery.html")
    g = open(gpath, encoding="utf-8").read()
    g = replace_block(g, "FILTERS", "\n".join(filt))
    g = replace_block(g, "REELS", "\n".join(grid))
    g = replace_block(g, "REELS-LD", '<script type="application/ld+json">\n%s\n</script>' % json.dumps(gal_ld, ensure_ascii=False, indent=1))
    g = re.sub(r'data-reel-count>\d+<', 'data-reel-count>%d<' % len(reels), g)
    open(gpath, "w", encoding="utf-8", newline="\n").write(g)

    # ---------- home top 10 ----------
    top = sorted([r for r in reels if r.get("top")], key=lambda r: r["top"])
    cards = []
    for r in top:
        cards.append(
            '<article class="rc" data-reel data-src="{v}" data-title="{t}" data-tag="{tag}">'
            '<video muted playsinline loop preload="none" poster="{p}" data-src="{v}" aria-label="{t}"></video>'
            '<span class="rc__rank">{n:02d}</span>'
            '<button class="rc__sound" type="button" aria-label="Turn sound on" aria-pressed="false">{muted}</button>'
            '<button class="rc__open" type="button" aria-label="Play “{t}” full screen with sound"><span class="rc__play">{play}</span></button>'
            '<div class="rc__meta"><span class="reel__tag">{tag}</span><h3>{t}</h3><span class="rc__dur">{d}</span></div>'
            '</article>'.format(v=r["video"], p=r["poster_img"], t=esc(r["title"]), tag=esc(r["tag"]),
                                n=r["top"], muted=MUTED, play=PLAY, d=mmss(r["dur"])))
    top_ld = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Top 10 jobs from the Sevak Auto workshop, Nashik",
        "itemListElement": [dict(position=i + 1, item=video_ld(r), **{"@type": "ListItem"}) for i, r in enumerate(top)],
    }
    ipath = os.path.join(ROOT, "index.html")
    ix = open(ipath, encoding="utf-8").read()
    ix = replace_block(ix, "TOP10", "\n".join(cards))
    ix = replace_block(ix, "TOP10-LD", '<script type="application/ld+json">\n%s\n</script>' % json.dumps(top_ld, ensure_ascii=False, indent=1))
    ix = re.sub(r'data-reel-count>\d+<', 'data-reel-count>%d<' % len(reels), ix)
    open(ipath, "w", encoding="utf-8", newline="\n").write(ix)

    # ---------- sitemap ----------
    today = date.today().isoformat()
    pages = [("", "1.0", "weekly"), ("services.html", "0.9", "monthly"), ("gallery.html", "0.9", "weekly"),
             ("testimonials.html", "0.7", "monthly"), ("about.html", "0.7", "monthly"), ("contact.html", "0.8", "monthly")]

    def vtag(r):
        return ("    <video:video>\n"
                "      <video:thumbnail_loc>%s</video:thumbnail_loc>\n"
                "      <video:title>%s</video:title>\n"
                "      <video:description>%s</video:description>\n"
                "      <video:content_loc>%s</video:content_loc>\n"
                "      <video:duration>%d</video:duration>\n"
                "      <video:publication_date>%sT10:00:00+05:30</video:publication_date>\n"
                "    </video:video>\n") % (SITE + r["poster_img"], esc(r["title"]), esc(r["desc"]),
                                            SITE + r["video"], round(r["dur"]), r["date"])
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">']
    for path, pri, freq in pages:
        vids = ""
        if path == "":
            vids = "".join(vtag(r) for r in top)
        elif path == "gallery.html":
            vids = "".join(vtag(r) for r in reels)
        out.append("  <url>\n    <loc>%s%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>%s</changefreq>\n    <priority>%s</priority>\n%s  </url>"
                   % (SITE, path, today, freq, pri, vids))
    out.append("</urlset>\n")
    open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8", newline="\n").write("\n".join(out))
    print("reels:", len(reels), "top:", len(top))


if __name__ == "__main__":
    main()
