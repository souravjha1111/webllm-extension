# WebLLM Chrome Extension

![Chrome Extension](https://github.com/mlc-ai/mlc-llm/assets/11940172/0d94cc73-eff1-4128-a6e4-70dc879f04e0)

## Features

- **Automatic LinkedIn Post Summarization:**
  - When you browse your LinkedIn feed, the extension automatically detects posts and injects a summary box for each post.
  - Summaries are generated using a local LLM model (via the extension popup/background).
  - No user interaction is required—summaries appear automatically as you scroll.

## Installation & Usage

To run the extension, do the following steps under this folder:

```bash
npm install
npm run build
```

This will create a new directory at `chrome-extension/dist/`. To load the extension into Chrome:

1. Go to Extensions > Manage Extensions and select Load Unpacked.
2. Add the `chrome-extension/dist/` directory.
3. Pin the extension to your toolbar.
4. Browse LinkedIn and see automatic summaries appear on posts!

## Notes
- The extension does not inject a chat UI or floating button.
- All summarization is handled automatically for LinkedIn posts.
- For best results, keep the extension popup loaded in the background.
