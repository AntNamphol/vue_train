<template>
  <div>
    <!-- Sidebar (v-navigation-drawer) -->
    <v-navigation-drawer app dark>
      <v-list dense>
        <v-list-group prepend-icon="mdi-account" no-action>
          <template v-slot:activator>
            <v-list-item-title>{{ fname }} {{ lname }}</v-list-item-title>
          </template>

          <!-- Additional items -->
          <v-list-item  link :to="'/editprofile'">
            <v-list-item-content>
              <v-list-item-title><v-icon>mdi-account-edit-outline</v-icon> แก้ไขโปรไฟล์</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item link :to="'/home'" v-if="userLv == '1'">
          <v-list-item-content>
            <v-list-item-title><v-icon left>mdi-home</v-icon>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="'/production'" v-if="userLv == '1'">
          <v-list-item-content>
            <v-list-item-title><v-icon left>mdi-tray-plus</v-icon>Production</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link :to="'/shopping'">
          <v-list-item-content>
            <v-list-item-title><v-icon left>mdi-cart-arrow-down</v-icon>Shopping</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- เพิ่มเมนูอื่นๆ ตามต้องการ -->
      </v-list>

      <!-- ปุ่ม Logout -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="red" @click="logout">
            <v-icon>mdi-logout</v-icon>
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar (แถบเมนูด้านบน) -->
    <v-app-bar app color="dark" dark>
      <div>Training VueJS</div>
    </v-app-bar>

    <br />

    <!-- Main Content (เนื้อหาหลัก) -->
    <v-main>
      <router-view />
    </v-main>

  </div>
</template>

<script>
export default {
  data() {
    return {
      fname: "",
      lname: "",
      userLv: "",
    }
  },
  methods: {
    logout() {
      // ลบ Token และข้อมูลผู้ใช้จาก LocalStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");

      // Redirect ไปหน้า Login
      this.$router.push("/").catch(err => {
        console.error("Navigation error:", err);
      });
    },
    editProfile() {
      alert("แก้ไขโปรไฟล์");
      // หรือคุณสามารถเรียกฟังก์ชันที่เกี่ยวข้องสำหรับการแก้ไขโปรไฟล์
    },

  },
  created() {
    // ดึงข้อมูลผู้ใช้จาก LocalStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      this.fname = userInfo.fname;
      this.lname = userInfo.lname;
      this.userLv = userInfo.user_lv;
    }
  },
};
</script>

<style>
/* ปรับแต่งสไตล์เพิ่มเติม */
</style>
