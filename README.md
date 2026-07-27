# FORUM

AI-moderated debate platform on GenLayer Bradbury Testnet.

Submit arguments on controversial topics. GenLayer validators run AI judgment under consensus to evaluate argument quality. Build your deliberation reputation on-chain.

---

## Overview

FORUM is a frontend application designed for the GenLayer ecosystem, where the Intelligent Contract acts as the backend: state, business logic, and AI judgment all live inside the contract under validator consensus. There are no servers, no databases, and no API keys. The frontend is a pure static SPA that communicates directly with the chain through genlayer-js.

The platform enables users to submit positions on debated topics. An AI model, running under the consensus of multiple validators, scores each argument on reasoning quality, evidence, and relevance. The decision field is compared exactly across validators; the prose is free. This ensures that the on-chain verdict is deterministic and tamper-resistant.

This repository contains the frontend only. To deploy the full dApp with a live contract, use the GenLayer companion skills (write-contract, genvm-lint, genlayer-cli) to author, validate, and deploy the Intelligent Contract, then configure the contract address in the environment.

## Art Direction

**Swiss grid, light** - Paper background (#f4f2ec), single cobalt accent (#2945c9), tight grotesque type, exposed grid rules, zero gradients, zero rounded corners. Typography and spacing do all the work.

- Display font: Space Grotesk
- Body font: Inter
- Monospace: IBM Plex Mono

## Tech Stack

- **Next.js 14** (App Router, static export)
- **TypeScript** (strict mode)
- **Tailwind CSS** (custom design tokens)
- **Framer Motion** (choreographed animations)
- **lucide-react** (icon system)
- **genlayer-js** (chain communication)

## Project Structure

```
forum-genlayer/
  frontend/
    src/
      app/              layout.tsx, page.tsx, globals.css
      components/       Header, Hero, HowItWorks, EmptyState, Footer,
                        Toast, ConfirmDialog, ConsensusStage
      lib/              contract.ts (config), format.ts (atto math, addresses)
      hooks/            useWallet.ts
    public/             .nojekyll
    next.config.js      static export config
    tailwind.config.ts  design tokens
    tsconfig.json
    package.json
  scripts/
    no-emoji.js         emoji gate check
  .env.example
  .gitignore
  README.md
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/<username>/forum-genlayer.git
cd forum-genlayer/frontend

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Configuration

Copy `.env.example` to `.env.local` and fill in the values:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...   # deployed contract address
NEXT_PUBLIC_CONTRACT_DEPLOY_TX=0x... # deployment transaction hash
```

Without a configured contract address, the frontend renders the hero, how-it-works, and features sections with a clear message that no contract is connected.

## Connecting a Contract

1. Deploy the Intelligent Contract using the GenLayer CLI:
   ```bash
   genlayer deploy --contract contracts/contract.py
   ```
2. Verify a read works:
   ```bash
   genlayer call <contract-address> get_stats
   ```
3. Set the address in `.env.local` and rebuild:
   ```bash
   npm run build
   ```

## Deploy to GitHub Pages

```bash
cd frontend
npm run deploy
```

This builds the static export to `out/` and publishes it to the `gh-pages` branch via the gh-pages package. The `--dotfiles` flag ensures `.nojekyll` is included so GitHub Pages serves the `_next/` directory correctly.

## Network

- **Network:** GenLayer Bradbury Testnet
- **Chain ID:** 4221
- **Faucet:** https://testnet-faucet.genlayer.foundation/
- **Explorer:** https://explorer-bradbury.genlayer.com

## Architecture

```
+------------------+        +------------------------+
|   Frontend       |  RPC   |  GenLayer Bradbury     |
|   (Static SPA)   | -----> |  Intelligent Contract  |
|                  | <----- |  (AI + Consensus)      |
+------------------+        +------------------------+

Frontend owns:
  - UI rendering and animations
  - Wallet connection (MetaMask)
  - Transaction polling (8s intervals)
  - Derived statistics

Contract owns:
  - All authoritative state
  - AI judgment (gl.nondet.exec_prompt)
  - Validator consensus on decisions
  - Business logic invariants
```

## Key Design Decisions

- **No emojis anywhere.** Icons come from lucide-react inside designed containers.
- **Zero rounded corners.** The Swiss grid identity uses sharp edges throughout.
- **Typography-driven design.** Space Grotesk display + Inter body + IBM Plex Mono for data.
- **Animated crosshair grid hero.** Canvas-based, requestAnimationFrame, devicePixelRatio-aware, pauses when tab is hidden.
- **Consensus as theater.** The ConsensusStage component shows the real validator lifecycle with leader draft previews.
- **Toast system.** Bottom-right stacking toasts with Framer Motion AnimatePresence.
- **Accessibility.** Semantic landmarks, visible keyboard focus, aria-labels, prefers-reduced-motion respected.

## License

MIT
