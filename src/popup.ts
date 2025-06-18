/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use strict";

// This code is partially adapted from the openai-chatgpt-chrome-extension repo:
// https://github.com/jessedi0n/openai-chatgpt-chrome-extension

import "./popup.css";

import {
  MLCEngineInterface,
  InitProgressReport,
  CreateMLCEngine,
  ChatCompletionMessageParam,
  prebuiltAppConfig,
} from "@mlc-ai/web-llm";
import { ProgressBar, Line } from "progressbar.js";

// modified setLabel to not throw error
function setLabel(id: string, text: string) {
  const label = document.getElementById(id);
  if (label != null) {
    label.innerText = text;
  }
}

function getElementAndCheck(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (element == null) {
    throw Error("Cannot find element " + id);
  }
  return element;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const queryInput = getElementAndCheck("query-input")!;
const submitButton = getElementAndCheck("submit-button")!;
const modelName = getElementAndCheck("model-name");

let context = "";
let modelDisplayName = "";

// throws runtime.lastError if you refresh extension AND try to access a webpage that is already open
fetchPageContents();

(<HTMLButtonElement>submitButton).disabled = true;

let progressBar: ProgressBar = new Line("#loadingContainer", {
  strokeWidth: 4,
  easing: "easeInOut",
  duration: 1400,
  color: "#ffd166",
  trailColor: "#eee",
  trailWidth: 1,
  svgStyle: { width: "100%", height: "100%" },
});

let isLoadingParams = true;

let initProgressCallback = (report: InitProgressReport) => {
  setLabel("init-label", report.text);
  progressBar.animate(report.progress, {
    duration: 50,
  });
  if (report.progress == 1.0) {
    enableInputs();
  }
};

/* All available models in prebuiltAppConfig:
  - Qwen2-0.5B-Instruct-q4f16_1-MLC
  - Qwen2-1.5B-Instruct-q4f16_1-MLC
  - Qwen2-4B-Instruct-q4f16_1-MLC
  - Qwen2-7B-Instruct-q4f16_1-MLC
  - Llama-2-7b-chat-hf-q4f32_1-MLC
  - Llama-2-13b-chat-hf-q4f32_1-MLC
  - Llama-2-70b-chat-hf-q4f32_1-MLC
  - Mistral-7B-Instruct-v0.2-q4f32_1-MLC
  - Phi-2-q4f32_1-MLC
  - RedPajama-3B-v2-q4f32_1-MLC
*/

// Available models
const availableModels = [
  "Qwen2-0.5B-Instruct-q4f16_1-MLC",
  "Qwen2-1.5B-Instruct-q4f16_1-MLC",  // Default model
  "Llama-2-13b-chat-hf-q4f32_1-MLC",
  "Llama-2-7b-chat-hf-q4f32_1-MLC",
  "Qwen2-7B-Instruct-q4f16_1-MLC",
  "Qwen2-4B-Instruct-q4f16_1-MLC"
];

// initially selected model
let selectedModel = "Qwen2-0.5B-Instruct-q4f16_1-MLC";

// populate model-selection
const modelSelector = getElementAndCheck(
  "model-selection",
) as HTMLSelectElement;

// Filter and add only the specified models
for (const modelId of availableModels) {
  const opt = document.createElement("option");
  opt.value = modelId;
  opt.innerHTML = modelId;
  opt.selected = modelId === selectedModel;
  modelSelector.appendChild(opt);
}

modelName.innerText = "Loading initial model...";
const engine: MLCEngineInterface = await CreateMLCEngine(selectedModel, {
  initProgressCallback: initProgressCallback,
});
modelName.innerText = "Now chatting with " + modelDisplayName;

let chatHistory: ChatCompletionMessageParam[] = [];

function enableInputs() {
  if (isLoadingParams) {
    setTimeout(() => {
      isLoadingParams = false;
    }, 500);
  }

  const initLabel = document.getElementById("init-label");
  initLabel?.remove();
  const loadingBarContainer = document.getElementById("loadingContainer")!;
  loadingBarContainer?.remove();
  queryInput.focus();

  const modelNameArray = selectedModel.split("-");
  modelDisplayName = modelNameArray[0];
  let j = 1;
  while (j < modelNameArray.length && modelNameArray[j][0] != "q") {
    modelDisplayName = modelDisplayName + "-" + modelNameArray[j];
    j++;
  }
}

let requestInProgress = false;

// Disable submit button if input field is empty
queryInput.addEventListener("keyup", () => {
  (<HTMLButtonElement>submitButton).disabled = 
    (<HTMLInputElement>queryInput).value === "" || 
    requestInProgress || 
    isLoadingParams;
});

// If user presses enter, click submit button
queryInput.addEventListener("keyup", (event) => {
  if (event.code === "Enter") {
    event.preventDefault();
    submitButton.click();
  }
});

// Listen for clicks on submit button
async function handleClick() {
  requestInProgress = true;
  (<HTMLButtonElement>submitButton).disabled = true;

  const message = (<HTMLInputElement>queryInput).value;
  document.getElementById("answer")!.innerHTML = "";
  document.getElementById("answerWrapper")!.style.display = "none";
  document.getElementById("loading-indicator")!.style.display = "block";

  chatHistory.push({ role: "user", content: message });

  let curMessage = "";
  const completion = await engine.chat.completions.create({
    stream: true,
    messages: chatHistory,
  });
  for await (const chunk of completion) {
    const curDelta = chunk.choices[0].delta.content;
    if (curDelta) {
      curMessage += curDelta;
    }
    updateAnswer(curMessage);
  }
  const response = await engine.getMessage();
  chatHistory.push({ role: "assistant", content: response });

  requestInProgress = false;
  (<HTMLButtonElement>submitButton).disabled = false;
}
submitButton.addEventListener("click", handleClick);

// listen for changes in modelSelector
async function handleSelectChange() {
  if (isLoadingParams) return;

  modelName.innerText = "";

  const initLabel = document.createElement("p");
  initLabel.id = "init-label";
  initLabel.innerText = "Initializing model...";
  const loadingContainer = document.createElement("div");
  loadingContainer.id = "loadingContainer";

  const loadingBox = getElementAndCheck("loadingBox");
  loadingBox.appendChild(initLabel);
  loadingBox.appendChild(loadingContainer);

  isLoadingParams = true;
  (<HTMLButtonElement>submitButton).disabled = true;

  if (requestInProgress) {
    engine.interruptGenerate();
  }
  engine.resetChat();
  chatHistory = [];
  await engine.unload();

  selectedModel = modelSelector.value;

  progressBar = new Line("#loadingContainer", {
    strokeWidth: 4,
    easing: "easeInOut",
    duration: 1400,
    color: "#ffd166",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: { width: "100%", height: "100%" },
  });

  initProgressCallback = (report: InitProgressReport) => {
    setLabel("init-label", report.text);
    progressBar.animate(report.progress, {
      duration: 50,
    });
    if (report.progress == 1.0) {
      enableInputs();
    }
  };

  engine.setInitProgressCallback(initProgressCallback);

  requestInProgress = true;
  modelName.innerText = "Reloading with new model...";
  await engine.reload(selectedModel);
  requestInProgress = false;
  modelName.innerText = "Now chatting with " + modelDisplayName;
}
modelSelector.addEventListener("change", handleSelectChange);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(({ answer, error }) => {
  if (answer) {
    updateAnswer(answer);
  }
});

function updateAnswer(answer: string) {
  const answerElement = document.getElementById("answer")!;
  answerElement.innerHTML = answer;
  document.getElementById("answerWrapper")!.style.display = "block";
  document.getElementById("loading-indicator")!.style.display = "none";
  document.getElementById("timestamp")!.innerText = new Date().toLocaleTimeString();
}

// Copy answer to clipboard
document.getElementById("copyAnswer")!.addEventListener("click", () => {
  const answer = document.getElementById("answer")!.innerText;
  navigator.clipboard.writeText(answer);
});

function fetchPageContents() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const port = chrome.tabs.connect(tabs[0].id, { name: "channelName" });
    port.postMessage({});
    port.onMessage.addListener(function (msg) {
      console.log("Page contents:", msg.contents);
      context = msg.contents;
    });
  });
}
