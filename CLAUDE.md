# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This is currently a **test project directory** with no active codebase. The directory contains:
- Claude configuration (`.claude/settings.json`)
- Custom error-log-analyzer agent configuration
- Temporary files from previous Claude sessions

## Active Plugins

- **context7**: Enabled for live documentation access

## Custom Agents

### error-log-analyzer
Located in `.claude/agents/error-log-analyzer.md`

Use this agent when analyzing error logs or diagnosing application issues. The agent:
- First assesses the environment configuration
- Parses error messages and stack traces systematically
- Identifies root causes vs symptoms
- Provides actionable recommendations with priority

Invoke with: `/task` or when errors are encountered during development.

## Instructions for Project Initialization

When code is added to this repository, update this file with:

1. **Commands**: Build, test, lint, and development server commands
2. **Architecture**: High-level overview of codebase structure and key patterns
3. **Tech Stack**: Languages, frameworks, databases, and major dependencies
4. **Development Workflow**: How to run tests, debug, and deploy

Avoid repeating information that's already in README.md or listing obvious file structures.
