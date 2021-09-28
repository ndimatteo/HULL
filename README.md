<p align="center">
<img src="public/HULL-Logo.svg" align="center" height="100" />
</p>
<p align="center">
  <strong>Starter built on <a href="https://nextjs.org">Next.js</a></strong> 🤘 <br />
  <strong>Headless CMS powered by <a href="https://sanity.io">Sanity.io</a></strong> ⚡<br />
</p>

<p align="center">
  <a href="https://hull.dev">
    <img src="https://img.shields.io/static/v1?label=&message=View%20Demo&style=for-the-badge&color=black&logo=vercel" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-set-up">Set Up</a> •
  <a href="#-spin-up">Spin Up</a> •
    <a href="#-deployment">Deployment</a> •
  <a href="#-extrastips">Extras</a>
</p>
<br />

<br />

# ✨ Features

- Utility-first CSS with [Tailwind CSS](https://tailwindcss.com)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
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

<br />

# 💀 Set Up

Clone this repository from your GitHub account with the [Use this template](https://github.com/ndimatteo/HULL/generate) button

### 1) Sanity
1. If you don't have the [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) installed, first run `npm install -g @sanity/cli` to install it globally
2. `npm install && sanity init` in the `/studio` folder
3. During Sanity's initalization it will warn you, type `Y` and hit `enter`:
```
? The current folder contains a configured Sanity studio. Would you like to reconfigure it? (Y/n)
```
4. When it asks you what dataset configuration to use, go with the `default`
5. Add CORS Origins to your newly created Sanity project (visit: [manage.sanity.io](https://manage.sanity.io) and go to Settings > API):
    - Add your Studio URLs **_with_** credentials: `http://localhost:3333` and `[subdomain].sanity.studio`
    - Add your front-end URLs **_without_** credentials: `http://localhost:3000` and `https://[subdomain].vercel.app`
> ⚠️ **Important!** <br />For "singleton" documents, like settings sections, the schema uses a combination of `__experimental_actions` and the new [actions resolver](https://www.sanity.io/docs/document-actions). If you are using this outside of the official Sanity Starter, you will need to comment out the `__experimental_actions` line in "singleton" schemas to publish settings for the first time. This is because a singleton is still a document type, and one needs to exist first before it can be edited. Additionally, if you want to create additional "singleton" schemas, be sure to edit the `singletons` array in the following file: `/studio/parts/resolve-actions.js`.

### 2) NextJS
1. `npm install` in the project root folder on local
2. Create an `.env.local` file in the project folder, and add the following variables:
```
SANITY_PROJECT_DATASET=production
SANITY_PROJECT_ID=XXXXXX
SANITY_API_TOKEN=XXXXXX

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
  - `KLAVIYO_API_KEY` - Create a Private API Key from your Klaviyo Account "Settings" -> "API Keys"
  - `MAILCHIMP_API_KEY` - Create an API key from "Account -> "Extras" -> API Keys
  - `MAILCHIMP_SERVER` - This is the server your account is from. It's in the URL when logged in and at the end of your API Key
  - `SENDGRID_API_KEY` - Create an API key from "Settings" -> "API Keys" with "Restricted Access" to only "Mail Send"

<br />

# ⚡ Spin Up

### Next (Front End)
`npm run dev` in the project folder to start the front end locally
   - Your front end should be running on [http://localhost:3000](http://localhost:3000)
   
### Sanity (Back End)
`sanity start` in the `/studio` folder to start the studio locally
   - Your Sanity Studio should be running on [http://localhost:3333](http://localhost:3333)

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
3. Create a more approachable starter for anyone looking to build production-ready headless experiences

That being said, I understand this means a lot of what's included is **very opinionated**. However, you'll find that at it's core the structure and naming conventions lend itself to really making it your own.

I've purposefully used extracted component classes, not only for cleaner file structure, but also so you can easily work in your own styles exclusively within the styles folder. Feel free to extend or outright remove the applied styles for all of the components!
</details>

<details>
<summary><strong>What's up with the CSS? What are extracted component classes and why should I use them?</strong></summary>

While utility-first CSS definitely speeds up your dev time, it can become overwhelming and untenable. This can make it difficult to understand what a component is doing when shrouded in dozens of utility classes, especially for developers getting familiar with a new codebase. Luckily, Tailwind offers the ability to [extract a component](https://tailwindcss.com/docs/extracting-components), allowing you to compose custom utility patterns.

The nice thing about this is we can get all the benefits of writing in utility class shorthand, but without having to sift through all your javascript logic to adjust styles. This means writing our CSS is business as usual. You create stylesheets, but use Tailwind's `@apply` to create nice and succinct classes to push to your components.

You still get all the tree-shaking benefits of Tailwind, _and_ you can still use utility classes in your components when needed; the best of both worlds!
</details>

<details>
<summary><strong>Error: Failed to communicate with the Sanity API</strong></summary>

If you get this error in your CLI, you need to logout and log back in again. Simply do `sanity logout` and then `sanity login` to fix.
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

Simply run `npm run analyze` from the project folder. This will run a build of your site and automatically open the [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) visuals for your site's build files.
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
