# Graph Report - issue-51-51ce39  (2026-08-14)

## Corpus Check
- 83 files · ~47,706 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 618 nodes · 867 edges · 60 communities (42 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8aef9540`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Core Layout & Animation|Core Layout & Animation]]
- [[_COMMUNITY_Design System Components|Design System Components]]
- [[_COMMUNITY_Dev Dependencies & Turbo|Dev Dependencies & Turbo]]
- [[_COMMUNITY_Example App Dependencies|Example App Dependencies]]
- [[_COMMUNITY_Expo App Config|Expo App Config]]
- [[_COMMUNITY_Circle Math & Geometry|Circle Math & Geometry]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_CICD & Workflows|CI/CD & Workflows]]
- [[_COMMUNITY_Example TypeScript Config|Example TypeScript Config]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_Agent Documentation|Agent Documentation]]
- [[_COMMUNITY_Release Configuration|Release Configuration]]
- [[_COMMUNITY_Architecture Decisions|Architecture Decisions]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Metro Bundler Config|Metro Bundler Config]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Package Scripts|Package Scripts]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
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
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 26 edges
2. `compilerOptions` - 16 edges
3. `expo` - 15 edges
4. `rnAnimatedDriver` - 13 edges
5. `CircleLayoutContext` - 11 edges
6. `AnimationDriver` - 11 edges
7. `Domain Context - react-native-circle-layout` - 11 edges
8. `CircleLayoutRef` - 10 edges
9. `Props` - 10 edges
10. `Theme` - 9 edges

## Surprising Connections (you probably didn't know these)
- `ADR-0002: totalParts invariant for partial arcs` --conceptually_related_to--> `total parts`  [INFERRED]
  docs/adr/0002-totalparts-invariant-for-partial-arcs.md → CONTEXT.md
- `example package` --conceptually_related_to--> `example app`  [INFERRED]
  pnpm-workspace.yaml → CONTRIBUTING.md
- `pnpm Workspace Config` --conceptually_related_to--> `CircleLayout Component`  [INFERRED]
  pnpm-workspace.yaml → AGENTS.md
- `ADR-0001: Imperative ref API for show/hide` --references--> `CircleLayoutRef (type)`  [INFERRED]
  docs/adr/0001-imperative-ref-api.md → README.md
- `hideComponents()` --conceptually_related_to--> `ADR-0001: Imperative ref API for show/hide`  [INFERRED]
  README.md → docs/adr/0001-imperative-ref-api.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CircleLayout Component Hierarchy** — agents_circlelayout, agents_circlelayoutprovider, agents_circlelayoutcontext, agents_circlelayoutcontent, agents_circlelayoutcomponent, agents_bg [EXTRACTED 1.00]
- **Animation Hook Pipeline** — agents_circlelayoutcomponent, agents_useanimation, agents_usecombinedanimation, agents_useanimatedsectorpath [EXTRACTED 1.00]
- **Agent Skills System** — agents_issue_tracker, agents_triage_labels, agents_domain_docs, agents_github_issues [EXTRACTED 1.00]

## Communities (60 total, 18 thin omitted)

### Community 1 - "Core Layout & Animation"
Cohesion: 0.06
Nodes (50): rnAnimatedDriver, RNAnimationConfig, AnimatedNode, AnimationDriver, DriverComposite, DriverConfig, DriverValue, Icon (+42 more)

### Community 2 - "Design System Components"
Cohesion: 0.06
Nodes (40): Action, colorOptions, initialState, State, Button, ButtonComponent(), ButtonComponentProps, ButtonProps (+32 more)

### Community 3 - "Dev Dependencies & Turbo"
Cohesion: 0.06
Nodes (33): devDependencies, commitlint, @commitlint/config-conventional, del-cli, eslint, @eslint-community/eslint-plugin-eslint-comments, @eslint/compat, eslint-config-prettier (+25 more)

### Community 4 - "Example App Dependencies"
Cohesion: 0.06
Nodes (34): dependencies, expo, @expo/metro-runtime, expo-router, expo-splash-screen, expo-status-bar, expo-system-ui, react (+26 more)

### Community 5 - "Expo App Config"
Cohesion: 0.06
Nodes (30): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, projectId (+22 more)

### Community 6 - "Circle Math & Geometry"
Cohesion: 0.14
Nodes (18): center, UseAnimatedSectorPath, CirclePosition, CirclePositionsConfig, computePosition(), useCirclePosition(), useCirclePositions(), CirclePathProps (+10 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.07
Nodes (28): compilerOptions, allowUnreachableCode, allowUnusedLabels, customConditions, esModuleInterop, forceConsistentCasingInFileNames, jsx, lib (+20 more)

### Community 8 - "CI/CD & Workflows"
Cohesion: 0.13
Nodes (18): build-web job, CI Workflow, Contributing Guide, Conventional Commits specification, example app, pnpm workspaces, release-it, build job (deploy-pages) (+10 more)

### Community 9 - "Example TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowUnreachableCode, allowUnusedLabels, forceConsistentCasingInFileNames, noFallthroughCasesInSwitch, noImplicitReturns, noImplicitUseStrict, noStrictGenericChecks (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (11): src/utils/circle.ts, animation gap, center component, circle layout (glossary term), Domain Context - react-native-circle-layout, polar-to-Cartesian, start angle, sweep angle (+3 more)

### Community 11 - "Package Metadata"
Cohesion: 0.08
Nodes (25): AnimationCombinationType, AnimationConfig, `animationProps`, AnimationProps, AnimationType, Authors, `bgConfig`, BgConfig (+17 more)

### Community 12 - "Agent Documentation"
Cohesion: 0.33
Nodes (6): needs-info label, needs-triage label, ready-for-agent label, ready-for-human label, Triage Labels mapping, wontfix label

### Community 13 - "Release Configuration"
Cohesion: 0.13
Nodes (14): author, bugs, url, commitlint, extends, description, files, homepage (+6 more)

### Community 14 - "Architecture Decisions"
Cohesion: 0.20
Nodes (11): ADR-0001: Imperative ref API for show/hide, Consequences, Decision, Rationale, entry animation, exit animation, CircleLayout (exported component), CircleLayoutRef (type) (+3 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (10): Bg (Background Sector), Bg[] (background sectors), CircleLayoutArray, CircleLayoutComponent (wrapper), CircleLayoutContent, CircleLayoutContext, useAnimatedSectorPath, useAnimation (+2 more)

### Community 16 - "Metro Bundler Config"
Cohesion: 0.33
Nodes (5): config, { getDefaultConfig }, path, root, { withMetroConfig }

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (10): ADR-0002: totalParts invariant for partial arcs, Consequences, Decision, Rationale, ADR 0002 - totalParts Invariant for Partial Arcs, CircleLayoutProvider, React Context for Shared Props, totalParts invariant (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.25
Nodes (8): AnimationCombinationType, AnimationConfig, AnimationType, BgConfig, CircleLayoutProps, CircleLayoutRef, src/index.tsx (public API), animation combination type (glossary)

### Community 19 - "Package Scripts"
Cohesion: 0.15
Nodes (12): 1. Correction, 2. Warning, 3. Temporary Ban, 4. Permanent Ban, Attribution, Contributor Covenant Code of Conduct, Enforcement, Enforcement Guidelines (+4 more)

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (6): CircleLayout Component, Polar-to-Cartesian Conversion, Public API Surface, useAnimation Hook, useCombinedAnimation Hook, pnpm Workspace Config

### Community 21 - "Community 21"
Cohesion: 0.33
Nodes (6): AnimationCombinationType (enum, README), AnimationConfig (type, README), AnimationProps (type), AnimationType (enum, README), BgConfig (type, README), CircleLayoutProps (type)

### Community 22 - "Community 22"
Cohesion: 0.15
Nodes (12): env, inputs, outputs, env, inputs, outputs, globalDependencies, globalEnv (+4 more)

### Community 23 - "Grid-to-Circle Morph"
Cohesion: 0.17
Nodes (12): commitMessage, tagName, release, publish, @release-it/conventional-changelog, name, release-it, preset (+4 more)

### Community 24 - "Agent Issue System"
Cohesion: 0.33
Nodes (5): Before exploring, read these, Domain Docs, File structure, Flag ADR conflicts, Use the glossary's vocabulary

### Community 25 - "Prettier Config"
Cohesion: 0.22
Nodes (8): Agent skills, Architecture, Commands, Domain docs, graphify, Issue tracker, react-native-circle-layout, Triage labels

### Community 27 - "Library Builder Config"
Cohesion: 0.25
Nodes (8): scripts, clean, example, lint, prepare, release, test, typecheck

### Community 28 - "Package Exports"
Cohesion: 0.29
Nodes (6): Commit message convention, Contributing, Development workflow, Publishing to npm, Scripts, Sending a pull request

### Community 29 - "Jest Config"
Cohesion: 0.33
Nodes (5): Conventions, Issue tracker: GitHub, When a skill says "fetch the relevant ticket", When a skill says "publish to the issue tracker", gh CLI

### Community 30 - "Peer Dependencies"
Cohesion: 0.33
Nodes (5): Domain Context — react-native-circle-layout, Example app runtime, Glossary, Preferred terminology, What this library does NOT do

### Community 31 - "Builder Bob Config"
Cohesion: 0.33
Nodes (6): jest, modulePathIgnorePatterns, preset, setupFilesAfterEnv, testPathIgnorePatterns, transformIgnorePatterns

### Community 32 - "Publish Config"
Cohesion: 0.33
Nodes (6): prettier, quoteProps, singleQuote, tabWidth, trailingComma, useTabs

### Community 33 - "Repository Info"
Cohesion: 0.50
Nodes (5): gh CLI for Issue Operations, GitHub Issues (sonalip9/react-native-circle-layout), Issue Tracker Agent Skill, Triage Labels, AGENTS.md - Project Documentation

### Community 34 - "Build TypeScript Config"
Cohesion: 0.40
Nodes (5): create-react-native-library, languages, tools, type, version

### Community 51 - "Community 51"
Cohesion: 0.40
Nodes (5): default, exports, ./package.json, source, types

### Community 52 - "Community 52"
Cohesion: 0.50
Nodes (4): peerDependencies, react, react-native, react-native-svg

### Community 53 - "Community 53"
Cohesion: 0.50
Nodes (4): react-native-builder-bob, output, source, targets

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (3): publishConfig, access, registry

### Community 55 - "Community 55"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **353 isolated node(s):** `colorOptions`, `State`, `initialState`, `Action`, `baseContext` (+348 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies & Turbo` to `Release Configuration`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `CircleLayoutRef` connect `Core Layout & Animation` to `Design System Components`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `colorOptions`, `State`, `initialState` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Layout & Animation` be split into smaller, more focused modules?**
  _Cohesion score 0.060073260073260075 - nodes in this community are weakly interconnected._
- **Should `Design System Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05961538461538462 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies & Turbo` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Example App Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._