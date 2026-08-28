import json
from pathlib import Path

INDEX_PATH = "index.json"
BLOG_DIR = Path(__file__).resolve().parent
SITE_ROOT = BLOG_DIR.parent  # where index.html is


def build_index():
    posts = []
    for json_file in BLOG_DIR.rglob("*.json"):
        if json_file.name == "index.json":
            continue
        with open(json_file, "r", encoding="utf-8") as f:
            post = json.load(f)
        posts.append(
            {
                "path": json_file.relative_to(SITE_ROOT).as_posix(),
                "date": post.get("date", ""),
                "header": post.get("header", ""),
                "tldr": post.get("tldr", ""),
            }
        )

    posts.sort(key=lambda p: p["date"], reverse=True)

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2)

    print(f"Wrote {len(posts)} posts to {INDEX_PATH}")


if __name__ == "__main__":
    build_index()
