<template>
  <button 
    @click="$emit('select')" 
    class="category-card"
    :class="category"
    :disabled="disabled"
  >
    <div class="category-icon" :class="category">
      <unicon :name="icon" fill="white" :width="24" :height="24" />
    </div>
    <div class="category-info">
      <h4>{{ title }}</h4>
      <p>{{ description }}</p>
    </div>
  </button>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    category: {
      type: String,
      required: true
    },
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
