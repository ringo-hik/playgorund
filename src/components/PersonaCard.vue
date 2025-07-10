<template>
  <button 
    @click="$emit('select')" 
    class="persona-card"
    :disabled="disabled"
  >
    <div class="persona-icon">
      <unicon :name="icon" fill="var(--primary-gold)" :width="24" :height="24" />
    </div>
    <div class="persona-info">
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
    <div class="arrow-icon">
      <unicon name="angle-right" fill="#CBD1DA" :width="16" :height="16" />
    </div>
  </button>
</template>

<script>
export default {
  name: 'PersonaCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
