# Connection check — know what a connector can do before you need it

A skill that will **write through a connector** — draft or send an email, create
a Google Doc, put a file in Drive, schedule a post, stage a send — checks that
connector's **capability at the start of the run**, not at the moment of the
write. Skills point here from their Step 0 instead of restating the procedure.

The failure this prevents: a session drafts a whole deliverable, reaches the
"create the draft" step, and only then finds the connector is read-only or
absent — after the user has invested the time. Present is not the same as
writable.

## The check — at the start, before any work

1. **List the tools the connector actually offers in this session.** A
   connector counts only through its MCP tools being present
   (`docs/connectors.md`). Look at the tool names, not the connector's name.
2. **Classify the capability the run needs:**

   | Need | Writable when a tool like this exists | Otherwise |
   |---|---|---|
   | Email draft | a Gmail `create_draft` (or equivalent draft tool) | read-only — search / read only |
   | Email send | a `send_message` / send tool | draft-only, or read-only |
   | Document | a Docs / Drive `create_file` / create-document tool | read-only — search / read only |
   | Channel post / schedule | the channel connector's post / schedule tool | manual hand-off |

3. **Say it at once.** If the needed capability is **read-only** or **missing**,
   tell the user before doing the work — one line: what is missing and what you
   will do instead. Never discover it when the write is attempted.
4. **Offer the fallback** and let the user choose:
   - a **local file** in the granted folder (the normal AOS output — e.g.
     `deliverables/<YYYY-MM>/…`), or
   - **text to copy** — the subject + body (or the document body) in the chat,
     ready to paste.
5. **Record the mode** in the run's output (connector-assisted / fallback), as
   the skill's connector status line already does.

## Masking — when listing connections

When the check (or a session-start brief) lists connections to the user:

- **Email addresses** — first letter + `***`, domain first letter + `***`, keep
  the TLD: `j***@d***.com`.
- **Headers and tokens** — never print values: `Authorization: Bearer ****`,
  `api_key=****`. Name the header, mask the value.
- **Account ids / subdomains** — show only enough to tell two apart
  (`acct-****42`).

Never paste a raw token, header or full address into a deliverable, the
captain's log, or a feedback record.

## Relation to preflight

This is the write-capability half of the `connectors` preflight check
(`docs/preflight.md`): preflight asks *is the connector there?*; this asks *can
it do the write this run needs?* The granted folder's `CLAUDE.md` session-start
health check runs it once per session; a skill that writes through a connector
re-runs it in its own Step 0.
