/**
 * Saikat Photography - Guide Export & Printing Engine
 * Generates standalone, self-contained printable HTML & Markdown manuals
 * that bypass iframe sandbox restrictions and print seamlessly to PDF or paper.
 */

export function generatePrintableHtml(): string {
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Saikat Photography – Studio CMS & Administrative Operations Manual</title>
  <style>
    /* CSS Reset & Print Variables */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @page {
      size: A4 portrait;
      margin: 18mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page);
        font-size: 9pt;
        color: #666;
      }
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 10.5pt;
      line-height: 1.55;
      color: #1a1a1a;
      background-color: #ffffff;
      padding: 0;
    }

    /* Screen-only top action bar */
    .screen-banner {
      position: sticky;
      top: 0;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #D91B24;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .screen-banner h1 {
      font-size: 14pt;
      font-weight: 600;
      margin: 0;
      color: #fff;
    }
    .screen-banner p {
      font-size: 9pt;
      color: #94a3b8;
      margin: 0;
    }
    .print-btn {
      background: #D91B24;
      color: #ffffff;
      border: none;
      padding: 10px 20px;
      font-size: 10pt;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(217, 27, 36, 0.4);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .print-btn:hover {
      background: #b5141c;
    }

    /* Printable document layout */
    .document-container {
      max-width: 860px;
      margin: 0 auto;
      padding: 30px 25px;
    }

    /* Cover / Header section */
    .manual-header {
      border-bottom: 3px solid #D91B24;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .manual-header .studio-name {
      font-size: 24pt;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #000;
      margin-bottom: 4px;
    }
    .manual-header .manual-title {
      font-size: 16pt;
      font-weight: 600;
      color: #D91B24;
      margin-bottom: 12px;
    }
    .manual-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      font-size: 9pt;
      color: #555;
    }
    .meta-tag {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 4px 8px;
      border-radius: 4px;
    }

    /* Table of contents */
    .toc-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 30px;
      page-break-after: avoid;
    }
    .toc-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      margin-bottom: 10px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
    }
    .toc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 8px 20px;
      font-size: 9.5pt;
    }
    .toc-item a {
      color: #1e293b;
      text-decoration: none;
    }
    .toc-item a:hover {
      text-decoration: underline;
      color: #D91B24;
    }

    /* Headings */
    h2.section-heading {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 36px;
      margin-bottom: 14px;
      page-break-after: avoid;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    h3.sub-heading {
      font-size: 11.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    h4.module-title {
      font-size: 11pt;
      font-weight: 700;
      color: #D91B24;
      margin-top: 14px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    /* Content Cards & Blocks */
    .card-block {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px 16px;
      margin-bottom: 14px;
      background: #ffffff;
      page-break-inside: avoid;
    }
    .card-block.highlight {
      border-left: 4px solid #D91B24;
      background: #fafafa;
    }

    p {
      margin-bottom: 8px;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 10px;
    }
    li {
      margin-bottom: 4px;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 20px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    table.data-table th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.05em;
    }
    table.data-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    code {
      font-family: Consolas, Monaco, "Courier New", monospace;
      font-size: 8.5pt;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      padding: 2px 5px;
      border-radius: 3px;
      color: #0f172a;
    }

    .badge-pill {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 3px;
      background: #e2e8f0;
      color: #334155;
    }
    .badge-pill.success {
      background: #dcfce7;
      color: #166534;
    }
    .badge-pill.danger {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Footer */
    .document-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 15px;
      margin-top: 40px;
      font-size: 8.5pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }

    /* PRINT SPECIFIC OVERRIDES */
    @media print {
      .no-print, .screen-banner {
        display: none !important;
      }
      .document-container {
        max-width: 100% !important;
        padding: 0 !important;
      }
      body {
        font-size: 10pt !important;
        background: #fff !important;
        color: #000 !important;
      }
      h2.section-heading {
        page-break-before: auto;
      }
      .card-block, table.data-table, .toc-box {
        page-break-inside: avoid;
      }
      a {
        color: #000 !important;
        text-decoration: none !important;
      }
    }
  </style>
</head>
<body>
  <!-- Screen top action bar with direct print trigger -->
  <div class="screen-banner no-print">
    <div>
      <h1>Saikat Photography – Administrative Operations Manual</h1>
      <p>Print or save to PDF using your browser's print dialog (Ctrl+P / Cmd+P)</p>
    </div>
    <button class="print-btn" onclick="window.print()">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="document-container">
    <!-- Manual Header -->
    <header class="manual-header">
      <div class="studio-name">Saikat Photography</div>
      <div class="manual-title">Studio Master Operating & Administration Manual</div>
      <div class="manual-meta">
        <span class="meta-tag"><strong>Date:</strong> ${generatedDate}</span>
        <span class="meta-tag"><strong>Version:</strong> 2026.1 Production</span>
        <span class="meta-tag"><strong>Classification:</strong> Internal Staff & Administrator Only</span>
        <span class="meta-tag"><strong>Modules Documented:</strong> 20 CMS Modules</span>
      </div>
    </header>

    <!-- Table of Contents -->
    <nav class="toc-box">
      <div class="toc-title">Table of Contents</div>
      <div class="toc-grid">
        <div class="toc-item"><a href="#sec-website">1. Public Website Architecture</a></div>
        <div class="toc-item"><a href="#sec-modules">2. Administrative Modules (1–20)</a></div>
        <div class="toc-item"><a href="#sec-images">3. Section-Specific Image Guidelines</a></div>
        <div class="toc-item"><a href="#sec-videos">4. Video Upload & Streaming Guidelines</a></div>
        <div class="toc-item"><a href="#sec-files">5. File & Storage Management</a></div>
        <div class="toc-item"><a href="#sec-roles">6. Roles & Access Control (RBAC)</a></div>
        <div class="toc-item"><a href="#sec-settings">7. Settings & Configuration Reference</a></div>
        <div class="toc-item"><a href="#sec-troubleshooting">8. Troubleshooting & Diagnostics</a></div>
        <div class="toc-item"><a href="#sec-bestpractices">9. Operational Best Practices</a></div>
      </div>
    </nav>

    <!-- PART 1: PUBLIC WEBSITE ARCHITECTURE -->
    <section id="sec-website">
      <h2 class="section-heading">1. Public Website Architecture & Frontend Features</h2>
      <p>
        The public website for <strong>Saikat Photography</strong> delivers an ultra-luxury portfolio experience built for discerning wedding couples, portrait clients, and art collectors. All customer-facing elements are completely dynamic and managed via the Admin CMS:
      </p>

      <div class="card-block">
        <h3 class="sub-heading">1.1 Navigation Header & Sticky Branding</h3>
        <p>A glassmorphic sticky dark navbar featuring the brand monogram, navigation anchors (Portfolio, Services, Investment, About, Inquire), phone and email contact shortcuts, a primary "Book Session" conversion button, and a private "Client Portal" PIN entry trigger.</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.2 Hero Visual Showcase</h3>
        <p>High-resolution cinematic visual header supporting either an optimized still banner or looping Full HD video. Includes custom typography, tagline, headline, primary booking button, secondary portfolio link, and adjustable background overlay opacity.</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.3 Portfolio & Filterable Gallery</h3>
        <p>Curated showcase categorized into Luxury Weddings, Pre-Wedding Heirlooms, Editorial Portraits, and Destination Events. Visitors can switch category tabs dynamically. Clicking any photo launches a full-screen Lightbox displaying EXIF camera data (aperture, shutter speed, ISO, lens).</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.4 Artist Biography & Animated Milestone Counters</h3>
        <p>Presents photographer Saikat Roy with an artist portrait, personal biography, and live animated milestones: Years of Experience, Weddings Captured, Happy Couples, and Exclusive Events.</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.5 Services & Curated Investment Packages</h3>
        <p>Presents bespoke photography services and tiered packages. Package cards highlight team size, edited photo count, premium albums, and video/drone inclusions. Clicking "Reserve Package" pre-fills the inquiry form automatically.</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.6 Client Reviews & Studio FAQs</h3>
        <p>5-star testimonials from verified wedding couples accompanied by categorized FAQs (General, Booking, Delivery, Equipment) answering common client questions before they submit an inquiry.</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.7 Interactive Booking & Lead Capture Form</h3>
        <p>Captures full name, email, phone number, event type, shoot date, venue location, budget range, and custom message. Submissions automatically log into the admin database with instant Google Analytics conversion tracking (<code>submit_inquiry</code>).</p>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">1.8 Private Client Proofing Portal</h3>
        <p>Couples access their private photo proofs by entering their 4-digit PIN in the Client Portal popup. Shows delivery status, photo count, and high-resolution album download links.</p>
      </div>
    </section>

    <!-- PART 2: ADMINISTRATIVE MODULES MANUAL -->
    <section id="sec-modules">
      <h2 class="section-heading">2. Administrative Modules Guide (Module-by-Module)</h2>
      <p>The Admin Panel provides 20 specialized tools to manage daily studio operations, bookings, inquiries, and technical infrastructure:</p>

      <div class="card-block highlight">
        <h4 class="module-title">Module 1: Executive Dashboard (dashboard)</h4>
        <p><strong>Purpose:</strong> Central command center aggregating total gallery photos, active packages, verified reviews, and incoming unread inquiries.</p>
        <p><strong>Key Actions:</strong> Monitor revenue conversion pipeline, review latest inquiries with status pills, and launch quick-action buttons to add photos, packages, or services.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 2: Google Analytics & Traffic Center (analytics)</h4>
        <p><strong>Purpose:</strong> Connect Google Analytics 4 (GA4), Meta Pixel, and Google Tag Manager containers.</p>
        <p><strong>Key Actions:</strong> Enter Measurement ID (<code>G-XXXXXXXXXX</code>) and Meta Pixel ID. Automated telemetry tracks <code>click_whatsapp</code>, <code>submit_inquiry</code>, and <code>open_client_portal</code> without code modification.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 3: Leads & Client Inquiries (inquiries)</h4>
        <p><strong>Purpose:</strong> Central CRM capturing all website booking form submissions.</p>
        <p><strong>Key Actions:</strong> Change lead status (New, Contacted, Follow Up, Booked, Closed), launch 1-click WhatsApp chats to clients, write private internal notes, and export inquiries to CSV.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 4: Shoots & Production Calendar (calendar)</h4>
        <p><strong>Purpose:</strong> Visual calendar tracking confirmed shoots, tentative inquiries, editing deadlines, and blocked holiday dates.</p>
        <p><strong>Key Actions:</strong> Click any date to register a photoshoot, select event type, assign team members, and prevent double-booking peak wedding dates.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 5: Quotations & Estimates Generator (invoicing)</h4>
        <p><strong>Purpose:</strong> Create branded, itemized quotations for bespoke wedding commissions.</p>
        <p><strong>Key Actions:</strong> Add line items with specific descriptions and amounts in INR/USD. Track quotation status (Draft, Sent, Accepted, Declined) and print/download clean PDF estimates.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 6: Client Proofing & PIN Portals (client-galleries)</h4>
        <p><strong>Purpose:</strong> Deliver private online photo collections to couples secured with a 4-digit PIN.</p>
        <p><strong>Key Actions:</strong> Assign unique access PINs, upload cover images, specify photo counts, link full-resolution download drives (Google Drive / Pixieset), and toggle download permissions.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 7: WhatsApp & Communication Templates (templates)</h4>
        <p><strong>Purpose:</strong> Standardize studio communication with pre-written, variable-powered responses.</p>
        <p><strong>Key Actions:</strong> Edit templates for Inquiry Response, Booking Confirmation, Advance Payment Request, and Album Delivery using tokens like <code>{client_name}</code> and <code>{event_date}</code>.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 8: Gallery & Category Manager (gallery)</h4>
        <p><strong>Purpose:</strong> Manage the public visual portfolio and category organization.</p>
        <p><strong>Key Actions:</strong> Upload photographs, set display order (lower numbers display first), toggle "Featured" homepage status, and record camera EXIF metadata (camera, lens, aperture, shutter speed, ISO).</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 9: Services & Specializations (services)</h4>
        <p><strong>Purpose:</strong> Configure studio service offerings and deliverables.</p>
        <p><strong>Key Actions:</strong> Define service titles, slug, pricing type (Fixed, Starting At, Custom), bullet-point feature lists, and cover images.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 10: Packages & Investment Tiers (packages)</h4>
        <p><strong>Purpose:</strong> Structure client investment packages and comparison cards.</p>
        <p><strong>Key Actions:</strong> Configure deliverables (photographer team count, retouched photos, album count), toggle Drone/Video inclusions, set popular badges, and enable 1-click form prefill.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 11: Testimonials & Client Reviews (testimonials)</h4>
        <p><strong>Purpose:</strong> Publish verified client reviews and 5-star ratings.</p>
        <p><strong>Key Actions:</strong> Add client couple names, wedding venue/event type, 1-5 star ratings, couple avatar portraits, and toggle public visibility.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 12: Studio FAQs (faqs)</h4>
        <p><strong>Purpose:</strong> Manage customer FAQs categorized by General, Booking, Delivery, and Equipment.</p>
        <p><strong>Key Actions:</strong> Add questions and answers to resolve objections regarding advance payments, RAW files, delivery turnaround, and gear redundancy.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 13: Media Library & Asset Storage (media)</h4>
        <p><strong>Purpose:</strong> Central repository for photos, banners, logos, and graphic assets.</p>
        <p><strong>Key Actions:</strong> Upload files to the Supabase Storage bucket <code>website-assets</code>, copy permanent CDN URLs with 1-click, and safely remove obsolete assets.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 14: Site & Brand Settings (site-settings)</h4>
        <p><strong>Purpose:</strong> Master configuration of studio bio, phone, WhatsApp number, address, and security.</p>
        <p><strong>Key Actions:</strong> Edit photographer bio and live milestone counters, configure official contact channels, toggle right-click image protection, and enable the announcement top bar.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 15: Homepage Layout & Section Reordering (homepage-layout)</h4>
        <p><strong>Purpose:</strong> Control the visual hierarchy and visibility of homepage sections.</p>
        <p><strong>Key Actions:</strong> Enable/disable individual sections and adjust numeric display order (1, 2, 3...) to rearrange sections on the live site.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 16: Theme & Typography Settings (theme)</h4>
        <p><strong>Purpose:</strong> Fine-tune brand colors, typography, and button corner radius without coding.</p>
        <p><strong>Key Actions:</strong> Select accent color (Default: Crimson Red <code>#D91B24</code>), heading font (Cormorant Garamond, Syne, Sans), and button roundness.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 17: Data Backup & Reset Center (backup)</h4>
        <p><strong>Purpose:</strong> Protect studio data against loss with 1-click export and import.</p>
        <p><strong>Key Actions:</strong> Download a full JSON database backup containing all 14 collections, restore from previous backups, or reset demo content safely.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 18: Admin Users & Staff Roles (users)</h4>
        <p><strong>Purpose:</strong> Role-based access control (RBAC) managing administrator privileges.</p>
        <p><strong>Key Actions:</strong> Create and manage accounts across Super Admin, Admin, and Editor roles to protect database credentials and sensitive financial records.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 19: Security & Activity Logs (logs)</h4>
        <p><strong>Purpose:</strong> Audit trail tracking all logins, edits, uploads, and deletions.</p>
        <p><strong>Key Actions:</strong> Filter audit records by module category and administrator email with exact timestamps.</p>
      </div>

      <div class="card-block highlight">
        <h4 class="module-title">Module 20: Database & Supabase Command Center (database)</h4>
        <p><strong>Purpose:</strong> Monitor live cloud PostgreSQL connection and execute database synchronizations.</p>
        <p><strong>Key Actions:</strong> Inspect live connection status, run the 14-table health check, execute 1-click Local-to-Cloud sync, and copy full PostgreSQL schema SQL.</p>
      </div>
    </section>

    <!-- PART 3: SECTION-SPECIFIC IMAGE UPLOAD GUIDELINES -->
    <section id="sec-images">
      <h2 class="section-heading">3. Section-Specific Image Upload Guidelines</h2>
      <p>To ensure optimal visual fidelity, rapid page load speeds, and retina display clarity, use the exact specifications for each section:</p>

      <table class="data-table">
        <thead>
          <tr>
            <th>Section / Element</th>
            <th>Dimensions (px)</th>
            <th>Aspect Ratio</th>
            <th>Format</th>
            <th>Max Size</th>
            <th>Quality & Composition Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Hero Banner (Desktop)</strong></td>
            <td>2560 × 1440 px</td>
            <td>16:9 Widescreen</td>
            <td>WebP / JPG</td>
            <td>1.5 MB</td>
            <td>High-impact cinematic landscape. Subject centered or slightly offset to right.</td>
          </tr>
          <tr>
            <td><strong>Hero Banner (Mobile)</strong></td>
            <td>1080 × 1920 px</td>
            <td>9:16 Vertical</td>
            <td>WebP / JPG</td>
            <td>800 KB</td>
            <td>Framed vertically for smartphone screens.</td>
          </tr>
          <tr>
            <td><strong>Artist Biography Portrait</strong></td>
            <td>1200 × 1600 px</td>
            <td>3:4 Vertical</td>
            <td>WebP / JPG</td>
            <td>800 KB</td>
            <td>Editorial studio portrait of Saikat holding camera. Clean neutral background.</td>
          </tr>
          <tr>
            <td><strong>Portfolio Showcase (Landscape)</strong></td>
            <td>2048 × 1365 px</td>
            <td>3:2 Classic</td>
            <td>WebP / JPG</td>
            <td>1.2 MB</td>
            <td>sRGB color profile. Sharpened for web display (85% JPEG quality).</td>
          </tr>
          <tr>
            <td><strong>Portfolio Showcase (Portrait)</strong></td>
            <td>1365 × 2048 px</td>
            <td>2:3 Classic</td>
            <td>WebP / JPG</td>
            <td>1.2 MB</td>
            <td>Retains rich shadow detail in wedding attire.</td>
          </tr>
          <tr>
            <td><strong>Service Cover Cards</strong></td>
            <td>1200 × 800 px</td>
            <td>3:2 Landscape</td>
            <td>WebP / JPG</td>
            <td>600 KB</td>
            <td>Representative visual for each service specialty.</td>
          </tr>
          <tr>
            <td><strong>Client Testimonial Avatars</strong></td>
            <td>400 × 400 px</td>
            <td>1:1 Square</td>
            <td>WebP / JPG / PNG</td>
            <td>250 KB</td>
            <td>Circular cropped in UI. Couple's faces clearly centered.</td>
          </tr>
          <tr>
            <td><strong>Client Proofing Cover Photo</strong></td>
            <td>1920 × 1080 px</td>
            <td>16:9 Landscape</td>
            <td>WebP / JPG</td>
            <td>1.0 MB</td>
            <td>Key highlight portrait representing the wedding event.</td>
          </tr>
          <tr>
            <td><strong>Studio Brand Logo</strong></td>
            <td>600 × 160 px</td>
            <td>Horizontal (~4:1)</td>
            <td>SVG / PNG (Alpha)</td>
            <td>300 KB</td>
            <td>Transparent background. Crisp vector lines or high-density 2x PNG.</td>
          </tr>
          <tr>
            <td><strong>Website Favicon</strong></td>
            <td>512 × 512 px</td>
            <td>1:1 Square</td>
            <td>PNG / ICO</td>
            <td>100 KB</td>
            <td>Simplified high-contrast monogram icon visible at 16×16px tab scale.</td>
          </tr>
          <tr>
            <td><strong>Social Share Card (Open Graph)</strong></td>
            <td>1200 × 630 px</td>
            <td>1.91:1 Landscape</td>
            <td>JPG / PNG</td>
            <td>800 KB</td>
            <td>Preview image for Facebook, WhatsApp, Twitter, and iMessage shared links.</td>
          </tr>
        </tbody>
      </table>

      <div class="card-block">
        <h3 class="sub-heading">Image Optimization Rules:</h3>
        <ul>
          <li><strong>Color Space:</strong> Always export photos using the <strong>sRGB IEC61966-2.1</strong> color space. AdobeRGB or ProPhotoRGB will appear desaturated on iPhones and web browsers.</li>
          <li><strong>Compression:</strong> Never upload uncompressed 35MB RAW/TIFF camera files directly. Run JPEGs through JPEGmini or TinyPNG.</li>
          <li><strong>WebP Format:</strong> WebP files are approximately 30% smaller than JPEGs with identical visual quality.</li>
          <li><strong>Naming Convention:</strong> Use SEO-friendly filenames (e.g. <code>udaipur-luxury-palace-wedding-01.jpg</code>).</li>
        </ul>
      </div>
    </section>

    <!-- PART 4: VIDEO UPLOAD GUIDELINES -->
    <section id="sec-videos">
      <h2 class="section-heading">4. Video Upload & Streaming Guidelines</h2>
      <p>Video banners deliver high engagement but require strict compression to maintain instant playback without buffering:</p>

      <div class="card-block">
        <h3 class="sub-heading">4.1 Hero Looping Background Video</h3>
        <ul>
          <li><strong>Resolution:</strong> 1920 × 1080 (1080p Full HD). 4K is not recommended due to mobile data overhead.</li>
          <li><strong>Aspect Ratio:</strong> 16:9 Widescreen Landscape.</li>
          <li><strong>Format & Codec:</strong> MP4 container with H.264 (AVC) video stream.</li>
          <li><strong>Duration:</strong> 10 to 30 seconds seamless loop.</li>
          <li><strong>Maximum File Size:</strong> <strong>15 MB – 25 MB</strong> maximum.</li>
          <li><strong>Target Bitrate:</strong> 2.5 Mbps to 3.5 Mbps.</li>
          <li><strong>Mandatory Audio Rule:</strong> Video <strong>MUST BE MUTED</strong> (no audio track) to satisfy browser autoplay restrictions.</li>
        </ul>
      </div>

      <div class="card-block">
        <h3 class="sub-heading">4.2 HandBrake Compression Workflow</h3>
        <ol>
          <li>Open free <strong>HandBrake</strong> (<a href="https://handbrake.fr" target="_blank">handbrake.fr</a>).</li>
          <li>Import your master exported video from Premiere Pro or DaVinci Resolve.</li>
          <li>Select preset: <strong>Web &gt; Fast 1080p30</strong>.</li>
          <li>Ensure <strong>Web Optimized</strong> is checked (enables faststart streaming).</li>
          <li>Set <strong>Constant Quality (RF)</strong> to <code>22</code>.</li>
          <li>Export and upload the resulting file to the Media Library.</li>
        </ol>
      </div>
    </section>

    <!-- PART 5: FILE & STORAGE MANAGEMENT -->
    <section id="sec-files">
      <h2 class="section-heading">5. File & Storage Management</h2>
      <div class="card-block">
        <ul>
          <li><strong>Storage Engine:</strong> Supabase Object Storage bucket <code>website-assets</code> backed by resilient local storage fallback.</li>
          <li><strong>Supported File Types:</strong> <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code>, <code>.webp</code>, <code>.svg</code>, <code>.ico</code>, <code>.mp4</code>, <code>.pdf</code>, <code>.json</code>.</li>
          <li><strong>Uploading Assets:</strong> Navigate to <strong>Media Library</strong>, drag-and-drop assets, and click <em>Copy URL</em> to retrieve the public CDN link.</li>
          <li><strong>Replacing Assets:</strong> Paste the new asset URL into the respective module's Image URL field.</li>
        </ul>
      </div>
    </section>

    <!-- PART 6: PERMISSIONS & ACCESS CONTROL (RBAC) -->
    <section id="sec-roles">
      <h2 class="section-heading">6. Permissions Matrix & Role-Based Access Control (RBAC)</h2>
      <p>Strict access boundaries ensure staff only interact with areas relevant to their duties:</p>

      <table class="data-table">
        <thead>
          <tr>
            <th>Module / Action</th>
            <th>Super Admin</th>
            <th>Admin</th>
            <th>Editor / Staff</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Upload & Edit Gallery Photos</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
          </tr>
          <tr>
            <td>Manage Leads & Inquiries</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill">View Only</span></td>
          </tr>
          <tr>
            <td>Create Quotes & Invoices</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
          </tr>
          <tr>
            <td>Edit Services & Packages</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
          </tr>
          <tr>
            <td>Manage Client Proofing PINs</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill">View Only</span></td>
          </tr>
          <tr>
            <td>Modify Site Brand & Theme</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
          </tr>
          <tr>
            <td>Configure Google Analytics / Pixels</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
          </tr>
          <tr>
            <td>Manage Staff Accounts & Roles</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
          </tr>
          <tr>
            <td>Database Connection & SQL Tools</td>
            <td><span class="badge-pill success">Full</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
            <td><span class="badge-pill danger">Denied</span></td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- PART 7: SETTINGS & CONFIGURATIONS REFERENCE -->
    <section id="sec-settings">
      <h2 class="section-heading">7. Settings & Configuration Reference</h2>
      <div class="card-block">
        <h4 class="module-title">Enable Right-Click Protection</h4>
        <p>Disables right-click context menus and image dragging across all portfolio galleries to prevent casual copyright theft. Recommended: Always Enabled.</p>

        <h4 class="module-title">Announcement Top Bar</h4>
        <p>Broadcasts a high-visibility crimson banner along the top of all pages. Use during peak booking windows (e.g. <em>"Now accepting commissions for 2026/27 Winter season"</em>).</p>

        <h4 class="module-title">Hero Overlay Opacity (0.0 to 1.0)</h4>
        <p>Adjusts the black gradient darkness over the hero image/video to maintain headline legibility. Recommended: 0.5 to 0.7 for bright photos.</p>

        <h4 class="module-title">WhatsApp Number Format</h4>
        <p>Must include country code with no plus sign, spaces, or dashes (e.g. <code>919876543210</code> for India, <code>15551234567</code> for USA).</p>

        <h4 class="module-title">Google Analytics 4 Measurement ID</h4>
        <p>Formatted as <code>G-XXXXXXXXXX</code>. Injects the official GA4 global site tag across all web pages.</p>
      </div>
    </section>

    <!-- PART 8: TROUBLESHOOTING & SOLUTIONS -->
    <section id="sec-troubleshooting">
      <h2 class="section-heading">8. Troubleshooting Guide & Diagnostics</h2>
      <div class="card-block">
        <h4 class="module-title">Issue 1: "Supabase status shows 'Resilient Store' instead of 'Connected'"</h4>
        <p><strong>Cause:</strong> Missing or incorrect Supabase Project URL or Anon Public Key.</p>
        <p><strong>Fix:</strong> Go to <em>Database & SQL</em>, verify the credentials from your Supabase Dashboard, click <em>Save & Connect Supabase</em>, and click <em>Test All 14 Tables Now</em>.</p>

        <h4 class="module-title">Issue 2: "An uploaded photo appears as a broken image icon"</h4>
        <p><strong>Cause:</strong> The photo URL points to a private drive link or has spaces in the filename.</p>
        <p><strong>Fix:</strong> Upload the image through the <em>Media Library</em> module and copy the verified public CDN URL.</p>

        <h4 class="module-title">Issue 3: "Client says their PIN code is rejected in the proofing portal"</h4>
        <p><strong>Cause:</strong> Gallery is toggled to <em>Inactive</em> or spaces were typed in the PIN.</p>
        <p><strong>Fix:</strong> Verify in <em>Client Proofing & PINs</em> that <strong>Is Active</strong> is checked and confirm the exact 4-digit code.</p>

        <h4 class="module-title">Issue 4: "Google Analytics is not recording live sessions"</h4>
        <p><strong>Cause:</strong> An ad blocker is active or the Measurement ID contains leading/trailing spaces.</p>
        <p><strong>Fix:</strong> Verify ID format <code>G-XXXXXXXXXX</code> in <em>Google Analytics & Traffic</em> and test in an incognito window without ad blockers.</p>
      </div>
    </section>

    <!-- PART 9: OPERATIONAL BEST PRACTICES -->
    <section id="sec-bestpractices">
      <h2 class="section-heading">9. Operational Best Practices & Precautions</h2>
      <div class="card-block">
        <h3 class="sub-heading">Recommended Workflows (DO):</h3>
        <ul>
          <li><strong>Curate Quality Over Quantity:</strong> Showcase 15–25 breathtaking, award-winning images per category rather than hundreds of average shots.</li>
          <li><strong>Compress All Media:</strong> Always run images through Lightroom Web Export or TinyPNG before uploading.</li>
          <li><strong>Respond Swiftly:</strong> Use WhatsApp templates to respond to inquiries within 2 hours while interest is highest.</li>
          <li><strong>Weekly JSON Backups:</strong> Export a full JSON backup every Sunday via the <em>Data Backup & Reset</em> module.</li>
        </ul>

        <h3 class="sub-heading">Critical Precautions (DON'T):</h3>
        <ul>
          <li><strong>Never Upload Uncompressed RAW/TIFFs:</strong> Large 40MB files will exhaust mobile visitor bandwidth and cause high bounce rates.</li>
          <li><strong>Never Drop Database Tables in Supabase:</strong> Only run verified ALTER or CREATE statements from the provided setup script.</li>
          <li><strong>Never Share Master Passwords:</strong> Keep Super Admin credentials restricted to the studio principal.</li>
        </ul>
      </div>
    </section>

    <!-- Document Footer -->
    <footer class="document-footer">
      <div>© ${new Date().getFullYear()} Saikat Photography. Confidential & Proprietary.</div>
      <div>Studio Operations & Administration Manual · Page 1 of 1</div>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Generates clean markdown representation of the entire manual
 * for easy copying into Google Docs, Word, or Notion.
 */
export function generateMarkdownText(): string {
  return `# SAIKAT PHOTOGRAPHY – STUDIO CMS & ADMINISTRATIVE OPERATIONS MANUAL
Generated: ${new Date().toLocaleDateString()}
Classification: Internal Studio Staff & Administrator Only
Version: 2026.1 Production

---

## TABLE OF CONTENTS
1. Public Website Architecture & Features
2. Administrative Modules Guide (Modules 1–20)
3. Section-Specific Image Upload Guidelines
4. Video Upload & Streaming Guidelines
5. File & Storage Management
6. Permissions & Role-Based Access Control (RBAC)
7. Settings & Configuration Reference
8. Troubleshooting Guide & Diagnostics
9. Operational Best Practices & Precautions

---

## 1. PUBLIC WEBSITE ARCHITECTURE & FEATURES
- 1.1 Navigation Header: Sticky navbar, logo, navigation anchors, contact shortcuts, "Book Session" CTA, and "Client Portal" trigger.
- 1.2 Hero Visual Showcase: High-resolution cinematic visual header, subtitle, primary booking button, secondary portfolio link, and overlay opacity control.
- 1.3 Portfolio & Filterable Gallery: Filterable category tabs (Weddings, Pre-Wedding, Editorial, Destination). Fullscreen lightbox modal with EXIF camera metadata display.
- 1.4 Artist Biography & Counters: Narrative bio of Saikat Roy with live animated proof counters (Years of Experience, Weddings Captured, Happy Couples, Exclusive Events).
- 1.5 Services & Curated Packages: Bespoke services and investment packages. Features deliverables counters, drone/video toggles, and direct booking form pre-filling.
- 1.6 Reviews & Studio FAQs: Verified 5-star couple reviews and categorized FAQs (General, Booking, Delivery, Equipment).
- 1.7 Interactive Booking Form: Captures full name, email, phone number, event type, date, location, budget, and message with GA4 conversion tracking.
- 1.8 Client Proofing Portal: 4-digit PIN access modal granting exclusive access to private wedding albums and downloads.

---

## 2. ADMINISTRATIVE MODULES GUIDE (1–20)
- Module 1 (dashboard): Executive Dashboard – Real-time metrics, leads stream, revenue funnel.
- Module 2 (analytics): Google Analytics & Traffic – GA4 Measurement ID (G-XXXXXXXXXX), Meta Pixel ID, automated telemetry.
- Module 3 (inquiries): Leads & Inquiries – Lead status, 1-click WhatsApp replies, internal notes, CSV export.
- Module 4 (calendar): Shoots & Calendar – Scheduled weddings, tentative inquiries, editing deadlines, blocked dates.
- Module 5 (invoicing): Quotations & Estimates – Custom PDF estimates, itemized line items, status tracking.
- Module 6 (client-galleries): Client Proofing & PINs – 4-digit PIN protected client albums, external drive links.
- Module 7 (templates): WhatsApp & Templates – Fast messaging responses with {client_name} and {event_date} tokens.
- Module 8 (gallery): Gallery & Categories – Portfolio upload, display ordering, featured flags, camera EXIF data.
- Module 9 (services): Services – Title, price types, feature bullet checklists, cover photos.
- Module 10 (packages): Packages & Pricing – Investment tiers, deliverable counters, popular badges, video/drone toggles.
- Module 11 (testimonials): Testimonials – Verified client reviews, star ratings, couple portraits.
- Module 12 (faqs): Studio FAQs – Manage questions across General, Booking, Delivery, and Equipment.
- Module 13 (media): Media Library – Supabase Storage (website-assets), 1-click CDN link copy, asset deletion.
- Module 14 (site-settings): Site Settings – Bio, phone, WhatsApp number, Instagram URL, right-click protection, announcement bar.
- Module 15 (homepage-layout): Homepage Layout – Enable/disable and reorder sections vertically (1, 2, 3...).
- Module 16 (theme): Theme & Typography – Crimson red (#D91B24), Cormorant Garamond / Syne typography, button radius.
- Module 17 (backup): Data Backup & Reset – 1-click JSON database export and restore.
- Module 18 (users): Admin Users & RBAC – Super Admin, Admin, and Editor roles.
- Module 19 (logs): Security & Activity Logs – Audit trail of all actions with admin email and timestamps.
- Module 20 (database): Database & SQL Center – Live PostgreSQL health check, 14 table validator, 1-click cloud sync.

---

## 3. SECTION-SPECIFIC IMAGE UPLOAD GUIDELINES
- Hero Banner (Desktop): 2560 × 1440 px | 16:9 | WebP/JPG | Max 1.5 MB | Centered landscape framing
- Hero Banner (Mobile): 1080 × 1920 px | 9:16 | WebP/JPG | Max 800 KB | Smartphone vertical framing
- Artist Biography Portrait: 1200 × 1600 px | 3:4 | WebP/JPG | Max 800 KB | Editorial studio portrait
- Portfolio Showcase (Landscape): 2048 × 1365 px | 3:2 | WebP/JPG | Max 1.2 MB | sRGB, 85% web quality
- Portfolio Showcase (Portrait): 1365 × 2048 px | 2:3 | WebP/JPG | Max 1.2 MB | Rich shadow fidelity
- Service Cover Cards: 1200 × 800 px | 3:2 | WebP/JPG | Max 600 KB | Representative specialty visual
- Client Testimonial Avatars: 400 × 400 px | 1:1 | WebP/JPG/PNG | Max 250 KB | Faces centered
- Client Proofing Cover Photo: 1920 × 1080 px | 16:9 | WebP/JPG | Max 1.0 MB | Key event highlight
- Studio Brand Logo: 600 × 160 px | ~4:1 | SVG / PNG Alpha | Max 300 KB | Transparent background
- Website Favicon: 512 × 512 px | 1:1 | PNG/ICO | Max 100 KB | Crisp monogram icon
- Social Share Card (OG): 1200 × 630 px | 1.91:1 | JPG/PNG | Max 800 KB | Social media link preview

---

## 4. VIDEO UPLOAD GUIDELINES
- Hero Looping Video: 1920 × 1080 Full HD | 16:9 | MP4 (H.264) | 10–30s loop | Max 15–25 MB | MUST BE MUTED for mobile autoplay
- HandBrake Settings: Preset "Web > Fast 1080p30", check "Web Optimized", Constant Quality RF 22

---

## 5. FILE & STORAGE MANAGEMENT
- Supabase Object Storage bucket: website-assets
- Max upload limit: 10 MB per browser upload
- Supported formats: .jpg, .jpeg, .png, .webp, .svg, .ico, .mp4, .pdf, .json

---

## 6. ROLE-BASED ACCESS CONTROL (RBAC)
- Super Admin: Unrestricted permissions across all modules, user administration, database sync, and billing.
- Admin: Operational management over gallery, inquiries, calendar, quotes, packages, services, and media.
- Editor / Staff: Restricted to uploading photos, updating shoot notes, and viewing inquiries.

---

## 7. SETTINGS & CONFIGURATIONS REFERENCE
- Right-Click Protection: Disables browser context menus on all photos to prevent theft.
- Announcement Bar: High-visibility top banner for seasonal booking notices.
- Hero Overlay Opacity: 0.0 to 1.0 darkness adjustment to ensure text readability.
- WhatsApp Format: Country code without '+' or dashes (e.g. 919876543210).
- GA4 Measurement ID: Formatted as G-XXXXXXXXXX.

---

## 8. TROUBLESHOOTING GUIDE
- Supabase Disconnected: Check URL and anon key in Database & SQL module. Run 14-table test.
- Broken Images: Ensure image is uploaded via Media Library with verified public URL.
- PIN Rejected: Verify gallery is set to Active and 4-digit code has no spaces.
- Analytics Not Recording: Verify G-XXXXXXXXXX ID and test in an incognito window without ad blockers.

---

## 9. OPERATIONAL BEST PRACTICES
- DO: Curate 15–25 top photos per category, compress all media with TinyPNG, respond to leads within 2 hours, export weekly backups.
- DON'T: Never upload 40MB RAW files, never drop database tables in Supabase, never share super admin passwords.

© ${new Date().getFullYear()} Saikat Photography. Confidential Internal Manual.
`;
}

/**
 * Safely prints the generated manual via an isolated hidden iframe
 * ensuring all 20 modules and CSS styles print cleanly without truncating
 * or conflicting with the parent application layout.
 */
export function printDocumentViaIframe(htmlContent: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      let iframe = document.getElementById('guide-print-iframe') as HTMLIFrameElement | null;
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }

      iframe = document.createElement('iframe');
      iframe.id = 'guide-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document;
      if (!frameDoc) {
        throw new Error('Unable to access iframe document');
      }

      frameDoc.open();
      frameDoc.write(htmlContent);
      frameDoc.close();

      setTimeout(() => {
        try {
          iframe?.contentWindow?.focus();
          iframe?.contentWindow?.print();
          resolve(true);
        } catch (printErr) {
          console.warn('Iframe print failed, falling back to window.print():', printErr);
          try {
            window.print();
            resolve(true);
          } catch (winErr) {
            console.error('All print methods failed:', winErr);
            resolve(false);
          }
        }
      }, 400);
    } catch (err) {
      console.warn('printDocumentViaIframe setup failed, falling back:', err);
      try {
        window.print();
        resolve(true);
      } catch (err2) {
        resolve(false);
      }
    }
  });
}

/**
 * Download helper function that safely triggers browser file download
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Opens a clean, dedicated standalone print window using Blob URL
 */
export function openCleanPrintWindow(htmlContent: string): boolean {
  try {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (!printWindow) {
      return false; // Popup blocked
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  } catch (err) {
    console.error('Failed to open clean print window:', err);
    return false;
  }
}
