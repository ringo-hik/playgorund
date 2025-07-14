<template>
  <Icon v-if="iconData" :icon="iconData" :width="width" :height="height" :style="{ fill: fill }" />
  <span v-else class="icon-fallback">{{ name }}</span>
</template>

<script>
import { Icon } from '@iconify/vue'

// Icon mappings
const iconMap = {
  'comment': 'uil:comment',
  'times': 'uil:times',
  'heart': 'uil:heart',
  'grid': 'uil:apps',
  'star': 'uil:star',
  'info-circle': 'uil:info-circle',
  'home': 'uil:home',
  'redo': 'uil:redo',
  'trash': 'uil:trash',
  'user': 'uil:user',
  'wrench': 'uil:wrench',
  'cog': 'uil:cog',
  'chart-bar': 'uil:chart-bar',
  'check-circle': 'uil:check-circle',
  'exclamation-triangle': 'uil:exclamation-triangle',
  'edit': 'uil:edit',
  'message': 'uil:message',
  'minus': 'uil:minus',
  'expand-arrows-alt': 'uil:expand-arrows-alt',
  'compress-arrows-alt': 'uil:compress-arrows-alt',
  'code-branch': 'uil:code-branch',
  'plus': 'uil:plus',
  // Additional mappings for missing icons
  'apps': 'uil:apps',
  'question-circle': 'uil:question-circle',
  'lightbulb': 'uil:lightbulb-alt',
  'comments': 'uil:comments',
  'headphones': 'uil:headphones',
  'tools': 'uil:wrench',
  // Missing icons found in code
  'users-alt': 'uil:users-alt',
  'angle-right': 'uil:angle-right',
  'arrow-left': 'uil:arrow-left',
  'bolt': 'uil:bolt',
  'exchange-alt': 'uil:exchange-alt',
  'copy': 'uil:copy',
  'check': 'uil:check',
  'lightbulb-alt': 'uil:lightbulb-alt',
  'folder': 'uil:folder'
}

export default {
  name: 'Unicon',
  components: {
    Icon
  },
  props: {
    name: {
      type: String,
      required: true
    },
    fill: {
      type: String,
      default: 'currentColor'
    },
    width: {
      type: [String, Number],
      default: 24
    },
    height: {
      type: [String, Number],
      default: 24
    }
  },
  computed: {
    iconData() {
      return iconMap[this.name] || null
    }
  }
}
</script>

<style scoped>
.icon-fallback {
  display: inline-block;
  width: 1em;
  height: 1em;
  font-size: inherit;
  text-align: center;
  background: #ccc;
  border-radius: 2px;
}

/* Iconify 아이콘이 제대로 표시되도록 강제 설정 */
:deep(.iconify) {
  display: inline-block !important;
  width: inherit !important;
  height: inherit !important;
  vertical-align: middle;
}

/* SVG 요소가 제대로 표시되도록 강제 설정 */
:deep(svg) {
  display: inline-block !important;
  width: inherit !important;
  height: inherit !important;
  fill: currentColor;
  vertical-align: middle;
}
</style>