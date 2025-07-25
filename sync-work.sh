#!/bin/bash

# Script to sync relevant work from blog-automations to multi-agent-content-system
# This will copy only the files we want, not the entire old repository

echo "🔄 Syncing relevant work from blog-automations to multi-agent-content-system..."

# Source and destination directories
SOURCE_DIR="../blog-automations"
DEST_DIR="."

# Create backup of current state
echo "📦 Creating backup of current state..."
cp -r . ../multi-agent-content-system-backup-$(date +%Y%m%d-%H%M%S)

# Copy hybrid-project directory (contains all the planning and documentation)
echo "📋 Copying hybrid-project directory..."
if [ -d "$SOURCE_DIR/hybrid-project" ]; then
    cp -r "$SOURCE_DIR/hybrid-project" "$DEST_DIR/"
    echo "✅ Copied hybrid-project"
else
    echo "❌ hybrid-project not found in source"
fi

# Copy template directory (contains the actual working code)
echo "📁 Copying template directory..."
if [ -d "$SOURCE_DIR/template" ]; then
    cp -r "$SOURCE_DIR/template" "$DEST_DIR/"
    echo "✅ Copied template"
else
    echo "❌ template not found in source"
fi

# Copy specific files that might have been updated
echo "📄 Copying specific updated files..."
FILES_TO_COPY=(
    ".env.example"
    "README.md"
    "package.json"
)

for file in "${FILES_TO_COPY[@]}"; do
    if [ -f "$SOURCE_DIR/$file" ]; then
        cp "$SOURCE_DIR/$file" "$DEST_DIR/"
        echo "✅ Copied $file"
    else
        echo "⚠️ $file not found in source"
    fi
done

echo "🎉 Sync completed!"
echo "📝 Next steps:"
echo "1. Review the copied files"
echo "2. Update .env with your Supabase credentials"
echo "3. Run: node test-phase2.js"
