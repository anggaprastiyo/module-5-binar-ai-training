# CodeCov Setup Guide

This project is configured to work with CodeCov for code coverage reporting. Here's how to set it up:

## 1. CodeCov Account Setup

1. Go to [CodeCov.io](https://codecov.io) and sign up with your GitHub account
2. Add your repository to CodeCov
3. Get your CodeCov token from the repository settings

## 2. GitHub Repository Setup

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a new repository secret:
   - Name: `CODECOV_TOKEN`
   - Value: Your CodeCov token from step 1

## 3. Update Badge URLs

In the `README.md` file, update the badge URLs with your actual repository information:

```markdown
[![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/workflows/Test%20and%20Coverage/badge.svg)](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO_NAME/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO_NAME)
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

## 4. Configuration Files

The project includes:

- `.github/workflows/test.yml` - GitHub Actions workflow for CI/CD
- `codecov.yml` - CodeCov configuration
- `jest.config.js` - Jest configuration for coverage reporting

## 5. Coverage Targets

The current configuration targets:
- **Project coverage**: 90% minimum
- **Patch coverage**: 90% minimum for new changes
- **Threshold**: 5% tolerance

## 6. Running Tests Locally

To run tests with coverage locally:

```bash
npm run test:ci
```

This will generate a coverage report in the `coverage/` directory.

## 7. Viewing Coverage

- **Local**: Open `coverage/lcov-report/index.html` in your browser
- **Online**: Visit your CodeCov dashboard at `https://codecov.io/gh/YOUR_USERNAME/YOUR_REPO_NAME`

## 8. Coverage Reports

CodeCov will automatically:
- Generate coverage reports on every push and pull request
- Comment on pull requests with coverage changes
- Provide detailed coverage analysis
- Track coverage trends over time

## Troubleshooting

If you encounter issues:

1. **Badge not showing**: Check that your repository is properly connected to CodeCov
2. **Coverage not uploading**: Verify the `CODECOV_TOKEN` secret is set correctly
3. **Tests failing**: Ensure all tests pass locally before pushing
4. **Coverage too low**: Add more test cases to reach the 90% target

## Current Coverage Status

As of the latest tests:
- **Login Page**: 100% coverage ✅
- **Profile Page**: 80.43% coverage
- **API Routes**: 66.66% coverage

The login feature has achieved 100% test coverage, meeting our quality standards! 