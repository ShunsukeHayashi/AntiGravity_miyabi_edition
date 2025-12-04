# Claude Code Context Documentation

This directory contains context modules that Claude Code automatically references when working on the AntiGravity IDE project.

## 📚 Context Modules

### Core Documentation
- **`agents.md`** - Miyabi agent system, 21 agents, workflows
- **`development.md`** - Development guidelines, coding standards, testing
- **`mcp.md`** - Model Context Protocol servers and integration

## 🎯 How Context Works

Claude Code automatically loads these context modules to understand:
1. **Agent Architecture** - How the 21 Miyabi agents work together
2. **Development Standards** - Coding style, testing requirements, Git workflow
3. **MCP Integration** - How to use Model Context Protocol servers
4. **Project Structure** - Where files live and how they're organized

## 📖 Reading Order

When starting on the project, read in this order:
1. Start with `README.md` (this file)
2. Read `agents.md` to understand the agent system
3. Read `development.md` for coding standards
4. Read `mcp.md` for MCP server usage

## 🔄 Updating Context

Context should be updated when:
- New agents are added
- Development standards change
- New MCP servers are integrated
- Project structure changes significantly

## 🎨 Context Organization

```
.claude/context/
├── README.md           # This file - overview and guide
├── agents.md           # Agent system and workflows
├── development.md      # Development guidelines
└── mcp.md              # MCP server documentation
```

## 💡 Best Practices

1. **Keep it Current**: Update context when project changes
2. **Be Specific**: Include concrete examples and code snippets
3. **Cross-Reference**: Link related sections across files
4. **Version Control**: Commit context changes with related code changes

## 🔗 Related Files

- **`../.agent/`** - Agent configurations and rules
- **`../.miyabi/`** - Miyabi framework configuration
- **`../../CLAUDE.md`** - Main Claude Code instruction manual
- **`../../AGENTS.md`** - Agent operation protocols

## 📞 Questions?

If you're unsure about any context:
1. Check the main `CLAUDE.md` file
2. Review the `.agent/` directory
3. Look at `.miyabi/config.yml`
4. Check project documentation in `docs/`

---

**Last Updated**: 2025-12-02
**Maintained By**: Miyabi Orchestra
