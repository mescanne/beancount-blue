import httpx


def push_message(title: str, msg: str, notify_token: str, priority: str = "default"):
    _ = httpx.post(
        f"https://ntfy.sh/{notify_token}",
        headers={
            "Title": title,
            "Priority": priority,
        },
        data=bytes(msg.encode(encoding="utf-8")),  # pyright: ignore[reportArgumentType]
    )
