# Graph Report - .  (2026-06-25)

## Corpus Check
- 45 files · ~50,890 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 611 nodes · 919 edges · 51 communities (36 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Example App Screens|Example App Screens]]
- [[_COMMUNITY_Core Layout & Animation|Core Layout & Animation]]
- [[_COMMUNITY_Design System Components|Design System Components]]
- [[_COMMUNITY_Dev Dependencies & Turbo|Dev Dependencies & Turbo]]
- [[_COMMUNITY_Example App Dependencies|Example App Dependencies]]
- [[_COMMUNITY_Expo App Config|Expo App Config]]
- [[_COMMUNITY_Circle Math & Geometry|Circle Math & Geometry]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_CICD & Workflows|CI/CD & Workflows]]
- [[_COMMUNITY_Example TypeScript Config|Example TypeScript Config]]
- [[_COMMUNITY_App Navigation & Layout|App Navigation & Layout]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_Agent Documentation|Agent Documentation]]
- [[_COMMUNITY_Release Configuration|Release Configuration]]
- [[_COMMUNITY_Architecture Decisions|Architecture Decisions]]
- [[_COMMUNITY_Agent Architecture Refs|Agent Architecture Refs]]
- [[_COMMUNITY_Metro Bundler Config|Metro Bundler Config]]
- [[_COMMUNITY_Agent Type Definitions|Agent Type Definitions]]
- [[_COMMUNITY_Domain Glossary|Domain Glossary]]
- [[_COMMUNITY_Package Scripts|Package Scripts]]
- [[_COMMUNITY_README API Types|README API Types]]
- [[_COMMUNITY_TotalParts Invariant|TotalParts Invariant]]
- [[_COMMUNITY_Agent Component Docs|Agent Component Docs]]
- [[_COMMUNITY_Grid-to-Circle Morph|Grid-to-Circle Morph]]
- [[_COMMUNITY_Agent Issue System|Agent Issue System]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Donut Chart Screen|Donut Chart Screen]]
- [[_COMMUNITY_Library Builder Config|Library Builder Config]]
- [[_COMMUNITY_Package Exports|Package Exports]]
- [[_COMMUNITY_Jest Config|Jest Config]]
- [[_COMMUNITY_Peer Dependencies|Peer Dependencies]]
- [[_COMMUNITY_Builder Bob Config|Builder Bob Config]]
- [[_COMMUNITY_Publish Config|Publish Config]]
- [[_COMMUNITY_Repository Info|Repository Info]]
- [[_COMMUNITY_Build TypeScript Config|Build TypeScript Config]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Android Icon Foreground|Android Icon Foreground]]
- [[_COMMUNITY_Android Icon Monochrome|Android Icon Monochrome]]
- [[_COMMUNITY_Favicon Asset|Favicon Asset]]
- [[_COMMUNITY_App Icon Asset|App Icon Asset]]
- [[_COMMUNITY_Splash Icon Asset|Splash Icon Asset]]
- [[_COMMUNITY_Bug Report Template|Bug Report Template]]
- [[_COMMUNITY_CI Build Library|CI Build Library]]
- [[_COMMUNITY_CI Lint Job|CI Lint Job]]
- [[_COMMUNITY_CI Test Job|CI Test Job]]
- [[_COMMUNITY_Deploy Pages Workflow|Deploy Pages Workflow]]
- [[_COMMUNITY_EAS Build Workflow|EAS Build Workflow]]
- [[_COMMUNITY_NPM Publish Workflow|NPM Publish Workflow]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 26 edges
2. `CircleLayoutRef` - 18 edges
3. `expo` - 16 edges
4. `compilerOptions` - 16 edges
5. `CircleLayout()` - 16 edges
6. `AnimationType` - 15 edges
7. `AnimationCombinationType` - 15 edges
8. `Domain Context - react-native-circle-layout` - 13 edges
9. `rnAnimatedDriver` - 12 edges
10. `AnimationDriver` - 11 edges

## Surprising Connections (you probably didn't know these)
- `ADR-0002: totalParts invariant for partial arcs` --conceptually_related_to--> `total parts`  [INFERRED]
  docs/adr/0002-totalparts-invariant-for-partial-arcs.md → CONTEXT.md
- `Example app runtime (React 19.2.3)` --conceptually_related_to--> `example app`  [INFERRED]
  CONTEXT.md → CONTRIBUTING.md
- `example package` --conceptually_related_to--> `example app`  [INFERRED]
  pnpm-workspace.yaml → CONTRIBUTING.md
- `pnpm Workspace Config` --conceptually_related_to--> `CircleLayout Component`  [INFERRED]
  pnpm-workspace.yaml → AGENTS.md
- `Issue Template Config` --references--> `react-native-circle-layout (project)`  [EXTRACTED]
  .github/ISSUE_TEMPLATE/config.yml → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CircleLayout Component Hierarchy** — agents_circlelayout, agents_circlelayoutprovider, agents_circlelayoutcontext, agents_circlelayoutcontent, agents_circlelayoutcomponent, agents_bg [EXTRACTED 1.00]
- **Animation Hook Pipeline** — agents_circlelayoutcomponent, agents_useanimation, agents_usecombinedanimation, agents_useanimatedsectorpath [EXTRACTED 1.00]
- **Agent Skills System** — agents_issue_tracker, agents_triage_labels, agents_domain_docs, agents_github_issues [EXTRACTED 1.00]

## Communities (51 total, 15 thin omitted)

### Community 0 - "Example App Screens"
Cohesion: 0.05
Nodes (34): NAV_ITEMS, styles, COLORS, styles, colorOptions, ICONS, styles, Icon (+26 more)

### Community 1 - "Core Layout & Animation"
Cohesion: 0.08
Nodes (39): rnAnimatedDriver, RNAnimationConfig, AnimatedNode, AnimationDriver, DriverComposite, DriverConfig, DriverValue, Android Icon Background (+31 more)

### Community 2 - "Design System Components"
Cohesion: 0.08
Nodes (33): Button, ButtonComponent(), ButtonComponentProps, ButtonProps, Props, ResolvedStyle, RestyleProps, Dropdown (+25 more)

### Community 3 - "Dev Dependencies & Turbo"
Cohesion: 0.04
Nodes (45): devDependencies, commitlint, @commitlint/config-conventional, del-cli, eslint, @eslint-community/eslint-plugin-eslint-comments, @eslint/compat, eslint-config-prettier (+37 more)

### Community 4 - "Example App Dependencies"
Cohesion: 0.05
Nodes (38): dependencies, expo, @expo/metro-runtime, expo-router, expo-splash-screen, expo-status-bar, expo-system-ui, @expo/vector-icons (+30 more)

### Community 5 - "Expo App Config"
Cohesion: 0.06
Nodes (34): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+26 more)

### Community 6 - "Circle Math & Geometry"
Cohesion: 0.15
Nodes (18): center, UseAnimatedSectorPath, CirclePosition, CirclePositionsConfig, computePosition(), useCirclePosition(), useCirclePositions(), CirclePathProps (+10 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.07
Nodes (27): compilerOptions, allowUnreachableCode, allowUnusedLabels, customConditions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib (+19 more)

### Community 8 - "CI/CD & Workflows"
Cohesion: 0.11
Nodes (20): build-web job, CI Workflow, Contributor Covenant Code of Conduct, Example app runtime (React 19.2.3), Contributing Guide, Conventional Commits specification, example app, pnpm workspaces (+12 more)

### Community 9 - "Example TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowUnreachableCode, allowUnusedLabels, forceConsistentCasingInFileNames, noFallthroughCasesInSwitch, noImplicitReturns, noImplicitUseStrict, noStrictGenericChecks (+12 more)

### Community 10 - "App Navigation & Layout"
Cohesion: 0.17
Nodes (6): RootScreens, RootStackParamList, RootStackScreenProps, PopUpProps, Stack, AppContextValue

### Community 11 - "Package Metadata"
Cohesion: 0.13
Nodes (14): author, bugs, url, commitlint, extends, description, files, homepage (+6 more)

### Community 12 - "Agent Documentation"
Cohesion: 0.15
Nodes (13): react-native-circle-layout (project), CLAUDE.md project instructions, Issue Template Config, Copilot Instructions, graphify query/path/explain workflow, gh CLI, Issue tracker: GitHub, needs-info label (+5 more)

### Community 13 - "Release Configuration"
Cohesion: 0.17
Nodes (12): commitMessage, tagName, release, publish, @release-it/conventional-changelog, name, release-it, preset (+4 more)

### Community 14 - "Architecture Decisions"
Cohesion: 0.28
Nodes (9): ADR-0001: Imperative ref API for show/hide, entry animation, exit animation, CONTEXT-MAP.md (multi-context convention), Domain Docs (agent guidance), /grill-with-docs skill, CircleLayoutRef (type), hideComponents() (+1 more)

### Community 15 - "Agent Architecture Refs"
Cohesion: 0.22
Nodes (9): Bg (Background Sector), CircleLayout Component, CircleLayoutContext, Polar-to-Cartesian Conversion, Public API Surface, useAnimatedSectorPath Hook, useAnimation Hook, useCombinedAnimation Hook (+1 more)

### Community 16 - "Metro Bundler Config"
Cohesion: 0.22
Nodes (8): config, framerMotionBundle, fs, { getDefaultConfig }, motiDir, path, root, { withMetroConfig }

### Community 17 - "Agent Type Definitions"
Cohesion: 0.25
Nodes (8): AnimationCombinationType, AnimationConfig, AnimationType, BgConfig, CircleLayoutProps, CircleLayoutRef, src/index.tsx (public API), animation combination type (glossary)

### Community 18 - "Domain Glossary"
Cohesion: 0.25
Nodes (8): src/utils/circle.ts, animation gap, center component, circle layout (glossary term), Domain Context - react-native-circle-layout, polar-to-Cartesian, start angle, sweep angle

### Community 19 - "Package Scripts"
Cohesion: 0.25
Nodes (8): scripts, clean, example, lint, prepare, release, test, typecheck

### Community 20 - "README API Types"
Cohesion: 0.25
Nodes (8): AnimationCombinationType (enum, README), AnimationConfig (type, README), AnimationProps (type), AnimationType (enum, README), BgConfig (type, README), CircleLayout (exported component), CircleLayoutProps (type), react-native-circle-layout README

### Community 21 - "TotalParts Invariant"
Cohesion: 0.33
Nodes (7): ADR-0002: totalParts invariant for partial arcs, ADR 0002 - totalParts Invariant for Partial Arcs, CircleLayoutProvider, React Context for Shared Props, totalParts invariant, totalParts Invariant for Partial Arcs, total parts

### Community 22 - "Agent Component Docs"
Cohesion: 0.29
Nodes (7): Bg[] (background sectors), CircleLayoutArray, CircleLayoutComponent (wrapper), CircleLayoutContent, useAnimatedSectorPath, useAnimation, useCombinedAnimation

### Community 23 - "Grid-to-Circle Morph"
Cohesion: 0.38
Nodes (5): getCirclePosition(), getGridPosition(), ITEMS, MorphItem(), styles

### Community 24 - "Agent Issue System"
Cohesion: 0.40
Nodes (6): Domain Docs (CONTEXT.md + ADRs), gh CLI for Issue Operations, GitHub Issues (sonalip9/react-native-circle-layout), Issue Tracker Agent Skill, Triage Labels, AGENTS.md - Project Documentation

### Community 25 - "Prettier Config"
Cohesion: 0.33
Nodes (6): prettier, quoteProps, singleQuote, tabWidth, trailingComma, useTabs

### Community 27 - "Library Builder Config"
Cohesion: 0.40
Nodes (5): create-react-native-library, languages, tools, type, version

### Community 28 - "Package Exports"
Cohesion: 0.40
Nodes (5): default, exports, ./package.json, source, types

### Community 29 - "Jest Config"
Cohesion: 0.40
Nodes (5): jest, modulePathIgnorePatterns, preset, setupFilesAfterEnv, transformIgnorePatterns

### Community 30 - "Peer Dependencies"
Cohesion: 0.50
Nodes (4): peerDependencies, react, react-native, react-native-svg

### Community 31 - "Builder Bob Config"
Cohesion: 0.50
Nodes (4): react-native-builder-bob, output, source, targets

### Community 32 - "Publish Config"
Cohesion: 0.67
Nodes (3): publishConfig, access, registry

### Community 33 - "Repository Info"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **324 isolated node(s):** `flatCompat`, `name`, `slug`, `version`, `orientation` (+319 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CircleLayoutRef` connect `Example App Screens` to `Core Layout & Animation`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `palette` connect `Design System Components` to `Example App Screens`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies & Turbo` to `Package Metadata`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `flatCompat`, `name`, `slug` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Example App Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.05191146881287726 - nodes in this community are weakly interconnected._
- **Should `Core Layout & Animation` be split into smaller, more focused modules?**
  _Cohesion score 0.07598371777476255 - nodes in this community are weakly interconnected._
- **Should `Design System Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0797872340425532 - nodes in this community are weakly interconnected._