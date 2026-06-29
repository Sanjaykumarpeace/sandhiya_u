# Sandhiya U Portfolio

Professional static portfolio website for Sandhiya U, built with HTML, CSS, and JavaScript.

## Project Structure

```text
.
├── index.html
├── css/
├── js/
├── assets/
├── presenterwebm.webm
├── Sandhiya_U_Resume.docx
├── vercel.json
└── package.json
```

## Local Preview

From the project root:

```bash
python -m http.server 8083
```

Open:

```text
http://127.0.0.1:8083/
```

## Validation

```bash
npm run check
```

## Deploy To Vercel

### Option 1: Vercel Dashboard

1. Push this repository to GitHub:
   `https://github.com/Sanjaykumarpeace/sandhiya_u.git`
2. Open [Vercel](https://vercel.com/).
3. Select **Add New Project**.
4. Import the GitHub repository.
5. Use these settings:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: leave empty
6. Click **Deploy**.

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Notes

- This is a static site, so no server build is required.
- `vercel.json` adds clean URLs and long-term caching for CSS, JS, assets, and video files.
- `.vercelignore` excludes debug/generated files from deployment.
