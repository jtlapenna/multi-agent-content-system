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

### 1. Parse Input Parameters and Load Data
```javascript
// Extract parameters from the command
const blogSlug = process.argv[2] || 'blog-' + new Date().toISOString().split('T')[0];
const topic = process.argv[3] || 'general';
const phase = process.argv[4] || 'IMAGE';
const site = process.argv[5] || 'brightgift';

console.log(`Image Agent starting for: ${blogSlug}, topic: ${topic}, site: ${site}`);

// Load content and data
const contentDir = `content/blog-posts/${blogSlug}`;
const fs = require('fs');
const path = require('path');

const blogFinalPath = path.join(contentDir, 'blog-final.md');
const workflowStatePath = path.join(contentDir, 'workflow_state.json');

if (!fs.existsSync(blogFinalPath)) {
  throw new Error(`Blog final content not found at: ${blogFinalPath}`);
}

const blogContent = fs.readFileSync(blogFinalPath, 'utf8');
const workflowState = JSON.parse(fs.readFileSync(workflowStatePath, 'utf8'));

console.log('Loaded blog final content and workflow state');
```

### 2. Extract Content Information
- Parse blog title and description from content
- Extract key themes and visual elements
- Identify content type and target audience
- Prepare content context for image prompt generation

### 3. Generate Image Prompts
Create stylized prompts for each image type following BrightGift guidelines.

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

### 7. Generate and Process Images
```javascript
// Generate image prompts based on content
const imagePrompts = generateImagePrompts(blogContent, topic);

// Generate images using GPT-4
const bannerImage = await generateImage(imagePrompts.banner, 'banner');
const ogImage = await generateImage(imagePrompts.og, 'og');

// Optimize and enhance images
const optimizedBanner = await optimizeImage(bannerImage, 'banner');
const optimizedOG = await optimizeImage(ogImage, 'og');

// Convert OG image to JPG for compatibility
const ogImageJpg = await convertToJpg(optimizedOG);

// Create images directory
const imagesDir = path.join(contentDir, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Save all images
fs.writeFileSync(path.join(imagesDir, 'banner.webp'), optimizedBanner);
fs.writeFileSync(path.join(imagesDir, 'og.webp'), optimizedOG);
fs.writeFileSync(path.join(imagesDir, 'og.jpg'), ogImageJpg);

// Save image prompts metadata
const imagePromptsPath = path.join(imagesDir, 'image-prompts.json');
fs.writeFileSync(imagePromptsPath, JSON.stringify(imagePrompts, null, 2));

console.log(`Images saved to: ${imagesDir}`);
```

### 8. Update Workflow State
```javascript
// Update workflow state with image completion
workflowState.current_phase = "IMAGE_COMPLETE";
workflowState.next_agent = "PublishingAgent";
workflowState.last_updated = new Date().toISOString();
workflowState.updated_at = new Date().toISOString();
workflowState.agents_run.push("ImageAgent");
workflowState.agent_outputs["ImageAgent"] = "images/";

// Add image metadata
workflowState.image_metadata = {
  banner_image: "images/banner.webp",
  og_image: "images/og.webp",
  og_image_jpg: "images/og.jpg",
  image_prompts: "images/image-prompts.json",
  generation_time: new Date().toISOString()
};

// Update timestamps
workflowState.timestamps.image_started = workflowState.timestamps.image_started || new Date().toISOString();
workflowState.timestamps.image_completed = new Date().toISOString();

// Save updated workflow state
fs.writeFileSync(workflowStatePath, JSON.stringify(workflowState, null, 2));
console.log(`Workflow state updated: ${workflowStatePath}`);
```

### 9. Commit Changes to GitHub
```javascript
// Commit all changes to trigger next agent
const { execSync } = require('child_process');

try {
  // Add all files to git
  execSync('git add .', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Files added to git');
  
  // Commit changes
  const commitMessage = `Image Agent: Complete image generation for ${blogSlug} - ${topic}`;
  execSync(`git commit -m "${commitMessage}"`, { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Changes committed to git');
  
  // Push to trigger GitHub webhook
  execSync('git push', { cwd: process.cwd(), stdio: 'inherit' });
  console.log('Changes pushed to GitHub');
  
} catch (error) {
  console.error('Git operations failed:', error.message);
  // Continue execution even if git fails
}
```

### 10. Trigger Next Agent
The GitHub commit above will automatically trigger the GitHub webhook, which will then trigger the next agent (PublishingAgent) via n8n.

## 📁 Output Files
- `content/blog-posts/{blogSlug}/images/banner.webp` - Optimized banner image (16:9, 1200px wide)
- `content/blog-posts/{blogSlug}/images/og.webp` - Optimized Open Graph image (16:9, 1200px wide)
- `content/blog-posts/{blogSlug}/images/og.jpg` - JPG version of OG image for platform compatibility
- `content/blog-posts/{blogSlug}/images/image-prompts.json` - Image generation metadata and prompts
- `content/blog-posts/{blogSlug}/workflow_state.json` - Updated state with image completion

## 🎯 Success Criteria
- ✅ Generated high-quality banner image following BrightGift style
- ✅ Generated high-quality OG image following BrightGift style
- ✅ Images optimized for web performance and loading speed
- ✅ OG image converted to JPG format for platform compatibility
- ✅ All images meet technical specifications and brand guidelines
- ✅ Updated workflow state and triggered next agent via GitHub commit

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

## 🔧 Helper Function Documentation

### **generateImagePrompts(blogContent, topic)**
```javascript
// Should return an object with { banner: string, og: string }
```

### **generateImage(prompt, type)**
```javascript
// Should return a Buffer or image data for the generated image
```

### **optimizeImage(image, type)**
```javascript
// Should return a Buffer or optimized image data
```

### **convertToJpg(image)**
```javascript
// Should return a Buffer or JPG image data
``` 