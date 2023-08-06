<template>
  <table class="w-full table-auto border-collapse">
    <thead class="bg-slate-100 text-xl">
      <tr>
        <th
          v-for="tableHeader in tableHeaders"
          class="border-b border-solid border-gray-300"
        >
          <div class="flex items-center justify-center py-3">
            {{ tableHeader }}
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <WorkshopTableRow
        v-for="workshop in workshops"
        :workshop="workshop"
        class="cursor-pointer border-b border-solid border-gray-300 transition-all hover:bg-gray-100"
      />
    </tbody>
  </table>
</template>

<script setup lang="ts"></script>
