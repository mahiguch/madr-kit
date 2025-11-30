#!/bin/bash
#
# Decision Creation Script
# Guides user through creating a new architectural decision record
#
# Usage: ./create-decision.sh [OPTIONS]
#
# Options:
#   -d, --dir DIR             Decisions directory (default: docs/decisions)
#   -t, --template PATH       Template file path (default: .madrkit/templates/decision-template.md)
#   -q, --quiet               Suppress non-error output
#   -h, --help                Show this help message
#

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
DECISIONS_DIR="docs/decisions"
TEMPLATE_PATH=".madrkit/templates/decision-template.md"
QUIET=false

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -d|--dir)
      DECISIONS_DIR="$2"
      shift 2
      ;;
    -t|--template)
      TEMPLATE_PATH="$2"
      shift 2
      ;;
    -q|--quiet)
      QUIET=true
      shift
      ;;
    -h|--help)
      grep "^#" "$0" | sed 's/^# *//'
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Helper functions
log() {
  if [ "$QUIET" != true ]; then
    echo -e "${GREEN}✓${NC} $1"
  fi
}

error() {
  echo -e "${RED}✗${NC} $1" >&2
}

info() {
  if [ "$QUIET" != true ]; then
    echo -e "${BLUE}ℹ${NC} $1"
  fi
}

prompt_title() {
  local title=""
  while [ -z "$title" ]; do
    read -p "Decision title: " title
    if [ -z "$title" ]; then
      error "Title cannot be empty"
    elif [ ${#title} -gt 200 ]; then
      error "Title must be 200 characters or less"
      title=""
    fi
  done
  echo "$title"
}

prompt_status() {
  local status
  echo "Decision status:"
  select status in "proposed" "accepted" "rejected" "deprecated" "superseded"; do
    case $status in
      proposed|accepted|rejected|deprecated|superseded)
        echo "$status"
        break
        ;;
      *)
        error "Invalid status"
        ;;
    esac
  done
}

prompt_multiline() {
  local prompt="$1"
  local content=""
  echo "$prompt (Press Ctrl+D when done):"
  while IFS= read -r line; do
    if [ -z "$content" ]; then
      content="$line"
    else
      content="$content"$'\n'"$line"
    fi
  done
  echo "$content"
}

# Main script
main() {
  # Check if decisions directory exists
  if [ ! -d "$DECISIONS_DIR" ]; then
    error "Decisions directory not found: $DECISIONS_DIR"
    exit 1
  fi

  log "Creating new decision record"

  # Gather information
  title=$(prompt_title)
  status=$(prompt_status)
  context=$(prompt_multiline "Context")
  decision=$(prompt_multiline "Decision")
  consequences=$(prompt_multiline "Consequences")

  # Optional fields
  read -p "Deciders (comma-separated, optional): " deciders
  read -p "Related decisions (comma-separated numbers, optional): " related

  log "Decision information collected"
  info "Run 'madrkit.decide' to finalize and save the decision"
}

# Run main function
main
exit 0
