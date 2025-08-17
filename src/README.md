# React Users Admin - rewriten `src` folder

This `src` implements:
- React + Redux Toolkit
- react-router-dom for routing
- axios to talk to https://reqres.in (public demo API)
- Loader components, form validation, table & card views
- Styling in `styles/common.css`

How to use:
1. Create a new React app (e.g. using Create React App) or place this `src` into an existing project.
2. Install dependencies:
   ```
   npm install react-router-dom @reduxjs/toolkit react-redux axios
   ```
3. Start the dev server:
   ```
   npm start
   ```

Notes:
- API uses https://reqres.in. Create / edit / delete are proxied to that demo API and behave like demo endpoints.
- This `src` is intended as a complete rewrite of your frontend code. You can further adapt styles to match pixel-perfect UI.
