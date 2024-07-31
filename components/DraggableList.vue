<script setup lang="ts" generic="T extends { id: string}">
const { list, renderList } = defineProps<{
  list: T[]
  renderList: (v: T) => string
}>()

const isDragging = ref(false)
</script>

<template>
  <div class="flex justify-center">
    <div class="w-2/6 rounded overflow-hidden p-5">
      <draggable
        class="list-group"
        tag="ul"
        :list="list"
        @start="isDragging = true"
        @end="isDragging = false"
      >
        <transition-group type="transition" name="flip-list">
          <li
            v-for="element in list"
            :key="element.id"
            class="list-group-item p-1 bg-gray-200 m-1 rounded-md u-cursor-move"
          >
            {{ renderList(element) }}
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
