# Portfolio site: install and deploy guide

Your new portfolio is a **static site**. That means it is only files (HTML, CSS, JavaScript, images, fonts) with no server and no database behind it.

Everyday example: a static site is like a printed flyer. You hand over the same finished sheet to everyone. Nothing is cooked to order, so there is nothing to hack, nothing to keep running and hosting is free.

## What is in the folder

| File | What it is | When you touch it |
|---|---|---|
| `index.html` | All the text of the site | To change wording, add a project, update a date |
| `assets/style.css` | Colours, fonts, layout, animations | To change the look. Colours sit at the top under "Tokens" |
| `assets/main.js` | The interactive effects | Rarely |
| `assets/img/` | Your portrait in web formats | To swap the photo |
| `assets/fonts/` | The two fonts, stored locally | Never |
| `preview.png` | A screenshot of the top of the page | Not part of the site, you can delete it |

## 1. Look at it on your Mac

1. Open Finder and go to `Downloads/portfolio`.
2. Double-click `index.html`. It opens in your browser.
3. Scroll, hover over cards and buttons, and try the project filter.
4. Make the window narrow to see the phone layout.

Nothing is online at this point. The file opens from your own disk.

## 2. Change content

1. Open `index.html` in VS Code.
2. Press `Cmd+F` and search for the text you want to change.
3. Edit the text between the tags, save, and reload the browser tab.

To add a project, copy one whole `<article class="card project ...">` block, paste it below, and change the number, dates, title, text and pills. The `data-cat` value decides which filter buttons show it: `ai`, `erp`, `data` or `biz`. Several are allowed, separated by a space.

Easiest path with Claude: open the folder in Claude Code and say "add this project to my portfolio" with the details. A normal chat is enough for this. No skill or scheduled task is needed, because it is a small one-off edit.

### The moving drawings

The "AI in motion" row is made of drawings written directly in `index.html` as SVG (a picture described in text, so it stays sharp at any size and needs no image file). To change a caption, search for its title, for example `Ask your data`, and edit the text below it. No picture on the site comes from the web, so there is no copyright or logo question to worry about.

## 3. Swap the photo

The site uses four files: `portrait-480` and `portrait-960`, each as `.webp` and `.jpg`, in a square shape (480 x 480 and 960 x 960 pixels). There is also `portrait-square.jpg`, 600 x 600, used as the preview picture when you share the link.

1. Ask Claude: "Replace the portrait in my portfolio with this photo" and attach the photo.
2. Or export the four files yourself with the same names and overwrite them.

The current portrait is the suit photo taken out of your CV PDF. That copy is only 306 pixels wide, so it is shown fairly small. If you have the original file, swap it in for a sharper picture.

Safety note: iPhone photos store hidden data such as the GPS location where the photo was taken. The files in this folder had that data removed. Do the same for any new photo before it goes online.

## 4. Put it online

Nothing has been published. You choose when. Two good options:

### Option A: GitHub Pages (recommended)

What it is: GitHub hosts the files of a repository as a website, for free. Choose it when you want every change tracked and a link that looks at home on a developer CV. Example address: `https://YOUR-USERNAME.github.io/portfolio/`.

I recommend it because recruiters for AI and engineering roles like seeing a GitHub profile, and updating the site is then just a push.

Use a **personal** GitHub account, not your Surfgreen one. A personal site should not sit under your employer's account.

1. On github.com click **+** (top right), then **New repository**.
2. Name it `portfolio`, set it to **Public**, click **Create repository**.
3. In Terminal run:
   ```bash
   cd ~/Downloads/portfolio
   git init -b main
   git add .
   git commit -m "Add portfolio site"
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
4. In the repository open **Settings**, then **Pages**.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**, pick **main** and **/ (root)**, click **Save**.
6. Wait about a minute, then reload the Pages screen. Your address appears at the top.

A public repository means everybody can read every file in it, so only put the site in it.

### Option B: Netlify Drop

What it is: a web page where you drag a folder and get a live link. Choose it when you want the site online in two minutes without Git. Example address: `https://some-name.netlify.app`.

1. Open `https://app.netlify.com/drop`.
2. Drag the `portfolio` folder onto the page.
3. Create a free account when asked, so the site stays online.

The downside is that every update means dragging the folder again.

## 5. After it is live

1. Replace the old portfolio link in your CV and on LinkedIn with the new address.
2. Open the site on your phone and check the menu and the email buttons.
3. Update the wording in the Contact section when your plans change.

## What I left out on purpose

These are in your CV but not on the site, because a public page is read and copied by anyone:

- Phone number, street address, date of birth and nationality
- The CV PDF itself. The "Request my CV" button opens an email to you instead
- The certificate credential IDs
- The name of your thesis supervisor. Ask them before you put their name on a public page

Two more protections are built in:

- **No outside requests.** The fonts are stored in the folder instead of loading from Google Fonts. Everyday example: it is like serving guests from your own kitchen instead of ordering from a delivery service that writes down every address. This matters in Germany, where courts have ruled against loading Google Fonts without consent. The site also has no tracking and no cookies, so it needs no cookie banner.
- **Your email is assembled by the script** when the page loads, so it is not sitting in the page source for the simplest spam bots.

## One legal point for Germany

German law asks many websites for an **Impressum** (a page with the name and a postal address of the person responsible). A purely private site does not need one, but a site used to look for work can count as business-like. I am not a lawyer, so check this before you publish. If you add one, the page needs a reachable address, and that conflicts with keeping your home address private. A common way out is a paid postal address service.

## Statements to double-check

- The Contact section says you are "open to master's programmes and to roles in agentic AI, AI integration and process automation". That sentence is my wording, based on what you told me, not a line from your CV.
- The language bars under Skills are a visual estimate of C1, A2 and native.
