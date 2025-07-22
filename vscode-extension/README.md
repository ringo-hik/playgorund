# SWDP ChatOps Extension

VSCode extension for SWDP ChatOps integration with one-click automation

## Features

### 🤖 Weekly Report Automation
- Generate comprehensive weekly reports based on your development activity
- Apply AI-powered feedback to improve report content
- Automatic saving with timestamp-based file naming (e.g., `weekly_report_250122_1430.md`)

### 🔐 Authentication Management
- Secure token-based authentication
- Easy setup through VSCode settings or command palette
- Real-time authentication status checking
- Auto-retry on authentication failure

### 📊 Smart UI Integration
- Activity bar integration with ChatOps icon (🤖)
- Tree view for easy navigation
- Context-sensitive commands

## Installation

### Method 1: VSIX Installation (Recommended)
1. Download the `swdp-chatops-extension-1.0.0.vsix` file
2. Open VSCode
3. Go to Extensions view (Ctrl+Shift+X)
4. Click "..." menu → "Install from VSIX"
5. Select the downloaded `.vsix` file

### Method 2: Command Line
```bash
code --install-extension swdp-chatops-extension-1.0.0.vsix
```

## Setup & Configuration

### 1. Configure Authentication Token
**Option A: Through Settings**
1. Open VSCode Settings (Ctrl+,)
2. Search for "SWDP ChatOps"
3. Enter your authentication token in "Auth Token" field

**Option B: Through Command Palette**
1. Press Ctrl+Shift+P
2. Type "SWDP ChatOps: Check Authentication"
3. Enter token when prompted (if not set)

### 2. Verify Connection
1. Find the ChatOps icon (🤖) in the Activity Bar
2. Click "Check Authentication" in the tree view
3. Confirm "Authentication successful!" message

## Usage Guide

### Generating Weekly Reports
1. Click the ChatOps icon (🤖) in Activity Bar
2. Expand "Weekly Reports" → "Weekly Report Actions"
3. Click "Process Weekly Report"
4. Choose action:
   - **Generate New Report**: Creates fresh weekly report based on last 8 days
   - **Provide Feedback**: Modify existing report with AI feedback

### Report Management
- Reports auto-saved to: `workspace/swdp_chatops/weekly_report/`
- File format: Markdown (.md)
- Naming: `weekly_report_YYMMDD_HHMM.md`
- Auto-opens in editor after generation

---

# SWDP ChatOps 확장 프로그램

클릭 한 번으로 자동화되는 SWDP ChatOps 통합을 위한 VSCode 확장 프로그램입니다.

## 기능

- **주간 보고서 생성**: 활동을 기반으로 주간 보고서를 자동으로 생성합니다.
- **피드백 통합**: 생성된 보고서를 구체화하고 개선하기 위해 피드백을 제공합니다.
- **보고서 저장**: 보고서를 작업 공간에 직접 저장합니다.
- **인증**: 인증 토큰을 사용하여 SWDP ChatOps API에 안전하게 연결합니다.

## 설치

1.  Visual Studio Code를 엽니다.
2.  확장 프로그램 보기로 이동합니다 (`Ctrl+Shift+X`).
3.  `SWDP ChatOps Extension`을 검색합니다.
4.  `설치`를 클릭합니다.

## 설정

1.  확장 프로그램을 설치한 후 인증 토큰을 구성해야 합니다.
2.  SWDP ChatOps 보기에서 설정 아이콘을 클릭하거나 명령 팔레트(`Ctrl+Shift+P`)를 열고 `SWDP ChatOps: Open Settings`를 검색합니다.
3.  그러면 확장 프로그램의 설정 페이지가 열립니다.
4.  `Swdp Chat Ops: Auth Token` 필드에 인증 토큰을 입력합니다.

## 사용법

1.  활동 표시줄에서 로봇 아이콘을 클릭하여 SWDP ChatOps 보기를 엽니다.
2.  **인증 확인**: `Check Authentication` 항목을 클릭하여 토큰을 확인합니다.
3.  **주간 보고서 처리**: `Process Weekly Report` 항목을 클릭하여 새 보고서를 생성하거나 기존 보고서에 대한 피드백을 제공합니다.
4.  **보고서 저장**: `Save Report` 항목을 클릭하여 현재 보고서를 작업 공간에 저장합니다.
