# GitHub Pages deployment — BV-Garden

## Current verified state (13 November 2026)
- The repository **AnnyaB/BV-Garden remains private**.
- The playable `index.html` has been updated for phone, tablet, desktop and large-display presentation. It uses the established 2.5D pixel garden, not the unwanted WebGL temple-style view.
- The workflow at `.github/workflows/pages.yml` stages **only** `index.html` and `.nojekyll` for public hosting. It does **not** upload the private source ZIP, reference documents, or other repository contents.
- GitHub Actions run [#1](https://github.com/AnnyaB/BV-Garden/actions/runs/43282816290) **failed at configure-pages** with: `Get Pages site failed ... verify the repository has Pages enabled and configured to build using GitHub Actions`. This is a repository Pages setting, not an HTML/quiz failure. The website is **NOT yet deployed**.

## To finish publishing (owner action)
1. While signed in as the repository admin, open [BV-Garden → Settings → Pages](https://github.com/AnnyaB/BV-Garden/settings/pages).
2. Under **Build and deployment → Source**, choose **GitHub Actions** and save if prompted.
3. Open [Actions → Publish BV-Garden to GitHub Pages](https://github.com/AnnyaB/BV-Garden/actions/workflows/pages.yml). Select **Run workflow** on `main`, or open the failed run and choose **Re-run all jobs**.
4. Verify that the configure, upload and deploy steps are all green. Use GitHub's **Visit site** link shown in Settings → Pages; do not assume a URL is live before verifying it.

## Plan eligibility and visibility
- On GitHub Free, Pages requires a **public repository**. GitHub Pro (or another eligible paid plan) supports Pages from a private repository.
- A website built from a private repository is still **publicly accessible** on standard personal GitHub Pages. Private access-restricted Pages is an Enterprise Cloud organisation capability.
- Do **not** change this repository's visibility to public just to make Pages work. If the account is on GitHub Free, publish a separately reviewed public site-only repository (only the game's `index.html`) rather than revealing private source.
- Public webpage visitors can inspect the HTML and inline game questions. No static site can guarantee question secrecy.

## Quality and copyright notes
The mobile/tablet changes modify only presentation styling; they do not alter chapter order, scoring rules, content, artwork or progression. Screen and interaction tests are documented in the conversation. No claim of perfect behavior on every device is made.

The project uses *unofficial fan-art interpretations* of copyrighted SPY×FAMILY characters and concepts. Citation does not grant redistribution rights. Review rights risks before distributing publicly.

## Official sources (accessed 13 November 2026)
- GitHub Docs (n.d.) 'Creating a GitHub Pages site'. https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- GitHub Docs (n.d.) 'Configuring a publishing source for your GitHub Pages site'. https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub Docs (n.d.) 'Using custom workflows with GitHub Pages'. https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
