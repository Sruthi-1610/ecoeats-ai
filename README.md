<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Repository

Repository: https://github.com/Sruthi-1610/ecoeats-ai

## CI

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that will run on pushes and pull requests to `main`. It installs dependencies, runs a build (if present), and runs tests (if present).

## License

This project is released under the MIT License — see `LICENSE`.
