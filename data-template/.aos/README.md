# .aos/ — runtime directory

Internal runtime artifacts for the AOS plugin. Rebuildable — safe to delete.

- Holds the **persisted copy** of the `/tmp` SQLite query index, if one is used.
- The live SQLite DB is **never** operated here — this folder is on a FUSE mount
  with no POSIX locking. The plugin builds the index in `/tmp` and copies the
  finished `.db` here to persist it.
