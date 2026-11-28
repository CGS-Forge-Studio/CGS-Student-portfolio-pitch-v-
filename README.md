# CGS HUB — Student Portfolio

CGS HUB is a responsive student portfolio demo for exploring attendance, academic progress, achievements, and study files.

## Start the app

Install [Node.js](https://nodejs.org/) if it isn’t already installed. From the project directory, run:

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000) and opens in your default browser. Press `Ctrl+C` in the terminal to stop it.

## Demo sign-in

On the sign-in page, choose **Continue with demo account** to explore the sample portfolio. Username and password fields are included, but credential sign-in is not connected.

## Features

- **Overview:** Attendance snapshot, progress metrics, calendar, and notices panel.
- **Attendance:** Daily records with Present, Absent, and OD statuses. Select a calendar date to view attendance.
- **Academic record:** Sample assessments with subject filtering and scores.
- **Achievements:** Sample accomplishments with category filters.
- **Digital vault:** Sample study files, file uploads, and a 1 GB storage limit. Files added in this browser are saved in local storage.

The portfolio uses sample data stored in the frontend and runs independently of the separate Attendance prototype.

## Project structure

```text
frontend/
  app.js       Portfolio pages, interactions, and sample data
  index.html   App entry point
  styles.css   Responsive styles
  logo.svg     CGS HUB logo
scripts/
  portfolio.mjs  Local development server
```

## Notes

- The development server binds to `localhost` on port `3000`.
- Username and password sign-in is display-only; no credentials are sent or checked.
- Uploaded file details are saved in the current browser. This demo does not upload files to a backend.
