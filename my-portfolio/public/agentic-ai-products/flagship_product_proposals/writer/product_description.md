# Creative — “Writer’s Room Copilot” (Script Writing)

## 1) Executive snapshot
**ICP:** aspiring / professional screenwriters, showrunners, indie teams  
**Job-to-be-done:** turn rough ideas + notes into a **polished screenplay package** (outline → drafts → revisions → pitch assets).  
**Wedge workflow:** “Episode/pilot draft sprint” with structured writer’s room critique and rewrite plan.  
**Why an agent:** multi-step iteration across roles + artifact generation + structured revision loops (not a single answer).  
**Autonomy:** **Copilot** (agent proposes; user approves direction; subagents produce drafts).

**North-star KPIs**
- time-to-first-draft (hours → <60 minutes for a usable draft)
- revision cycle time (days → <1 day)
- consistency score: character/plot continuity across scenes

## 2) Product experience & UX
**UI paradigm:** group chat “writer’s room” where each message is attributable to a role.  
**Primary UX loop:** *Plan → Draft → Critique → Rewrite → Package*.

**Core screens (minimal)**
- **Group Chat:** Producer, Story Editor, Script Supervisor, Director, Dialogue Punch-up
- **Artifact Panel:** Outline, Beat Sheet, Draft v1/v2, Notes, Character Bible
- **Diff Viewer:** highlight changes between drafts (scene-level diffs)
- **Pitch Kit Generator:** logline, synopsis, episode bible, poster concepts

## 3) Agent design map
**Skills (domain roles)**
- Producer (market fit, pacing, positioning)
- Story Editor (structure, arcs, tension)
- Script Supervisor (continuity, props/timeline)
- Director (visual staging, shot intent)
- Dialogue Writer (voice, comedic rhythm)
- Sensitivity / Authenticity reviewer (optional)

**Subagents (executors)**
- Researcher: check novelty, references, comps, similar works (web search)
- Continuity Checker: validate character/plot consistency with rules
- Screenplay Formatter: exports to industry format (Final Draft / Fountain)
- Pitch Kit Builder: generates 1-pager + synopsis + bible
- Poster Mockup Designer: creates style-aligned key art

**Planner**
- decomposes requests into: research → outline → draft scenes → consistency pass → revision pass → export

## 4) Tool & data plane (MCP-centric)
- MCP server: “Script Library” (project artifacts: bibles, outlines, drafts)
- MCP server: “Media/Comps Search” (film/TV database search + citations)
- MCP server: “Document Export” (Fountain / Final Draft templates)

## 5) Context engineering plan
- **Source-of-truth artifacts:** character bible, timeline, outline, user notes
- **Working context:** last 2–3 turns + relevant artifact snippets + scene being edited
- **Compaction:** older discussions summarized into “decision log”
- **Isolation:** subagents get narrow slices (e.g., continuity gets bible + latest draft only)

## 6) Evals & observability
**Offline evals**
- rubric scoring: structure coherence, character consistency, formatting validity
- regression set: “common writer’s room edits” (tighten dialogue, fix logic holes, pace act breaks)

**Online metrics**
- user acceptance rate of revision plan
- number of “undo” / reverts
- continuity flags per page
- cost per screenplay-page produced

## 7) Failure modes & mitigations
| What breaks | Detect | Constrain | Prevent regression |
|---|---|---|---|
| Continuity errors | timeline validator; character bible checks | continuity gate before export | add failing drafts as replay tests |
| Tone drift | style classifier; dialogue voice checks | require “voice sheet” pinned | rubric eval + tone stress tests |
| Similarity risk | similarity/comps checks | enforce citations + “inspiration” logs | add adversarial similarity probes |
| Overwriting user intent | diff viewer + approval | rewrite only after plan approval | UX: plan-first; locked constraints |

## 8) Governance posture & rollout
- “Export screenplay” is a gated action (approval required)
- versioned artifacts + audit trail of changes
- canary to small cohort; track “regret rate” (reverts)

## 9) Business case + distribution loops
**ROI model:** hours saved per draft sprint × hourly rate + fewer rewrite rounds  
**Pricing:** per project/month + export credits  
**Distribution loops**
- Shareable pitch kits and scripts (viral loop)
- Collaboration invites (writer invites producer / editor)
- Templates marketplace (community loop)


## 10) Where RFT helps

* **Consistency of character voice & scene structure** across long arcs (reduces “episode drift”).
* **Better long-horizon planning**: fewer plot holes introduced early that break later scenes (credit assignment problem).
* **Tool-use policy**: when to research references vs write; when to ask the user for missing beats.

**What you train on (signals):**

* Trajectories: outline → beat sheet → scene drafts → revisions → final screenplay artifact.
* Graders (multi-grader):

  * Format compliance (screenplay structure checks)
  * Rubric voice/continuity scoring
  * “Room quality” score (producer/editor/director rubric)
  * Efficiency (revision count / token + tool budget)

**Business metrics it can lift:**

* Higher *draft acceptance rate* (fewer revisions before “publishable”)
* Faster *time-to-first-good-draft*
* Higher retention for creators (the system “learns your room’s taste”)
