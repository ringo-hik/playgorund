function convertMarkdownToHtml(mdString) {
    let html = '';
    // 연속된 빈 줄을 하나로 축소
    const normalizedMd = mdString.replace(/\n\s*\n\s*\n+/g, '\n\n');
    const lines = normalizedMd.split('\n');
    let inCodeBlock = false;
    let codeLang = '';
    let inTable = false;
    let tableRows = [];
    let inBlockquote = false;
    let inAlert = false;
    let alertType = '';
    let inList = false;
    let listStack = []; // 중첩 리스트 지원을 위한 스택
    let paragraphBuffer = []; // 단락 버퍼

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        let originalLine = lines[i]; // 들여쓰기 보존

        // 코드 블록 처리
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                html += '</pre></div>';
                inCodeBlock = false;
                codeLang = '';
            } else {
                codeLang = line.replace('```', '').trim();
                html += '<div class="markdown-code-block">';
                html += `<div class="code-header"><span class="code-lang">${codeLang || 'code'}</span><button class="copy-code-btn">Copy</button></div>`;
                html += '<pre>';
                inCodeBlock = true;
            }
            continue;
        }
        if (inCodeBlock) {
            html += escapeHtml(originalLine) + '\n'; // 원본 라인 사용 (들여쓰기 유지)
            continue;
        }

        // 알림 박스 처리 (GFM 스타일: > [!NOTE] 등)
        if (line.startsWith('> [!')) {
            const match = line.match(/^> \[!(\w+)\]/);
            if (match) {
                alertType = match[1].toLowerCase();
                let classType = '';
                let iconType = '';
                switch (alertType) {
                    case 'note': case 'info': 
                        classType = 'info'; 
                        iconType = 'ℹ️'; 
                        break;
                    case 'tip': case 'success': 
                        classType = 'success'; 
                        iconType = '✅'; 
                        break;
                    case 'warning': 
                        classType = 'warning'; 
                        iconType = '⚠️'; 
                        break;
                    case 'caution': case 'error': 
                        classType = 'error'; 
                        iconType = '❌'; 
                        break;
                    default: 
                        classType = 'info';
                        iconType = 'ℹ️';
                }
                html += `<div class="markdown-alert markdown-alert-${classType}">`;
                const text = line.replace(/^> \[!\w+\]\s*/, '').trim();
                html += `<span class="markdown-alert-icon">${iconType}</span>`;
                if (text) html += `<div>${parseInline(text)}</div>`;
                inAlert = true;
                continue;
            }
        }
        if (inAlert && line.startsWith('> ')) {
            const text = line.replace(/^>\s*/, '').trim();
            html += `<p>${parseInline(text)}</p>`;
            continue;
        } else if (inAlert) {
            html += '</div>';
            inAlert = false;
        }

        // 헤딩 처리
        if (line.startsWith('#')) {
            closeLists(); // 리스트 종료
            const level = line.match(/^#+/)[0].length;
            const text = line.replace(/^#+\s*/, '').trim();
            html += `<h${level} class="markdown-h${level} markdown-heading">${parseInline(text)}</h${level}>`;
            continue;
        }

        // 리스트 처리 (중첩 지원)
        const indentLevel = originalLine.match(/^\s*/)[0].length / 2; // 2스페이스당 레벨
        const isUnordered = line.match(/^(\s*)[-*+]\s/);
        const isOrdered = line.match(/^(\s*)\d+\.\s/);
        if (isUnordered || isOrdered) {
            adjustListStack(indentLevel, isUnordered ? 'ul' : 'ol');
            const item = line.replace(/^(\s*)[-*+]?\s*\d*\.?\s*/, '').trim();
            html += `<li class="markdown-list-item markdown-list-item-level-${indentLevel}">${parseInline(item)}</li>`;
            continue;
        } else {
            closeLists();
        }

        // 인용구 처리
        if (line.startsWith('>') && !inAlert) {
            if (!inBlockquote) {
                html += '<blockquote class="markdown-blockquote">';
                inBlockquote = true;
            }
            const text = line.replace(/^>\s*/, '').trim();
            html += `<p>${parseInline(text)}</p>`;
            continue;
        } else if (inBlockquote) {
            html += '</blockquote>';
            inBlockquote = false;
        }

        // 테이블 처리
        if (line.startsWith('|')) {
            if (!inTable) {
                inTable = true;
                tableRows = [];
            }
            tableRows.push(line);
            // 테이블이 끝나는지 확인 (다음 줄이 |로 시작하지 않거나 마지막 줄일 경우)
            if (i + 1 >= lines.length || !lines[i + 1].trim().startsWith('|')) {
                html += processTable(tableRows);
                inTable = false;
                tableRows = [];
            }
            continue;
        }

        // 구분선 처리
        if (line.match(/^[-*]{3,}$/)) {
            closeLists();
            html += '<hr class="markdown-hr">';
            continue;
        }

        // 단락 처리
        if (line) {
            closeLists();
            // 이전 줄이 두 개 공백으로 끝나는지 확인 (마크다운 강제 줄바꿈)
            const prevLineEndsWithTwoSpaces = i > 0 && lines[i-1].endsWith('  ');
            if (paragraphBuffer.length > 0 && prevLineEndsWithTwoSpaces) {
                // 강제 줄바꿈: 같은 단락 내에서 <br> 추가
                paragraphBuffer.push('<br>' + parseInline(line));
            } else if (paragraphBuffer.length > 0) {
                // 일반적인 줄바꿈: 공백으로 연결 (마크다운에서 단일 줄바꿈은 공백으로 처리)
                paragraphBuffer.push(' ' + parseInline(line));
            } else {
                // 새 단락 시작
                paragraphBuffer = [parseInline(line)];
            }
        } else if (paragraphBuffer.length > 0) {
            // 빈 줄을 만나면 현재 단락 완료
            html += `<p class="markdown-paragraph">${paragraphBuffer.join('')}</p>`;
            paragraphBuffer = [];
        }
    }

    // 열린 태그 닫기
    closeAll();

    return `<div class="markdown-content">${html}</div>`;

    // 헬퍼 함수들
    function closeLists() {
        while (listStack.length > 0) {
            html += `</${listStack.pop()}>`;
        }
        inList = false;
    }

    function adjustListStack(level, type) {
        while (listStack.length > level) {
            html += `</${listStack.pop()}>`;
        }
        if (listStack.length < level) {
            html += `<${type} class="markdown-list markdown-list-level-${level}">`;
            listStack.push(type);
        } else if (listStack.length === level && listStack[listStack.length - 1] !== type) {
            html += `</${listStack.pop()}>`;
            html += `<${type} class="markdown-list markdown-list-level-${level}">`;
            listStack.push(type);
        }
        inList = true;
    }

    function closeAll() {
        // 마지막에 남은 단락 처리
        if (paragraphBuffer.length > 0) {
            html += `<p class="markdown-paragraph">${paragraphBuffer.join('')}</p>`;
            paragraphBuffer = [];
        }
        if (inCodeBlock) html += '</pre></div>';
        if (inAlert) html += '</div>';
        closeLists();
        if (inBlockquote) html += '</blockquote>';
        if (inTable) {
            html += processTable(tableRows);
            inTable = false;
            tableRows = [];
        }
    }

    function processTable(rows) {
        if (rows.length < 2) return ''; // 헤더와 구분선 최소 2줄 필요

        let tableHtml = '<div class="markdown-table-container"><table class="markdown-table">';
        const headerLine = rows[0];
        const alignmentLine = rows[1];
        const dataLines = rows.slice(2);

        const headers = headerLine.split('|').map(cell => cell.trim()).slice(1, -1); // 양 끝의 빈 문자열 제거
        const alignments = alignmentLine.split('|').map(cell => cell.trim()).slice(1, -1);

        // a. 테이블 헤더 생성
        tableHtml += '<thead><tr>';
        headers.forEach((header, index) => {
            const align = alignments[index] || '';
            let alignClass = '';
            if (align.startsWith(':') && align.endsWith(':')) {
                alignClass = ' style="text-align: center;"';
            } else if (align.endsWith(':')) {
                alignClass = ' style="text-align: right;"';
            } else {
                alignClass = ' style="text-align: left;"';
            }
            tableHtml += `<th${alignClass}>${parseInline(header)}</th>`;
        });
        tableHtml += '</tr></thead>';

        // b. 테이블 본문 생성
        tableHtml += '<tbody>';
        dataLines.forEach(rowLine => {
            const cells = rowLine.split('|').map(cell => cell.trim()).slice(1, -1);
            tableHtml += '<tr>';
            cells.forEach((cell, index) => {
                const align = alignments[index] || '';
                let alignClass = '';
                if (align.startsWith(':') && align.endsWith(':')) {
                    alignClass = ' style="text-align: center;"';
                } else if (align.endsWith(':')) {
                    alignClass = ' style="text-align: right;"';
                } else {
                    alignClass = ' style="text-align: left;"';
                }
                tableHtml += `<td${alignClass}>${parseInline(cell)}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody>';

        tableHtml += '</table></div>';
        return tableHtml;
    }
}

function parseInline(text) {
    // 재귀적 중첩 인라인 파싱 (중첩 지원)
    function parseRecur(t) {
        // 링크 먼저 (복잡성 때문) - [text](url) 형태
        t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="markdown-link">$1</a>');
        // 볼드
        t = t.replace(/\*\*(.*?)\*\*/g, (match, p1) => `<strong class="markdown-strong">${parseRecur(p1)}</strong>`);
        // 이탤릭 (볼드와 충돌 방지)
        t = t.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (match, p1) => `<em class="markdown-em">${parseRecur(p1)}</em>`);
        // 인라인 코드
        t = t.replace(/`(.*?)`/g, '<code class="markdown-inline-code">$1</code>');
        return t;
    }
    return parseRecur(text);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export { convertMarkdownToHtml };