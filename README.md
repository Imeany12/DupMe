## DupMe Battleship Game
DupMe is a simple, interactive socket programming-based client-server battleship game designed for local or networked multiplayer gameplay. The game challenges players to follow and recreate piano patterns under time pressure. It showcases the implementation of real-time communication between multiple clients via a centralized server.

## 🕹️ Game Features
- Multiplayer gameplay between two or more computers, with authentication through third-party services.
- Real-time pattern creation and replication under time constraints.
- Server-client architecture using socket programming.
- Player nickname entry and score tracking.
- Game ends after 2 rounds (4 turns) with a winner announcement.
- Server GUI displays the number of online players and offers a reset function.

## 🧩 Gameplay Rules
- The server randomizes who plays first.
- The first player has 10 seconds to create a button pattern.
- The second player has 20 seconds to replicate it.
- Correct replication scores points based on right steps in correct order.
- The game alternates turns and ends after 4 total turns.
- The player with the highest score is announced the winner.

## ⚙️ Installation
Make sure you have pnpm installed. If not, install it from pnpm.io.

Then run:

```bash
Copy
Edit
pnpm install
pnpm run
```
This will start both the server and the client (depending on your script setup). Make sure to run the client on at least two separate machines or terminals to test multiplayer features.

## 🖥️ Architecture Overview
Server: Maintains a list of connected clients, tracks scores, handles turn logic, and provides reset functionality.
Client: Connects to the server, allows nickname entry, displays countdowns, and lets players input or follow button patterns.

## 📦 Requirements
Server IP and port are hardcoded in the client source code. Players do not need to enter IP addresses manually.
Ensure both clients and the server are on the same network (or use services like Hamachi for remote connection).
