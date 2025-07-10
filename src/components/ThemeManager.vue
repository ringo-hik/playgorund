<template>
  <button @click="changeColorTheme" class="theme-btn" :title="getCurrentThemeName()">
    <span class="theme-indicator" :class="currentTheme"></span>
  </button>
</template>

<script>
export default {
  name: 'ThemeManager',
  data() {
    return {
      currentTheme: this.getInitialTheme(),
    };
  },
  props: {
    currentLanguage: {
      type: String,
      default: 'ko'
    }
  },
  methods: {
    getInitialTheme() {
      try {
        return localStorage.getItem('float-chat-theme') || 'default';
      } catch (error) {
        return 'default';
      }
    },
    changeColorTheme() {
      const themes = ['default', 'gucci', 'hermes', 'harry-winston', 'bugatti'];
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      this.currentTheme = themes[nextIndex];
      
      this.applyTheme(this.currentTheme);
      
      try {
        localStorage.setItem('float-chat-theme', this.currentTheme);
      } catch (error) {
      }
    },
    getCurrentThemeName() {
      const themeNames = {
        ko: {
          'default': '기본 테마',
          'gucci': '구찌 테마',
          'hermes': '에르메스 테마',
          'harry-winston': '해리 윈스턴 테마',
          'bugatti': '부가티 테마'
        },
        en: {
          'default': 'Default Theme',
          'gucci': 'Gucci Theme', 
          'hermes': 'Hermès Theme',
          'harry-winston': 'Harry Winston Theme',
          'bugatti': 'Bugatti Theme'
        }
      };
      
      return themeNames[this.currentLanguage][this.currentTheme] || '테마 변경';
    },
    applyTheme(themeName) {
      const root = document.documentElement;
      
      // 기존 테마 클래스 제거
      root.classList.remove('theme-default', 'theme-gucci', 'theme-hermes', 'theme-harry-winston', 'theme-bugatti');
      
      // 새 테마 클래스 추가
      root.classList.add(`theme-${themeName}`);
      
      const themeColors = {
        default: {
          // 기본 레이아웃 변수
          '--float-size': '60px',
          '--chat-width': '455px', 
          '--chat-height': '676px',
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px',
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(12, 35, 64, 0.12), 0 10px 10px -5px rgba(12, 35, 64, 0.06)',
          '--shadow-md': '0 4px 6px -1px rgba(12, 35, 64, 0.08), 0 2px 4px -1px rgba(12, 35, 64, 0.04)',
          '--shadow-sm': '0 1px 2px 0 rgba(12, 35, 64, 0.03)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 은은한 배경 색상 (너무 과하지 않게)
          '--primary-blue': '#4A90E2',
          '--primary-navy': '#2C3E50',
          '--primary-gold': '#D4B896',
          '--primary-gray': '#E8EAF0',
          '--surface-white': '#FEFEFE',
          '--surface-light': '#F9FAFB',
          '--bg-light': '#F5F6F8',
          '--bg-medium': '#EBEDF2',
          '--text-primary': '#1A202C',
          '--text-secondary': '#4A5568',
          '--text-muted': '#718096',
          '--text-light': '#FFFFFF',
          '--border-light': '#E2E8F0',
          '--border-gray': '#CBD5E1',
          // 포인트 감성 색상 (카테고리/아이콘용)
          '--luxury-emerald': '#20B2AA',
          '--luxury-emerald-dark': '#1A9A92',
          '--luxury-burgundy': '#B8860B',
          '--luxury-burgundy-dark': '#A0750A',
          '--luxury-sapphire': '#4169E1',
          '--luxury-sapphire-dark': '#3A5FCD',
          '--luxury-cyan': '#40E0D0',
          '--luxury-cyan-dark': '#38C9B8',
          '--success-color': '#48BB78',
          '--error-color': '#E53E3E',
          '--delete-color': '#F56565',
          '--delete-hover': '#E53E3E'
        },
        gucci: {
          // 기본 레이아웃 변수 (동일)
          '--float-size': '60px',
          '--chat-width': '455px',
          '--chat-height': '676px', 
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px',
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(13, 91, 60, 0.12), 0 10px 10px -5px rgba(13, 91, 60, 0.06)',
          '--shadow-md': '0 4px 6px -1px rgba(13, 91, 60, 0.08), 0 2px 4px -1px rgba(13, 91, 60, 0.04)',
          '--shadow-sm': '0 1px 2px 0 rgba(13, 91, 60, 0.03)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 구찌 색상 - 은은한 그린 베이스
          '--primary-blue': '#2E8B57',
          '--primary-navy': '#1C4D3A',
          '--primary-gold': '#E6D7C3',
          '--primary-gray': '#E8F2E8',
          '--surface-white': '#FDFFFE',
          '--surface-light': '#F8FBF8',
          '--bg-light': '#F3F8F3',
          '--bg-medium': '#E8F2E8',
          '--text-primary': '#1A3A1A',
          '--text-secondary': '#2D5A2D',
          '--text-muted': '#5A7A5A',
          '--text-light': '#FFFFFF',
          '--border-light': '#D1E7D1',
          '--border-gray': '#B8D8B8',
          // 포인트 색상 - 구찌 특유의 감성
          '--luxury-emerald': '#0D5B3C',
          '--luxury-emerald-dark': '#0A3D29',
          '--luxury-burgundy': '#9B1C31',
          '--luxury-burgundy-dark': '#7A1526',
          '--luxury-sapphire': '#1B5E20',
          '--luxury-sapphire-dark': '#0D3A14',
          '--luxury-cyan': '#00695C',
          '--luxury-cyan-dark': '#004D40',
          '--success-color': '#2E7D32',
          '--error-color': '#C62828',
          '--delete-color': '#E57373',
          '--delete-hover': '#D32F2F'
        },
        hermes: {
          // 기본 레이아웃 변수 (동일)
          '--float-size': '60px',
          '--chat-width': '455px',
          '--chat-height': '676px',
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px', 
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(243, 112, 33, 0.12), 0 10px 10px -5px rgba(243, 112, 33, 0.06)',
          '--shadow-md': '0 4px 6px -1px rgba(243, 112, 33, 0.08), 0 2px 4px -1px rgba(243, 112, 33, 0.04)',
          '--shadow-sm': '0 1px 2px 0 rgba(243, 112, 33, 0.03)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 에르메스 색상 - 은은한 오렌지 베이스
          '--primary-blue': '#D2691E',
          '--primary-navy': '#8B4513',
          '--primary-gold': '#F0E5D0',
          '--primary-gray': '#F5F0E8',
          '--surface-white': '#FFFEF9',
          '--surface-light': '#FDF8F2',
          '--bg-light': '#FAF5EE',
          '--bg-medium': '#F2E8DC',
          '--text-primary': '#5D4037',
          '--text-secondary': '#795548',
          '--text-muted': '#8D6E63',
          '--text-light': '#FFFFFF',
          '--border-light': '#E6D7C8',
          '--border-gray': '#D7C4B0',
          // 포인트 색상 - 에르메스 특유의 감성
          '--luxury-emerald': '#A0522D',
          '--luxury-emerald-dark': '#8B4513',
          '--luxury-burgundy': '#B8860B',
          '--luxury-burgundy-dark': '#9A7209',
          '--luxury-sapphire': '#CD853F',
          '--luxury-sapphire-dark': '#B8751F',
          '--luxury-cyan': '#DEB887',
          '--luxury-cyan-dark': '#D2B48C',
          '--success-color': '#8FBC8F',
          '--error-color': '#CD5C5C',
          '--delete-color': '#F4A460',
          '--delete-hover': '#DAA520'
        },
        'harry-winston': {
          // 기본 레이아웃 변수 (동일)
          '--float-size': '60px',
          '--chat-width': '455px',
          '--chat-height': '676px',
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px',
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(0, 33, 64, 0.15), 0 10px 10px -5px rgba(0, 33, 64, 0.08)',
          '--shadow-md': '0 4px 6px -1px rgba(0, 33, 64, 0.12), 0 2px 4px -1px rgba(0, 33, 64, 0.06)',
          '--shadow-sm': '0 1px 2px 0 rgba(0, 33, 64, 0.04)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 해리 윈스턴 색상 - 은은한 사파이어 블루 베이스
          '--primary-blue': '#1E3A8A',
          '--primary-navy': '#0F172A',
          '--primary-gold': '#E5E7EB',
          '--primary-gray': '#F1F5F9',
          '--surface-white': '#FEFEFE',
          '--surface-light': '#F8FAFC',
          '--bg-light': '#F1F5F9',
          '--bg-medium': '#E2E8F0',
          '--text-primary': '#0F172A',
          '--text-secondary': '#334155',
          '--text-muted': '#64748B',
          '--text-light': '#FFFFFF',
          '--border-light': '#E2E8F0',
          '--border-gray': '#CBD5E1',
          // 포인트 색상 - 다이아몬드와 사파이어의 감성
          '--luxury-emerald': '#059669',
          '--luxury-emerald-dark': '#047857',
          '--luxury-burgundy': '#7C2D12',
          '--luxury-burgundy-dark': '#6B1F0F',
          '--luxury-sapphire': '#1E40AF',
          '--luxury-sapphire-dark': '#1E3A8A',
          '--luxury-cyan': '#0891B2',
          '--luxury-cyan-dark': '#0E7490',
          '--success-color': '#059669',
          '--error-color': '#DC2626',
          '--delete-color': '#EF4444',
          '--delete-hover': '#DC2626'
        },
        bugatti: {
          // 기본 레이아웃 변수 (동일)
          '--float-size': '60px',
          '--chat-width': '455px',
          '--chat-height': '676px',
          '--header-height': '72px',
          '--font-family': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '--radius-full': '50%',
          '--radius-md': '8px',
          '--radius-sm': '4px',
          '--shadow-lg': '0 20px 25px -5px rgba(49, 140, 231, 0.15), 0 10px 10px -5px rgba(49, 140, 231, 0.08)',
          '--shadow-md': '0 4px 6px -1px rgba(49, 140, 231, 0.12), 0 2px 4px -1px rgba(49, 140, 231, 0.06)',
          '--shadow-sm': '0 1px 2px 0 rgba(49, 140, 231, 0.04)',
          '--transition-smooth': '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // 부가티 색상 - 은은한 레이싱 블루 베이스
          '--primary-blue': '#2563EB',
          '--primary-navy': '#1E293B',
          '--primary-gold': '#FED7AA',
          '--primary-gray': '#F1F5F9',
          '--surface-white': '#FEFEFE',
          '--surface-light': '#F8FAFC',
          '--bg-light': '#F1F5F9',
          '--bg-medium': '#E2E8F0',
          '--text-primary': '#0F172A',
          '--text-secondary': '#334155',
          '--text-muted': '#64748B',
          '--text-light': '#FFFFFF',
          '--border-light': '#E2E8F0',
          '--border-gray': '#CBD5E1',
          // 포인트 색상 - 스피드와 럭셔리의 감성
          '--luxury-emerald': '#10B981',
          '--luxury-emerald-dark': '#059669',
          '--luxury-burgundy': '#B91C1C',
          '--luxury-burgundy-dark': '#991B1B',
          '--luxury-sapphire': '#2563EB',
          '--luxury-sapphire-dark': '#1D4ED8',
          '--luxury-cyan': '#06B6D4',
          '--luxury-cyan-dark': '#0891B2',
          '--success-color': '#10B981',
          '--error-color': '#DC2626',
          '--delete-color': '#EF4444',
          '--delete-hover': '#DC2626'
        }
      };
      
      const colors = themeColors[themeName] || themeColors.default;
      
      // CSS 변수 적용
      Object.keys(colors).forEach(property => {
        root.style.setProperty(property, colors[property]);
      });
    },
  },
  mounted() {
    this.applyTheme(this.currentTheme);
  }
}
</script>

<style scoped>
.theme-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--primary-gray);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  position: relative;
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--primary-gold);
  transform: translateY(-1px) scale(1.05);
  box-shadow: var(--shadow-sm);
}

.theme-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.theme-indicator.default {
  background: linear-gradient(45deg, #4A90E2 0%, #D4B896 50%, #2C3E50 100%);
}

.theme-indicator.gucci {
  background: linear-gradient(45deg, #2E8B57 0%, #E6D7C3 50%, #9B1C31 100%);
}

.theme-indicator.hermes {
  background: linear-gradient(45deg, #D2691E 0%, #F0E5D0 50%, #8B4513 100%);
}

.theme-indicator.harry-winston {
  background: linear-gradient(45deg, #1E3A8A 0%, #E5E7EB 50%, #0F172A 100%);
}

.theme-indicator.bugatti {
  background: linear-gradient(45deg, #2563EB 0%, #FED7AA 50%, #1E293B 100%);
}

.theme-indicator::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: inherit;
  opacity: 0.3;
  filter: blur(2px);
  z-index: -1;
}
</style>
