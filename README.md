# ApexGPT

## About the Project

ApexGPT is a ChatGPT-style web app I built with the MERN stack. You sign up, open a chat, and type a prompt. In text mode it gives you a written reply from an AI model. In image mode it generates an image from your prompt.

I built it to practice full-stack development: user login, saving chat history, calling third-party AI APIs, and taking payments. The app uses a credit system. Each user starts with 20 credits, a text reply costs 1 credit, and an image costs 2. When credits run out, the user can buy more through Stripe.

The React frontend has a sidebar with the chat list, a chat window, a credits page, and a community page for images other users chose to publish. The Express backend handles authentication, talks to MongoDB, and calls the AI services.

## Features

- Register and login with email and password (passwords hashed with bcrypt, JWT auth)
- Create, view, search, and delete chats from the sidebar
- Text chat with AI replies rendered as Markdown, with code highlighting (Prism)
- Image generation from a text prompt
- Option to publish a generated image to a public Community gallery
- Credit system: 20 free credits on signup, 1 credit per text reply, 2 per image
- Buy credit plans (Basic, Pro, Premium) through Stripe Checkout
- Stripe webhook that adds credits after a successful payment
- Light and dark theme, saved in localStorage
- Responsive layout with a mobile sidebar menu

## Tech Stack

**Frontend**
- React 19 (Vite)
- React Router
- Tailwind CSS 4

**Backend**
- Node.js
- Express 5

**Database**
- MongoDB with Mongoose

**APIs / AI services**
- Google Gemini API (text), used through the OpenAI SDK
- Pollinations (image generation)
- ImageKit (image storage)
- Stripe (payments)

**Other libraries**
- axios, react-hot-toast, react-markdown, prismjs, moment
- jsonwebtoken, bcryptjs, cors, dotenv
- svix is listed in the server dependencies, but I couldn't find it used anywhere in the code

## How It Works

**Text:**
User types a prompt → React frontend → `POST /api/message/text` → Express calls Gemini → reply saved in the Chat document in MongoDB → reply sent back and shown in the chat

**Image:**
User types a prompt → `POST /api/message/image` → server fetches an image from Pollinations → uploads it to ImageKit → the ImageKit URL is saved in the chat and returned to the frontend

**Payment:**
User picks a plan → `POST /api/credit/purchase` → server creates a Transaction and a Stripe Checkout session → user pays on Stripe → Stripe calls `/api/stripe` → server adds credits to the user

The frontend keeps the JWT in localStorage and sends it in the `Authorization` header on protected requests.

## Project Structure

```
ApexGPT-main/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # ChatBox, Message, Sidebar
│       ├── pages/           # Login, Credits, Community, Loading
│       ├── context/         # AppContext (global state, axios setup)
│       └── assets/          # icons, images, assets.js
└── server/                  # Express backend
    ├── configs/             # db, openai (Gemini), imageKit
    ├── controllers/         # user, chat, message, credit, webhooks
    ├── middlewares/         # auth.js (JWT check)
    ├── models/              # user, Chat, Transaction
    ├── routes/
    └── server.js
```

## Getting Started

You need Node.js, a MongoDB database, and accounts for Gemini, ImageKit, and Stripe.

1. Clone the repo and go into it.

2. Set up the backend:
   ```bash
   cd server
   npm install
   ```
   Create a `server/.env` file (see the next section), then run:
   ```bash
   npm run server    # uses nodemon
   # or
   npm start
   ```
   The server runs on port 3000 unless `PORT` is set.

3. Set up the frontend in a second terminal:
   ```bash
   cd client
   npm install
   ```
   Create `client/.env`, then run:
   ```bash
   npm run dev
   ```

4. Open the URL that Vite prints in the terminal.

For payments to work locally, Stripe needs to send webhooks to `/api/stripe` on your server, for example with the Stripe CLI.

## Environment Variables

**server/.env**
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_api_key_here
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PORT=3000
```
`PORT` is optional.

**client/.env**
```
VITE_SERVER_URL=http://localhost:3000
```

## API / Backend

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/user/register` | Create an account, returns a JWT |
| POST | `/api/user/login` | Login, returns a JWT |
| GET | `/api/user/data` | Get the logged-in user's data (auth) |
| GET | `/api/user/published-images` | Get all published images |
| POST | `/api/chat/create` | Create a new chat (auth) |
| GET | `/api/chat/get` | Get all chats of the user (auth) |
| POST | `/api/chat/delete` | Delete a chat (auth) |
| POST | `/api/message/text` | Send a prompt and get a text reply (auth) |
| POST | `/api/message/image` | Generate an image from a prompt (auth) |
| GET | `/api/credit/plan` | List the credit plans |
| POST | `/api/credit/purchase` | Start a Stripe Checkout session (auth) |
| POST | `/api/stripe` | Stripe webhook, adds credits on payment |

## AI / API Integration

For text, `server/configs/openai.js` creates an OpenAI SDK client with the base URL set to Google's Gemini OpenAI-compatible endpoint. It uses `GEMINI_API_KEY`, and the message controller calls the `gemini-2.5-flash` model.

For images, the server requests `https://image.pollinations.ai/prompt/<prompt>`, converts the result to base64, and uploads it to ImageKit under the `/quickgpt` folder. The ImageKit URL is what gets stored and shown.

Stripe is used only for one-time payments (`mode: "payment"`, in USD).

## Database

MongoDB (through Mongoose) has three collections:

- **User**: name, email, hashed password, credits
- **Chat**: user id, chat name, and an array of messages (role, content, timestamp, whether it's an image, whether it's published)
- **Transaction**: user, plan, amount, credits, and whether it has been paid

Generated images are not stored in the database itself. Only their ImageKit URLs are saved inside chat messages.

## Screenshots / Demo

There are no screenshots or a deployed link in the repository yet. The repo does have `vercel.json` files in both `client` and `server`, so I set it up with Vercel in mind, but I haven't added a live URL.

## Limitations

- Only the latest prompt is sent to Gemini. Earlier messages in the chat are not, so the model has no memory of the conversation.
- Chats always stay named "New Chat". There is no auto-naming.
- The text route doesn't check credits before calling the AI, so a user with 0 credits can still get replies.
- `/api/chat/delete` deletes by chat id without checking that the chat belongs to the logged-in user.
- The auth middleware prints the token and `JWT_SECRET` to the console. This should be removed before any real deployment.
- Replies come back all at once. There is no streaming.
- The community page tries to show the author's name, but the API only returns image URLs, so it shows "Anonymous".
- The plan descriptions on the Credits page (support levels, "pro models", and so on) are just text. Nothing in the code differs between plans except the credit amount.
- Stripe metadata still uses the app id `quickgpt`, and `server/test.js` and `test2.js` are leftover DNS test files.
- No automated tests.

## Future Improvements

- Send previous messages to the model so chats have context
- Stream text replies as they are generated
- Check credits before text requests, and verify chat ownership on delete
- Return the author's name in the community API and add a way to unpublish an image
- Auto-name chats from the first message, and clean up debug logs and unused files

## Author

**Harsh Chandel**
GitHub: [harshchandel393-ai](https://github.com/harshchandel393-ai)
