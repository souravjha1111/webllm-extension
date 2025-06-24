# 🎯 MLCBot Context Menu Feature

## ✨ New Right-Click Context Menu

Version 2 now includes a **context menu** that appears when you select text on any webpage. This provides quick access to AI-powered LinkedIn engagement tools.

## 🖱️ How to Use

### 1. **Select Text on Any Webpage**
- Highlight any text (LinkedIn posts, articles, social media content, etc.)
- The context menu will automatically appear

### 2. **Right-Click or Use Context Menu**
- Two options will appear:
  - 🗨️ **Generate comments for this text**
  - ❓ **Ask followup question using AI**

### 3. **Get AI-Generated Responses**
- Click either option
- The side panel will open automatically
- AI will process your request and provide results

## 🎯 Perfect for LinkedIn Engagement

### **Generate Comments**
- **Use Case**: Select a LinkedIn post
- **Action**: Click "Generate comments for this text"
- **Result**: Get 3 professional comment suggestions
- **Prompt Sent**: `"Based on the content: "[selected text]" please evaluate and generate 3 professional LinkedIn comments that I can use to engage with this post. Make the comments thoughtful, relevant, and add value to the conversation."`

### **Ask Followup Questions**
- **Use Case**: Select any content
- **Action**: Click "Ask followup question using AI"
- **Result**: Get an engaging followup question
- **Prompt Sent**: `"Based on the content: "[selected text]" please evaluate and generate a thoughtful followup question that I can ask related to this content. The question should be engaging and encourage further discussion."`

## 🔧 Technical Implementation

### **Context Menu Creation**
- **Trigger**: `mouseup` event when text is selected
- **Position**: Appears at cursor location
- **Styling**: Modern, clean design with icons
- **Auto-close**: Closes when clicking outside

### **AI Processing Flow**
1. **Content Script** → Detects selection and creates menu
2. **User Click** → Sends prompt to background script
3. **Background Script** → Opens side panel and processes request
4. **Popup** → Receives prompt and generates AI response
5. **Result** → Shows in side panel

### **Message Flow**
```
Content Script → Background Script → Popup → AI Engine → Response
```

## 📱 User Experience

### **Context Menu Features**
- **Visual Design**: Clean, modern interface
- **Icons**: FontAwesome icons for each option
- **Hover Effects**: Smooth transitions
- **Auto-Positioning**: Appears at cursor location
- **Smart Closing**: Closes when clicking elsewhere

### **Automatic Processing**
- **No Manual Input**: Just click the menu option
- **Auto-Side Panel**: Opens automatically
- **Instant Processing**: Starts AI generation immediately
- **Clear Results**: Shows formatted responses

## 🎨 Example Workflows

### **LinkedIn Post Engagement**
1. **Browse LinkedIn** and find an interesting post
2. **Select the post text** (highlight it)
3. **Right-click** to see context menu
4. **Click "Generate comments"**
5. **Get 3 professional comment suggestions**
6. **Copy and paste** the best comment

### **Content Analysis**
1. **Select any article text** or social media post
2. **Right-click** for context menu
3. **Click "Ask followup question"**
4. **Get an engaging question** to ask
5. **Use the question** to continue the conversation

## 🛠️ Technical Details

### **Files Modified**
- `src/content.js` - Added context menu creation and event handling
- `src/background.js` - Added AI request processing
- `src/popup.ts` - Added context menu request handling
- `src/manifest.json` - Added notifications permission

### **Key Functions**
- `createContextMenu()` - Creates the context menu UI
- `generateComments()` - Handles comment generation requests
- `askFollowupQuestion()` - Handles followup question requests
- `handleContextMenuRequest()` - Processes requests in popup

### **Permissions Added**
- `notifications` - For showing processing status

## 🚀 Benefits

### **Efficiency**
- **One-Click Access**: No need to open extension manually
- **Context-Aware**: Automatically includes selected text
- **Instant Results**: No manual prompt writing

### **Professional Use**
- **LinkedIn Ready**: Perfect for social media engagement
- **Thoughtful Responses**: AI generates professional comments
- **Engagement Boost**: Helps create meaningful interactions

### **Versatility**
- **Any Website**: Works on LinkedIn, Twitter, articles, etc.
- **Any Content**: Text, posts, articles, comments
- **Multiple Use Cases**: Comments, questions, analysis

## 🔮 Future Enhancements

Potential improvements:
- **Custom Prompts**: User-defined prompt templates
- **Multiple Options**: More context menu choices
- **Quick Actions**: Direct copy to clipboard
- **History**: Save generated responses
- **Templates**: Industry-specific comment templates

## 📋 Installation & Testing

1. **Build the extension**:
   ```bash
   npm run build
   ```

2. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select the `dist/` folder

3. **Test the feature**:
   - Go to LinkedIn or any website
   - Select some text
   - Right-click to see the context menu
   - Try both options!

## 🎯 Use Cases

### **LinkedIn Professionals**
- Generate thoughtful comments on industry posts
- Ask engaging followup questions
- Build professional relationships

### **Content Creators**
- Analyze social media content
- Generate engagement ideas
- Create discussion starters

### **Students & Researchers**
- Analyze article content
- Generate discussion questions
- Understand complex topics

### **Social Media Managers**
- Create engagement strategies
- Generate response ideas
- Analyze content performance 