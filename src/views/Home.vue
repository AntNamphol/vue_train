<template>
<div>
<!-- เรียกใช้ Component UserTable -->
<UserTable />
</div>
      

</template>

<script>
// นำเข้า UserTable component ที่เราสร้างขึ้น
import UserTable from "@/components/UserTable.vue";

export default {
  components: {
    UserTable, // เพิ่ม component ที่นำเข้า
  },
};
</script>
