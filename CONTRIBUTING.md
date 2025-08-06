# Contributing to Email Spam Detection & Summarization

First off, thank you for considering contributing to this project! 🎉

## 🤝 How to Contribute

### Reporting Bugs

1. **Check existing issues** first to avoid duplicates
2. **Use the bug report template** when creating a new issue
3. **Include detailed information**:
   - Operating system and version
   - Python/Node.js versions
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Features

1. **Check the roadmap** in README.md first
2. **Open a feature request issue** with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach
   - Examples or mockups if applicable

### Code Contributions

#### 1. Fork and Clone
```bash
git clone https://github.com/sarthak536/spam_detection_email_summarizer.git
cd spam_detection_email_summarizer
```

#### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

#### 3. Development Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Development dependencies
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

#### 4. Make Changes

**Code Style Guidelines:**

**Python (Backend):**
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings to functions and classes
- Maximum line length: 88 characters
- Use `black` for formatting: `black backend/`
- Use `flake8` for linting: `flake8 backend/`

**JavaScript/React (Frontend):**
- Follow ESLint configuration
- Use functional components with hooks
- Use meaningful variable and function names
- Add comments for complex logic
- Format with Prettier: `npm run format`
- Lint with ESLint: `npm run lint`

#### 5. Testing

**Backend Tests:**
```bash
cd backend
pytest tests/ -v
python -m pytest --cov=models tests/  # With coverage
```

**Frontend Tests:**
```bash
cd frontend
npm test
npm run test:coverage
```

**Manual Testing:**
- Test both real backend and mock mode
- Test responsive design on different screen sizes
- Verify all API endpoints work correctly
- Test error handling scenarios

#### 6. Commit Guidelines

Use conventional commit format:
```
type(scope): description

feat(api): add batch email processing endpoint
fix(ui): resolve mobile responsive issues
docs(readme): update installation instructions
test(backend): add unit tests for spam detector
refactor(frontend): improve component structure
```

#### 7. Pull Request

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update README.md** if adding new features
5. **Create pull request** with:
   - Clear title and description
   - Reference any related issues
   - Screenshots for UI changes
   - Test instructions

## 🧪 Testing Guidelines

### Backend Testing
- **Unit tests**: Test individual functions and classes
- **Integration tests**: Test API endpoints
- **Model tests**: Test ML model predictions
- **Performance tests**: Test response times

### Frontend Testing
- **Component tests**: Test React components
- **Integration tests**: Test API integration
- **E2E tests**: Test complete user workflows
- **Accessibility tests**: Ensure WCAG compliance

## 📁 Project Structure Guidelines

### Adding New Features

**Backend:**
```
backend/
├── models/           # ML models and related logic
├── routes/           # API route handlers
├── utils/            # Utility functions
├── tests/            # Test files
└── config/           # Configuration files
```

**Frontend:**
```
frontend/src/
├── components/       # Reusable UI components
├── pages/           # Page-level components
├── services/        # API and external services
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── __tests__/       # Test files
```

### Naming Conventions

- **Files**: Use kebab-case for files (`email-input.jsx`)
- **Components**: Use PascalCase (`EmailInput`)
- **Functions**: Use camelCase (`analyzeEmail`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_BASE_URL`)
- **CSS Classes**: Use kebab-case (`email-input-container`)

## 🔍 Code Review Process

1. **Automated checks** must pass (GitHub Actions)
2. **Manual review** by maintainers
3. **Testing** in review environment
4. **Approval** and merge

### Review Criteria

- **Functionality**: Does it work as expected?
- **Code Quality**: Is it readable and maintainable?
- **Performance**: Does it impact performance?
- **Security**: Are there any security concerns?
- **Documentation**: Is it properly documented?
- **Tests**: Are there adequate tests?

## 🚀 Release Process

1. **Feature freeze** for upcoming release
2. **Regression testing** on staging environment
3. **Update version numbers** and changelog
4. **Create release** with detailed notes
5. **Deploy** to production environments

## 📚 Documentation

### What to Document

- **New API endpoints**: Include examples and response formats
- **Configuration options**: Explain purpose and usage
- **Complex algorithms**: Add inline comments and documentation
- **Setup procedures**: Keep installation guides updated
- **Troubleshooting**: Add common issues and solutions

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Keep documentation in sync with code
- Use proper Markdown formatting

## 🎯 Areas Needing Help

### High Priority
- [ ] Add comprehensive unit tests
- [ ] Improve mobile responsiveness
- [ ] Add email template detection
- [ ] Implement user authentication
- [ ] Add batch processing capabilities

### Medium Priority
- [ ] Performance optimization
- [ ] Add more ML models
- [ ] Implement caching
- [ ] Add monitoring and logging
- [ ] Create browser extensions

### Low Priority
- [ ] Add dark mode theme
- [ ] Implement email parsing for attachments
- [ ] Add multi-language support
- [ ] Create mobile app
- [ ] Add advanced analytics

## 🏆 Recognition

Contributors will be:
- **Listed** in the README.md
- **Mentioned** in release notes
- **Credited** in commit messages
- **Invited** to the contributors team

## 📞 Getting Help

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bugs and specific feature requests
- **Email**: sarthak536@example.com for private matters
- **Discord/Slack**: [Link to community chat if available]

## 📋 Checklist for Contributors

Before submitting your contribution:

- [ ] Code follows style guidelines
- [ ] Self-review of code completed
- [ ] Tests added for new features
- [ ] All tests pass locally
- [ ] Documentation updated
- [ ] No sensitive information in code
- [ ] Commit messages follow conventions
- [ ] PR description is clear and detailed

Thank you for contributing! 🚀
