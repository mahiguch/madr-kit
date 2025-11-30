#!/bin/bash
#
# MADR Initialization Script
# Sets up a new MADR project structure and installs dependencies
#
# Usage: ./init-madr.sh [OPTIONS]
#
# Options:
#   -o, --output-dir DIR      Decisions directory (default: docs/decisions)
#   -t, --template-dir DIR    Template directory (default: .madrkit/templates)
#   -f, --force              Reinitialize even if already initialized
#   -q, --quiet              Suppress non-error output
#   -h, --help               Show this help message
#

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
OUTPUT_DIR="docs/decisions"
TEMPLATE_DIR=".madrkit/templates"
FORCE=false
QUIET=false

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--output-dir)
      OUTPUT_DIR="$2"
      shift 2
      ;;
    -t|--template-dir)
      TEMPLATE_DIR="$2"
      shift 2
      ;;
    -f|--force)
      FORCE=true
      shift
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

# Main initialization logic
main() {
  # Check if already initialized
  if [ -d "$OUTPUT_DIR" ] && [ "$FORCE" != true ]; then
    info "MADR project is already initialized at $OUTPUT_DIR"
    exit 0
  fi

  # Step 1: Check if npm is available
  if ! command -v npm &> /dev/null; then
    error "npm is not installed. Please install Node.js and npm."
    exit 1
  fi

  # Step 2: Install MADR package
  log "Installing MADR package..."
  if ! npm install madr --save-dev 2>/dev/null; then
    error "Failed to install MADR package"
    exit 1
  fi

  # Step 3: Create directory structure
  log "Creating directory structure: $OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
  mkdir -p "$TEMPLATE_DIR/commands"

  # Step 4: Copy templates from node_modules
  log "Setting up templates in $TEMPLATE_DIR"
  if [ -d "node_modules/madr/template" ]; then
    cp -r "node_modules/madr/template"/* "$TEMPLATE_DIR/" 2>/dev/null || true
  fi

  log "MADR project initialized successfully"
  info "Ready to create your first decision record"
}

# Run main function
main
exit 0
