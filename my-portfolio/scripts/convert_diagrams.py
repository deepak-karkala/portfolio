#!/usr/bin/env python3

import re
import os
import sys
import subprocess
from pathlib import Path

BASE_DIR = Path("/Users/deepakkarkala/Documents/work/portfolio/my-portfolio")
CONTENT_DIR = BASE_DIR / "content/playbooks/mlops-production-guide"
PUBLIC_DIR = BASE_DIR / "public/playbooks/mlops-production-guide"

CHAPTERS = [
    "ch3.1", "ch4.1", "ch4.2", "ch5.2", "ch6.1", "ch6.2",
    "ch7.1", "ch7.2", "ch7.3", "ch8.1", "ch9.1", "ch10.1",
    "ch10.2", "ch11.1", "ch12.1", "ch12.2", "ch12.3", "ch13.1"
]

CONFIG_HEADER = """---
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
"""

CLASS_DEFS = """
%% Pastel Node Classes (Design System - Thicker Borders)
classDef sourceStyle fill:#E0F2FE,stroke:#38BDF8,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef ingestionStyle fill:#E9D5FF,stroke:#A78BFA,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef storageStyle fill:#FEF9C3,stroke:#FACC15,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef transformStyle fill:#DCFCE7,stroke:#4ADE80,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef serveStyle fill:#FCE7F3,stroke:#F472B6,stroke-width:2.5px,color:#0F172A,font-weight:600
classDef opsStyle fill:#FFEDD5,stroke:#FB923C,stroke-width:2.5px,color:#0F172A,font-weight:600
"""

def extract_mermaid_blocks(content):
    """Extract all mermaid code blocks from markdown content."""
    # Pattern to match ```mermaid ... ``` blocks
    pattern = r'```mermaid\n(.*?)\n```'
    matches = re.findall(pattern, content, re.DOTALL)
    return matches

def convert_newlines_in_labels(diagram_code):
    """Replace \\n with <br/> in node labels for Mermaid CLI compatibility."""
    # For Mermaid CLI, we need to handle newlines differently
    # The issue is that parentheses in labels cause parsing errors with <br/>
    # Solution: Use actual newlines in the .mmd file, not <br/>
    # Mermaid CLI/Puppeteer will handle them correctly
    return diagram_code.replace('\\n', '\n')

def extract_diagram_type(diagram_code):
    """Extract the diagram type (flowchart, graph, etc.)."""
    first_line = diagram_code.strip().split('\n')[0]
    return first_line.lower()

def create_mmd_file(diagram_code, diagram_num, chapter):
    """Create a .mmd file with proper configuration."""
    # Convert newlines in labels
    diagram_code = convert_newlines_in_labels(diagram_code)

    # Fix parentheses in node labels by converting diamond nodes with parentheses to rectangles with quotes
    def fix_diamond_nodes_with_parentheses(text):
        """
        Converts problematic diamond nodes with parentheses to rectangle nodes with quotes.
        Example: B{High avoidable bias?\n(train err)} --> B["High avoidable bias?\n(train err)"]
        """
        lines = text.split('\n')
        result = []
        i = 0

        while i < len(lines):
            line = lines[i]

            # Check if line starts a diamond node definition (ID{...)
            if re.search(r'^\s*(\w+)\{', line):
                # Collect the full node definition (might span multiple lines)
                node_match = re.match(r'^(\s*)(\w+)\{', line)
                if node_match:
                    indent = node_match.group(1)
                    node_id = node_match.group(2)

                    # Collect all lines until we find the closing }
                    node_content = line[len(indent):].replace(f'{node_id}{{', '')
                    closing_line_idx = i

                    # Check if it's a single-line diamond
                    if '}' in node_content:
                        closing_idx = node_content.index('}')
                        label_text = node_content[:closing_idx]
                        rest_of_line = node_content[closing_idx+1:]

                        # Check if label contains parentheses
                        if '(' in label_text:
                            # Convert to rectangle with quotes
                            # Escape any quotes in the label
                            label_text = label_text.replace('"', '\\"')
                            result.append(f'{indent}{node_id}["{label_text}"]{rest_of_line}')
                            i += 1
                            continue
                    else:
                        # Multi-line diamond node - collect until closing brace
                        full_content = [node_content]
                        j = i + 1
                        while j < len(lines):
                            full_content.append(lines[j])
                            if '}' in lines[j]:
                                closing_line_idx = j
                                # Find the closing brace
                                close_idx = lines[j].index('}')
                                label_text = '\n'.join(full_content)[:-len(lines[j])+close_idx]
                                rest_of_line = lines[j][close_idx+1:]

                                # Check if label contains parentheses
                                if '(' in label_text:
                                    # Convert to rectangle
                                    label_text = label_text.replace('"', '\\"')
                                    result.append(f'{indent}{node_id}["{label_text}"]{rest_of_line}')
                                    i = j + 1
                                    break
                                else:
                                    # No parentheses, keep as is
                                    for k in range(i, j+1):
                                        result.append(lines[k])
                                    i = j + 1
                                    break
                            j += 1
                        else:
                            # No closing brace found, keep original
                            result.append(line)
                            i += 1
                        continue

            # Not a problematic diamond, keep as-is
            result.append(line)
            i += 1

        return '\n'.join(result)

    diagram_code = fix_diamond_nodes_with_parentheses(diagram_code)

    # Still need to handle square brackets with parentheses
    def quote_square_bracket_labels(text):
        """Quote square bracket labels that contain parentheses."""
        pattern = r'(\w+)\[([^\[\]]*\([^\)]*\)[^\[\]]*)\]'
        def replacer(match):
            node_id = match.group(1)
            label = match.group(2)
            if not label.startswith('"'):
                label_clean = label.replace('\n', '<br/>')
                return f'{node_id}["{label_clean}"]'
            return match.group(0)
        return re.sub(pattern, replacer, text)

    diagram_code = quote_square_bracket_labels(diagram_code)

    mmd_content = CONFIG_HEADER + diagram_code + CLASS_DEFS

    # Create directory if it doesn't exist
    mmd_dir = PUBLIC_DIR / "mermaid" / chapter
    mmd_dir.mkdir(parents=True, exist_ok=True)

    mmd_file = mmd_dir / f"diagram-{diagram_num}.mmd"

    with open(mmd_file, 'w') as f:
        f.write(mmd_content)

    return str(mmd_file)

def generate_png(mmd_file, chapter, diagram_num):
    """Generate PNG from mermaid file using mmdc."""
    png_file = PUBLIC_DIR / "img" / chapter / f"diagram-{diagram_num}.png"
    png_file.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        'mmdc',
        '-i', str(mmd_file),
        '-o', str(png_file),
        '-b', 'white',
        '-p', '/tmp/puppeteer-config.json',
        '--scale', '3'
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            print(f"ERROR generating PNG for {mmd_file}:")
            print(result.stderr)
            return None
        return str(png_file)
    except subprocess.TimeoutExpired:
        print(f"TIMEOUT generating PNG for {mmd_file}")
        return None
    except FileNotFoundError:
        print("ERROR: mmdc not found. Install with: npm install -g @mermaid-js/mermaid-cli")
        return None

def generate_alt_text(diagram_code):
    """Generate descriptive alt text from diagram code."""
    # Simple heuristic: look for flowchart/graph type and count nodes
    if 'flowchart' in diagram_code.lower():
        diagram_type = "Flowchart"
    elif 'graph' in diagram_code.lower():
        diagram_type = "Graph"
    elif 'sequenceDiagram' in diagram_code.lower():
        diagram_type = "Sequence Diagram"
    else:
        diagram_type = "Diagram"

    # Count nodes as rough complexity indicator
    node_count = len(re.findall(r'\[\w+\]', diagram_code))

    return f"MLOps {diagram_type} with {node_count if node_count > 0 else 'multiple'} components"

def process_chapter(chapter):
    """Process all diagrams in a chapter."""
    chapter_file = CONTENT_DIR / f"{chapter}.md"

    if not chapter_file.exists():
        print(f"WARNING: {chapter_file} does not exist")
        return False

    with open(chapter_file, 'r') as f:
        content = f.read()

    diagrams = extract_mermaid_blocks(content)

    if not diagrams:
        print(f"{chapter}: No diagrams found")
        return True

    print(f"\n{chapter}: Found {len(diagrams)} diagram(s)")

    replacements = {}

    for idx, diagram_code in enumerate(diagrams, 1):
        print(f"  Processing diagram {idx}...")

        # Create .mmd file
        mmd_file = create_mmd_file(diagram_code, idx, chapter)
        print(f"    Created: {mmd_file}")

        # Generate PNG
        png_file = generate_png(mmd_file, chapter, idx)
        if not png_file:
            print(f"    ERROR: Failed to generate PNG")
            return False
        print(f"    Generated: {png_file}")

        # Store replacement info
        alt_text = generate_alt_text(diagram_code)
        image_ref = f"![{alt_text}](/playbooks/mlops-production-guide/img/{chapter}/diagram-{idx}.png)"
        replacements[diagram_code] = image_ref

    # Now update the markdown file
    updated_content = content
    for diagram_code, image_ref in replacements.items():
        # Build the full mermaid block to replace
        full_block = f"```mermaid\n{diagram_code}\n```"
        updated_content = updated_content.replace(full_block, image_ref)

    with open(chapter_file, 'w') as f:
        f.write(updated_content)

    print(f"  Updated: {chapter_file}")
    return True

def main():
    """Main execution."""
    print("Starting Mermaid to PNG conversion...")

    # Check if mmdc is installed
    try:
        result = subprocess.run(['which', 'mmdc'], capture_output=True)
        if result.returncode != 0:
            print("ERROR: Mermaid CLI (mmdc) not found.")
            print("Install it with: npm install -g @mermaid-js/mermaid-cli")
            sys.exit(1)
    except:
        pass

    # Check Puppeteer config
    puppeteer_config = "/tmp/puppeteer-config.json"
    if not os.path.exists(puppeteer_config):
        print(f"Creating Puppeteer config at {puppeteer_config}")
        with open(puppeteer_config, 'w') as f:
            f.write('{\n')
            f.write('  "executablePath": "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"\n')
            f.write('}\n')

    failed_chapters = []
    for chapter in CHAPTERS:
        if not process_chapter(chapter):
            failed_chapters.append(chapter)

    print("\n" + "="*50)
    if failed_chapters:
        print(f"FAILED chapters: {failed_chapters}")
        sys.exit(1)
    else:
        print("All chapters processed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
