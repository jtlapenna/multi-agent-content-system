const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { getEnvConfig } = require('../cli/utils/config');
const chalk = require('chalk');
const costTracker = require('../utils/costTracker');

/**
 * Generate images for blog content using your actual GPT image assistant
 * @param {Object} content - Generated content object
 * @param {Object} config - Site configuration
 * @returns {Object} Generated images metadata
 */
async function generateImages(content, config) {
  try {
    const { frontmatter, slug } = content;
    const imageConfig = config.imageGeneration;
    
    // Create images directory if it doesn't exist
    const imagesDir = path.resolve(config.imagesDir, slug);
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    const generatedImages = {};
    
    // Step 1: Create image prompt trigger file for Cursor AI
    await createImagePromptTrigger(content, config);
    
    // Step 2: Wait for Cursor AI to generate image prompts
    const imagePrompts = await waitForImagePrompts(slug);
    
    // Step 3: Generate actual images using OpenAI API
    // Generate banner image
    if (imageConfig.dimensions.banner) {
      const bannerPrompt = imagePrompts.find(p => p.label === 'banner')?.text;
      if (bannerPrompt) {
        const bannerImage = await generateImage(bannerPrompt, imageConfig.dimensions.banner, config);
        const bannerPath = path.join(imagesDir, `${slug}-banner.webp`);
        await saveImage(bannerImage, bannerPath, imageConfig.dimensions.banner);
        generatedImages.banner = bannerPath;
      }
    }
    
    // Generate social image (DISABLED - only using OG for social)
    // Social images are no longer generated as we use OG images for social sharing
    
    // Generate OG image
    if (imageConfig.dimensions.og) {
      const ogPrompt = imagePrompts.find(p => p.label === 'og')?.text;
      if (ogPrompt) {
        const ogImage = await generateImage(ogPrompt, imageConfig.dimensions.og, config);
        const ogPath = path.join(imagesDir, `${slug}-og.webp`);
        await saveImage(ogImage, ogPath, imageConfig.dimensions.og);
        generatedImages.og = ogPath;
        // Convert OG image to JPG for Instagram compatibility
        const ogJpgPath = ogPath.replace('.webp', '.jpg');
        await convertToJPG(ogPath, ogJpgPath);
        generatedImages.ogJpg = ogJpgPath;
      }
    }
    
    // Create image metadata file
    const imageMetadata = {
      slug,
      title: frontmatter.title,
      generatedAt: new Date().toISOString(),
      images: generatedImages,
      prompts: imagePrompts
    };
    
    const metadataPath = path.join(imagesDir, `${slug}-image-prompts.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(imageMetadata, null, 2));
    
    return {
      ...generatedImages,
      metadataPath
    };
    
  } catch (error) {
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Create image prompt trigger file for Cursor AI
 */
async function createImagePromptTrigger(content, config) {
  try {
    const triggerData = {
      slug: content.slug,
      title: content.frontmatter.title,
      description: content.frontmatter.description || '',
      content: content.content,
      type: content.type,
      seoData: content.seoData,
      config: {
        imageGeneration: config.imageGeneration,
        brand: config.brand
      },
      instructions: `You are an AI art director for BrightGift, a modern gift recommendation brand.

Your job is to write stylized image prompts for use with the GPT-4 API image model gpt-image-1, based on a provided blog title and excerpt. You must follow BrightGift's distinct image style and formatting guidelines.

🖼️ Image Types

You must generate two distinct prompts, one for each image format:

• "banner" → Blog banner (wide horizontal layout, no visible text or logos).
→ IMPORTANT: ALWAYS include dimension ratio 16:9 and size 1200px wide.
→ NEVER include text or logos in banner images.

• "og" → Open Graph preview image (horizontal layout, no visible text or logos).
→ IMPORTANT: ALWAYS include dimension ratio 16:9 and size 1200px wide.
→ NEVER include text or logos in OG images.

🎨 BrightGift Image Style (Required in Every Prompt)

Every prompt must match the BrightGift brand's whimsical and editorial image tone — a mix of playful 3D-style cartoon objects and subtle 2D illustrative elements.

At the end of every prompt, include this BrightGift Style Signature, word for word:

"Modern flat illustration with soft 3D-style characters and objects, combined with subtle 2D decorative elements. Use warm, vibrant pastels (teal #00A99D, coral-orange #FF6B35, sunshine yellow #FFD700). Layout must be clean and giftable, using rounded forms, balanced negative space, and minimal visual clutter. The tone should feel cheerful, light, editorial, and creative — never realistic or photorealistic. No text or logos in any images. Background colors can vary within our color palette."

✏️ Prompt Writing Guidelines

Each prompt should:
• Be written as a fluent, descriptive sentence or paragraph
• Focus on physical object-based scenes (gifts, home goods, accessories, tools, etc.)
• Describe layouts like flat-lay, stacked boxes, tidy clusters, or centered scenes
• Avoid surrealism, fantasy, characters, or complex environments
• Emphasize the mix of 3D-style cartoon objects and 2D design accents (like sparkles, swirls, or illustrated shadows)
• Mention floating elements, sparkles, or motion lines if appropriate
• NEVER include realism, materials (e.g., plastic, glass, metallic), photorealism, or rendering
• ALWAYS include clear dimensional instructions per the image type

✅ Output Format

Return JSON in this format:

{
"slug": "slugified-blog-title-here",
"prompts": [
{
"label": "banner",
"text": "[WRITE FULL STYLED PROMPT HERE]"
},
{
"label": "og",
"text": "[WRITE FULL STYLED PROMPT HERE]"
}
]
}

📌 Prompt Requirements

Each "text" field must:
• Clearly define the subject matter and visual composition
• Include size and aspect ratio information explicitly
• End with the BrightGift Style Signature block exactly as written above
• NEVER include HTML, image data, or base64
• NEVER include watermarks, logos, or brand references inside the image
• Only generate banner and og images (no social images)`,
      createdAt: new Date().toISOString()
    };
    
    // Create the trigger file in the workflow folder
    const triggerPath = path.join('workflow', '05-image-prompts', 'pending', `${content.slug}-image-prompts.json`);
    
    // Ensure the directory exists
    const triggerDir = path.dirname(triggerPath);
    if (!fs.existsSync(triggerDir)) {
      fs.mkdirSync(triggerDir, { recursive: true });
    }
    
    fs.writeFileSync(triggerPath, JSON.stringify(triggerData, null, 2));
    console.log(`✅ Image prompt trigger created: ${triggerPath}`);
    
    return triggerPath;
    
  } catch (error) {
    throw new Error(`Failed to create image prompt trigger: ${error.message}`);
  }
}

/**
 * Wait for Cursor AI to generate image prompts
 */
async function waitForImagePrompts(slug) {
  try {
    console.log(`⏳ Waiting for Cursor AI to generate image prompts for: ${slug}`);
    
    // Check if Cursor AI has processed the trigger file
    const processedPath = path.join('workflow', '05-image-prompts', 'completed', `${slug}-image-prompts.json`);
    const pendingPath = path.join('workflow', '05-image-prompts', 'pending', `${slug}-image-prompts.json`);
    
    // Wait for Cursor AI to process (max 30 seconds)
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      if (fs.existsSync(processedPath)) {
        // Cursor AI has processed the file
        const processedData = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
        console.log(`✅ Image prompts generated by Cursor AI`);
        return processedData.prompts;
      }
      
      // Check if trigger file still exists (Cursor AI is processing)
      if (fs.existsSync(pendingPath)) {
        console.log(`⏳ Cursor AI is processing image prompts... (${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      } else {
        // Trigger file was moved but no processed file found
        throw new Error('Cursor AI processing failed - trigger file removed but no processed file found');
      }
    }
    
    // Timeout - fallback to simple prompts without OpenAI
    console.log(`⚠️ Cursor AI timeout, using fallback prompts`);
    const fallbackPrompts = [
      {
        label: 'banner',
        text: `A flat-lay scene showcasing ${slug.replace(/-/g, ' ')} gifts arranged in a warm, editorial style. Each item should be rendered in a 3D cartoonish style with clean outlines, soft shadows, and no text. Use pastel tones (teal #00A99D, coral-orange #FF6B35, sunshine yellow #FFD700) and include illustrated sparkles or abstract shapes as accents. Maintain a 16:9 layout with ample negative space and no logos or watermarks. Banner images must be text-free and non-photorealistic. Modern flat illustration with soft 3D-style characters and objects, combined with subtle 2D decorative elements. Use warm, vibrant pastels (teal #00A99D, coral-orange #FF6B35, sunshine yellow #FFD700). Layout must be clean and giftable, using rounded forms, balanced negative space, and minimal visual clutter. The tone should feel cheerful, light, editorial, and creative — never realistic or photorealistic. No text or logos in any images. Background colors can vary within our color palette.`
      },
      {
        label: 'og',
        text: `A well-balanced horizontal layout showing ${slug.replace(/-/g, ' ')} gifts with a clean, editorial vibe. Render objects in a cute, soft-edged 3D style and arrange them with plenty of negative space. Avoid any text or logos. Use background elements like stars, lines, or geometric shapes in 2D to accent the scene. Format should be 1200×630 and suitable for link previews. Modern flat illustration with soft 3D-style characters and objects, combined with subtle 2D decorative elements. Use warm, vibrant pastels (teal #00A99D, coral-orange #FF6B35, sunshine yellow #FFD700). Layout must be clean and giftable, using rounded forms, balanced negative space, and minimal visual clutter. The tone should feel cheerful, light, editorial, and creative — never realistic or photorealistic. No text or logos in any images. Background colors can vary within our color palette.`
      }
    ];
    
    return fallbackPrompts;
    
  } catch (error) {
    throw new Error(`Failed to wait for image prompts: ${error.message}`);
  }
}

/**
 * Generate image prompts using your actual GPT image assistant
 */
async function generateImagePromptsWithAssistant(frontmatter, config) {
  const env = getEnvConfig();
  const imageAssistantId = 'asst_tholLMDBMGjJbgjy9TTbQ6qo'; // Your image assistant ID
  
  if (!env.openai?.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    // Create a thread
    const thread = await createThread(env.openai.apiKey);
    
    // Add the blog title and description as a message
    const message = await addMessage(thread.id, buildImagePromptMessage(frontmatter), env.openai.apiKey);
    
    // Run the image assistant
    const run = await runAssistant(thread.id, imageAssistantId, env.openai.apiKey);
    
    // Wait for completion and get response
    const response = await waitForCompletion(thread.id, run.id, env.openai.apiKey);
    
    // Parse the JSON response from your assistant
    const promptData = parseImageAssistantResponse(response);
    
    return promptData.prompts;
    
  } catch (error) {
    throw new Error(`Image prompt generation failed: ${error.message}`);
  }
}

/**
 * Build the message to send to the image assistant
 */
function buildImagePromptMessage(frontmatter) {
  return `Please generate image prompts for this blog post:

Title: "${frontmatter.title}"
Description: "${frontmatter.description || ''}"

Please follow your instructions and return the prompts in the required JSON format with banner, social, and og prompts.`;
}

/**
 * Create a new thread
 */
async function createThread(apiKey) {
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2',
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create thread: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Add a message to a thread
 */
async function addMessage(threadId, content, apiKey) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      role: 'user',
      content: content
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add message: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Run an assistant on a thread
 */
async function runAssistant(threadId, assistantId, apiKey) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      assistant_id: assistantId
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to run assistant: ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Wait for assistant completion and get response
 */
async function waitForCompletion(threadId, runId, apiKey) {
  let status = 'queued';
  let attempts = 0;
  const maxAttempts = 60; // Increased timeout for image generation
  const spinner = require('ora')('Waiting for Image Assistant...').start();
  
  while (status !== 'completed' && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    try {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to check run status: ${response.statusText}`);
      }
      
      const runData = await response.json();
      status = runData.status;
      attempts++;
      
      // Update spinner with status
      spinner.text = `Image Assistant: ${status} (${attempts}/${maxAttempts}s)`;
      
      if (status === 'failed') {
        spinner.fail(`Image assistant run failed: ${runData.last_error?.message || 'Unknown error'}`);
        throw new Error(`Image assistant run failed: ${runData.last_error?.message || 'Unknown error'}`);
      }
      
      if (status === 'requires_action') {
        spinner.warn('Image assistant requires action - this may cause hanging');
        // Continue waiting but log the issue
      }
      
    } catch (error) {
      if (attempts >= maxAttempts) {
        spinner.fail(`Image assistant run timed out after ${maxAttempts} seconds`);
        throw new Error(`Image assistant run timed out after ${maxAttempts} seconds`);
      }
      // Continue trying on network errors
      console.log(chalk.yellow(`⚠️  Network error checking image status, retrying... (${error.message})`));
    }
  }
  
  if (status !== 'completed') {
    spinner.fail(`Image assistant run timed out - status: ${status}`);
    throw new Error(`Image assistant run timed out - status: ${status}`);
  }
  
  spinner.succeed('Image Assistant completed');
  
  // Get the messages from the thread
  const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  });
  
  if (!messagesResponse.ok) {
    throw new Error(`Failed to get messages: ${messagesResponse.statusText}`);
  }
  
  const messagesData = await messagesResponse.json();
  
  // Find the assistant's response (most recent message from assistant)
  const assistantMessage = messagesData.data.find(msg => msg.role === 'assistant');
  if (!assistantMessage) {
    throw new Error('No assistant response found in thread');
  }
  
  return assistantMessage;
}

/**
 * Parse the image assistant's JSON response
 */
function parseImageAssistantResponse(message) {
  try {
    console.log('Debug: Message structure:', JSON.stringify(message, null, 2));
    
    if (!message || !message.content || !Array.isArray(message.content) || message.content.length === 0) {
      throw new Error('Invalid message structure - no content array');
    }
    
    // Look for text content in the message
    const textContent = message.content.find(content => content.type === 'text');
    if (!textContent || !textContent.text || !textContent.text.value) {
      console.log('Debug: Available content types:', message.content.map(c => c.type));
      throw new Error('Invalid message structure - no text content found');
    }
    
    const content = textContent.text.value;
    console.log('Debug: Raw content:', content);
    
    // Try to extract JSON from the response
    let jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in assistant response');
    }
    
    const promptData = JSON.parse(jsonMatch[0]);
    console.log('Debug: Parsed prompt data:', JSON.stringify(promptData, null, 2));
    
    // Validate required fields
    if (!promptData.prompts || !Array.isArray(promptData.prompts)) {
      throw new Error('Missing prompts array in assistant response');
    }
    
    return promptData;
    
  } catch (error) {
    throw new Error(`Failed to parse image assistant response: ${error.message}`);
  }
}

/**
 * Generate image using AI service
 */
async function generateImage(prompt, dimensions, config) {
  const env = getEnvConfig();
  const imageConfig = config.imageGeneration;
  
  if (imageConfig.model === 'gpt-image-1') {
    return await generateWithGPTImage1(prompt, dimensions, config);
  } else if (imageConfig.model === 'dall-e-3') {
    return await generateWithDALLE3(prompt, dimensions, config);
  } else {
    // Default to gpt-image-1
    return await generateWithGPTImage1(prompt, dimensions, config);
  }
}

/**
 * Generate image using gpt-image-1
 */
async function generateWithGPTImage1(prompt, dimensions, config) {
  const env = getEnvConfig();
  if (!env.gptImage?.apiKey) {
    throw new Error('GPT Image API key not configured');
  }
  
  // Convert dimensions to gpt-image-1 format
  const gptImageDimensions = convertDimensionsForGPTImage1(dimensions);
  
  // Real gpt-image-1 API call
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.gptImage.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt: prompt,
      size: gptImageDimensions,
      n: 1
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(`gpt-image-1 error: ${data.error.message}`);
  
  // Track cost for image generation
  costTracker.trackImageCall('gptImage1', 'standard', 1);
  
  // Debug: Check the response structure
  console.log('GPT Image API Response structure:', Object.keys(data));
  
  // Handle different response formats
  if (data.data && Array.isArray(data.data) && data.data[0]) {
    if (data.data[0].url) {
      return data.data[0].url;
    } else if (data.data[0].b64_json) {
      // Handle base64 response format
      return `data:image/png;base64,${data.data[0].b64_json}`;
    }
  } else if (data.url) {
    return data.url;
  } else if (data.data && data.data.url) {
    return data.data.url;
  } else if (data.data && data.data.b64_json) {
    // Handle base64 response format (fallback)
    return `data:image/png;base64,${data.data.b64_json}`;
  } else {
    console.error('Unexpected response format:', JSON.stringify(data, null, 2));
    throw new Error(`Invalid response from gpt-image-1 API: ${JSON.stringify(data)}`);
  }
}

/**
 * Generate image using OpenAI DALL-E 3
 */
async function generateWithDALLE3(prompt, dimensions, config) {
  const env = getEnvConfig();
  
  if (!env.openai?.apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const OpenAI = require('openai');
  const openai = new OpenAI({
    apiKey: env.openai.apiKey
  });
  
  // Convert dimensions to DALL-E format
  const dalleDimensions = convertDimensions(dimensions);
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: dalleDimensions,
    quality: "standard",
    n: 1,
  });
  
  // Track cost for DALL-E 3 image generation
  costTracker.trackImageCall('dallE3', 'standard', 1);
  
  return response.data[0].url;
}

/**
 * Convert dimensions to DALL-E format
 */
function convertDimensions(dimensions) {
  let width, height;
  
  // Handle both string format ("1200x630") and object format ({width: 1200, height: 630})
  if (typeof dimensions === 'string') {
    [width, height] = dimensions.split('x').map(Number);
  } else if (typeof dimensions === 'object' && dimensions.width && dimensions.height) {
    width = dimensions.width;
    height = dimensions.height;
  } else {
    throw new Error(`Invalid dimensions format: ${JSON.stringify(dimensions)}`);
  }
  
  if (width === 1024 && height === 1024) return "1024x1024";
  if (width === 1792 && height === 1024) return "1792x1024";
  if (width === 1024 && height === 1792) return "1024x1792";
  
  // Default to square if dimensions don't match DALL-E options
  return "1024x1024";
}

/**
 * Convert dimensions to gpt-image-1 format
 * gpt-image-1 supports: '1024x1024', '1024x1536', '1536x1024', and 'auto'
 */
function convertDimensionsForGPTImage1(dimensions) {
  let width, height;
  
  // Handle both string format ("1200x630") and object format ({width: 1200, height: 630})
  if (typeof dimensions === 'string') {
    [width, height] = dimensions.split('x').map(Number);
  } else if (typeof dimensions === 'object' && dimensions.width && dimensions.height) {
    width = dimensions.width;
    height = dimensions.height;
  } else {
    throw new Error(`Invalid dimensions format: ${JSON.stringify(dimensions)}`);
  }
  
  // Exact matches
  if (width === 1024 && height === 1024) return "1024x1024";
  if (width === 1024 && height === 1536) return "1024x1536";
  if (width === 1536 && height === 1024) return "1536x1024";
  
  // For banner/landscape images (like 1200x630), use 1536x1024
  if (width > height) {
    return "1536x1024";
  }
  
  // For portrait images, use 1024x1536
  if (height > width) {
    return "1024x1536";
  }
  
  // Default to square
  return "1024x1024";
}

/**
 * Save image from URL to file
 */
async function saveImage(imageUrl, filePath, dimensions) {
  try {
    let buffer;
    
    // Handle both URLs and base64 data URLs
    if (imageUrl.startsWith('data:')) {
      // Handle base64 data URL
      const base64Data = imageUrl.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else {
      // Handle regular URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      buffer = Buffer.from(await response.arrayBuffer());
    }
    
    // Process image with Sharp
    let width, height;
    if (typeof dimensions === 'string') {
      [width, height] = dimensions.split('x').map(Number);
    } else if (typeof dimensions === 'object' && dimensions.width && dimensions.height) {
      width = dimensions.width;
      height = dimensions.height;
    } else {
      throw new Error(`Invalid dimensions format: ${JSON.stringify(dimensions)}`);
    }
    
    await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(filePath);
    
  } catch (error) {
    throw new Error(`Failed to save image: ${error.message}`);
  }
}

/**
 * Convert WebP to JPG
 */
async function convertToJPG(webpPath, jpgPath) {
  try {
    await sharp(webpPath)
      .jpeg({ quality: 85 })
      .toFile(jpgPath);
  } catch (error) {
    console.warn(`Failed to convert ${webpPath} to JPG: ${error.message}`);
  }
}

/**
 * Optimize image for web
 */
async function optimizeImage(inputPath, outputPath, options = {}) {
  const {
    quality = 85,
    format = 'webp',
    width,
    height
  } = options;
  
  try {
    let sharpInstance = sharp(inputPath);
    
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, { fit: 'cover' });
    }
    
    if (format === 'webp') {
      await sharpInstance.webp({ quality }).toFile(outputPath);
    } else if (format === 'jpeg') {
      await sharpInstance.jpeg({ quality }).toFile(outputPath);
    } else if (format === 'png') {
      await sharpInstance.png({ quality }).toFile(outputPath);
    }
    
  } catch (error) {
    throw new Error(`Image optimization failed: ${error.message}`);
  }
}

/**
 * Generate alt text for images
 */
async function generateAltText(imagePath, content, config) {
  // Generate simple, descriptive alt text without using OpenAI
  const title = content.frontmatter.title;
  const slug = content.slug;
  
  // Extract key words from slug for better SEO
  const keywords = slug.replace(/-/g, ' ').split(' ').filter(word => word.length > 2);
  const keyPhrase = keywords.slice(0, 3).join(' ');
  
  // Create descriptive alt text
  let altText = '';
  
  if (imagePath.includes('banner')) {
    altText = `Banner image featuring ${keyPhrase} gifts and products`;
  } else if (imagePath.includes('og')) {
    altText = `Preview image for ${title} - ${keyPhrase} gift guide`;
  } else if (imagePath.includes('social')) {
    altText = `Social media image for ${title} - ${keyPhrase} recommendations`;
  } else {
    altText = `Image showcasing ${keyPhrase} gifts and products`;
  }
  
  // Ensure alt text is under 125 characters
  if (altText.length > 125) {
    altText = altText.substring(0, 122) + '...';
  }
  
  return altText;
}

module.exports = {
  generateImages,
  optimizeImage,
  generateAltText
}; 