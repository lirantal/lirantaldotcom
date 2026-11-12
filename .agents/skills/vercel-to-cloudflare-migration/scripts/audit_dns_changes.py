#!/usr/bin/env python3
"""Compare Cloudflare JSON DNS snapshots offline; perform no network or mutations."""
import argparse
import json
import sys
from pathlib import Path

FIELDS = ("name", "type", "content", "ttl", "proxied", "priority", "data", "comment", "tags", "settings")


def pair(record):
    return (record["name"].lower().rstrip("."), record["type"].upper())


def read_records(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    info = data.get("result_info", {}) if isinstance(data, dict) else {}
    if isinstance(data, dict):
        data = data.get("dns", data.get("result"))
    if not isinstance(data, list):
        raise ValueError(f"{path}: expected a record array, a result array, or a dns array")
    if info.get("total_count", len(data)) > len(data):
        raise ValueError(f"{path}: incomplete paginated snapshot; collect all records first")
    indexed = {}
    for record in data:
        if not isinstance(record, dict) or not isinstance(record.get("name"), str) or not isinstance(record.get("type"), str):
            raise ValueError(f"{path}: a record is missing name/type")
        identity = ("id", record["id"]) if record.get("id") else ("record", *pair(record), record.get("content"), record.get("priority"))
        if identity in indexed:
            raise ValueError(f"{path}: duplicate record identity for {record['name']} {record['type']}")
        indexed[identity] = record
    return indexed


def allowed_pair(value):
    try:
        name, kind = value.rsplit(":", 1)
    except ValueError as exc:
        raise argparse.ArgumentTypeError("use an exact DNS name:type pair") from exc
    name, kind = name.lower().rstrip("."), kind.upper()
    if not name or not kind or any(char.isspace() for char in name):
        raise argparse.ArgumentTypeError("use an exact DNS name:type pair")
    return name, kind


def audit(before, after, allowed):
    expected, unexpected = [], []
    for identity in sorted(set(before) | set(after), key=repr):
        old, new = before.get(identity), after.get(identity)
        if old is None:
            changes = [(new, "added", [])]
        elif new is None:
            changes = [(old, "removed", [])]
        elif pair(old) != pair(new):
            # A record moved to another name/type needs approval for BOTH pairs.
            changes = [(old, "removed", []), (new, "added", [])]
        else:
            fields = [key for key in FIELDS if old.get(key) != new.get(key)]
            changes = [(new, "modified", fields)] if fields else []
        for record, action, fields in changes:
            name, kind = pair(record)
            item = {"action": action, "name": name, "type": kind}
            if fields:
                item["fields"] = fields
            (expected if (name, kind) in allowed else unexpected).append(item)
    return {"allowed_changes": expected, "unexpected_changes": unexpected, "ok": not unexpected}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("before")
    parser.add_argument("after")
    parser.add_argument("--allow-record", action="append", type=allowed_pair, default=[], metavar="NAME:TYPE", help="exact allowed pair; repeat for each approved A/AAAA/CNAME replacement")
    args = parser.parse_args()
    try:
        result = audit(read_records(args.before), read_records(args.after), set(args.allow_record))
    except (ValueError, OSError, TypeError, KeyError) as exc:
        print(f"DNS snapshot error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(result, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
