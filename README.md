# FastAPI Full Stack Cypress Automation Suite V2

This suite is prepared for the FastAPI Full Stack Template.

## Important URLs
- Frontend: http://localhost:5173
- Backend docs: http://localhost:8000/docs

## How to run visibly on Chrome

```bash
npm install
npm run cy:chrome
```

This command runs Cypress on **headed Chrome**, so the browser opens and you can watch the tests running.

## Interactive mode

```bash
npm run cy:open
```

## Notes
- Positive API tests validate status code, JSON body, and returned data.
- Tests that need data create their own records first and store generated IDs in variables.
- Page Object Model is used for UI pages.
- Selectors are separated per page.
