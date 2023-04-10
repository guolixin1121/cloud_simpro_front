<template>
  <search-form-demo />
  
  <!-- 有add权限的人才可以看到这个button -->
  <a-button class="mt-5 mb-3" type="primary" v-if="user.hasPermission('add')">新建</a-button>

  <table-demo />
</template>

<script setup lang="ts">
import SearchFormDemo from '../../../components/search-form/demo.vue'
import TableDemo from '../../..//components/table/demo.vue'

import { useUserStore } from '../../../store/user';
const user = useUserStore()
</script>
