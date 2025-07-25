# 🖼️ Image Agent Instructions

## 🎯 Purpose
Generate and process images for blog content including hero images, social media images, and Open Graph images.

## 📋 Responsibilities
- Generate image prompts based on blog content
- Create hero, social, and OG images
- Process and optimize images for web
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **Image Generation**: `images.js` - Image generation and processing
- **Blog Content**: `blog-final.md` from Review Agent
- **Image Processing**: Image optimization and formatting
- **Workflow State**: `workflow_state.json` - State management

## 🔄 Workflow Steps

### 1. Load Blog Content
```bash
# Load final blog content
const blogContent = loadFile('blog-final.md');
const blogMetadata = parseFrontmatter(blogContent);
```

### 2. Generate Image Prompts
- Analyze blog content and title
- Create prompts for different image types:
  - Hero image (1200x630px)
  - Social media image (1080x1080px)
  - Open Graph image (1200x630px)
- Ensure prompts match content theme and style

### 3. Generate Images
- Generate hero image for blog header
- Create social media image for sharing
- Generate Open Graph image for social preview
- Ensure consistent style and branding

### 4. Process and Optimize
- Optimize images for web performance
- Ensure proper dimensions and format
- Add alt text and metadata
- Compress for fast loading

### 5. Update Workflow State
```json
{
  "current_phase": "IMAGE_COMPLETE",
  "next_agent": "PublishingAgent",
  "images": {
    "hero": "images/hero.jpg",
    "social": "images/social.jpg",
    "og": "images/og.jpg"
  },
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 6. Trigger Next Agent
- Commit image files and updated `workflow_state.json`
- Send Slack command to trigger Publishing Agent
- Log completion in agent logs

## 📁 Output Files
- `images/hero.jpg` - Hero image for blog
- `images/social.jpg` - Social media image
- `images/og.jpg` - Open Graph image
- `workflow_state.json` - Updated state with image completion
- `logs/image-log.json` - Detailed execution log

## 🎯 Success Criteria
- ✅ Generated all required images
- ✅ Images optimized for web
- ✅ Proper dimensions and format
- ✅ Alt text and metadata added
- ✅ Updated workflow state
- ✅ Triggered next agent

## 🔧 Configuration
- **Image Generation**: Configured for content-based prompts
- **Image Dimensions**: Standard web dimensions
- **Format**: Optimized for web performance
- **Style**: Consistent with brand guidelines

## 📝 Image Guidelines
- **Hero Image**: 1200x630px, engaging and relevant
- **Social Image**: 1080x1080px, shareable and attractive
- **OG Image**: 1200x630px, optimized for social preview
- **Alt Text**: Descriptive and accessible
- **Style**: Consistent with brand and content theme

## 📝 Notes
- Generate images that match content theme
- Ensure images are high-quality and engaging
- Optimize for web performance and loading speed
- Include proper alt text for accessibility
- Log all image generation steps for transparency 