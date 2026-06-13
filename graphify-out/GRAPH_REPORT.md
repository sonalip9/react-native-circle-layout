# Graph Report - .  (2026-06-13)

## Corpus Check
- Corpus is ~43,524 words - fits in a single context window. You may not need a graph.

## Summary
- 485 nodes · 725 edges · 49 communities (34 shown, 15 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 151,655 input · 64,993 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Animation Driver Layer|Animation Driver Layer]]
- [[_COMMUNITY_Design System Atoms (Button)|Design System Atoms (Button)]]
- [[_COMMUNITY_ESLint  Lint Tooling Deps|ESLint / Lint Tooling Deps]]
- [[_COMMUNITY_Example App Dependencies|Example App Dependencies]]
- [[_COMMUNITY_Expo App Icon Config|Expo App Icon Config]]
- [[_COMMUNITY_Example TS Compiler Config|Example TS Compiler Config]]
- [[_COMMUNITY_Nested Ring Menu  Playground|Nested Ring Menu / Playground]]
- [[_COMMUNITY_CI Workflows & Contributor Docs|CI Workflows & Contributor Docs]]
- [[_COMMUNITY_Animated Sector Path & Arc Math|Animated Sector Path & Arc Math]]
- [[_COMMUNITY_Example App Navigation|Example App Navigation]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_Turborepo Pipeline Config|Turborepo Pipeline Config]]
- [[_COMMUNITY_Release-it Config|Release-it Config]]
- [[_COMMUNITY_TotalParts Invariant Docs|TotalParts Invariant Docs]]
- [[_COMMUNITY_Public API Types|Public API Types]]
- [[_COMMUNITY_CircleLayout Component Tree|CircleLayout Component Tree]]
- [[_COMMUNITY_Circle Geometry & Domain Glossary|Circle Geometry & Domain Glossary]]
- [[_COMMUNITY_Root Package Scripts|Root Package Scripts]]
- [[_COMMUNITY_README Public API Docs|README Public API Docs]]
- [[_COMMUNITY_Project Agent Instructions|Project Agent Instructions]]
- [[_COMMUNITY_Imperative Ref API (ADR-0001)|Imperative Ref API (ADR-0001)]]
- [[_COMMUNITY_Metro Config|Metro Config]]
- [[_COMMUNITY_Prettier Config|Prettier Config]]
- [[_COMMUNITY_Issue Triage Labels|Issue Triage Labels]]
- [[_COMMUNITY_create-react-native-library Config|create-react-native-library Config]]
- [[_COMMUNITY_Package Exports Map|Package Exports Map]]
- [[_COMMUNITY_Jest Config|Jest Config]]
- [[_COMMUNITY_Peer Dependencies|Peer Dependencies]]
- [[_COMMUNITY_react-native-builder-bob Config|react-native-builder-bob Config]]
- [[_COMMUNITY_Library tsconfig|Library tsconfig]]
- [[_COMMUNITY_npm Publish Config|npm Publish Config]]
- [[_COMMUNITY_Repository Metadata|Repository Metadata]]
- [[_COMMUNITY_tsconfig.build.json|tsconfig.build.json]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_Android Icon Foreground Asset|Android Icon Foreground Asset]]
- [[_COMMUNITY_Android Monochrome Icon Asset|Android Monochrome Icon Asset]]
- [[_COMMUNITY_Example App Favicon|Example App Favicon]]
- [[_COMMUNITY_Example App Icon|Example App Icon]]
- [[_COMMUNITY_Splash Icon Asset|Splash Icon Asset]]
- [[_COMMUNITY_Bug Report Template|Bug Report Template]]
- [[_COMMUNITY_CI build-library Job|CI build-library Job]]
- [[_COMMUNITY_CI lint Job|CI lint Job]]
- [[_COMMUNITY_CI test Job|CI test Job]]
- [[_COMMUNITY_Deploy Pages Workflow|Deploy Pages Workflow]]
- [[_COMMUNITY_EAS Build Workflow|EAS Build Workflow]]
- [[_COMMUNITY_npm-publish Release Workflow|npm-publish Release Workflow]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 26 edges
2. `expo` - 13 edges
3. `Domain Context - react-native-circle-layout` - 13 edges
4. `rnAnimatedDriver` - 12 edges
5. `AnimationDriver` - 11 edges
6. `CircleLayoutRef` - 10 edges
7. `Theme` - 9 edges
8. `resolveStyles()` - 9 edges
9. `CircleLayoutContext` - 9 edges
10. `AnimationType` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ADR-0002: totalParts invariant for partial arcs` --conceptually_related_to--> `total parts`  [INFERRED]
  docs/adr/0002-totalparts-invariant-for-partial-arcs.md → CONTEXT.md
- `Example app runtime (React 19.2.3)` --conceptually_related_to--> `example app`  [INFERRED]
  CONTEXT.md → CONTRIBUTING.md
- `example package` --conceptually_related_to--> `example app`  [INFERRED]
  pnpm-workspace.yaml → CONTRIBUTING.md
- `Issue Template Config` --references--> `react-native-circle-layout (project)`  [EXTRACTED]
  .github/ISSUE_TEMPLATE/config.yml → AGENTS.md
- `CLAUDE.md project instructions` --conceptually_related_to--> `graphify query/path/explain workflow`  [INFERRED]
  CLAUDE.md → .github/copilot-instructions.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CI/CD GitHub Actions workflows sharing setup action** — ci_ci_workflow, deploy_pages_deploy_pages_workflow, eas_build_eas_build_workflow, npm_publish_release_workflow, setup_setup_action [EXTRACTED 1.00]
- **CircleLayout component composition tree** — agents_circle_layout_component, agents_circle_layout_provider, agents_circle_layout_context, agents_circle_layout_content, agents_circle_layout_array, agents_circle_layout_component_wrapper, agents_bg_component [EXTRACTED 1.00]
- **Documentation describing the totalParts invariant across files** — agents_total_parts_invariant, 0002_totalparts_invariant_adr, context_total_parts, agents_circle_layout_provider [INFERRED 0.85]

## Communities (49 total, 15 thin omitted)

### Community 0 - "Animation Driver Layer"
Cohesion: 0.08
Nodes (34): rnAnimatedDriver, RNAnimationConfig, AnimationDriver, DriverComposite, DriverConfig, DriverValue, Android Icon Background, AnimationArgs (+26 more)

### Community 1 - "Design System Atoms (Button)"
Cohesion: 0.08
Nodes (33): Button, ButtonComponent(), ButtonComponentProps, ButtonProps, Props, ResolvedStyle, RestyleProps, Dropdown (+25 more)

### Community 2 - "ESLint / Lint Tooling Deps"
Cohesion: 0.06
Nodes (32): devDependencies, commitlint, @commitlint/config-conventional, del-cli, eslint, @eslint-community/eslint-plugin-eslint-comments, @eslint/compat, eslint-config-prettier (+24 more)

### Community 3 - "Example App Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, expo, @expo/metro-runtime, expo-status-bar, @expo/vector-icons, react, react-dom, react-native (+21 more)

### Community 4 - "Expo App Icon Config"
Cohesion: 0.07
Nodes (27): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, projectId, expo (+19 more)

### Community 5 - "Example TS Compiler Config"
Cohesion: 0.07
Nodes (27): compilerOptions, allowUnreachableCode, allowUnusedLabels, customConditions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib (+19 more)

### Community 6 - "Nested Ring Menu / Playground"
Cohesion: 0.17
Nodes (10): Icon, icons, subIcons, Icon, CircleLayout(), AnimationCombinationType, AnimationConfig, AnimationType (+2 more)

### Community 7 - "CI Workflows & Contributor Docs"
Cohesion: 0.11
Nodes (20): build-web job, CI Workflow, Contributor Covenant Code of Conduct, Example app runtime (React 19.2.3), Contributing Guide, Conventional Commits specification, example app, pnpm workspaces (+12 more)

### Community 8 - "Animated Sector Path & Arc Math"
Cohesion: 0.19
Nodes (13): AnimatedNode, center, UseAnimatedSectorPath, CirclePathProps, getArc(), getArcPath(), getSectorPath(), Point (+5 more)

### Community 9 - "Example App Navigation"
Cohesion: 0.21
Nodes (7): RootScreens, RootStackParamList, RootStackScreenProps, PopUpProps, Stack, AppContext, AppContextValue

### Community 10 - "Package Metadata"
Cohesion: 0.13
Nodes (14): author, bugs, url, commitlint, extends, description, files, homepage (+6 more)

### Community 11 - "Turborepo Pipeline Config"
Cohesion: 0.14
Nodes (13): turbo, env, inputs, outputs, env, inputs, outputs, globalDependencies (+5 more)

### Community 12 - "Release-it Config"
Cohesion: 0.17
Nodes (12): commitMessage, tagName, release, publish, @release-it/conventional-changelog, name, release-it, preset (+4 more)

### Community 13 - "TotalParts Invariant Docs"
Cohesion: 0.29
Nodes (8): ADR-0002: totalParts invariant for partial arcs, CircleLayout component, CircleLayoutProvider, totalParts invariant, total parts, CONTEXT-MAP.md (multi-context convention), Domain Docs (agent guidance), /grill-with-docs skill

### Community 14 - "Public API Types"
Cohesion: 0.25
Nodes (8): AnimationCombinationType, AnimationConfig, AnimationType, BgConfig, CircleLayoutProps, CircleLayoutRef, src/index.tsx (public API), animation combination type (glossary)

### Community 15 - "CircleLayout Component Tree"
Cohesion: 0.25
Nodes (8): Bg[] (background sectors), CircleLayoutArray, CircleLayoutComponent (wrapper), CircleLayoutContent, CircleLayoutContext, useAnimatedSectorPath, useAnimation, useCombinedAnimation

### Community 16 - "Circle Geometry & Domain Glossary"
Cohesion: 0.25
Nodes (8): src/utils/circle.ts, animation gap, center component, circle layout (glossary term), Domain Context - react-native-circle-layout, polar-to-Cartesian, start angle, sweep angle

### Community 17 - "Root Package Scripts"
Cohesion: 0.25
Nodes (8): scripts, clean, example, lint, prepare, release, test, typecheck

### Community 18 - "README Public API Docs"
Cohesion: 0.25
Nodes (8): AnimationCombinationType (enum, README), AnimationConfig (type, README), AnimationProps (type), AnimationType (enum, README), BgConfig (type, README), CircleLayout (exported component), CircleLayoutProps (type), react-native-circle-layout README

### Community 19 - "Project Agent Instructions"
Cohesion: 0.29
Nodes (7): react-native-circle-layout (project), CLAUDE.md project instructions, Issue Template Config, Copilot Instructions, graphify query/path/explain workflow, gh CLI, Issue tracker: GitHub

### Community 20 - "Imperative Ref API (ADR-0001)"
Cohesion: 0.47
Nodes (6): ADR-0001: Imperative ref API for show/hide, entry animation, exit animation, CircleLayoutRef (type), hideComponents(), showComponents()

### Community 21 - "Metro Config"
Cohesion: 0.33
Nodes (5): config, { getDefaultConfig }, path, root, { withMetroConfig }

### Community 22 - "Prettier Config"
Cohesion: 0.33
Nodes (6): prettier, quoteProps, singleQuote, tabWidth, trailingComma, useTabs

### Community 23 - "Issue Triage Labels"
Cohesion: 0.33
Nodes (6): needs-info label, needs-triage label, ready-for-agent label, ready-for-human label, Triage Labels mapping, wontfix label

### Community 24 - "create-react-native-library Config"
Cohesion: 0.40
Nodes (5): create-react-native-library, languages, tools, type, version

### Community 25 - "Package Exports Map"
Cohesion: 0.40
Nodes (5): default, exports, ./package.json, source, types

### Community 26 - "Jest Config"
Cohesion: 0.40
Nodes (5): jest, modulePathIgnorePatterns, preset, setupFilesAfterEnv, transformIgnorePatterns

### Community 27 - "Peer Dependencies"
Cohesion: 0.50
Nodes (4): peerDependencies, react, react-native, react-native-svg

### Community 28 - "react-native-builder-bob Config"
Cohesion: 0.50
Nodes (4): react-native-builder-bob, output, source, targets

### Community 30 - "npm Publish Config"
Cohesion: 0.67
Nodes (3): publishConfig, access, registry

### Community 31 - "Repository Metadata"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **257 isolated node(s):** `flatCompat`, `name`, `slug`, `version`, `orientation` (+252 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `ESLint / Lint Tooling Deps` to `Package Metadata`, `Turborepo Pipeline Config`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `CircleLayoutRef` connect `Nested Ring Menu / Playground` to `Animation Driver Layer`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Domain Context - react-native-circle-layout` connect `Circle Geometry & Domain Glossary` to `CI Workflows & Contributor Docs`, `TotalParts Invariant Docs`, `Public API Types`, `Project Agent Instructions`, `Imperative Ref API (ADR-0001)`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `flatCompat`, `name`, `slug` to the rest of the system?**
  _257 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Animation Driver Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.08234126984126984 - nodes in this community are weakly interconnected._
- **Should `Design System Atoms (Button)` be split into smaller, more focused modules?**
  _Cohesion score 0.07673469387755102 - nodes in this community are weakly interconnected._
- **Should `ESLint / Lint Tooling Deps` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._