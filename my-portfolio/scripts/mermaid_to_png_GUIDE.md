# Guide: Converting Mermaid Diagrams to High-Resolution PNG Images

## Overview
This guide provides step-by-step instructions for converting all 30 Mermaid code blocks across 19 chapters in the MLOps Production Guide playbook to high-resolution, styled PNG images.

## Prerequisites

### 1. Install Mermaid CLI
```bash
npm install -g @mermaid-js/mermaid-cli
```

### 2. Create Puppeteer Configuration
Create a config file to use system Chrome (faster than downloading):

```bash
cat > /tmp/puppeteer-config.json << 'EOF'
{
  "executablePath": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
}
EOF
```

**Note:** Adjust the Chrome path if you're on a different OS:
- macOS: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- Linux: `/usr/bin/google-chrome`
- Windows: `C:\Program Files\Google\Chrome\Application\chrome.exe`

## Directory Structure

Create the following directories:
```bash
# For PNG images
mkdir -p my-portfolio/public/playbooks/mlops-production-guide/img/ch{2.1,2.2,3.1,4.1,4.2,5.1,5.2,6.1,7.1,7.2,8.1,9.1,10.1,10.2,11.1,12.1,12.2,12.3,13.1}

# For source .mmd files
mkdir -p my-portfolio/public/playbooks/mlops-production-guide/mermaid/ch{2.1,2.2,3.1,4.1,4.2,5.1,5.2,6.1,7.1,7.2,8.1,9.1,10.1,10.2,11.1,12.1,12.2,12.3,13.1}
```

**CRITICAL:** Files must be in `my-portfolio/public/` NOT `public/` at the repository root.

## Styling Configuration

### Theme Configuration
Add this at the top of each .mmd file:

```yaml
---
config:
  look: neo
  theme: redux-color
  themeVariables:
    fontFamily: 'Inter, ui-sans-serif, system-ui'
    fontSize: '16px'
    primaryTextColor: '#0F172A'
    lineColor: '#000000'
    edgeLabelBackground: '#FFFFFF'
    clusterTextSize: '18px'
    clusterTextWeight: '700'
---
```

### Custom Pastel Color Palette (Design System)
Use these classDef styles for consistent, vibrant pastel styling:

```mermaid
%% Pastel Node Classes (Design System - Thicker Borders)
classDef sourceStyle fill:#E0F2FE,stroke:#38BDF8,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef ingestionStyle fill:#E9D5FF,stroke:#A78BFA,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef storageStyle fill:#FEF9C3,stroke:#FACC15,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef transformStyle fill:#DCFCE7,stroke:#4ADE80,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef serveStyle fill:#FCE7F3,stroke:#F472B6,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef opsStyle fill:#FFEDD5,stroke:#FB923C,stroke-width:2.5px,color:#0F172A,font-weight:600
```

### Subgraph Panel Styling
Apply these styles to each subgraph for consistent gray backgrounds with darker borders and bold titles:

```mermaid
%% Grey Subgraph Panels with Thicker Darker Borders and Bold Titles
style SUBGRAPH_ID fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
```

**Key Features:**
- Light slate gray background (#F1F5F9)
- Darker gray borders (#64748B) with 2.5px width
- Rounded corners (rx:10, ry:10)
- Bold subgraph titles at 16px
- Black connections for better visibility

## Conversion Workflow

### For Each Chapter with Mermaid Diagrams:

#### Step 1: Extract Mermaid Code
1. Open the chapter markdown file (e.g., `content/playbooks/mlops-production-guide/ch5.1.md`)
2. Locate the mermaid code block(s)
3. **Important:** Replace `\n` with `<br/>` in node labels (CLI parsing requirement)

#### Step 2: Create .mmd File
Create a new file with this structure:

```
---
config:
  look: neo
  theme: redux-color
  themeVariables:
    fontFamily: 'Inter, ui-sans-serif, system-ui'
    fontSize: '16px'
    primaryTextColor: '#0F172A'
    lineColor: '#000000'
    edgeLabelBackground: '#FFFFFF'
    clusterTextSize: '18px'
    clusterTextWeight: '700'
---
flowchart TB
  subgraph SUBID[Subgraph Title]
    [YOUR DIAGRAM CODE HERE - with <br/> instead of \n]
  end

  %% Pastel Node Classes (Design System - Thicker Borders)
  classDef sourceStyle fill:#E0F2FE,stroke:#38BDF8,stroke-width:2.5px,color:#0F172A,font-weight:600
  classDef ingestionStyle fill:#E9D5FF,stroke:#A78BFA,stroke-width:2.5px,color:#0F172A,font-weight:600
  classDef storageStyle fill:#FEF9C3,stroke:#FACC15,stroke-width:2.5px,color:#0F172A,font-weight:600
  classDef transformStyle fill:#DCFCE7,stroke:#4ADE80,stroke-width:2.5px,color:#0F172A,font-weight:600
  classDef serveStyle fill:#FCE7F3,stroke:#F472B6,stroke-width:2.5px,color:#0F172A,font-weight:600
  classDef opsStyle fill:#FFEDD5,stroke:#FB923C,stroke-width:2.5px,color:#0F172A,font-weight:600

  class NODE1,NODE2,NODE3 sourceStyle

  %% Grey Subgraph Panels with Thicker Darker Borders and Bold Titles
  style SUBID fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
```

#### Step 3: Generate High-Resolution PNG
Run the mmdc command with `--scale 3` for 3x resolution:

```bash
mmdc -i my-portfolio/public/playbooks/mlops-production-guide/mermaid/ch5.1/diagram-1.mmd \
     -o my-portfolio/public/playbooks/mlops-production-guide/img/ch5.1/diagram-1.png \
     -b white \
     -p /tmp/puppeteer-config.json \
     --scale 3
```

**IMPORTANT:** All paths must be relative to the portfolio root directory, with files in `my-portfolio/public/` NOT `public/` at root.

**Parameters explained:**
- `-i`: Input .mmd file
- `-o`: Output PNG path
- `-b white`: White background
- `-p`: Puppeteer config (uses system Chrome)
- `--scale 3`: 3x resolution for crisp, readable text

#### Step 4: Save .mmd File
The source file is already saved in the correct location:

```bash
my-portfolio/public/playbooks/mlops-production-guide/mermaid/ch5.1/diagram-1.mmd
```

No need to copy from /tmp - create files directly in the mermaid/ directory.

#### Step 5: Update Markdown File
Replace the mermaid code block with the image reference:

**Before:**
~~~markdown
```mermaid
flowchart TB
  [diagram code]
```
~~~

**After:**
```markdown
![Data Pipeline Architecture](/playbooks/mlops-production-guide/img/ch5.1/diagram-1.png)
```

## Chapter Conversion Checklist

Use this checklist to track progress:

- [x] ch2.1.md - 1 diagram ✓ (COMPLETED)
- [x] ch2.2.md - 1 diagram ✓ (COMPLETED)
- [x] ch3.1.md - 2 diagrams ✓ (COMPLETED)
- [x] ch4.1.md - 1 diagram ✓ (COMPLETED)
- [x] ch4.2.md - 1 diagram ✓ (COMPLETED)
- [x] ch5.1.md - 1 diagram ✓ (COMPLETED)
- [x] ch5.2.md - 1 diagram ✓ (COMPLETED)
- [x] ch6.1.md - 2 diagrams ✓ (COMPLETED)
- [x] ch7.1.md - 1 diagram ✓ (COMPLETED)
- [x] ch7.2.md - 1 diagram ✓ (COMPLETED)
- [x] ch8.1.md - 1 diagram ✓ (COMPLETED)
- [x] ch9.1.md - 3 diagrams ✓ (COMPLETED)
- [x] ch10.1.md - 2 diagrams ✓ (COMPLETED)
- [x] ch10.2.md - 2 diagrams ✓ (COMPLETED)
- [x] ch11.1.md - 1 diagram ✓ (COMPLETED)
- [x] ch12.1.md - 2 diagrams ✓ (COMPLETED)
- [x] ch12.2.md - 3 diagrams ✓ (COMPLETED)
- [x] ch12.3.md - 1 diagram ✓ (COMPLETED)
- [x] ch13.1.md - 1 diagram ✓ (COMPLETED)

**Total: 30 diagrams across 19 chapters**

## Verification Steps

After converting all diagrams:

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Run dev server:**
   ```bash
   npm run dev
   ```

3. **Manual verification:**
   - Navigate to each chapter
   - Verify images load correctly
   - Check text is crisp and readable
   - Ensure colors match the pastel palette
   - Verify no broken image links

4. **Check file sizes:**
   ```bash
   ls -lh public/playbooks/mlops-production-guide/img/*/diagram-*.png
   ```
   - High-res PNGs should be 100-200KB each
   - Low-res (if you find any) would be <50KB

## Common Issues & Solutions

### Issue 1: "Could not find Chrome"
**Solution:** Install Chrome headless shell or use system Chrome via puppeteer config.

```bash
npx puppeteer browsers install chrome-headless-shell
# OR use the puppeteer-config.json with system Chrome path
```

### Issue 2: Parse error with `\n`
**Solution:** Replace all `\n` with `<br/>` in node labels.

```diff
- STR[Stream Bus\n(Kafka/Kinesis)]
+ STR[Stream Bus<br/>Kafka/Kinesis]
```

### Issue 3: Colors not applying
**Solution:** Ensure classDef definitions come AFTER the diagram structure, and class assignments reference the correct node IDs.

### Issue 4: Low resolution images
**Solution:** Always use `--scale 3` parameter. File should be 3-4x larger than without scaling.

## Batch Processing Script (Optional)

For efficiency, you can create a script to process multiple diagrams:

```bash
#!/bin/bash
# batch-convert.sh

CHAPTERS=("ch2.1" "ch2.2" "ch3.1" "ch4.1" "ch4.2" "ch5.1" "ch5.2" "ch6.1" "ch7.1" "ch7.2" "ch8.1" "ch9.1" "ch10.1" "ch10.2" "ch11.1" "ch12.1" "ch12.2" "ch12.3" "ch13.1")

for chapter in "${CHAPTERS[@]}"; do
  echo "Processing $chapter..."
  # Add your mmdc command here for each chapter
done
```

## Example: ch5.1 Complete Workflow

Here's the complete example that was successfully tested:

1. **Created .mmd file directly in mermaid directory:**
   ```bash
   # File: my-portfolio/public/playbooks/mlops-production-guide/mermaid/ch5.1/diagram-1.mmd
   ---
   config:
     look: neo
     theme: redux-color
     themeVariables:
       fontFamily: 'Inter, ui-sans-serif, system-ui'
       fontSize: '16px'
       primaryTextColor: '#0F172A'
       lineColor: '#000000'
       edgeLabelBackground: '#FFFFFF'
       clusterTextSize: '18px'
       clusterTextWeight: '700'
   ---
   flowchart TB
     subgraph SRC[Sources]
       APP[Apps/Services]
       DB[(OLTP DB)]
       LOG[Logs/Events]
       API[3rd-party API]
     end
     [... rest of diagram ...]

     %% Pastel Node Classes (Design System - Thicker Borders)
     classDef sourceStyle fill:#E0F2FE,stroke:#38BDF8,stroke-width:2.5px,color:#0F172A,font-weight:600
     classDef ingestionStyle fill:#E9D5FF,stroke:#A78BFA,stroke-width:2.5px,color:#0F172A,font-weight:600
     classDef storageStyle fill:#FEF9C3,stroke:#FACC15,stroke-width:2.5px,color:#0F172A,font-weight:600
     classDef transformStyle fill:#DCFCE7,stroke:#4ADE80,stroke-width:2.5px,color:#0F172A,font-weight:600
     classDef serveStyle fill:#FCE7F3,stroke:#F472B6,stroke-width:2.5px,color:#0F172A,font-weight:600
     classDef opsStyle fill:#FFEDD5,stroke:#FB923C,stroke-width:2.5px,color:#0F172A,font-weight:600

     class APP,DB,LOG,API sourceStyle
     class CDC,STR,BATCH,DLQ ingestionStyle
     class RAW,CUR storageStyle
     class CLEAN,MODEL,FEAT transformStyle
     class WH,FS,TRAIN,BI serveStyle
     class ORCH,OBS,META opsStyle

     %% Grey Subgraph Panels with Thicker Darker Borders and Bold Titles
     style SRC fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
     style ING fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
     style LAKE fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
     style XFORM fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
     style SERVE fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
     style OPS fill:#F1F5F9,stroke:#64748B,stroke-width:2.5px,rx:10,ry:10,font-size:16px,font-weight:bold
   ```

2. **Generated PNG:**
   ```bash
   mmdc -i my-portfolio/public/playbooks/mlops-production-guide/mermaid/ch5.1/diagram-1.mmd \
        -o my-portfolio/public/playbooks/mlops-production-guide/img/ch5.1/diagram-1.png \
        -b white \
        -p /tmp/puppeteer-config.json \
        --scale 3
   ```

3. **Updated ch5.1.md:**
   ```markdown
   ![Data Pipeline Architecture](/playbooks/mlops-production-guide/img/ch5.1/diagram-1.png)
   ```

4. **Result:**
   - Image size: 136KB (high resolution)
   - Text: Crisp, readable, and bold
   - Colors: Vibrant pastel palette with light gray subgraph backgrounds
   - Theme: Neo look with redux-color palette
   - Font: Inter at 16px with bold node labels (weight:600)
   - Subgraph titles: Bold at 16px
   - Connections: Black for better visibility
   - Borders: Thicker (2.5px) for enhanced visual presence
   - Build: Successful

## References

- [Mermaid CLI Documentation](https://github.com/mermaid-js/mermaid-cli)
- [Mermaid Theme Configuration](https://mermaid.js.org/config/theming.html)
- [High Resolution PNG Issue](https://github.com/mermaid-js/mermaid-cli/issues/715)
- [Customizing Colors](https://dev.to/leonards/customising-mermaid-diagram-font-and-colors-4pm9)

## Notes

- Always use `--scale 3` for production images
- Save .mmd files for future edits (don't rely on HTML comments)
- Use consistent pastel colors across all diagrams for brand consistency
- Test build after every 5-10 conversions to catch issues early
- The conversion process takes ~30-60 seconds per diagram depending on complexity
