#!/bin/bash

# VoiceCraft - Setup and Test Script
echo "🚀 VoiceCraft - Setup and Test"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# Check for REPLICATE_API_TOKEN
if ! grep -q "^REPLICATE_API_TOKEN=" .env || grep -q "^REPLICATE_API_TOKEN=your_replicate_api_token_here" .env || grep -q "^REPLICATE_API_TOKEN=$" .env; then
    echo ""
    echo "⚠️  REPLICATE_API_TOKEN not configured"
    echo ""
    echo "To get your Replicate API token:"
    echo "1. Visit: https://replicate.com/account/api-tokens"
    echo "2. Create a new token or copy an existing one"
    echo "3. Add it to your .env file:"
    echo ""
    echo "   REPLICATE_API_TOKEN=r8_your_token_here"
    echo ""
    read -p "Do you have your Replicate API token? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Enter your Replicate API token: " token

        # Check if REPLICATE_API_TOKEN line exists
        if grep -q "^REPLICATE_API_TOKEN=" .env; then
            # Replace existing line
            sed -i '' "s|^REPLICATE_API_TOKEN=.*|REPLICATE_API_TOKEN=$token|" .env
        else
            # Add new line
            echo "REPLICATE_API_TOKEN=$token" >> .env
        fi

        echo "✅ REPLICATE_API_TOKEN added to .env"
    else
        echo ""
        echo "Please get your Replicate API token first:"
        echo "https://replicate.com/account/api-tokens"
        echo ""
        echo "Then run this script again or manually add it to .env:"
        echo "REPLICATE_API_TOKEN=r8_your_token_here"
        exit 1
    fi
fi

echo ""
echo "✅ Environment configured"
echo ""

# Check if dev server is running
echo "🔍 Checking if dev server is running..."
if curl -s http://localhost:3000/api/voices/generate > /dev/null 2>&1; then
    echo "✅ Dev server is running on http://localhost:3000"
else
    echo "⚠️  Dev server not running"
    echo ""
    read -p "Start dev server in a new terminal? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Starting dev server..."
        echo "Run this command in a new terminal:"
        echo ""
        echo "  npm run dev"
        echo ""
        echo "Then run this script again to test."
        exit 0
    else
        echo ""
        echo "Please start the dev server manually:"
        echo "  npm run dev"
        echo ""
        echo "Then run this script again."
        exit 0
    fi
fi

echo ""
echo "🧪 Running voice cloning test..."
echo ""

# Check if DATABASE is accessible
echo "🔍 Checking database connection..."
if npx prisma db push --skip-generate > /dev/null 2>&1; then
    echo "✅ Database connected and schema synced"
else
    echo "⚠️  Database connection issue - attempting to push schema..."
    npx prisma db push
fi

echo ""
echo "🎬 Starting comprehensive test..."
echo ""

# Run the TypeScript test
npx tsx test-voice-cloning.ts

echo ""
echo "✅ Test complete!"
