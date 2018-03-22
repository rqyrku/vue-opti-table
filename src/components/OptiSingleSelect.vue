<template>
  <div>
    <b-dropdown>
      <div slot="button-content" class="placeholder" v-html="$c_placeholder"></div>

      <b-dropdown-item class="item"
        v-for="(item, i) in list" :key="i"
        :class="{ 'active-item': item.selected }"
        @click="$_itemClickAction(item)"
        v-html="item.content"
      ></b-dropdown-item>

    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'opti-single-select',
  props: {
    list: { type: Array, required: true },
    placeholder: { type: String, default: '' },
    staticPlaceholder: { type: String, default: '' },
    onClick: { type: Function, default: null },
  },
  data() {
    return {
    };
  },
  computed: {
    $c_selectedItem() {
      return this.list.find(item => item.selected);
    },
    $c_placeholder() {
      if (this.staticPlaceholder) {
        return this.staticPlaceholder;
      }
      return (this.$c_selectedItem && this.$c_selectedItem.content) || this.placeholder;
    },
  },
  methods: {
    $_itemClickAction(item) {
      this.list.forEach(item => (item.selected = false));
      item.selected = true;
      this.$emit('input', item);
      if (this.onClick) {
        this.onClick(item);
      }
    },
  },
  created() {
    if (this.list.length) {
      this.$emit('input', this.$c_selectedItem || null);
    }
  },
};
</script>

<style>
  .b-dropdown > * {
    width: 100% !important;
  }
</style>

<style scoped>
  .b-dropdown {
    width: 100% !important;
  }
  .placeholder {
    width: calc(100% - 10px) !important;
    display: inline-block;
    text-align: left;
  }
  .item {
    width: 100% !important;
    font-size: 13px;
    height: 35px;
    line-height: 35px;
    padding: 0px;
    padding-left: 10px;
    padding-right: 10px;
    background: #fff;
    border: 0px;
  }
  .item:hover {
    background: #eee;
  }
  .item:focus {
    color: black;
    outline: none !important;
  }
  .active-item {
    background: #f5f5f5 !important;
  }
</style>
