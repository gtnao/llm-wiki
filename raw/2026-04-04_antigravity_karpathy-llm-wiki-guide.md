---
title: "Karpathy's LLM Wiki: The Complete Guide to His Idea File"
url: https://antigravity.codes/blog/karpathy-llm-wiki-idea-file
date: 2026-04-04
type: article
---

# Karpathy's LLM Wiki: The Complete Guide to His Idea File

Published: April 4, 2026 | Read Time: 25 minutes | Category: AI Deep Dive

## Article Summary

Andrej Karpathy, co-founder of OpenAI and former Tesla AI lead, released a GitHub gist describing an "idea file" — a pattern for building personal knowledge wikis maintained by LLMs rather than traditional RAG (Retrieval-Augmented Generation) systems.

## Key Concepts

**The Core Shift**: Instead of uploading documents for on-demand retrieval, users drop sources into a `raw/` directory where an LLM incrementally compiles them into an interlinked markdown wiki that persists and compounds over time.

**Three-Layer Architecture**:
1. **Raw Sources** (immutable reference documents)
2. **Wiki** (LLM-generated markdown files with summaries and connections)
3. **Schema** (configuration file defining structure and workflows)

**Three Core Operations**:
- **Ingest**: Process new sources, update relevant pages, maintain cross-references
- **Query**: Search the wiki, synthesize answers, file valuable insights back as new pages
- **Lint**: Health-check for contradictions, orphaned pages, missing concepts

## Tools Mentioned

- **Obsidian**: Markdown knowledge management with graph visualization
- **qmd**: Local hybrid search engine (BM25 + vector + LLM re-ranking)
- **Web Clipper**: Browser extension for converting articles to markdown
- **Marp**: Markdown-based presentation generation
- **Git**: Version control for the wiki repository

## Historical Context

Karpathy references Vannevar Bush's 1945 "Memex" concept — a personal knowledge store with associative trails between documents. The LLM Wiki realizes Bush's vision by automating the maintenance burden that previously made such systems impractical.

## Implementation Approach

The "idea file" represents a new open-source paradigm: sharing conceptual patterns rather than specific code, allowing LLM agents to customize implementations for individual environments and preferences.
