<p align="center">
<img src="public/HULL-Logo.svg" align="center" height="100" />
</p>
<p align="center">
  <strong>Headless Shopify starter built on <a href="https://nextjs.org">Next.js</a></strong> 🤘 <br />
  <strong>Headless CMS powered by <a href="https://sanity.io">Sanity.io</a></strong> ⚡<br />
</p>

<p align="center">
  <a href="https://hull.dev">
    <img src="https://img.shields.io/static/v1?label=&message=View%20Demo&style=for-the-badge&color=black&logo=vercel" />
  </a>
  <br />
  <a href="https://www.sanity.io/create?template=ndimatteo/HULL">
    <img src="https://img.shields.io/static/v1?label=Sanity&message=Create%20Project&style=for-the-badge&color=156dff&labelColor=black" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tours">Tours</a> •
  <a href="#-automatic-set-up">Set Up</a> •
  <a href="#-spin-up">Spin Up</a> •
    <a href="#-deployment">Deployment</a> •
  <a href="#-extrastips">Extras</a>
</p>
<br />

<br />

# ✨ Features

- Utility-first CSS with [Tailwind CSS](https://tailwindcss.com)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Cart powered by [Shopify Buy SDK](https://www.npmjs.com/package/shopify-buy)
- Real-time inventory check for products using [SWR](https://swr.vercel.app)
- Customizable Filtering & Sorting for product collections
- Klaviyo waitlist form for out-of-stock products
- Klaviyo newsletter form with opt-in field
- Dynamic Page Routes for custom page creation
- Automatic `Sitemap.xml` generation
- Automatic `robots.txt` generation
- Automatic 301 Redirects from Sanity
- Live Preview content directly from Sanity
- Modern Image component using Sanity's Hotspot, Crop, and automatic WEBP format
- Modular page content for all pages, including dynamic grid layouts
- Customizable Promotion Banner
- Customizable Cookie Notice
- Accessibility features:
  - ARIA Landmark Roles
  - Default focus states preserved for keyboard navigation
  - Correctly trap focus for drawers with [focus-trap-react](https://www.npmjs.com/package/focus-trap-react)
  - Roving tabindex for radio buttons
  - Input-based quantity counters
  - Required `alt` text for all images
  - "Skip to Content" link
- SEO features:
  - Page-level SEO/Share settings with previews
  - Fallback Global SEO/Share settings
  - Automatic JSON-LD Schema markup for products

### Shopify Integration Features

- Automatically syncs products from Shopify into Sanity
- Custom action to sync product cart thumbnails back to Shopify from Sanity
- Tracks product status _(draft/published)_ from Shopify to help control visibility while editing
- Deleted products and variants are preserved and flagged in Sanity
- Updates the URL on variant changes while keeping a clean history stack
- Vanity shop URL masking
- Global Cart with access to all variant data for line items
- Supports Single Variant products out of the box
- Product photo galleries with variant granularity
- Dynamic `/shop` collection page
- Custom collection pages
- Ability to surface a variant option on product cards

<br />

# 🎧 Tours

Still not sold? Here's some videos to get you psyched:

**Famous 5-Minute Setup™ - `Coming Soon`** <br />
_From sync to sale, watch me spin up a fresh storefront in under 5 minutes!_

**Explore the file Structure - `Coming Soon`** <br />
_In-depth look at the file structure, naming conventions, and logic under the hood_

**Setting up your first Product - `Coming Soon`** <br />
_Explore the Product settings within Sanity and how to properly setup PDP pages and PLP cards_

**Connecting to Klaviyo and testing your Forms - `Coming Soon`** <br />
_Learn how to quickly connect Klaviyo to utilize product waitlist and newsletter forms_

**Setup your first Vercel deployment - `Coming Soon`** <br />
_Using the Sanity Vercel Deploy plugin, see how easy it is to empower your clients to trigger deploys_

<br />

# 🔥 Automatic Set Up

Quickly [deploy as a Sanity Starter](https://www.sanity.io/create?template=ndimatteo/HULL) on [Vercel](https://vercel.com) with a pre-populated store! Once deployed, simply follow step 2 and 3 below to connect your Shopify store.

> ⚠️ **Important!** <br />Existing products will not automatically sync into Sanity. <br />You will need to trigger this by making a change to your product(s) in Shopify.

<br />

# 💀 Manual Set Up

Clone this repository from your GitHub account with the [Use this template](https://github.com/ndimatteo/HULL/generate) button

### 1) Sanity

1. **Initialize and build the Sanity Studio**
   - Make sure you have the [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) installed globally first
   - `yarn && sanity init` in the `/studio` folder
   - During Sanity's initalization it will warn you that the Sanity Studio is already configured. Type `Y` and hit `enter` to reconfigure it to your own project
   - When it asks you what dataset configuration to use, go with the `default`
2. **Add CORS Origins to Sanity project**
   - Visit [manage.sanity.io](https://manage.sanity.io) and go to [your-project] > API > "CORS origins"
   - Add your Studio URLs **_with_** credentials: `http://localhost:3333` and `[subdomain].sanity.studio`
   - Add your front-end URLs **_without_** credentials: `http://localhost:3000` and `https://[subdomain].vercel.app`

### 2) Shopify Storefront Access

1. **Allow custom app development in Shopify**
   - Go to "Settings" _(bottom left)_ > "Apps and sales channels" > "Develop apps" _(top right)_
   - click "Allow custom app development"
2. **Create a custom app in Shopify**
   - Go to "Settings" _(bottom left)_ > "Apps and sales channels" > "Develop apps" _(top right)_
   - click "Create an app"
   - Give this a relevant App name, I prefer: "Headless Storefront", so it's clear what it's being used for
   - Use your dev account as the App developer to know when there are issues
3. **Configure Admin API scopes**
   - Configuration > Admin API integration > "Configure"
   - Check the following boxes for the "Products" scope: `write_products` and `read_products`
4. **Configure Storefront API scopes**
   - Configuration > Storefront API integration > "Configure"
   - Check the following boxes for the "Products" scope: `unauthenticated_read_product_listings` and `unauthenticated_read_product_inventory`
   - Check the following boxes for the "Checkout" scope: `unauthenticated_write_checkouts` and `unauthenticated_read_checkouts`
5. **Install the App**

### 3) Shopify Webhooks

1. Go to "Settings" _(bottom left)_ -> "Notifications" -> "Webhooks" _(very bottom)_
2. add the following webhooks with the (Latest) stable API version:
   - Product creation - `[live-domain]/api/shopify/product-update`
   - Product update - `[live-domain]/api/shopify/product-update`
   - Product deletion - `[live-domain]/api/shopify/product-delete`
     > ⚠️ **Note** <br />You have to use a real, live domain name (not localhost!). Be sure to use your Vercel project URL during development, and then switch to the production domain once live. You may not know your Vercel project URL until you deploy, feel free to enter something temporary, but make sure to update this once deployed!

### 4) NextJS

1. `yarn` in the project root folder on local
2. Create an `.env.local` file in the project folder, and add the following variables:

```
SANITY_PROJECT_DATASET=production
SANITY_PROJECT_ID=XXXXXX
SANITY_API_TOKEN=XXXXXX
SANITY_STUDIO_PREVIEW_SECRET=XXXXXX

SHOPIFY_STORE_ID=XXXXXX
SHOPIFY_STOREFRONT_API_TOKEN=XXXXXX
SHOPIFY_ADMIN_API_TOKEN=XXXXXX
SHOPIFY_WEBHOOK_INTEGRITY=XXXXXX

// Needed for Klaviyo forms:
KLAVIYO_API_KEY=XXXXXX

// Needed for Mailchimp forms:
MAILCHIMP_API_KEY=XXXXXX-usX
MAILCHIMP_SERVER=usX

// Needed for SendGrid forms:
SENDGRID_API_KEY=XXXXXX
```

3. Update all the `XXXXXX` values, here's where to find each:

- `SANITY_PROJECT_ID` - You can grab this after you've initalized Sanity, either from the `studio/sanity.json` file, or from your Sanity Manage dashboard
- `SANITY_API_TOKEN` - Generate an API token for your Sanity project. Access your project from the Sanity Manage dashboard, and navigate to: "Settings" -> "API" -> "Add New Token" button. Make sure you give `read + write` access!
- `SANITY_STUDIO_PREVIEW_SECRET` - A unique string of your choice. This is used to confirm the authenticity of "preview mode" requests from the Sanity Studio
- `SHOPIFY_STORE_ID` - This is your Shopify store ID, it's the subdomain behind `.myshopify.com`
- `SHOPIFY_ADMIN_API_TOKEN` - Copy the Admin API access token from "Apps" -> "Develop apps" -> [your_custom_app] -> "API credentials". (__Note: you’ll only be able to reveal your Admin API token once.__)
- `SHOPIFY_STOREFRONT_API_TOKEN` - Copy the Storefront API access token from "Apps" -> "Develop apps" -> [your_custom_app] -> "API credentials".
- `SHOPIFY_WEBHOOK_INTEGRITY` - Copy the Integrity hash from "Settings" -> "Notifications" -> "Webhooks" _(very bottom of page)_
- `KLAVIYO_API_KEY` - Create a Private API Key from your Klaviyo Account "Settings" -> "API Keys"
- `MAILCHIMP_API_KEY` - Create an API key from "Account -> "Extras" -> API Keys
- `MAILCHIMP_SERVER` - This is the server your account is from. It's in the URL when logged in and at the end of your API Key
- `SENDGRID_API_KEY` - Create an API key from "Settings" -> "API Keys" with "Restricted Access" to only "Mail Send"

4. Create an `.env.production` and `.env.development` file in the `/studio` folder, and add the following (using the same value as above):

```
SANITY_STUDIO_PREVIEW_SECRET=XXXXXX
```

### 5) Shopify Store Theme

Since we're serving our store through a headless environment, we don't want visitors accessing our unused shopify theme. The domain for this is visible during checkout, and is publicly accessible. To silence it, replace your current theme's `theme.liquid` file with the one from this repo, and replace `YOUR_STOREFRONT_DOMAIN_NO_PROTOCOL` with your actual frontsite domain URL **(do not include protocol or trailing slash)**

This will essentially "pass-through" URLs accessed at your Shopify Store to your true headless storefront _(ie. `shop.hull.dev/products` -> `hull.dev/products`)_

<br />

# ⚡ Spin Up

### Next (Front End)

`yarn dev` in the project folder to start the front end locally

- Your front end should be running on [http://localhost:3000](http://localhost:3000)

### Sanity (Back End)

`yarn dev` in the `/studio` folder to start the studio locally

- Your Sanity Studio should be running on [http://localhost:3333](http://localhost:3333)
  > ⚠️ **Gotcha!** <br />If you did not manually set up your project, the `projectId` in `/studio/sanity.json` will still be set to the HULL demo project. Make sure to update this before starting the studio, otherwise you will be denied access when trying to access your studio.

<br />

# 🚀 Deployment

### Vercel

This is setup to work seamlessly with Vercel, which I highly recommend as your hosting provider of choice. Simply follow the on-screen instructions to setup your new project, and be sure to **add the same `.env.local` variables to your Vercel Project**

### Sanity

This is an easy one, you can simply run `sanity deploy` from the `/studio` folder in your project. Select a subdomain you want; your Studio is now accessible from the web. This is where I'll invite the client to manage the project so they can both add billing info and begin editing content.

### Client Updates

Once you hand off to the client you'll want to give them the ability to generate builds when they make updates within the Sanity Studio. The easiest way to do this is through my [Vercel Deploy plugin](https://github.com/ndimatteo/sanity-plugin-vercel-deploy).

<br />

# 🤘 Extras/Tips

<details>
<summary><strong>This looks like a theme... How can I use this like a starter?</strong></summary>

While this starter is relatively opinionated, the goal was three-fold:

1. Use high-quality packages that don't get in the way
2. Solve common UX problems and complex logic so you can focus on the fun stuff
3. Create a more approachable starter for anyone looking to build production-ready headless Shopify experiences

That being said, I understand this means a lot of what's included is **very opinionated**. However, you'll find that at it's core the structure and naming conventions lend itself to really making it your own.

I've purposefully used extracted component classes, not only for cleaner file structure, but also so you can easily work in your own styles exclusively within the styles folder. Feel free to extend or outright remove the applied styles for all of the components!

</details>

<details>
<summary><strong>What's up with the CSS? Why are you using @apply?</strong></summary>

Previously, `@apply` was used to extract component classes away from your javascript files. However, since then Tailwind has been opposed to this approach. In the coming releases HULL will move away from this approach in favor of applying styles directly to the components so functionality and styling is done in one place.

You can read more about Tailwind's stance on `@apply` here: https://tailwindcss.com/docs/reusing-styles#avoiding-premature-abstraction

</details>

<details>
<summary><strong>Can I use this for non-Shopify projects?</strong></summary>

Absolutely! This starter was actually born out of a non-shopify starter I had been using for my own client projects.

I made a `marketing-starter` branch that is **HULL without all the Shopify logic**! The fastest way to get started is simply cloning that branch locally into an empty project folder:

```
git clone -b marketing-starter --single-branch git@github.com:ndimatteo/HULL.git .
```

You can read the [setup instructions](https://github.com/ndimatteo/HULL/tree/marketing-starter#-set-up) for this version from the branch's README.

</details>

<details>
<summary><strong>Error: Failed to communicate with the Sanity API</strong></summary>

If you get this error in your CLI, you need to logout and log back in again. Simply do `sanity logout` and then `sanity login` to fix.

</details>

<details>
<summary><strong>Access your "product_sync" metafields in Shopify without using a plugin</strong></summary>

Simply navigate directly to: `https://[store_id].myshopify.com/admin/bulk?resource_name=Product&edit=metafields.sanity.product_sync`

_(making sure to replace `[store_id]` with your Shopify Store ID)_

</details>

<details>
<summary><strong>How do I properly hand-off a Vercel project to the client?</strong></summary>

While not as easy as Netlify, what I prefer to do is:

1. Have the client create their own [Vercel account](https://vercel.com/signup)
2. At the time of writing, Github connections can only be connected to one Vercel account at a time, so have the client [create a Github account](https://github.com/join) if they don't already have one, and transfer the project repo to them
3. Delete the dev project from your own Vercel account (this is so the client can utilize the project name and domain you were using during dev)
4. You or the client can now connect their newly transferred Github repo to their own Vercel account!
</details>

<details>
<summary><strong>How can I see the bundle size of my website?</strong></summary>

Simply run `yarn analyze` from the project folder. This will run a build of your site and automatically open the [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) visuals for your site's build files.

</details>

<br />

# 💯 Shoutouts

Huge ups to the following talented and rad folks who helped in countless ways. Thank you for all the support, code contributions, and discussions.

### Developers

- 🔥 [@tuckercs](https://github.com/tuckercs)
- 🍝 [@iamkevingreen](https://github.com/iamkevingreen)
- 🧈 [@mikehwagz](https://github.com/mikehwagz)
- 😎 [@dictions](https://github.com/dictions)

### Designers

- [@thecollectedworks](https://www.instagram.com/thecollectedworks/)
- [@joyntnotjoint](https://www.instagram.com/joyntnotjoint/)

<br />

# 🤝 License

### [MIT](LICENSE)

> [nickdimatteo.com](https://nickdimatteo.com) &nbsp;&middot;&nbsp;
> Github [@ndimatteo](https://github.com/ndimatteo) &nbsp;&middot;&nbsp;
> Instagram [@ndimatteo](https://instagram.com/ndimatteo)
