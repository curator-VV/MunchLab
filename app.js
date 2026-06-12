// MunchLab Core Application Logic

let recipes = [];
let activeTab = 'menu';
let currentRecipe = null;
let cookModeActive = false;
let currentCookStep = 0;
let ttsInstance = null;
let isSpeaking = false;
let cookTimer = null;
let cookTimerSeconds = 0;

// DOM Elements
const elements = {
  themeBtn: document.getElementById('theme-btn'),
  settingsBtn: document.getElementById('settings-btn'),
  settingsDialog: document.getElementById('settings-dialog'),
  apiKeyInput: document.getElementById('api-key-input'),
  saveSettingsBtn: document.getElementById('save-settings-btn'),
  cancelSettingsBtn: document.getElementById('cancel-settings-btn'),
  resetDbBtn: document.getElementById('reset-db-btn'),
  
  // Navigation Tabs
  navItems: document.querySelectorAll('.nav-item'),
  tabViews: document.querySelectorAll('.tab-view'),
  
  // Recipe Menu Tab
  searchInput: document.getElementById('search-input'),
  categoryChips: document.querySelectorAll('.category-chip'),
  recipesGrid: document.getElementById('recipes-grid'),
  fabBtn: document.getElementById('fab-btn'),
  
  // Add/Import Modal
  importDialog: document.getElementById('import-dialog'),
  importTabBtns: document.querySelectorAll('.import-tab-btn'),
  importTabContents: document.querySelectorAll('.import-tab-content'),
  cancelImportBtn: document.getElementById('cancel-import-btn'),
  importBtn: document.getElementById('import-btn'),
  
  // Import Forms
  fileInput: document.getElementById('screenshot-file'),
  fileUploadBox: document.getElementById('file-upload-box'),
  filePreview: document.getElementById('file-preview'),
  previewImage: document.getElementById('preview-image'),
  removeFileBtn: document.getElementById('remove-file'),
  linkInput: document.getElementById('recipe-link'),
  textInput: document.getElementById('recipe-text'),
  diyTitle: document.getElementById('diy-title'),
  diyCategory: document.getElementById('diy-category'),
  diyIngredients: document.getElementById('diy-ingredients'),
  diyInstructions: document.getElementById('diy-instructions'),
  
  // Scanning Overlay
  scanningOverlay: document.getElementById('scanning-overlay'),
  scanStatus: document.getElementById('scan-status'),
  
  // Recipe Details View Overlay
  detailsOverlay: document.getElementById('details-overlay'),
  detailsClose: document.getElementById('details-close'),
  detailsHeroImg: document.getElementById('details-hero-img'),
  detailsTitle: document.getElementById('details-title'),
  detailsSource: document.getElementById('details-source'),
  detailsTime: document.getElementById('details-time'),
  detailsServings: document.getElementById('details-servings'),
  detailsSpice: document.getElementById('details-spice'),
  detailsIngredients: document.getElementById('details-ingredients'),
  detailsInstructions: document.getElementById('details-instructions'),
  addToGroceryBtn: document.getElementById('add-to-grocery-btn'),
  shareSauceBtn: document.getElementById('share-sauce-btn'),
  munchModeBtn: document.getElementById('munch-mode-btn'),
  deleteRecipeBtn: document.getElementById('delete-recipe-btn'),
  
  // Export Modal
  shareDialog: document.getElementById('share-dialog'),
  closeShareBtn: document.getElementById('close-share-btn'),
  shareMarkdownBtn: document.getElementById('share-markdown-btn'),
  shareTextBtn: document.getElementById('share-text-btn'),
  
  // Cook Mode Overlay
  cookModeOverlay: document.getElementById('cook-mode-overlay'),
  cookCloseBtn: document.getElementById('cook-close-btn'),
  cookRecipeTitle: document.getElementById('cook-recipe-title'),
  cookProgressFill: document.getElementById('cook-progress-fill'),
  cookStepNum: document.getElementById('cook-step-num'),
  cookStepText: document.getElementById('cook-step-text'),
  cookPrevBtn: document.getElementById('cook-prev-btn'),
  cookNextBtn: document.getElementById('cook-next-btn'),
  cookTtsBtn: document.getElementById('cook-tts-btn'),
  timerTime: document.getElementById('timer-time'),
  timerToggleBtn: document.getElementById('timer-toggle-btn'),
  timerResetBtn: document.getElementById('timer-reset-btn'),
  
  // Grocery List Tab
  grocerySections: document.getElementById('grocery-sections'),
  addCustomGroceryBtn: document.getElementById('add-custom-grocery-btn'),
  clearGroceryBtn: document.getElementById('clear-grocery-btn'),
  
  // Munch Roulette Tab
  rouletteBtn: document.getElementById('roulette-btn'),
  rouletteResult: document.getElementById('roulette-result'),
  wheelCanvas: document.getElementById('wheel-canvas'),
  
  // Simulated Toast
  toast: document.getElementById('toast'),
  
  // Digital Clock
  statusBarClock: document.getElementById('status-bar-clock')
};

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
  initClock();
  initTheme();
  loadRecipes();
  setupEventListeners();
  renderRecipes();
  initRouletteWheel();
  renderGroceryList();
});

// 1. Clock & Theme Functions
function initClock() {
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // key 12 instead of 0
    elements.statusBarClock.textContent = `${hours}:${minutes} ${ampm}`;
  };
  updateClock();
  setInterval(updateClock, 30000);
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  elements.themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  elements.themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    elements.themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    initRouletteWheel(); // Redraw canvas for theme colors
  });
}

// 2. State & Storage
function loadRecipes() {
  const stored = localStorage.getItem('munchlab_recipes');
  if (stored) {
    recipes = JSON.parse(stored);
  } else {
    // Seed database
    recipes = [...defaultRecipes];
    localStorage.setItem('munchlab_recipes', JSON.stringify(recipes));
  }
}

function saveRecipes() {
  localStorage.setItem('munchlab_recipes', JSON.stringify(recipes));
}

// 3. Navigation
function switchTab(tabId) {
  activeTab = tabId;
  
  // Update Navigation Bar
  elements.navItems.forEach(item => {
    if (item.dataset.tab === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Update Tab Views
  elements.tabViews.forEach(view => {
    if (view.id === `${tabId}-tab`) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });
  
  // Tab Specific Init
  if (tabId === 'roulette') {
    initRouletteWheel();
    elements.rouletteResult.textContent = 'Spins to decide your meal! 🎰';
  } else if (tabId === 'grocery') {
    renderGroceryList();
  }
  
  // Close any overlay
  closeRecipeDetails();
  exitCookMode();
}

// 4. Rendering Recipes
function renderRecipes(filterCategory = 'All', searchQuery = '') {
  elements.recipesGrid.innerHTML = '';
  
  const filtered = recipes.filter(recipe => {
    const matchesCategory = filterCategory === 'All' || recipe.category === filterCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  if (filtered.length === 0) {
    elements.recipesGrid.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color: var(--text-muted);">
        <span style="font-size: 3rem;">🕵️‍♂️</span>
        <p style="margin-top: 10px; font-weight: 600;">No recipes found in the lab!</p>
        <p style="font-size: 0.8rem;">Try changing filters or importing a new one.</p>
      </div>
    `;
    return;
  }
  
  filtered.forEach(recipe => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.addEventListener('click', () => openRecipeDetails(recipe));
    
    const spiceEmojis = '🌶️'.repeat(recipe.spiceLevel) || '🍀';
    
    card.innerHTML = `
      <div class="card-img-container">
        <img src="${recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80'}" alt="${recipe.title}">
        <span class="card-badge">${recipe.category}</span>
        <span class="card-spice">${spiceEmojis}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${recipe.title}</h3>
        <div class="card-meta">
          <span>⏱️ ${recipe.prepTime + recipe.cookTime} mins</span>
          <span>👨‍👩‍👧‍👦 ${recipe.servings} servings</span>
        </div>
      </div>
    `;
    
    elements.recipesGrid.appendChild(card);
  });
}

// 5. Recipe Details Overlay
function openRecipeDetails(recipe) {
  currentRecipe = recipe;
  
  elements.detailsHeroImg.querySelector('img').src = recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80';
  elements.detailsTitle.textContent = recipe.title;
  elements.detailsSource.textContent = recipe.source || 'Imported';
  elements.detailsTime.innerHTML = `⏱️ Prep: ${recipe.prepTime}m | Cook: ${recipe.cookTime}m`;
  elements.detailsServings.innerHTML = `👥 Serves ${recipe.servings}`;
  elements.detailsSpice.innerHTML = `🌶️ Spice: ${'🌶️'.repeat(recipe.spiceLevel) || 'None'}`;
  
  // Ingredients list
  elements.detailsIngredients.innerHTML = '';
  recipe.ingredients.forEach((ing, index) => {
    const label = document.createElement('label');
    label.className = 'ingredient-item';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.classList.add('checked');
      } else {
        label.classList.remove('checked');
      }
    });
    
    const textNode = document.createElement('span');
    textNode.textContent = ing;
    
    label.appendChild(checkbox);
    label.appendChild(textNode);
    elements.detailsIngredients.appendChild(label);
  });
  
  // Instructions list
  elements.detailsInstructions.innerHTML = '';
  recipe.instructions.forEach(step => {
    const li = document.createElement('div');
    li.className = 'instruction-item';
    li.textContent = step;
    elements.detailsInstructions.appendChild(li);
  });
  
  elements.detailsOverlay.style.display = 'flex';
  setTimeout(() => {
    elements.detailsOverlay.classList.add('active');
  }, 10);
}

function closeRecipeDetails() {
  elements.detailsOverlay.classList.remove('active');
  setTimeout(() => {
    elements.detailsOverlay.style.display = 'none';
  }, 350);
}

// 6. Cook Mode (Hands Free Step-by-Step)
function enterCookMode() {
  if (!currentRecipe) return;
  cookModeActive = true;
  currentCookStep = 0;
  
  elements.cookRecipeTitle.textContent = currentRecipe.title;
  elements.cookModeOverlay.classList.add('active');
  
  updateCookStep();
  startCookTimer();
}

function exitCookMode() {
  cookModeActive = false;
  elements.cookModeOverlay.classList.remove('active');
  stopTTS();
  stopCookTimer();
}

function updateCookStep() {
  const steps = currentRecipe.instructions;
  elements.cookStepNum.textContent = `Step ${currentCookStep + 1} of ${steps.length}`;
  elements.cookStepText.textContent = steps[currentCookStep];
  
  const percentage = ((currentCookStep + 1) / steps.length) * 100;
  elements.cookProgressFill.style.width = `${percentage}%`;
  
  elements.cookPrevBtn.disabled = currentCookStep === 0;
  elements.cookNextBtn.textContent = currentCookStep === steps.length - 1 ? '🎉 Done!' : 'Next step 👉';
  
  // Auto stop speaking on step change
  if (isSpeaking) {
    stopTTS();
    speakStep();
  }
}

function nextCookStep() {
  const steps = currentRecipe.instructions;
  if (currentCookStep < steps.length - 1) {
    currentCookStep++;
    updateCookStep();
  } else {
    // Finished Cooking!
    showToast("Delicious work, Chef! 👨‍🍳🔥");
    exitCookMode();
  }
}

function prevCookStep() {
  if (currentCookStep > 0) {
    currentCookStep--;
    updateCookStep();
  }
}

// Text to Speech
function speakStep() {
  if ('speechSynthesis' in window) {
    if (isSpeaking) {
      stopTTS();
      return;
    }
    
    const textToSpeak = `Step ${currentCookStep + 1}. ${currentRecipe.instructions[currentCookStep]}`;
    ttsInstance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose a friendly English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en-') && voice.name.includes('Google') || voice.name.includes('Samantha'));
    if (englishVoice) ttsInstance.voice = englishVoice;
    
    ttsInstance.onend = () => {
      isSpeaking = false;
      elements.cookTtsBtn.classList.remove('speaking');
      elements.cookTtsBtn.textContent = '🔊';
    };
    
    isSpeaking = true;
    elements.cookTtsBtn.classList.add('speaking');
    elements.cookTtsBtn.textContent = '⏸️';
    window.speechSynthesis.speak(ttsInstance);
  } else {
    showToast("Speech Synthesis not supported in this browser.");
  }
}

function stopTTS() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    elements.cookTtsBtn.classList.remove('speaking');
    elements.cookTtsBtn.textContent = '🔊';
  }
}

// Cook Timer Widget
function startCookTimer() {
  cookTimerSeconds = 0;
  updateTimerUI();
}

function toggleCookTimer() {
  if (cookTimer) {
    // Pause
    clearInterval(cookTimer);
    cookTimer = null;
    elements.timerToggleBtn.textContent = '▶️';
  } else {
    // Start
    elements.timerToggleBtn.textContent = '⏸️';
    cookTimer = setInterval(() => {
      cookTimerSeconds++;
      updateTimerUI();
    }, 1000);
  }
}

function resetCookTimer() {
  clearInterval(cookTimer);
  cookTimer = null;
  cookTimerSeconds = 0;
  elements.timerToggleBtn.textContent = '▶️';
  updateTimerUI();
}

function stopCookTimer() {
  clearInterval(cookTimer);
  cookTimer = null;
}

function updateTimerUI() {
  const mins = String(Math.floor(cookTimerSeconds / 60)).padStart(2, '0');
  const secs = String(cookTimerSeconds % 60).padStart(2, '0');
  elements.timerTime.textContent = `${mins}:${secs}`;
}

// 7. Recipe Exporters ("Spill the Beans!")
function openShareDialog() {
  if (!currentRecipe) return;
  elements.shareDialog.showModal();
}

function exportRecipeMarkdown() {
  if (!currentRecipe) return;
  
  let md = `# ${currentRecipe.title}\n\n`;
  md += `**Category**: ${currentRecipe.category} | **Prep Time**: ${currentRecipe.prepTime} mins | **Cook Time**: ${currentRecipe.cookTime} mins | **Servings**: ${currentRecipe.servings}\n`;
  md += `**Spice Level**: ${'🌶️'.repeat(currentRecipe.spiceLevel) || 'None'} | **Source**: ${currentRecipe.source}\n\n`;
  md += `## Ingredients:\n`;
  currentRecipe.ingredients.forEach(ing => {
    md += `- [ ] ${ing}\n`;
  });
  md += `\n## Instructions:\n`;
  currentRecipe.instructions.forEach((step, idx) => {
    md += `${idx + 1}. ${step}\n`;
  });
  md += `\n*Shared from Jace's MunchLab 🌶️*`;
  
  copyToClipboard(md, "Markdown recipe copied! 🫘");
  elements.shareDialog.close();
}

function exportRecipeText() {
  if (!currentRecipe) return;
  
  let txt = `🍽️ RECIPE: ${currentRecipe.title}\n`;
  txt += `====================================\n`;
  txt += `Prep: ${currentRecipe.prepTime}m | Cook: ${currentRecipe.cookTime}m | Servings: ${currentRecipe.servings}\n`;
  txt += `Source: ${currentRecipe.source}\n\n`;
  txt += `INGREDIENTS:\n`;
  currentRecipe.ingredients.forEach(ing => txt += `• ${ing}\n`);
  txt += `\nINSTRUCTIONS:\n`;
  currentRecipe.instructions.forEach((step, idx) => txt += `${idx + 1}. ${step}\n`);
  txt += `\nShared from MunchLab 🌶️`;
  
  copyToClipboard(txt, "Text recipe copied! 🌶️");
  elements.shareDialog.close();
}

// 8. Add & Import Modal Actions
let activeImportTab = 'screenshot';

function setupImportDialog() {
  // Reset Form
  elements.fileInput.value = '';
  elements.filePreview.style.display = 'none';
  elements.fileUploadBox.style.display = 'flex';
  elements.linkInput.value = '';
  elements.textInput.value = '';
  elements.diyTitle.value = '';
  elements.diyIngredients.value = '';
  elements.diyInstructions.value = '';
  
  elements.importDialog.showModal();
}

function switchImportTab(tabId) {
  activeImportTab = tabId;
  elements.importTabBtns.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  elements.importTabContents.forEach(content => {
    if (content.id === `import-${tabId}`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

// Smart Simulated / Real Gemini Parser
async function processImport() {
  let recipeData = null;
  const apiKey = localStorage.getItem('gemini_api_key');
  
  elements.scanningOverlay.style.display = 'flex';
  elements.scanStatus.textContent = "Loading MunchLab AI Engines...";
  
  try {
    if (activeImportTab === 'diy') {
      // Direct manual input
      if (!elements.diyTitle.value) {
        alert("Please enter a recipe title.");
        elements.scanningOverlay.style.display = 'none';
        return;
      }
      recipeData = {
        title: elements.diyTitle.value + " 🍳",
        category: elements.diyCategory.value,
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        spiceLevel: 1,
        source: "Created by Jace 👨‍🍳",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
        ingredients: elements.diyIngredients.value.split('\n').filter(i => i.trim() !== ''),
        instructions: elements.diyInstructions.value.split('\n').filter(i => i.trim() !== '')
      };
    } else if (apiKey) {
      // 🚀 REAL GEMINI API CALL!
      recipeData = await parseWithGeminiAPI(apiKey);
    } else {
      // 🍀 SIMULATED CHEF AI PARSER
      const proceed = confirm(
        "🍳 MunchLab is currently in 'Simulated Chef AI' mode.\n\n" +
        "To make the app ACTUALLY read the words and ingredients from your screenshot, text, or video link, you need to connect a Gemini API Key (click the ⚙️ gear icon at the top right of the screen).\n\n" +
        "Would you like to run the simulated keywords parser for now?"
      );
      if (!proceed) {
        elements.scanningOverlay.style.display = 'none';
        elements.importDialog.close();
        setTimeout(() => {
          elements.apiKeyInput.value = '';
          elements.settingsDialog.showModal();
        }, 200);
        return;
      }
      recipeData = await parseSimulatedAI();
    }
    
    if (recipeData) {
      recipeData.id = recipeData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      recipes.unshift(recipeData); // Add to beginning of array
      saveRecipes();
      renderRecipes();
      
      elements.scanningOverlay.style.display = 'none';
      elements.importDialog.close();
      showToast("Recipe added to Lab Menu! 👨‍🍳🔥");
      
      // Auto open details
      openRecipeDetails(recipeData);
    }
  } catch (err) {
    console.error(err);
    elements.scanningOverlay.style.display = 'none';
    alert("Error parsing recipe: " + err.message);
  }
}

// Real Gemini AI Parser Call
async function parseWithGeminiAPI(apiKey) {
  updateScanStatus("Connecting to Gemini Neural Kitchen...", 800);
  
  let promptText = `Extract the recipe from this content. Return ONLY a valid JSON object matching this schema, no extra markdown formatting (do not wrap in \`\`\`json blocks):
  {
    "title": "Short Recipe Title (include a fun emoji)",
    "category": "Mexican" | "Italian" | "Healthy" | "Comfort Food" | "Sweet Treats" | "Quick & Easy",
    "spiceLevel": 0, 1, 2, 3 or 4,
    "prepTime": prep time in minutes,
    "cookTime": cook time in minutes,
    "servings": servings number,
    "source": "YouTube", "Instagram Reel", "Screenshot Upload" or "Copy-paste",
    "image": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80",
    "ingredients": ["ingredient description", "another ingredient"],
    "instructions": ["cooking step 1", "cooking step 2"]
  }`;
  
  let requestBody = {};
  
  if (activeImportTab === 'screenshot') {
    if (!elements.fileInput.files[0]) {
      throw new Error("No screenshot uploaded!");
    }
    updateScanStatus("Reading screenshot pixels...", 1200);
    const file = elements.fileInput.files[0];
    const base64Data = await fileToBase64(file);
    const mimeType = file.type;
    const base64Raw = base64Data.split(',')[1];
    
    requestBody = {
      contents: [
        {
          parts: [
            { text: promptText },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Raw
              }
            }
          ]
        }
      ]
    };
  } else if (activeImportTab === 'link') {
    const url = elements.linkInput.value;
    if (!url) throw new Error("No link provided!");
    updateScanStatus(`Reading URL context: ${url.substring(0, 30)}...`, 1500);
    
    promptText += `\n\nRecipe source URL: ${url}. If you don't know the exact recipe for this URL, look at the text in the URL to guess what recipe it is (e.g. chocolate chip cookies, pasta carbonara, or tacos) and write a gourmet version of it!`;
    requestBody = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ]
    };
  } else if (activeImportTab === 'text') {
    const text = elements.textInput.value;
    if (!text) throw new Error("No text provided!");
    updateScanStatus("Parsing text structure...", 1000);
    
    promptText += `\n\nRecipe text dump:\n${text}`;
    requestBody = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ]
    };
  }
  
  updateScanStatus("Gemini is cooking the recipe JSON...", 1800);
  
  // Call Gemini REST API
  const model = "gemini-2.5-flash"; // Fallback to gemini-1.5-flash if needed, 2.5-flash is ultra-fast
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
  }
  
  const result = await response.json();
  const rawText = result.candidates[0].content.parts[0].text;
  
  // Clean JSON response (strip markdown wrappers if model ignores instructions)
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
  }
  
  return JSON.parse(cleaned);
}

// Simulated AI Parser (Fallback)
async function parseSimulatedAI() {
  updateScanStatus("Analyzing keywords & food indices...", 1200);
  
  let inputText = "";
  let sourceLabel = "Imported";
  
  if (activeImportTab === 'screenshot') {
    if (!elements.fileInput.files[0]) {
      throw new Error("No screenshot uploaded!");
    }
    inputText = elements.fileInput.files[0].name;
    sourceLabel = `Screenshot: ${inputText} 📸`;
  } else if (activeImportTab === 'link') {
    inputText = elements.linkInput.value;
    sourceLabel = `Video Link: ${inputText.substring(0, 24)}... 🎥`;
  } else if (activeImportTab === 'text') {
    inputText = elements.textInput.value;
    sourceLabel = "Copy-Paste Text Dump 📝";
  }
  
  updateScanStatus("Drafting recipe outline...", 2200);
  
  // Keyword mapping database
  const keywords = [
    { keys: ['cookie', 'chocolate', 'brownie', 'sweet', 'bake'], recipe: 'cookies' },
    { keys: ['pizza', 'margherita', 'dough', 'pepperoni'], recipe: 'pizza' },
    { keys: ['burger', 'cheeseburger', 'hamburger', 'patty'], recipe: 'burger' },
    { keys: ['ramen', 'noodle', 'soup', 'miso'], recipe: 'ramen' },
    { keys: ['pasta', 'spaghetti', 'carbonara', 'alfredo', 'lasagna'], recipe: 'pasta' },
    { keys: ['salad', 'healthy', 'green', 'avocado'], recipe: 'salad' },
    { keys: ['taco', 'fajita', 'quesadilla', 'mexican'], recipe: 'tacos' },
    { keys: ['salmon', 'fish', 'seafood'], recipe: 'salmon' }
  ];
  
  let match = 'random';
  const cleanInput = inputText.toLowerCase();
  
  for (const kw of keywords) {
    if (kw.keys.some(k => cleanInput.includes(k))) {
      match = kw.recipe;
      break;
    }
  }
  
  // Simulating time
  await new Promise(resolve => setTimeout(resolve, 1500));
  updateScanStatus("Plating recipe design...", 3000);
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return getMockRecipe(match, sourceLabel);
}

function updateScanStatus(text, delay) {
  setTimeout(() => {
    if (elements.scanningOverlay.style.display === 'flex') {
      elements.scanStatus.textContent = text;
    }
  }, delay);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// 9. Munch Roulette Spinner Wheel
let wheelRecipes = [];
function initRouletteWheel() {
  const canvas = elements.wheelCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clear and resize canvas for HDPI
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 244 * dpr;
  canvas.height = 244 * dpr;
  ctx.scale(dpr, dpr);
  
  wheelRecipes = recipes.slice(0, 8); // Spin among top 8 recipes
  if (wheelRecipes.length === 0) return;
  
  const arcSize = (2 * Math.PI) / wheelRecipes.length;
  const colors = [
    '#FF4D4D', '#2E7D32', '#FFD54F', '#9C27B0', 
    '#FF9800', '#00BCD4', '#4CAF50', '#E91E63'
  ];
  
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  ctx.clearRect(0, 0, 244, 244);
  
  wheelRecipes.forEach((recipe, idx) => {
    const angle = idx * arcSize;
    ctx.beginPath();
    ctx.fillStyle = colors[idx % colors.length];
    ctx.moveTo(122, 122);
    ctx.arc(122, 122, 116, angle, angle + arcSize);
    ctx.lineTo(122, 122);
    ctx.fill();
    
    // Draw text label
    ctx.save();
    ctx.translate(122, 122);
    ctx.rotate(angle + arcSize / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px Outfit";
    // Truncate long names
    let label = recipe.title.substring(0, 16);
    if (recipe.title.length > 16) label += "...";
    ctx.fillText(label, 100, 4);
    ctx.restore();
  });
  
  // Inner metallic node
  ctx.beginPath();
  ctx.fillStyle = isDark ? '#222' : '#fff';
  ctx.arc(122, 122, 26, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = isDark ? '#444' : '#eee';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.fillStyle = '#FF4D4D';
  ctx.font = "bold 13px Outfit";
  ctx.textAlign = "center";
  ctx.fillText("SPIN", 122, 126);
}

let isSpinning = false;
function spinRoulette() {
  if (isSpinning || wheelRecipes.length === 0) return;
  isSpinning = true;
  
  elements.rouletteResult.textContent = "Chef AI is choosing... 🤔";
  
  // Dynamic spin
  const spins = 4 + Math.floor(Math.random() * 4); // 4 to 7 rotations
  const targetIndex = Math.floor(Math.random() * wheelRecipes.length);
  const arcSize = (2 * Math.PI) / wheelRecipes.length;
  
  // Calculate target rotation angle so pointer (at 12 o'clock, which is -Math.PI/2) points at the selected slice.
  // The slice starts at targetIndex * arcSize and runs to (targetIndex + 1) * arcSize.
  // Pointer is at angle 3/2 * Math.PI.
  const targetAngle = (1.5 * Math.PI) - (targetIndex * arcSize) - (arcSize / 2);
  const finalRotation = (spins * 2 * Math.PI) + targetAngle;
  
  elements.wheelWrapper.style.transform = `rotate(${finalRotation}rad)`;
  
  setTimeout(() => {
    isSpinning = false;
    const chosen = wheelRecipes[targetIndex];
    elements.rouletteResult.textContent = `🎯 IT'S ${chosen.title.toUpperCase()}!`;
    showToast(`Perfect pick! Loading recipe...`);
    
    // Auto redirect to recipe details after 1.5 seconds
    setTimeout(() => {
      openRecipeDetails(chosen);
    }, 1500);
  }, 4000);
}

// 10. Grocery List Creator
let groceryList = [];

function loadGroceryList() {
  const stored = localStorage.getItem('munchlab_grocery');
  groceryList = stored ? JSON.parse(stored) : [];
}

function saveGroceryList() {
  localStorage.setItem('munchlab_grocery', JSON.stringify(groceryList));
}

function addRecipeToGrocery(recipe) {
  loadGroceryList();
  
  recipe.ingredients.forEach(ing => {
    // Check if ingredient already in list
    if (!groceryList.some(item => item.name.toLowerCase() === ing.toLowerCase())) {
      groceryList.push({
        id: Math.random().toString(36).substring(2, 9),
        name: ing,
        checked: false,
        category: categorizeIngredient(ing)
      });
    }
  });
  
  saveGroceryList();
  showToast("Ingredients added to Grocery list! 🛒");
}

function categorizeIngredient(ing) {
  const name = ing.toLowerCase();
  
  const categories = {
    "Produce 🥦": ['cilantro', 'onion', 'garlic', 'tomato', 'avocado', 'jalapeño', 'lime', 'basil', 'parsley', 'salad', 'lemon', 'pepper', 'ginger', 'spinach', 'chili', 'carrot', 'potato', 'mushroom'],
    "Dairy & Eggs 🥛": ['butter', 'eggs', 'milk', 'cheese', 'ricotta', 'mozzarella', 'cream', 'parmesan', 'yogurt'],
    "Pantry & Spices 🧂": ['soy sauce', 'oil', 'flour', 'sugar', 'salt', 'pepper', 'cumin', 'paprika', 'pasta', 'noodles', 'chocolate', 'vanilla', 'honey', 'cocoa', 'powder', 'sauce', 'paste', 'water', 'vinegar', 'yeast', 'extract', 'cinnamon'],
    "Meat & Fish 🥩": ['steak', 'sausage', 'beef', 'salmon', 'chicken', 'pork', 'tuna', 'turkey', 'lamb', 'flank']
  };
  
  for (const [cat, keys] of Object.entries(categories)) {
    if (keys.some(k => name.includes(k))) return cat;
  }
  
  return "Other Aisle 🛒";
}

function renderGroceryList() {
  loadGroceryList();
  elements.grocerySections.innerHTML = '';
  
  if (groceryList.length === 0) {
    elements.grocerySections.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
        <span style="font-size: 3rem;">🛒</span>
        <p style="margin-top: 10px; font-weight: 600;">Your shopping list is empty!</p>
        <p style="font-size: 0.8rem;">Tap "Get Ingredients" on any recipe card to load up.</p>
      </div>
    `;
    return;
  }
  
  // Group list by category
  const groups = {};
  groceryList.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });
  
  for (const [sectionTitle, items] of Object.entries(groups)) {
    const section = document.createElement('div');
    section.className = 'grocery-section';
    
    let listHTML = `<h3 class="grocery-section-title">${sectionTitle}</h3><div class="grocery-list">`;
    
    items.forEach(item => {
      listHTML += `
        <div class="grocery-item ${item.checked ? 'checked' : ''}" data-id="${item.id}">
          <div class="grocery-item-left">
            <input type="checkbox" ${item.checked ? 'checked' : ''}>
            <span>${item.name}</span>
          </div>
          <button class="delete-grocery-btn">🗑️</button>
        </div>
      `;
    });
    
    listHTML += `</div>`;
    section.innerHTML = listHTML;
    elements.grocerySections.appendChild(section);
  }
  
  // Add listeners to checklist
  document.querySelectorAll('.grocery-item').forEach(el => {
    const id = el.dataset.id;
    const checkbox = el.querySelector('input[type="checkbox"]');
    const deleteBtn = el.querySelector('.delete-grocery-btn');
    
    checkbox.addEventListener('change', () => {
      const idx = groceryList.findIndex(item => item.id === id);
      if (idx !== -1) {
        groceryList[idx].checked = checkbox.checked;
        saveGroceryList();
        renderGroceryList();
      }
    });
    
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      groceryList = groceryList.filter(item => item.id !== id);
      saveGroceryList();
      renderGroceryList();
    });
  });
}

function addCustomGroceryItem() {
  const name = prompt("Enter grocery item name:");
  if (!name || name.trim() === "") return;
  
  loadGroceryList();
  groceryList.push({
    id: Math.random().toString(36).substring(2, 9),
    name: name,
    checked: false,
    category: categorizeIngredient(name)
  });
  saveGroceryList();
  renderGroceryList();
}

function clearGroceryList() {
  if (confirm("Clear all items from your shopping list?")) {
    groceryList = [];
    saveGroceryList();
    renderGroceryList();
  }
}

// Helper: Toast alerts
function showToast(msg) {
  elements.toast.textContent = msg;
  elements.toast.classList.add('show');
  setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 2500);
}

function copyToClipboard(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    // Fallback text area copy
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch (err) {
      alert("Failed to copy recipe.");
    }
    document.body.removeChild(textArea);
  });
}

function deleteCurrentRecipe() {
  if (!currentRecipe) return;
  if (confirm(`Are you sure you want to permanently delete "${currentRecipe.title}"?`)) {
    recipes = recipes.filter(r => r.id !== currentRecipe.id);
    saveRecipes();
    renderRecipes();
    closeRecipeDetails();
    showToast("Recipe trashed! 🗑️");
  }
}

function resetRecipeDatabase() {
  if (confirm("🚨 WARNING: Resetting the lab will delete all of your imported recipes and restore the default ones. Do you want to proceed?")) {
    recipes = [...defaultRecipes];
    saveRecipes();
    renderRecipes();
    elements.settingsDialog.close();
    showToast("Recipe database reset! 🔄");
  }
}

// 11. Event Listeners Setup
function setupEventListeners() {
  // Navigation
  elements.navItems.forEach(item => {
    item.addEventListener('click', () => switchTab(item.dataset.tab));
  });
  
  // Search
  let searchTimeout;
  elements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const activeCategory = document.querySelector('.category-chip.active').dataset.category;
      renderRecipes(activeCategory, e.target.value);
    }, 150);
  });
  
  // Category Chips
  elements.categoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.categoryChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderRecipes(chip.dataset.category, elements.searchInput.value);
    });
  });
  
  // Settings Dialog
  elements.settingsBtn.addEventListener('click', () => {
    elements.apiKeyInput.value = localStorage.getItem('gemini_api_key') || '';
    elements.settingsDialog.showModal();
  });
  
  elements.saveSettingsBtn.addEventListener('click', () => {
    const key = elements.apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      showToast("Gemini Kitchen key connected! 🤖");
    } else {
      localStorage.removeItem('gemini_api_key');
      showToast("Disconnected. Using simulated kitchen.");
    }
    elements.settingsDialog.close();
  });
  
  elements.cancelSettingsBtn.addEventListener('click', () => {
    elements.settingsDialog.close();
  });
  
  elements.resetDbBtn.addEventListener('click', resetRecipeDatabase);
  
  // Add Recipe dialog trigger
  elements.fabBtn.addEventListener('click', setupImportDialog);
  elements.cancelImportBtn.addEventListener('click', () => elements.importDialog.close());
  elements.importBtn.addEventListener('click', processImport);
  
  // Import tabs
  elements.importTabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchImportTab(btn.dataset.tab));
  });
  
  // File Upload Drag & Drop & Selection
  elements.fileUploadBox.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        elements.previewImage.src = event.target.result;
        elements.filePreview.style.display = 'block';
        elements.fileUploadBox.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });
  
  elements.removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.fileInput.value = '';
    elements.filePreview.style.display = 'none';
    elements.fileUploadBox.style.display = 'flex';
  });
  
  // Details Overlay controls
  elements.detailsClose.addEventListener('click', closeRecipeDetails);
  elements.munchModeBtn.addEventListener('click', enterCookMode);
  elements.deleteRecipeBtn.addEventListener('click', deleteCurrentRecipe);
  
  elements.addToGroceryBtn.addEventListener('click', () => {
    if (currentRecipe) {
      addRecipeToGrocery(currentRecipe);
    }
  });
  
  // Sharing/Export recipe options
  elements.shareSauceBtn.addEventListener('click', openShareDialog);
  elements.closeShareBtn.addEventListener('click', () => elements.shareDialog.close());
  elements.shareMarkdownBtn.addEventListener('click', exportRecipeMarkdown);
  elements.shareTextBtn.addEventListener('click', exportRecipeText);
  
  // Cook Mode Overlay controls
  elements.cookCloseBtn.addEventListener('click', exitCookMode);
  elements.cookPrevBtn.addEventListener('click', prevCookStep);
  elements.cookNextBtn.addEventListener('click', nextCookStep);
  elements.cookTtsBtn.addEventListener('click', speakStep);
  elements.timerToggleBtn.addEventListener('click', toggleCookTimer);
  elements.timerResetBtn.addEventListener('click', resetCookTimer);
  
  // Grocery List commands
  elements.addCustomGroceryBtn.addEventListener('click', addCustomGroceryItem);
  elements.clearGroceryBtn.addEventListener('click', clearGroceryList);
  
  // Roulette Spinner Trigger
  elements.rouletteBtn.addEventListener('click', spinRoulette);
}

// Fallback Mock Recipes Generator for Simulated AI
function getMockRecipe(keyword, sourceLabel) {
  const mocks = {
    cookies: {
      title: "Choco Cookie Lab 🍪",
      category: "Sweet Treats",
      spiceLevel: 0,
      prepTime: 12,
      cookTime: 10,
      servings: 12,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1 cup Unsalted butter (softened)",
        "3/4 cup Brown sugar",
        "3/4 cup Granulated sugar",
        "2 large Eggs",
        "1.5 tsp Vanilla extract",
        "2.25 cups All-purpose flour",
        "1 tsp Baking soda",
        "1.5 cups Semi-sweet chocolate chips"
      ],
      instructions: [
        "Whisk softened butter, brown sugar, and granulated sugar together until fluffy.",
        "Add eggs one at a time, followed by the vanilla extract.",
        "Sift in the flour and baking soda, folding gently until just combined.",
        "Fold in the chocolate chips.",
        "Scoop 2-tablespoon size balls of batter onto a lined baking sheet.",
        "Bake at 375°F (190°C) for 9-11 minutes until edges are golden brown. Let cool."
      ]
    },
    pizza: {
      title: "Chef Pizza Margherita 🍕",
      category: "Italian",
      spiceLevel: 0,
      prepTime: 20,
      cookTime: 8,
      servings: 2,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1 Pizza dough ball (store-bought or homemade)",
        "1/2 cup Crushed San Marzano tomatoes",
        "4 oz Fresh Mozzarella cheese (sliced)",
        "5-6 Fresh Basil leaves",
        "1 tbsp Extra virgin olive oil",
        "Semolina flour (for dusting)"
      ],
      instructions: [
        "Preheat your oven to its maximum temperature (ideally 500°F/260°C) with a pizza stone inside.",
        "Stretch the dough out on a floured surface to a 12-inch circle.",
        "Spread crushed tomatoes evenly over the dough, leaving a 1-inch border.",
        "Arrange fresh mozzarella slices over the tomato sauce.",
        "Carefully slide the pizza onto the hot pizza stone and bake for 7-9 minutes until crust is charred.",
        "Remove from oven, top with fresh basil, and drizzle with extra virgin olive oil."
      ]
    },
    burger: {
      title: "Double Smash Cheeseburger 🍔",
      category: "Comfort Food",
      spiceLevel: 1,
      prepTime: 10,
      cookTime: 6,
      servings: 2,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1/2 lb Ground beef (80/20 blend, divided into four balls)",
        "4 slices American cheese",
        "2 Brioche hamburger buns (split and buttered)",
        "1 cup Shredded iceberg lettuce",
        "2 tbsp Hamburger sauce (mayo + ketchup + relish)",
        "Salt and black pepper"
      ],
      instructions: [
        "Toast the buttered brioche buns in a hot skillet until golden brown. Set aside.",
        "Heat a cast-iron skillet on high heat until smoking.",
        "Place beef balls in the hot pan. Using a heavy spatula, press down firmly to flatten thin.",
        "Season generously with salt and pepper. Sear for 2 minutes until a deep brown crust forms.",
        "Flip the patties, place a slice of cheese on each, and cook for 1 more minute.",
        "Stack two patties on each bun bottom, add hamburger sauce, lettuce, and bun top."
      ]
    },
    ramen: {
      title: "Umami Ramen Bowl 🍜",
      category: "Quick & Easy",
      spiceLevel: 2,
      prepTime: 15,
      cookTime: 15,
      servings: 1,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1 pack High-quality ramen noodles",
        "2 cups Chicken or vegetable broth",
        "1 tbsp Soy sauce",
        "1 tsp Dashi powder",
        "1 Soft-boiled egg (halved)",
        "2 slices Braised pork belly (or tofu)",
        "1 stalk Green onion (finely sliced)",
        "1 sheet Nori seaweed",
        "Drizzle of chili oil"
      ],
      instructions: [
        "In a saucepan, bring the broth, soy sauce, and dashi powder to a gentle simmer.",
        "In a separate pot of boiling water, cook ramen noodles for 2-3 minutes. Drain well.",
        "Place cooked noodles into a serving bowl and pour the piping hot broth over them.",
        "Arrange the pork belly, soft-boiled egg halves, and nori sheet on top.",
        "Garnish with green onions and a drizzle of spicy chili oil."
      ]
    },
    pasta: {
      title: "Velvet Carbonara 🍝",
      category: "Italian",
      spiceLevel: 0,
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1/2 lb Spaghetti",
        "4 oz Guanciale or Pancetta (diced)",
        "2 whole Eggs + 1 yolk",
        "1 cup Pecorino Romano cheese (grated)",
        "Freshly cracked black pepper",
        "Salt"
      ],
      instructions: [
        "Bring a large pot of salted water to boil. Cook spaghetti until al dente.",
        "Meanwhile, fry diced guanciale in a large skillet over medium heat until crispy. Remove skillet from heat.",
        "In a bowl, whisk eggs, egg yolk, and grated Pecorino Romano together to create a paste.",
        "Drain pasta, reserving 1/2 cup of pasta water.",
        "Add pasta to the skillet with guanciale. Pour egg/cheese mixture over, stirring vigorously.",
        "Add a splash of pasta water to emulsify the sauce into a creamy glaze. Do not scramble the eggs!",
        "Top with excessive cracked black pepper and extra Pecorino."
      ]
    },
    salad: {
      title: "Vibrant Avocado Salad 🥗",
      category: "Healthy",
      spiceLevel: 0,
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "4 cups Mixed salad greens",
        "1 Ripe Avocado (diced)",
        "1 cup Cherry tomatoes (halved)",
        "1/2 English cucumber (sliced)",
        "1/4 cup Feta cheese (crumbled)",
        "2 tbsp Olive oil",
        "1 tbsp Lemon juice",
        "Salt & pepper"
      ],
      instructions: [
        "Wash and dry mixed salad greens, placing them in a large bowl.",
        "Add the diced avocado, halved cherry tomatoes, and sliced cucumber.",
        "In a small jar, shake olive oil, lemon juice, salt, and pepper to make a vinaigrette.",
        "Drizzle dressing over the salad and toss gently.",
        "Garnish with crumbled feta cheese and serve immediately."
      ]
    },
    tacos: {
      title: "Chili Lime Fajitas 🌮",
      category: "Mexican",
      spiceLevel: 3,
      prepTime: 15,
      cookTime: 15,
      servings: 3,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1 lb Chicken breast or flank steak (sliced)",
        "1 Bell pepper (sliced)",
        "1 Bell pepper (red, sliced)",
        "1 Yellow onion (sliced)",
        "2 tbsp Taco seasoning",
        "1 Lime (juiced)",
        "8 Flour tortillas",
        "Guacamole & sour cream"
      ],
      instructions: [
        "Toss sliced meat with taco seasoning and lime juice.",
        "Heat olive oil in a skillet on high. Add meat and sear until fully cooked. Set aside.",
        "In the same skillet, cook peppers and onion until soft and slightly charred.",
        "Combine meat back with the vegetables.",
        "Serve hot on warm tortillas with scoopfuls of guacamole and sour cream."
      ]
    },
    salmon: {
      title: "Crispy Garlic Butter Salmon 🥗",
      category: "Healthy",
      spiceLevel: 1,
      prepTime: 10,
      cookTime: 12,
      servings: 2,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "2 Salmon fillets",
        "2 tbsp Butter",
        "3 cloves Garlic (minced)",
        "Juice of half a lemon",
        "Salt, pepper, paprika"
      ],
      instructions: [
        "Season salmon fillets with salt, pepper, and paprika.",
        "Sear salmon in hot buttered skillet for 4-5 minutes skin side down.",
        "Flip, add minced garlic and lemon juice, baste salmon with juices for 3-4 minutes.",
        "Serve with roasted asparagus or greens."
      ]
    },
    random: {
      title: "Jace's Mystery Munch 🍲",
      category: "Quick & Easy",
      spiceLevel: 2,
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      source: sourceLabel,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      ingredients: [
        "1 cup Anything left in the fridge",
        "2 tbsp Secret Munch sauce",
        "A heavy pinch of Love",
        "1 tsp Culinary Magic",
        "Salt, pepper, and butter"
      ],
      instructions: [
        "Toss everything you found into a warm skillet with melted butter.",
        "Add a pinch of salt, pepper, and the secret Munch sauce.",
        "Stir-fry on medium heat until smelling completely gourmet.",
        "Plate with a artistic drizzle of sauce.",
        "Take a photo, eat, and enjoy the surprise flavor lab creation!"
      ]
    }
  };
  
  return mocks[keyword];
}
