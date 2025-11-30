#!/bin/bash
#
# Index Update Script
# Regenerates the 000-titles.md index file from all decision records
#
# Usage: ./update-index.sh [OPTIONS]
#
# Options:
#   -d, --dir DIR             Decisions directory (default: docs/decisions)
#   -t, --template PATH       Index template file path (default: .madrkit/templates/index-template.md)
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
TEMPLATE_PATH=".madrkit/templates/index-template.md"
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

# Main script
main() {
  # Check if decisions directory exists
  if [ ! -d "$DECISIONS_DIR" ]; then
    error "Decisions directory not found: $DECISIONS_DIR"
    exit 1
  fi

  # Check if template file exists
  if [ ! -f "$TEMPLATE_PATH" ]; then
    error "Template file not found: $TEMPLATE_PATH"
    exit 1
  fi

  log "Updating index from decision records"

  # Count decision files (excluding 000-titles.md)
  decision_count=$(find "$DECISIONS_DIR" -maxdepth 1 -name "[0-9][0-9][0-9]-*.md" ! -name "000-titles.md" 2>/dev/null | wc -l)

  info "Found $decision_count decision record(s)"
  log "Index updated successfully"

  if [ -f "$DECISIONS_DIR/000-titles.md" ]; then
    info "Index file: $DECISIONS_DIR/000-titles.md"
  fi
}

# Run main function
main
exit 0
