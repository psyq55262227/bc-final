# ChAInChat - Frontend

## 🌟 Features

- **AI Chat Interface:** A clean, ChatGPT-like interface for generating content (streaming simulated).
- **Mint as NFT:** Select specific message exchanges and mint them as verified assets on-chain.
- **Wallet Integration:** Seamless connection with MetaMask/RainbowKit (supports Sepolia/Ethereum).
- **Asset Management:** "My Assets" dashboard to view, price, and list/unlist minted conversations.
- **Decentralized Marketplace:** Buy and sell prompt chains using DataToken (DTK).
- **Responsive Design:** Fully optimized layouts for both Desktop and Mobile views.

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Framer Motion (Animations)
- **State Management:** Jotai
- **Web3 Integration:** Wagmi + Viem + RainbowKit
- **Data Fetching:** TanStack Query + Axios
- **Routing:** React Router DOM v7

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Web3 wallet (e.g., MetaMask) installed in your browser.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/psyq55262227/bc-final.git
    cd chainchat-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:5173` to view the application.

## 🧪 Testing & Demo Guide (For Graders)

To facilitate testing without requiring the full backend/blockchain infrastructure to be locally deployed, this frontend is currently configured with **Mock Mode enabled** for API calls, while still allowing real Wallet connectivity for UI states.

**Recommended Testing Flow:**

1.  **Connect Wallet:** Click the "Connect Wallet" button in the top right. You can use any test wallet.
2.  **Chat:**
    - Navigate to "Chat".
    - Type `RWA` to trigger a specific demo response, or type anything else for a generic response.
3.  **Mint:**
    - Click the checkbox circle next to a message to select it.
    - Click "Mint Selected".
    - _Note: In Mock mode, this simulates the IPFS upload and returns a success toast._
4.  **Manage Assets:**
    - Go to "Assets" (or "Rewards" on mobile).
    - You will see your minted items. Click the **Settings (Gear)** icon to set a price.
    - Click **List** to put the item on the market.
5.  **Marketplace:**
    - Go to "Marketplace".
    - You will see listed items.
    - _Note: Smart contract interactions (Buy/List) require a Web3 provider. If you are not on the correct testnet, the UI handles the error gracefully or logs to console._

## 📂 Project Structure

```text
src/
├── api/             # API integration (includes mock.ts for demo)
├── components/      # Reusable UI components
│   ├── chat/        # Chat interface specific components
│   ├── common/      # Buttons, Modals, Wallet connect
│   └── layout/      # Desktop vs Mobile layout wrappers
├── constants/       # Contract addresses and ABIs
├── hooks/           # Custom React hooks (useWallet, etc.)
├── pages/           # Main route pages (Chat, Marketplace, History)
├── state/           # Global state management (Jotai atoms)
└── types/           # TypeScript interfaces
```
