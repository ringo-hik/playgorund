# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI ChatOps Demo Application - A Vue.js-based web application that enables conversation with various AI personas. The system supports multiple themes, languages (Korean/English), and provides comprehensive markdown rendering capabilities.

## Development Commands

### Core Development

```bash
# Frontend development server (runs on port 3001)
npm run dev

# Backend mock server (runs on port 3004)
npm run mock:serve

# Production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all Playwright tests
npm test

# Run tests with interactive UI
npm run test:ui

# View test report
npm run test:report
```

### Dual Server Setup

The application requires both servers running simultaneously:

1. Frontend (Vite dev server) on port 3001
2. Backend (JSON server) on port 3004 serving `db.json`

## Architecture Overview

### Core Application Flow

1. **AIChatOpsLayout.vue** - Main application container managing view state and navigation
2. **Multi-view System**: Category selection → Persona list → Chat interface → Feedback
3. **Service Layer**: All API communication handled through `aiChatOpsService.js`
4. **State Management**: Vue reactive data with message caching and session management

### Key Components Architecture

#### AIChatOpsLayout.vue (Main Container)

- **View Management**: `currentView` state controls display (category/persona/chat/feedback)
- **Persona Management**: Loading, filtering, and selection of AI personas
- **Message Caching**: `personaMessageCache` Map for conversation persistence
- **Theme System**: 5 built-in themes with dynamic CSS variable switching

#### ChatTab.vue (Chat Interface)

- **Message Flow**: User input → API call → Response rendering → History storage
- **Loading States**: Dynamic loading messages with animated indicators
- **Memory Management**: Conversation history with configurable limits
- **Auto-queries**: Special behavior for `chatbot_manual` persona

#### aiChatOpsService.js (API Service)

- **HTTP Client**: Axios-based with error handling and timeout management
- **Content Processing**: Markdown detection, HTML conversion, and smart copying
- **Response Standardization**: Consistent API response format across all endpoints
- **Content Type Detection**: Automatic markdown/HTML/plain text identification

### Data Flow Architecture

#### Persona System

```
db.json → getPersonas() → AIChatOpsLayout → ChatTab → User Interface
```

- Personas contain: `personaCode`, `title`, `description`, `category`, `tags`, `welcomeMsg`
- Categories: `personal`, `general`, `operation`
- Welcome messages support markdown formatting

#### Message Processing

```
User Input → ChatTab → aiChatOpsService → API → Response → Content Processing → UI Rendering
```

- Copy functionality preserves original format (markdown/HTML/plain text)
- Message history cached per persona with session management

#### Theme System

```
AIChatOpsLayout → CSS Variables → Component Styling
```

- Themes: `default`, `dark`, `heritage`, `classic`, `retro`
- CSS variables cascade through all components
- Theme persistence in browser storage

### Critical Implementation Details

#### Content Rendering Strategy

- **Detection**: `isMarkdown()` method identifies content type
- **Rendering**: `formatContentForDisplay()` applies appropriate transformation
- **Copying**: `getContentForCopy()` maintains original format for clipboard

#### Message Caching System

- **Storage**: `personaMessageCache` Map with `personaCode` as key
- **Limits**: `maxMessagesPerPersona` configuration
- **Persistence**: Automatic save/load on persona switching

#### Error Handling Pattern

- **Service Layer**: All API calls wrapped in try-catch with standardized error responses
- **HTTP Status Mapping**: Specific error codes mapped to user-friendly messages
- **Graceful Degradation**: Fallback content for failed operations

### Testing Architecture

#### Playwright Configuration

- **Base URL**: `http://localhost:3001`
- **Timeout**: 30 seconds for operations, 5 seconds for assertions
- **Test Structure**: Component interaction testing with visual verification
- **Data Attributes**: `data-testid` attributes for reliable element selection

#### Test Categories

- **UI Interaction**: Persona selection, message sending, copy functionality
- **Content Rendering**: Markdown processing, welcome message display
- **Navigation**: View switching and state management

### Database Structure (db.json)

#### Mock API Endpoints

- `/health` - System health check
- `/personas` - Persona list with metadata
- `/message-async` - Chat message processing
- `/quick-questions` - Dynamic question generation
- `/conversations/:personaCode` - Conversation history

#### Persona Data Schema

```json
{
  "personaCode": "unique_identifier",
  "title": "Display Name",
  "description": "Brief description",
  "category": "personal|general|operation",
  "tags": ["tag1", "tag2"],
  "welcomeMsg": "Markdown formatted welcome message"
}
```

## Development Guidelines

### File Modification Patterns

- **Vue Components**: Always read existing file before editing to maintain structure
- **Service Layer**: Add new methods following existing error handling patterns
- **Styling**: Use existing CSS variables and component class naming conventions
- **Testing**: Add `data-testid` attributes for new interactive elements

### State Management Approach

- **No External Store**: Uses Vue's reactive data system
- **Message Persistence**: Manual caching with Map-based storage
- **Session Management**: Persona-specific session IDs for conversation continuity

### Content Processing Pipeline

1. **Input**: Raw content from API or user input
2. **Detection**: Automatic content type identification
3. **Processing**: Markdown rendering or HTML sanitization
4. **Rendering**: Vue template with `v-html` directive
5. **Copying**: Format-preserving clipboard operations

### Commit Convention

- Create commits after completing functional changes
- Include Korean descriptions for UI-related changes
- Follow existing commit message patterns with co-authoring
