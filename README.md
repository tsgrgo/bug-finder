# 💡 Code Review & Fix Assistant (powered by OpenAI)

This is a simple Node.js web app that helps users analyze and fix issues in their source code using OpenAI's API.  
It features a real-time code editor and AI-powered suggestions similar to Grammarly — but for code!

## ✨ Features

- 🧠 AI-generated code issue detection and explanations
- 💡 Smart fix suggestions with example code
- 🖋️ In-browser code editor with syntax highlighting (CodeMirror)
- 📋 Copy-to-clipboard for fix snippets
- ✅ "Apply Suggestion" button to auto-insert fixes into your code

## 🚀 Getting Started

### Prerequisites
- Node.js 
- An OpenAI API key

### Installation

```bash
git clone https://github.com/tsgrgo/bug-finder.git
cd bug-finder
npm install
```

### Set up environment

Create a .env file in the root with your OpenAI API key:
```
OPENAI_API_KEY=your-api-key-here
MODEL=gpt-3.5-turbo
```

### Run the server

```bash
npm run start
```
Then open your browser at http://localhost:3000

