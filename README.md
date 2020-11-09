<img src="public/HULL-Logo.svg" align="center" height="150" />

Website built on [Next.js](https://nextjs.org) 🤘 <br />
Headless CMS powered by [Sanity.io](https://sanity.io)


## Features

- ✅ Page Transitions powered by Framer Motion
- ✅ Lazyload Images + WEBP format by default
- ✅ Built-in Global navigation with active states and options for: internal links, external links, dropdowns, buttons
- ✅ Mailchimp Newsletter form with opt-in feature, validation, and success/failure states
- ✅ Contact Form with email notifications powered by SendGrid, validation, and success/failure states
- ✅ Dynamic Page Routes with optional nesting (ie. /parent/child)
- ✅ Automatic Sitemap.xml generation
- 🟢 Automatic robots.txt generation
- 🟢 301 Redirects pulled in from Sanity
- 🟢 Dynamic Modules for building page content, including:
   - 🟢 Marquees
   - 🟢 Image Carousels
   - 🟢 Accordions
   - 🟢 Pull-out Drawers
   - ⚪ One-off Card Grids
   - ⚪ Relationship Card Grids
- 🟢 Styles powered by PostCSS, to mimic SASS syntax
- 🟢 Baseline styles for all components, using a BEM-like approach
- 🟢 Simple Social icon navigation lists
- 🟡 Cursor Follow component
- ⚪ Initial animations
- ⚪ Scroll Animations
- ⚪ Default Blog setup
- ⚪ Instagram Module
- 🟢 Accessibility features:
   - 🟢 ARIA Landmark Roles
   - 🟢 Preserve default Focus States
   - Correctly Trap focus when Drawers (like the Shop Cart) are open (w/ [focus-trap-react](https://www.npmjs.com/package/focus-trap-react))
   - 🟢 Correctly associated button states
   - 🟢 Required `alt` states for all images
   - 🟡 Skip to Content link
- 🟢 SEO features:
   - 🟢 Page-level SEO settings for meta descriptions and share graphics
   - 🟢 Fallback Global SEO settings
   - 🟢 Product Variant-specific SEO updates
   - 🟢 Automatic JSON-LD Schema markup for Products
   
### Headless Shopify
- 🟢 Shopify Sync
- 🟢 Automatic Variant option toggles
- 🟢 Update URL on variant changes but keep a clean history stack
- 🟢 Accessible and clamped Quantity Counters
- 🟢 Vanity Shop URL Masking
- 🟢 Global Cart with access to all variant data for line items
- 🟢 Supports Single Variant products out of the box
- 🟡 PDP Photo Galleries with variant granularity
- 🟡 default PLP for all products
- 🟡 Custom PLP with easy, Sanity-managed Collections
- ⚪ Sanity-managed conditional Cart "add-ons"


## Quick start

1. Clone this repository from your GitHub account
2. `npm install` in the project root folder on local
3. `npm run dev` to start the frontend locally
   - Your site should be running on [http://localhost:3000](http://localhost:3000)
