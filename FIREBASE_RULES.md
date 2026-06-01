# Firebase RTDB Rules

This project uses Firebase Realtime Database for four paths:

- `users/{uid}`
- `leaderboard/{type}/{uid}`
- `chat/{messageId}`
- `matchmaking/{slotId}`

The ready-to-paste rules are stored in:

- `firebase-rtdb.rules.json`

The Firebase CLI project config is stored in:

- `firebase.json`
- `.firebaserc`

## What these rules do

- deny everything by default
- allow each user to read and write only `users/{uid}` for their own UID
- keep leaderboard reads public
- allow leaderboard writes only for authenticated users writing their own UID
- keep global chat readable, but require authentication for posting
- restrict matchmaking reads and writes to authenticated users
- add indexes for `leaderboard.score`, `chat.ts`, and `matchmaking.ts`

## How to apply

### Firebase CLI

From the project root:

```bash
npx firebase-tools deploy --only database
```

### Firebase Console

1. Open Firebase Console.
2. Go to `Realtime Database`.
3. Open the `Rules` tab.
4. Replace the current test rules with the contents of `firebase-rtdb.rules.json`.
5. Click `Publish`.

## Important behavior change

After these rules are published, global Firebase leaderboard writes become
authenticated-only. Guests still keep the local fallback leaderboard in
browser storage, but they won't be able to write to the shared Firebase
leaderboard until they sign in with Google.
