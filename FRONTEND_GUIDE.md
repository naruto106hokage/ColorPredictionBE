# Frontend Guide for Color Prediction Game

This document provides frontend developers with all the necessary information to interact with the Color Prediction Game backend.

## Game Overview

The game is a simple color/number prediction game. A new game round starts every minute. Users can place bets on numbers from 0 to 9 within that 1-minute window. At the end of the minute, a winning number is announced. Users who bet on the winning number receive a payout of 3 times their bet amount.

## Game Flow

1.  **Authentication**: The user must be logged in to play. See the Authentication endpoints below.
2.  **Get Active Game**: The frontend should fetch the list of game slots. The slot with the `active` status is the current game.
3.  **Display Game Info**: Display the active game slot information, including the `slotName` and the time remaining (`endTime` - current time).
4.  **Place Bets**: Users can place bets on any number from 0 to 9. The frontend will use the `POST /api/game/bet` endpoint.
5.  **Game End**: When the timer reaches zero, the `active` slot will change its status to `processing` and then `completed`. The frontend should poll the `GET /api/game/slot/list` endpoint to see this change and discover the `winningNumber`.
6.  **Show Results**: Once the slot is `completed`, the `winningNumber` will be available in the slot object. The frontend can display this to the user.
7.  **Check Winnings**: The frontend can use the `GET /api/game/bet/list` endpoint to get the status of the user's bets for that slot (`win` or `loss`). The user's total balance will be automatically updated.
8.  **New Game**: A new game slot with `active` status will become available immediately. The cycle repeats.

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

These endpoints are used for user registration and login.

#### `POST /user/signup`

*   **Description**: Registers a new user.
*   **Request Body**:
    ```json
    {
        "countryCode": "+91",
        "mobile": "1234567890",
        "name": "John Doe"
    }
    ```
*   **Response**: An OTP will be generated and logged to the backend console for development purposes. The user will need to use this OTP to log in for the first time.

#### `POST /user/login/otp`

*   **Description**: Logs a user in using their mobile number and an OTP.
*   **Request Body**:
    ```json
    {
        "countryCode": "+91",
        "mobile": "1234567890"
    }
    ```
*   **Response**:
    *   **Success**:
        ```json
        {
            "meta": {
                "status": true,
                "msg": "OTP sent successfully."
            }
        }
        ```
    *   An OTP will be logged to the backend console. The frontend needs to have a way to input this OTP.
    *   After submitting the OTP:
        ```json
        {
            "meta": {
                "status": true,
                "msg": "Login successful"
            },
            "data": {
                "token": "your_jwt_token_here"
            }
        }
        ```

### Game API

All game-related endpoints require an `Authorization` header with a Bearer token.

`Authorization: Bearer <your_jwt_token_here>`

#### `GET /game/slot/list`

*   **Description**: Retrieves the list of all game slots. The frontend should look for the slot with `status: 'active'`.
*   **Response**:
    ```json
    {
        "meta": {
            "status": true,
            "msg": "Slot list retrieved"
        },
        "data": [
            {
                "_id": "632c...e",
                "slotNumber": "1",
                "slotName": "Game #1",
                "startTime": 1663867390000,
                "endTime": 1663867450000,
                "status": "completed",
                "winningNumber": 5,
                "bets": [...]
            },
            {
                "_id": "632c...f",
                "slotNumber": "2",
                "slotName": "Game #2",
                "startTime": 1663867450000,
                "endTime": 1663867510000,
                "status": "active",
                "bets": [...]
            }
        ]
    }
    ```

#### `POST /game/bet`

*   **Description**: Places a bet on the active game slot.
*   **Request Body**:
    ```json
    {
        "slotId": "632c...f", // ID of the active slot
        "number": 7, // Number to bet on (0-9)
        "amount": 100 // Amount to bet
    }
    ```
*   **Response**:
    ```json
    {
        "meta": {
            "status": true,
            "msg": "Bet placed successfully"
        }
    }
    ```

#### `GET /game/bet/list`

*   **Description**: Retrieves a list of the current user's bets. Can be filtered by `status` or `slotId`.
*   **Query Parameters**:
    *   `slotId` (optional): Filter bets by a specific game slot.
    *   `status` (optional): Filter bets by status (`win`, `loss`, or `pending`).
*   **Example URL**: `/api/game/bet/list?slotId=632c...f`
*   **Response**:
    ```json
    {
        "meta": {
            "status": true,
            "msg": "Bet list retrieved"
        },
        "data": [
            {
                "_id": "632d...a",
                "userId": "632c...1",
                "slotId": "632c...f",
                "number": 7,
                "amount": 100,
                "status": "loss",
                "winningAmount": 0
            },
            {
                "_id": "632d...b",
                "userId": "632c...1",
                "slotId": "632c...f",
                "number": 5,
                "amount": 50,
                "status": "win",
                "winningAmount": 150
            }
        ]
    }
    ```

## Data Models

### User

```javascript
{
    _id: ObjectId,
    name: String,
    mobile: String,
    countryCode: String,
    topUpBalance: Number, // User's wallet balance
    // ... other fields
}
```

### Slot

```javascript
{
    _id: ObjectId,
    slotNumber: String,
    slotName: String,
    startTime: Number, // Unix timestamp
    endTime: Number, // Unix timestamp
    status: String, // 'active', 'processing', 'completed'
    winningNumber: Number, // 0-9
    bets: [ObjectId] // Array of Bet IDs
}
```

### Bet

```javascript
{
    _id: ObjectId,
    userId: ObjectId,
    slotId: ObjectId,
    number: Number, // The number the user bet on
    amount: Number, // The amount of the bet
    status: String, // 'pending', 'win', 'loss'
    winningAmount: Number // Amount won, 0 if lost
}
```
