#!/bin/bash

set -e  # Exit on any error

echo ""
echo "Festive.js NPM Build Script"
echo "================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Deployment folder
DEPLOY_DIR="$PROJECT_ROOT/npm-deploy"

echo "Project root: $PROJECT_ROOT"
echo "Deploy folder: $DEPLOY_DIR"
echo ""

# Clean up existing deploy folder
if [ -d "$DEPLOY_DIR" ]; then
    echo "Removing existing deploy folder: $DEPLOY_DIR"
    rm -rf "$DEPLOY_DIR"
    echo "Old deploy folder removed"
else
    echo "No existing deploy folder found"
fi
echo ""

# Create deploy folder
echo "Creating deploy folder..."
mkdir -p "$DEPLOY_DIR"

# Build the project first
echo "Building project..."
cd "$PROJECT_ROOT"
npm run build
echo ""

# Copy essential files only
echo "Copying essential files..."
echo "=============================="

# 1. Copy package.json from the package folder
echo "Copying package.json..."
if [ -f "$PROJECT_ROOT/package.json" ]; then
    # Create a modified version with correct main paths for npm deployment
    cp "$PROJECT_ROOT/package.json" "$DEPLOY_DIR/package.json"
    
    # Clean up package.json for npm using Node.js (more reliable than sed)
    if command -v node >/dev/null 2>&1; then
        node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('$DEPLOY_DIR/package.json', 'utf8'));

// Update paths to point to core.min.js (cleaner CDN URLs)
pkg.main = 'core.min.js';
pkg.module = 'core.min.js';
pkg.unpkg = 'core.min.js';
pkg.jsdelivr = 'core.min.js';

// Update exports
if (pkg.exports && pkg.exports['.']) {
  pkg.exports['.'].import = './core.min.js';
  pkg.exports['.'].require = './core.min.js';
  delete pkg.exports['.'].development;
}

// Update files array
pkg.files = ['core.min.js', 'index.d.ts', 'README.md', 'LICENSE'];

// Remove unnecessary fields for npm package
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.private;

fs.writeFileSync('$DEPLOY_DIR/package.json', JSON.stringify(pkg, null, 2));
"
    else
        echo "Warning: Node.js not found, package.json not optimized"
    fi
    echo "Success: package.json (copied and updated paths)"
else
    echo "Error: package.json not found in $PROJECT_ROOT"
    exit 1
fi

# 2. Copy built distribution files to root (for cleaner CDN URLs)
if [ -d "$PROJECT_ROOT/dist" ]; then
    echo "Copying built files from dist/..."
    cp "$PROJECT_ROOT/dist/core.min.js" "$DEPLOY_DIR/core.min.js" 2>/dev/null || echo "Warning: core.min.js not found in dist"
else
    echo "Error: dist/ folder not found! Run npm run build first."
    exit 1
fi

# 3. Copy TypeScript declarations
if [ -f "$PROJECT_ROOT/index.d.ts" ]; then
    echo "Copying index.d.ts..."
    cp "$PROJECT_ROOT/index.d.ts" "$DEPLOY_DIR/"
else
    echo "Warning: index.d.ts not found"
fi

# 4. Copy README
if [ -f "$PROJECT_ROOT/README.md" ]; then
    echo "Copying README.md..."
    cp "$PROJECT_ROOT/README.md" "$DEPLOY_DIR/"
else
    echo "Warning: README.md not found"
fi

# 5. Copy LICENSE from parent directory
if [ -f "$PROJECT_ROOT/../LICENSE" ]; then
    echo "Copying LICENSE (from parent directory)..."
    cp "$PROJECT_ROOT/../LICENSE" "$DEPLOY_DIR/"
else
    echo "Warning: LICENSE not found in parent directory"
fi
echo ""

# Show deployment folder contents
echo ""
echo "Deployment folder contents:"
echo "=============================="
cd "$DEPLOY_DIR"
echo "Files with sizes:"
find . -type f | sort | while read file; do
    size=$(du -h "$file" | cut -f1)
    echo "$file - $size"
done

# Calculate folder size
FOLDER_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)
echo ""
echo "Total package size: $FOLDER_SIZE"

# Show next steps
echo ""
echo "Next steps:"
echo "=============="
echo "1. cd $DEPLOY_DIR"
echo "2. npm login (if not already logged in)"
echo "3. npm publish"
echo ""
echo "NPM package ready for publishing!"
echo ""