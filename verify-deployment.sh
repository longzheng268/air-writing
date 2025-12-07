#!/bin/bash

# Verification script for Cloudflare Pages deployment
# This script checks if all required files are present

echo "🔍 Verifying deployment readiness..."
echo ""

# Check for required files
REQUIRED_FILES=(
    "index.html"
    "assets/css/style.css"
    "assets/js/app.js"
    "assets/images/logo.png"
    "package.json"
    "_headers"
)

all_present=true

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MISSING"
        all_present=false
    fi
done

echo ""

if [ "$all_present" = true ]; then
    echo "✨ All required files are present!"
    echo "📦 Ready for deployment to Cloudflare Pages"
    echo ""
    echo "Next steps:"
    echo "1. Push to Git: git push origin main"
    echo "2. Configure Cloudflare Pages Dashboard:"
    echo "   - Build command: npm run build"
    echo "   - Build output directory: /"
    echo ""
    echo "Or deploy via CLI:"
    echo "   npm run deploy"
    exit 0
else
    echo "⚠️  Some files are missing!"
    echo "Please ensure all required files are present before deploying."
    exit 1
fi
