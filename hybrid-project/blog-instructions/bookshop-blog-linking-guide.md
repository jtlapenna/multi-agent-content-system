# 📚 Bookshop.org Blog Linking Guide for Authors

## Overview
This guide helps blog post authors create direct Bookshop.org affiliate links using ISBNs for maximum conversion rates and better user experience.

---

## 🔗 **Direct Book Linking (Preferred Method)**

### Why Use Direct Links?
- **Higher conversion rates** - Users land directly on the book page
- **Better user experience** - No search results to navigate
- **More accurate tracking** - Direct attribution to specific books
- **Professional appearance** - Clean, direct links

### Link Format
```
https://bookshop.org/a/brightgift/ISBN
```

**Example:**
```
https://bookshop.org/a/brightgift/9780525559474
```

---

## 🔍 **How to Find ISBNs**

### Method 1: Bookshop.org Search
1. Go to [bookshop.org](https://bookshop.org)
2. Search for the book title
3. Click on the book
4. Look for the ISBN in the product details (usually 10 or 13 digits)
5. Copy the ISBN and create your link

### Method 2: Google Books
1. Search "book title author ISBN" on Google
2. Look for Google Books results
3. ISBN is usually displayed in the book details

### Method 3: Amazon Product Page
1. Go to Amazon and search for the book
2. On the product page, scroll down to "Product Details"
3. Look for "ISBN-13" or "ISBN-10"
4. Copy the ISBN

### Method 4: Library of Congress
1. Visit [loc.gov](https://loc.gov)
2. Search for the book
3. ISBN will be listed in the catalog record

---

## 📝 **Blog Post Implementation**

### Frontmatter Example
```yaml
---
title: "25 Thoughtful Gifts for Book Lovers Under $50"
affiliateLinks:
  - text: "The Midnight Library by Matt Haig"
    url: "https://bookshop.org/a/brightgift/9780525559474"
    platform: "bookshop"
  - text: "Atomic Habits by James Clear"
    url: "https://bookshop.org/a/brightgift/9780735211292"
    platform: "bookshop"
---
```

### In-Content Link Example
```html
<a href="https://bookshop.org/a/brightgift/9780525559474" class="amazon-link" target="_blank" rel="noopener">View on Bookshop.org</a>
```

### Markdown Link Example
```markdown
[The Midnight Library by Matt Haig](https://bookshop.org/a/brightgift/9780525559474)
```

---

## 📚 **Popular Book ISBNs for Gift Guides**

### Fiction Bestsellers
- **The Midnight Library** by Matt Haig: `9780525559474`
- **The Seven Husbands of Evelyn Hugo** by Taylor Jenkins Reid: `9781501161933`
- **Tomorrow, and Tomorrow, and Tomorrow** by Gabrielle Zevin: `9780593321201`
- **Lessons in Chemistry** by Bonnie Garmus: `9780385547345`
- **The House in the Cerulean Sea** by TJ Klune: `9781250217288`

### Non-Fiction Bestsellers
- **Atomic Habits** by James Clear: `9780735211292`
- **The Psychology of Money** by Morgan Housel: `9780857197689`
- **Think Again** by Adam Grant: `9781984878106`
- **The Subtle Art of Not Giving a F*ck** by Mark Manson: `9780062457714`
- **Sapiens** by Yuval Noah Harari: `9780062316097`

### Children's Books
- **The Very Hungry Caterpillar** by Eric Carle: `9780399226908`
- **Where the Wild Things Are** by Maurice Sendak: `9780060254926`
- **Goodnight Moon** by Margaret Wise Brown: `9780060775858`
- **The Giving Tree** by Shel Silverstein: `9780060256654`
- **Charlotte's Web** by E.B. White: `9780061124952`

### Reading Accessories
- **Reading Journal**: `9781641522944`
- **Book Lover's Journal**: `9781641522951`
- **Reading Tracker**: `9781641522968`

---

## 🔄 **Fallback Method: Search Links**

When you can't find an ISBN, use search links:

### Search Link Format
```
https://bookshop.org/search?keywords=BOOK+KEYWORDS&affiliate=brightgift
```

### Example
```html
<a href="https://bookshop.org/search?keywords=midnight+library+matt+haig&affiliate=brightgift" class="amazon-link" target="_blank" rel="noopener">View on Bookshop.org</a>
```

### When to Use Search Links
- New releases without confirmed ISBNs
- Books with multiple editions
- Out-of-print books
- Books not available on Bookshop.org

---

## 📋 **Blog Post Checklist**

### Before Publishing
- [ ] Verify all ISBNs are correct
- [ ] Test all Bookshop.org links
- [ ] Ensure affiliate ID is `brightgift` (not bright-gift)
- [ ] Include proper disclosure statement
- [ ] Use `amazon-link` class for consistent styling
- [ ] Set `target="_blank" rel="noopener"` for all links

### Disclosure Statement
```markdown
*As an Amazon Associate and Bookshop.org affiliate, we earn from qualifying purchases. This post contains affiliate links, which means we may earn a commission if you click through and make a purchase, at no additional cost to you.*
```

---

## 🎯 **Best Practices**

### Link Placement
- **Primary:** Direct book recommendations
- **Secondary:** Reading accessories and related items
- **Tertiary:** Gift combinations and bundles

### Content Strategy
- Include book descriptions and why they're recommended
- Mention target audience and reading level
- Provide price ranges when possible
- Create gift combinations with multiple books

### SEO Optimization
- Use descriptive anchor text
- Include book titles and authors in links
- Link to related content on your site
- Use internal linking to other book-related posts

---

## 🔧 **Technical Implementation**

### Environment Variable
Make sure your Cloudflare Pages environment includes:
```
BOOKSHOP_AFFILIATE_ID=brightgift
```

### Link Validation
Test all links before publishing:
1. Click each link to ensure it works
2. Verify the book loads correctly
3. Check that affiliate tracking is working
4. Confirm the book is available for purchase

---

## 📊 **Performance Tracking**

### Monitor These Metrics
- Click-through rates on Bookshop.org links
- Conversion rates by book category
- Revenue per book recommendation
- Performance of direct vs search links

### Optimization Tips
- Track which books perform best
- A/B test different link placements
- Monitor seasonal book trends
- Update recommendations regularly

---

## 🚨 **Common Mistakes to Avoid**

1. **Wrong Affiliate ID**: Using `bright-gift` instead of `brightgift`
2. **Incorrect ISBN**: Double-check all ISBNs before publishing
3. **Broken Links**: Test all links before going live
4. **Missing Disclosure**: Always include affiliate disclosure
5. **Poor Anchor Text**: Use descriptive, keyword-rich anchor text

---

## 📞 **Need Help?**

If you need help finding an ISBN or creating links:
1. Check the popular ISBNs list above
2. Use the fallback search method
3. Contact the content team for assistance
4. Use Bookshop.org's search function to find books

Remember: Direct links with ISBNs always perform better than search links! 