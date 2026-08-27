#!/usr/bin/env bash
# Stop hook (project-scoped, Stellara only): reminds the agent to update
# CLAUDE.md / STORY.md when code commits (or uncommitted changes) exist
# since the memory files were last touched. Never blocks silently forever:
# a fingerprint of the current "unreflected work" state is stored outside
# the repo so the same state only triggers once.
set -euo pipefail

repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$repo_root" || exit 0

[ -f CLAUDE.md ] || exit 0

memory_files=(CLAUDE.md STORY.md tasks/lessons.md)

last_memory_commit=""
last_memory_time=0
for f in "${memory_files[@]}"; do
  c=$(git log -1 --format=%H -- "$f" 2>/dev/null || true)
  [ -z "$c" ] && continue
  ct=$(git log -1 --format=%ct -- "$f")
  if [ "$ct" -gt "$last_memory_time" ]; then
    last_memory_commit="$c"
    last_memory_time="$ct"
  fi
done

if [ -n "$last_memory_commit" ]; then
  range="$last_memory_commit..HEAD"
else
  range="HEAD"
fi

code_commits=$(git log --format=%H "$range" -- . ":(exclude)CLAUDE.md" ":(exclude)STORY.md" ":(exclude)tasks/lessons.md" 2>/dev/null || true)
uncommitted=$(git status --porcelain 2>/dev/null || true)

if [ -z "$code_commits" ] && [ -z "$uncommitted" ]; then
  exit 0
fi

state_dir="$HOME/.claude/memory-hook-state"
mkdir -p "$state_dir"
state_key=$(printf '%s' "$repo_root" | md5sum | cut -d' ' -f1)
state_file="$state_dir/$state_key.state"

fingerprint=$(printf '%s\n%s' "$code_commits" "$uncommitted" | md5sum | cut -d' ' -f1)

if [ -f "$state_file" ] && [ "$(cat "$state_file")" = "$fingerprint" ]; then
  exit 0
fi

echo "$fingerprint" > "$state_file"

n_commits=$(printf '%s\n' "$code_commits" | grep -c . || true)
msg="Rappel memoire projet (stellara) : $n_commits commit(s) de code depuis la derniere mise a jour de CLAUDE.md."
if [ -n "$uncommitted" ]; then
  msg="$msg Modifications non commitees egalement presentes."
fi
msg="$msg Verifie si CLAUDE.md (et STORY.md pour un pivot business) doit etre mis a jour avant de terminer la session."

jq -n --arg reason "$msg" '{decision: "block", reason: $reason}'
