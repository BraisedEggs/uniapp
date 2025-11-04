<template>
  <div>
    <!-- 写法 -->
    <slot></slot>
    <slot name="插槽1"></slot>
    <slot name="插槽2" msg="1111"> </slot>

    <!-- 用法 -->
    <template></template>
    <template #插槽1></template>
    <template #插槽2="{ msg }"></template>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
