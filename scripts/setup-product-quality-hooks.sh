#!/bin/bash

# Setup Product Quality Checks with Git Hooks
# This script installs Husky and configures pre-commit hooks
# to run product quality checks before every commit

set -e

echo "📦 Setting up Product Quality Checks..."
echo ""

# Install dependencies
echo "1. Installing Husky and lint-staged..."
npm install --save-dev husky lint-staged

# Initialize Husky
echo "2. Initializing Husky..."
npx husky init

# Create pre-commit hook
echo "3. Creating pre-commit hook..."
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running Product Quality Checks..."
npx lint-staged
EOF

chmod +x .husky/pre-commit

# Add lint-staged configuration to package.json
echo "4. Configuring lint-staged..."
node << 'NODESCRIPT'
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

packageJson['lint-staged'] = {
  '*.{ts,tsx,js,jsx}': [
    'eslint --config .eslintrc.product.json --fix',
    'eslint --config .eslintrc.product.json'
  ],
  'app/**/page.{ts,tsx}': [
    'eslint --config .eslintrc.product.json --rule "product-quality/require-page-metadata: error"'
  ]
};

packageJson.scripts = packageJson.scripts || {};
packageJson.scripts['lint:product'] = 'eslint . --config .eslintrc.product.json';
packageJson.scripts['lint:product:fix'] = 'eslint . --config .eslintrc.product.json --fix';

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2) + '\n');
NODESCRIPT

echo ""
echo "✅ Product Quality Checks installed!"
echo ""
echo "📋 What's configured:"
echo "  - Pre-commit hook: Checks all staged files"
echo "  - Link validation: Catches broken internal links"
echo "  - Color validation: Enforces style guide"
echo "  - Content consistency: Company info, payment providers"
echo "  - Page metadata: SEO titles and descriptions"
echo "  - Accessibility: Color contrast checks"
echo ""
echo "🚀 Try it out:"
echo "  npm run lint:product         # Check all files"
echo "  npm run lint:product:fix     # Auto-fix issues"
echo "  git commit                   # Hooks run automatically"
echo ""
echo "💡 Pro tip: Issues will be caught before commit, not in production!"
