# Contributing to AntiGravity IDE

Thank you for your interest in contributing to AntiGravity IDE!

## Code of Conduct

Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition/issues)
2. If not, create a new issue using the Bug Report template
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details

### Suggesting Features

1. Check if the feature has already been requested
2. Create a new issue using the Feature Request template
3. Clearly describe the feature and its use case

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Write or update tests as needed
5. Ensure all tests pass: `npm test`
6. Ensure code passes linting: `npm run lint`
7. Commit your changes following our commit message guidelines
8. Push to your fork
9. Submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/AntiGravity_miyabi_edition.git
cd AntiGravity_miyabi_edition

# Add upstream remote
git remote add upstream https://github.com/ShunsukeHayashi/AntiGravity_miyabi_edition.git

# Install dependencies
npm install

# Start development
npm run watch
```

## Coding Standards

### TypeScript Style Guide

- Use TypeScript strict mode
- Prefer `interface` over `type` for object types
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Use 2 spaces for indentation

### Commit Message Guidelines

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

Example:
```
feat(agent): add mission control dashboard

Implement the mission control interface for managing multiple agents
simultaneously. Includes real-time status monitoring and task distribution.

Closes #123
```

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage

### Documentation

- Update README.md if needed
- Add JSDoc comments for new public APIs
- Update architecture docs for significant changes

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed project structure.

## Questions?

Feel free to ask questions by:
- Opening an issue
- Starting a discussion in GitHub Discussions

Thank you for contributing!
