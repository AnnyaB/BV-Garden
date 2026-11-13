# Publish BV-Garden safely on GitHub Free

GitHub Free supports Pages from **public repositories**; private repository Pages requires an eligible paid GitHub plan. Do not change the existing private source repository to Public: that would expose archived files and its earlier commit history.

## Recommended: fresh-history public site

1. In the **existing private** AnnyaB/BV-Garden, go to Settings → General → Repository name and rename it **BV-Garden-Development**. Keep visibility **Private**.
2. Create a **new, empty, Public** AnnyaB/BV-Garden, rather than a fork/import of the private repository. This gives it a new history and your exact desired repository name.
3. Transfer only the latest verified index.html, a reviewed public README and rights notice, and the Pages deployment workflow. Do not copy the old ZIP, private documentation or Git history.
4. In the **new public repository**, go to Settings → Pages → Build and deployment → Source → **GitHub Actions**. Run the supplied Pages workflow, which publishes only index.html.
5. Verify Configure Pages, Upload website artifact, and Deploy site all succeed. Use Settings → Pages → Visit site to get the real URL.

The expected project-site address is https://annyab.github.io/BV-Garden/ only **after** successful publication. Browser saves from other origins do not automatically transfer. Renaming the private repository, then reusing its old name, invalidates GitHub's former-name redirects; update local clone remotes.

## Before a public release
The HTML embeds unofficial *SPY×FAMILY*-derived artwork and MP3 assets supplied from other creators. Confirm permissions to distribute these assets. Crediting authors or using a fan disclaimer alone does not constitute a license.

Official GitHub documentation:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository

A browser educational game should not falsely claim model training, benchmark results, datasets, or an ICLR publication. Do not add irrelevant ML training scripts solely to imitate Dreamweaver.
