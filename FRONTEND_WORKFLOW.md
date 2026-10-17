# Frontend Workflow

This document explains how the DevSphere frontend starts, displays pages, manages user data, and communicates with the backend. It describes the current code in this project, rather than an idealized design.

## 1. Frontend at a glance

The frontend is a single-page application built with React and Vite. React renders the interface in the browser, React Router changes pages without a full browser reload, and Redux stores data that multiple components need to share.

```text
Browser
  |
  v
index.html
  |
  v
src/main.jsx
  |-- loads global CSS
  |-- mounts React
  v
src/App.jsx
  |-- Redux Provider (shared application state)
  |-- BrowserRouter (URL navigation)
  |-- Routes
  v
Body layout
  |-- Navbar
  |-- selected route page in Outlet
  |-- Footer
```

The browser handles presentation and interaction. The backend remains responsible for authentication, stored user and connection data, API validation, and payment order creation. The frontend sends requests to the backend and renders the responses.

## 2. Startup and application setup

1. Vite serves `index.html`, which contains the root HTML element.
2. `src/main.jsx` finds that element and mounts the React application using `createRoot`. It also loads `index.css` and wraps the app in React `StrictMode`.
3. `src/App.jsx` wraps the application in:
   - Redux `Provider`, connected to the store from `src/utils/appStore.js`.
   - React Router's `BrowserRouter`, which reads the browser URL and selects a matching page.
4. The root route renders `Body`. Its shared layout places the navigation bar above the active child page and the footer below it. React Router's `Outlet` is where that selected child page appears.

Vite is configured with the React and Tailwind CSS plugins. `src/index.css` loads Tailwind CSS and DaisyUI; page-specific styles are also defined in `src/App.css`.

## 3. Pages and navigation

The routes are declared in `src/App.jsx` as children of the root `Body` layout:

| URL | Page | Main purpose |
| --- | --- | --- |
| `/login` | `Login` | Sign in, or switch the same form into account-creation mode |
| `/signup` | `Signup` | Currently a placeholder page |
| `/feed` | `Feed` | Load and show a developer card |
| `/profile` | `Profile` | Show the profile editor |
| `/connections` | `Connections` | List accepted connections and link to chat |
| `/requests` | `Requests` | Review incoming connection requests |
| `/premium` | `Premium` | Present membership options and start checkout |
| `/chat/:targetUserid` | `Chat` | Load and exchange messages with a connection |

`Navbar` uses React Router links for navigation. When a user exists in Redux, it displays the user's name and profile image, plus links to the profile, connections, requests, and premium pages and a logout button.

## 4. Authentication and user session

The authentication flow uses API requests with Axios and `withCredentials: true`. This allows the browser to send the backend's session cookie with requests; the frontend does not read or manage the authentication token directly.

### Sign in

1. The user enters an email address and password on `/login`.
2. `Login` sends them to `POST /login`.
3. On success, the returned user is dispatched through the `addUser` Redux action.
4. The app navigates to `/feed`.
5. On failure, the form displays the error returned by the backend when available.

### Sign up

The `/login` page can switch into account-creation mode, which asks for first name, last name, email, and password and sends them to `POST /signup`. On success it stores the returned user in Redux and navigates to `/profile`. The separate `/signup` route currently renders only a placeholder; it is not the form used by the working sign-up flow.

### Restore the session and log out

When `Body` mounts, it requests `GET /profile/view`. A successful response is stored in Redux as the current user. If the backend responds with HTTP 401, `Body` navigates to `/login`; other errors are written to the browser console.

The logout button sends `POST /logout`. On success, it clears the Redux user and navigates to `/login`.

**Route-access note:** the session request redirects to login on a 401, but `App.jsx` does not currently define a separate protected-route wrapper around each page. Treat the session check as user restoration and a 401 redirect, not as a guarantee that every route is blocked before rendering.

## 5. Shared state and component state

`src/utils/appStore.js` combines four Redux slices:

| Store key | Slice | Data held |
| --- | --- | --- |
| `user` | `userSlice` | Current signed-in user, or `null` |
| `feed` | `feedSlice` | Feed users and the action to remove a user after responding |
| `connection` | `connectionSlice` | The user's accepted connections |
| `request` | `requestSlice` | Incoming connection requests |

Components read shared values with `useSelector` and update them with `useDispatch`. For example, the navigation bar reads `user`, while sign-in dispatches `addUser`.

Data that only matters to one screen stays in React component state. Examples include form field values, loading or error messages, a dragged card's position, and the chat's current message draft.

## 6. Main user and data workflows

### Feed and connection actions

1. `Feed` requests `GET /feed` when it mounts and stores the returned list with `addFeed`.
2. It renders the first user in the feed as a `UserCardd`.
3. The user can choose **Ignore** or **Interested**, or swipe left or right.
4. The card sends `POST /request/send/{status}/{userId}` with credentials.
5. Once the request succeeds, `removeUserFromFeed` removes that user from the local Redux feed and the card shows a confirmation. If the request fails, the card remains and shows an error.

The frontend therefore updates its displayed feed after the backend accepts the action; it does not treat a failed request as a successful connection action.

### Incoming requests

`Requests` loads `GET /user/request/received` and stores the returned requests using `addRequest`. Each request has **Accept** and **Reject** actions, which call `POST /request/review/{status}/{requestId}` with `accepted` or `rejected`. On success, the reviewed request is removed from the Redux list.

### Connections

`Connections` loads `GET /user/connections`, stores the returned users with `addConnection`, and displays loading, error, empty, or populated states. A **Chat** link navigates to `/chat/{connectionId}`.

### Profile editing

`Profile` reads the current user from Redux and passes it to `EditProfile`. The editor initializes its form from that user, then sends changes to `PATCH /profile/edit`. On success it replaces the Redux user with the updated user and shows a success toast; errors are shown in the form.

### Premium checkout

`Premium` loads the Razorpay checkout script when needed. When a membership is selected, it requests an order from `POST /payment/create` with the membership type, then uses the returned checkout details to open Razorpay. The frontend starts checkout; order creation is handled by the backend.

### Chat

When `Chat` opens, it uses the `targetUserid` from the route to load earlier messages from `GET /chat/{targetUserid}`. Once the current user is available, it creates a Socket.IO connection, emits `joinChat`, and listens for `messageRecieved`. Sending a message emits `sendMessage`. The socket listener and connection are cleaned up when the page changes or unmounts.

## 7. Backend requests and configuration

`src/utils/constants.js` defines `BASE_URL`, which the page components use as the prefix for API calls. It currently points to `http://localhost:7777`; the file also contains a commented `/api` option for a deployment configured to proxy API traffic through the frontend domain.

Most API calls include `{ withCredentials: true }` because the backend session is cookie-based. The socket helper in `src/utils/socket.js` uses the same base URL to create the Socket.IO connection.

The frontend depends on the backend API paths and response shapes described above. If those change, the relevant component's request handling and Redux update should be reviewed together.

## 8. Running the frontend

From the `my-app` directory:

```bash
npm install
npm run dev
```

The Vite development server prints the local URL to open in a browser. Useful project scripts are:

```bash
npm run build    # Create the production bundle in dist/
npm run preview  # Preview the production bundle locally
npm run lint     # Run ESLint
```

For local API-backed workflows, the backend must be available at the URL configured by `BASE_URL`.
