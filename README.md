# Color Prediction Game API

This is the backend server for a Color Prediction Game. It manages user authentication, game logic, betting, and payouts.

## Features

-   User registration and OTP-based login.
-   JWT-based authentication for secure endpoints.
-   Real-time game engine with 1-minute game slots.
-   Users can place bets on numbers (0-9) in the active game.
-   Automatic winner determination and payout calculation.
-   Separate wallets for deposits (`topUpBalance`) and winnings (`winningWallet`).
-   API to view game history, bet history, and user profile.

## Folder Structure

```
d:\ColorPredictionBE\
├───.env
├───.gitignore
├───ColorPredictionGame.postman_collection.json
├───FRONTEND_GUIDE.md
├───game-engine.js
├───package-lock.json
├───package.json
├───seed.js
├───server.js
├───config\
├───controllers\
│   ├───authController.js
│   ├───gameController.js
│   └───userController.js
├───middleware\
│   └───authMiddleware.js
├───models\
│   ├───Bet.js
│   ├───Recharge.js
│   ├───Slot.js
│   └───User.js
├───node_modules\...
└───routes\
    ├───authRoutes.js
    ├───gameRoutes.js
    └───userRoutes.js
```

## Technologies Used

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web framework for Node.js.
-   **MongoDB**: NoSQL database for storing data.
-   **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
-   **JSON Web Token (JWT)**: For securing API endpoints.
-   **dotenv**: For managing environment variables.

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ColorPredictionBE
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add the following environment variables:
    ```env
    PORT=3000
    MONGODB_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    Or for development with automatic restarts:
    ```bash
    nodemon server.js
    ```

## API Endpoints

All endpoints are prefixed with `/color/api/user`.

---

### Auth Routes

-   **`POST /login/otp`**
    -   Sends an OTP to a registered user for login.
    -   **Request Body**: `{ "mobile": "1234567890" }`

-   **`PUT /verify/otp`**
    -   Verifies the OTP to log in and returns a JWT token.
    -   **Request Body**: `{ "mobile": "1234567890", "otp": "1234" }`

-   **`POST /send/otp`**
    -   Registers a new user and sends an OTP for verification.
    -   **Request Body**: `{ "name": "John Doe", "email": "john@example.com", "mobile": "1234567890", "countryCode": "+1" }`

-   **`PUT /logout`**
    -   Logs out the current user.
    -   **Authentication Required**.

---

### Game Routes

**Authentication is required for all game routes.**

-   **`GET /slot/list`**
    -   Gets a list of all game slots.

-   **`GET /slot/current`**
    -   Gets the details of the current active game slot.

-   **`POST /bet`**
    -   Places a bet on the current active slot.
    -   **Request Body**: `{ "slotId": "...", "number": 5, "amount": 100 }`

-   **`GET /bet/list`**
    -   Gets a list of the current user's bets.

---

### User Routes

**Authentication is required for all user routes.**

-   **`GET /profile`**
    -   Gets the current user's profile information, including wallet balances.

-   **`POST /recharge/add`**
    -   Adds funds to the user's `topUpBalance`.
    -   **Request Body**: `{ "amount": 500 }`

-   **`GET /recharge/list`**
    -   Gets the user's recharge transaction history.
