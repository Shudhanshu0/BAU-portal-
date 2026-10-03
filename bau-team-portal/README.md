# BAU Team Portal

## Start the portal
Because the portal reads `links.json`, browsers may block it when `index.html` is opened directly.

1. Open this folder in VS Code.
2. Use the Live Server extension and select **Open with Live Server**.

Alternative using Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Add, remove or change tools
Edit only `links.json`.

Each tool uses:

```json
{
  "id": "unique-id",
  "name": "Tool name",
  "description": "Short explanation",
  "url": "https://your-approved-url",
  "category": "Monitoring",
  "icon": "fa-chart-line"
}
```

Supported categories are Monitoring, VMware, Cloud, Security and Documentation. You can also add another category and it will appear automatically.

## Branding
Replace `assets/company-logo.svg` with your approved logo, or change the `branding.logo` path in `links.json`. Update the title and subtitle in the same branding object.

## Notes
- Replace all `example.com` links and contact placeholders before team use.
- Favourites and theme preference are stored in each browser using localStorage.
- Font Awesome is loaded from a CDN, so icons require internet access. To work fully offline, self-host Font Awesome and update the stylesheet link.
