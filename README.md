<p align="center">
<img src="public/HULL-Logo.svg" align="center" height="150" />
</p>
<p align="center">
  <strong>Headless Shopify starter built on <a href="https://nextjs.org">Next.js</a></strong> 🤘 <br />
  <strong>Headless CMS powered by <a href="https://sanity.io">Sanity.io</a></strong><br />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-set-up">Set Up</a> •
  <a href="#-spin-up">Spin Up</a> •
  <a href="#-extrastips">Extras</a> •
  <a href="#license">License</a>
</p>

<img src="public/HULL.png" align="center" />

# ✨ Features
🟢 **= implemented**&nbsp;&nbsp;/&nbsp;&nbsp;
🟡 **= in progress**&nbsp;&nbsp;/&nbsp;&nbsp;
⚪ **= not started**

---

- 🟢 Page Transitions powered by Framer Motion
- 🟢 Lazyload Images + WEBP format by default
- 🟢 Built-in Global navigation with active states and options for: internal links, external links, dropdowns, buttons
- 🟢 Mailchimp Newsletter form with opt-in feature, validation, and success/failure states
- 🟢 Contact Form with email notifications powered by SendGrid, validation, and success/failure states
- 🟢 Dynamic Page Routes with optional nesting (ie. /parent/child)
- 🟢 Automatic Sitemap.xml generation
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
   
# 💀 Set Up

### Shopify Storefront Access
1. Enable Private Apps in Shopify
   - Apps > "Manage Private Apps" *(text link in page footer)*
   - Enable Private Apps
2. Create new Private App
   - Apps > Manage Private Apps > "Create private app" 
   - Use your dev email to know when there are issues
   - Allow this app to access your storefront data using the Storefront API.

### Shopify Webhooks
1. Go to "Settings" *(bottom left)* -> "Notifications" -> "Webhooks" *(very bottom)*
2. add the following webhooks:
  - product update - `[your-domain]/api/shopify/product-update`
  - product deletion - `[your-domain]/api/shopify/product-delete`
  
### Sanity
1. `npm install && sanity init` in the `/studio` folder
2. During Sanity's initalization it will warn you, type `Y` and hit `enter`:
```
? The current folder contains a configured Sanity studio. Would you like to reconfigure it? (Y/n)
```
3. When it asks you what dataset configuration to use, go with the `default`
4. Add `localhost` and your `.vercel.app` suffixed domain and any custom domains to your Sanity Project's API origins **(do not give credentials)**

### NextJS (frontend)
1. Clone this repository from your GitHub account with the `use template` button
2. `npm install` in the project root folder on local
3. Create an `.env.local` file in the project folder, and add the following variables:
```
SANITY_PROJECT_DATASET=production
SANITY_PROJECT_ID=XXXXXX
SANITY_API_TOKEN=XXXXXX
SHOPIFY_STORE_ID=XXXXXX
SHOPIFY_API_TOKEN=XXXXXX
SHOPIFY_API_PASSWORD=XXXXXX
SHOPIFY_WEBHOOK_INTEGRITY=XXXXXX
```
4. Update all the `XXXXXX` values, here's where to find each:
  - `SANITY_PROJECT_ID` - You can grab this after you've initalized Sanity, either from the `studio/sanity.json` file, or from your Sanity Manage dashboard
  - `SANITY_API_TOKEN` - Generate an API token for your Sanity project. Access your project from the Sanity Manage dashboard, and navigate to: "Settings" -> "API" -> "Add New Token" button
  - `SHOPIFY_STORE_ID` - This is your Shopify store ID, it's the subdomain behind `.myshopify.com`
  - `SHOPIFY_API_TOKEN` - Copy the Storefront Access Token you copied from setting up your Private Shopify App. _(Note: This is **not** the Admin API Key, scroll to the bottom where it says "Storefront API" for the correct value)_
  - `SHOPIFY_API_PASSWORD` - Copy the Admin API password from "Apps" -> "Manage private apps" -> [your_private_app].
  - `SHOPIFY_WEBHOOK_INTEGRITY` - Copy the Integrity hash from "Settings" -> "Notifications" -> "Webhooks" *(very bottom of page)*


# ⚡ Spin Up

### Frontend
`npm run dev` in the project folder to start the frontend locally
   - Your Frontend should be running on [http://localhost:3000](http://localhost:3000)
   
### Sanity
`sanity start` in the `/studio` folder to start the studio locally
   - Your Sanity Studio should be running on [http://localhost:3333](http://localhost:3333)


# Deployment

### Frontend

### Sanity


# 🤘 Extras/Tips

#### Error: Failed to communicate with the Sanity API
If you get this error in your CLI, you need to logout and log back in again, unfortunately. Simply do `sanity logout` and then `sanity login` to fix.

#### Access your `product_sync` metafields in Shopify without using a plugin
Simply navigate to: `https://[store_id].myshopify.com/admin/bulk?resource_name=Product&edit=metafields.sanity.product_sync`

# License

### MIT
> [nickdimatteo.com](https://nickdimatteo.com) &nbsp;&middot;&nbsp;
> GitHub [@ndimatteo](https://github.com/ndimatteo) &nbsp;&middot;&nbsp;
> Instagram [@ndimatteo](https://instagram.com/ndimatteo)
