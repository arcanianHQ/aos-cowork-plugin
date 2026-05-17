#!/usr/bin/env bash
#
# Lint every skill's `allowed-tools:` frontmatter against a known allowlist.
# A plugin skill that quietly grants itself a tool nobody vetted — a way to
# run shell, reach the network, or write files it has no reason to — is the
# plugin-specific poisoning vector. A new tool outside the allowlist fails
# CI so a human looks at it.
#
# Allowlist = the tools the AOS skill set legitimately uses today. Adding a
# tool is a deliberate act: extend ALLOWED here, in the same PR, on review.
#
# Run locally:  bash .github/scripts/check-allowed-tools.sh
set -euo pipefail

ALLOWED="Read Grep Glob Bash Write Edit WebFetch"
fail=0

for f in aos/skills/*/SKILL.md; do
  [ -e "$f" ] || continue
  line=$(grep -m1 '^allowed-tools:' "$f" || true)

  if [ -z "$line" ]; then
    echo "::error file=$f::no allowed-tools frontmatter"
    fail=1
    continue
  fi

  if [[ "$line" != *"["* ]]; then
    echo "::error file=$f::allowed-tools must use the inline [list] form"
    fail=1
    continue
  fi

  # extract between [ and ], drop quotes/spaces, split on comma
  tools=$(echo "$line" | sed -E 's/.*\[(.*)\].*/\1/' | tr ',' '\n' | tr -d ' "'\''')
  for t in $tools; do
    [ -z "$t" ] && continue
    case " $ALLOWED " in
      *" $t "*) ;;
      *)
        echo "::error file=$f::skill grants un-allowlisted tool '$t' — review required"
        fail=1
        ;;
    esac
  done
done

if [ "$fail" -ne 0 ]; then
  echo ""
  echo "A skill grants a tool outside the vetted allowlist ($ALLOWED)."
  echo "If the tool is legitimately needed, add it to ALLOWED in this script in the same PR."
  exit 1
fi

echo "OK — every skill's allowed-tools is within the vetted allowlist."
