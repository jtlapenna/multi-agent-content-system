# 🖼️ Image Agent Instructions

## 🎯 Purpose
Generate and optimize high-quality images for blog content using GPT-4 image generation, following BrightGift's distinct visual style. Create banner and Open Graph images, then enhance and convert them for optimal web performance.

## 📋 Responsibilities
- Generate stylized image prompts based on blog content and BrightGift brand guidelines
- Create banner and Open Graph images using GPT-4 image generation
- Optimize and enhance generated images for web performance
- Convert OG images to JPG format for platform compatibility
- Ensure consistent BrightGift visual style across all images
- Update workflow state and trigger next agent

## 🛠️ Tools & Dependencies
- **Image Generation**: `images.js` - Core image generation and processing utilities
- **Blog Content**: `blog-final.md` from Review Agent
- **GPT-4 Image API**: gpt-image-1 model for image generation
- **Image Processing**: Sharp library for optimization and format conversion
- **Workflow State**: `workflow_state.json` - State management and agent handoff

## 🔄 Workflow Steps

### 1. Load Blog Content and Data
```bash
# Load final blog content and metadata
const fs = require('fs').promises;
const blogContent = await fs.readFile('blog-final.md', 'utf8');
const workflowState = JSON.parse(await fs.readFile('workflow_state.json', 'utf8'));
```

### 2. Extract Content Information
- Parse blog title and description from content
- Extract key themes and visual elements
- Identify content type and target audience
- Prepare content context for image prompt generation

### 3. Generate Image Prompts
Create stylized prompts for each image type following BrightGift guidelines:

#### **Banner Image Prompt:**
- **Dimensions**: 16:9 ratio, 1200px wide
- **Content**: No visible text or logos
- **Style**: Physical object-based scenes (gifts, home goods, accessories)
- **Layout**: Flat-lay, stacked boxes, tidy clusters, or centered scenes
- **BrightGift Style**: Include the complete BrightGift Style Signature

#### **Open Graph Image Prompt:**
- **Dimensions**: 16:9 ratio, 1200px wide  
- **Content**: No visible text or logos
- **Style**: Physical object-based scenes matching content theme
- **Layout**: Clean, giftable layout with rounded forms and balanced negative space
- **BrightGift Style**: Include the complete BrightGift Style Signature

### 4. Generate Images with GPT-4
- **Banner Image**: Generate using gpt-image-1 model with banner prompt
- **OG Image**: Generate using gpt-image-1 model with OG prompt
- **Quality Control**: Ensure images meet BrightGift style requirements
- **Error Handling**: Retry generation if images don't meet quality standards

### 5. Optimize and Enhance Images
- **Image Enhancement**: Improve quality, contrast, and visual appeal
- **Web Optimization**: Compress for fast loading while maintaining quality
- **Format Optimization**: Ensure proper WebP format for web performance
- **Quality Validation**: Verify images meet all technical requirements

### 6. Convert and Save Images
- **Banner Image**: Save as `banner.webp` in optimized format
- **OG Image**: Save as `og.webp` and convert to `og.jpg` for platform compatibility
- **File Organization**: Store in `images/` directory with proper naming
- **Metadata**: Create image metadata file with prompts and generation details

### 7. Update Workflow State
```json
{
  "current_phase": "IMAGE_COMPLETE",
  "next_agent": "PublishingAgent",
  "agent_outputs": {
    "SEOAgent": "seo-results.json",
    "BlogAgent": "blog-draft.md",
    "ReviewAgent": "blog-final.md",
    "ImageAgent": "images/"
  },
  "image_metadata": {
    "banner_image": "images/banner.webp",
    "og_image": "images/og.webp",
    "og_image_jpg": "images/og.jpg",
    "image_prompts": "images/image-prompts.json",
    "generation_time": "2025-01-XXTXX:XX:XXZ"
  },
  "last_updated": "2025-01-XXTXX:XX:XXZ"
}
```

### 8. Trigger Next Agent
- Commit image files and updated `workflow_state.json`
- Send Slack command to trigger Publishing Agent
- Log completion in agent logs

## 📁 Output Files
- `images/banner.webp` - Optimized banner image (16:9, 1200px wide)
- `images/og.webp` - Optimized Open Graph image (16:9, 1200px wide)
- `images/og.jpg` - JPG version of OG image for platform compatibility
- `images/image-prompts.json` - Image generation metadata and prompts
- `workflow_state.json` - Updated state with image completion

## 🎯 Success Criteria
- ✅ Generated high-quality banner image following BrightGift style
- ✅ Generated high-quality OG image following BrightGift style
- ✅ Images optimized for web performance and loading speed
- ✅ OG image converted to JPG format for platform compatibility
- ✅ All images meet technical specifications and brand guidelines
- ✅ Updated workflow state and triggered next agent

## 🔧 Configuration
- **GPT-4 Image Model**: gpt-image-1 for image generation
- **Image Dimensions**: Banner and OG both 16:9 ratio, 1200px wide
- **Output Formats**: WebP for web optimization, JPG for compatibility
- **BrightGift Style**: Consistent application of brand visual guidelines

## 🎨 BrightGift Image Style Guidelines

### **Required Style Signature (Include in Every Prompt):**
"Modern flat illustration with soft 3D-style characters and objects, combined with subtle 2D decorative elements. Use warm, vibrant pastels (teal #00A99D, coral-orange #FF6B35, sunshine yellow #FFD700). Layout must be clean and giftable, using rounded forms, balanced negative space, and minimal visual clutter. The tone should feel cheerful, light, editorial, and creative — never realistic or photorealistic. Use text only in social images. Background colors can vary within our color palette."

### **Visual Style Requirements:**
- **Style**: Whimsical and editorial - mix of playful 3D-style cartoon objects and subtle 2D illustrative elements
- **Colors**: Warm, vibrant pastels (teal, coral-orange, sunshine yellow)
- **Layout**: Clean and giftable with rounded forms and balanced negative space
- **Tone**: Cheerful, light, editorial, and creative
- **Avoid**: Realism, photorealism, complex environments, or surrealism

### **Content Guidelines:**
- **Focus**: Physical object-based scenes (gifts, home goods, accessories, tools)
- **Layouts**: Flat-lay, stacked boxes, tidy clusters, or centered scenes
- **Elements**: Mix of 3D-style cartoon objects and 2D design accents
- **Enhancements**: Floating elements, sparkles, or motion lines when appropriate

## 📝 Image Generation Guidelines

### **Prompt Writing Requirements:**
- Write as fluent, descriptive sentences or paragraphs
- Focus on physical object-based scenes relevant to content
- Describe specific layouts and visual compositions
- Include clear dimensional instructions (16:9 ratio, 1200px wide)
- End with the complete BrightGift Style Signature
- Never include text or logos in banner or OG images
- Avoid realism, materials, or photorealism

### **Technical Requirements:**
- **Banner Image**: 16:9 ratio, 1200px wide, no text or logos
- **OG Image**: 16:9 ratio, 1200px wide, no text or logos
- **Format**: WebP for web optimization, JPG for compatibility
- **Quality**: High-quality, optimized for web performance
- **File Naming**: Use slug-based naming convention

### **Quality Control:**
- Verify images meet BrightGift style requirements
- Ensure proper dimensions and aspect ratios
- Check for visual quality and brand consistency
- Validate web optimization and file sizes
- Confirm platform compatibility (especially JPG conversion)

## 📝 Notes
- **Style Consistency**: Always apply BrightGift visual style guidelines
- **Quality Focus**: Generate high-quality images that enhance content
- **Performance Optimization**: Ensure images load quickly and efficiently
- **Platform Compatibility**: Convert OG images to JPG for broader compatibility
- **Error Handling**: Retry generation if images don't meet quality standards
- **Brand Alignment**: Maintain consistent BrightGift visual identity
- **Technical Excellence**: Optimize for web performance and user experience 