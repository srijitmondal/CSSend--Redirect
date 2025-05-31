# ElectraGuard - Blockchain-Based end-to-end Secure Voting System

ElectraGuard is a blockchain-based secure voting system that ensures transparency, security, and immutability in elections. The system includes interfaces for both voters and election organizers, with secure authentication, real-time vote tallying, and a tamper-proof voting ledger.

## Features

- ✅ **Secure voter authentication**
- ✅ **Election creation and management**
- ✅ **Real-time vote tallying**
- ✅ **Tamper-proof voting ledger**
- ✅ **Role-based access control**
- ✅ **Vote encryption**
- ✅ **Audit log for transparency**
- ✅ **Blockchain transaction tracking**

----

## Getting Started

Follow these steps to run ElectraGuard on your Windows computer:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.0 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A modern web browser (Firefox, Edge, Chrome, etc.)
- Ganneche

### Installation Steps

1. **Clone the repository**
   ```sh
   git clone https://github.com/srijitmondal/electrasecure-votechain.git
   cd electrasecure-votechain
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Download Ganache and start it by clicking Quick Start**
   ```sh
   (https://github.com/trufflesuite/ganache-ui/releases/download/v2.7.1/Ganache-2.7.1-win-x64.appx)
   ```   

4. **Start the development server**
   ```sh
   npm run dev
   ```

5. **Access the application**
   Open your web browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## Demo Accounts

For demo purposes, the system is set with two pre-configured accounts:

### 🔹 Admin Account
- **Email:** admin@example.com
- **Password:** password

### 🔹 Voter Account
- **Email:** voter@example.com
- **Password:** password

---

## Using ElectraGuard

### 🎯 For Voters
1. Register with your email or log in if you already have an account
2. Browse available elections
3. View candidate details
4. Cast your vote securely
5. View real-time results
6. Verify your vote on the blockchain

### 🎯 For Election Administrators
1. Log in with admin credentials
2. Create new elections
3. Add candidates
4. Set election duration
5. Monitor voting progress
6. View detailed results
7. Export election data

---

## System Architecture

ElectraGuard uses a simulated blockchain system (for demonstration purposes) with the following components:

- 🚀 **React frontend with TypeScript**
- 🔗 **Blockchain interaction logic**
- 📝 **Smart contract using Solidity**
- 🔒 **User authentication system**
- 📊 **Real-time vote counting**

---

## Technology Stack

- 🌐 **React**
- 📝 **TypeScript**
- 🎨 **Tailwind CSS**
- ⛓️ **Ethereum (Solidity)**
- 🔗 **web3.js for blockchain interactions**
- 🏗️ **shadcn/ui components**
- 🔐 **Authentication system**
- ⛓️ **Blockchain interaction simulation**

---
## Screenshots

_(You can view screenshots of key pages below to get a visual guide of the system)_

- **Start Screen** 🖼️ ![Start Screen](https://i.postimg.cc/NLhC8HTp/Screenshot-2025-04-02-130432.png)
- **Admin Dashboard** 🖼️ ![Admin Dashboard](https://i.postimg.cc/ryd8J2xr/Screenshot-2025-04-02-130704.png)
- **Voter Dashboard** 🖼️ ![Voter Dashboard](https://i.postimg.cc/9M6sbKHd/Screenshot-2025-04-02-130718.png)


---

## Next Steps

In a production environment, ElectraGuard would be integrated with:

- 🔗 **web3.js for blockchain interactions**
- 🔐 **Metamask or similar wallet integration**
- 📝 **Smart contracts for vote recording**
- 📂 **IPFS for distributed storage**

---

## License

📜 **MIT**
