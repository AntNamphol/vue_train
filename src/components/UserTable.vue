<template>
  <div>
    <v-dialog v-model="dialogEdit" min-width="50%">
      <v-card>
        <v-card-title>
          <v-icon left>mdi-store-plus-outline</v-icon>
          Edit User
        </v-card-title>

        <v-card-text>
          <div>UID</div>
          <v-text-field v-model="userUid" disabled></v-text-field>

          <div>Email</div>
          <v-text-field v-model="userEmail"></v-text-field>

          <div>Password</div>
          <v-text-field v-model="userPassword"></v-text-field>

          <div>First Name</div>
          <v-text-field v-model="userFname"></v-text-field>

          <div>Last Name</div>
          <v-text-field v-model="userLname"></v-text-field>

          <div>Phone</div>
          <v-text-field v-model="userPhone" ></v-text-field>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close_dialog" color="red darken-1">
            Cancel
          </v-btn>
          <v-btn text @click="saveUserEdit" color="green darken-1">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- ใช้ v-skeleton-loader แทนข้อความ "กำลังโหลดข้อมูล..." -->
    <v-skeleton-loader v-if="loading" type="list-item-two-line" :loading="loading" />

    <div v-else-if="error">{{ error }}</div>

    <v-data-table v-else :headers="headers" :items="items" :loading="loading" item-value="user_id" class="elevation-1" >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>ข้อมูลผู้ใช้</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- เพิ่มปุ่มรีเฟรช -->
          <v-btn @click="fetchData" icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <!-- ใช้ v-slot:column ชื่อว่า actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn @click="editProduct(item)" icon color="yellow darken-1">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn @click="deleteProduct(item.user_id)" icon color="red darken-1">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <template v-slot:no-data>
        <v-alert :value="true" type="warning">ไม่มีข้อมูล</v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "UserTable",
  data() {
    return {
      items: [],
      loading: true,
      error: null,
      headers: [
        { text: "ID", value: "uid" },
        { text: "E-mail", value: "email" },
        { text: "ชื่อ", value: "fname" },
        { text: "นามสกุล", value: "lname" },
        { text: "เบอร์โทร", value: "phone" },
        {text:"ระดับผู้ใช้", value:"user_lv"},
        { text: "การกระทำ", value: "actions", sortable: false },
      ],
      dialogEdit: false,
      userId: null,
      userUid: "",
      userEmail: "",
      userPassword: "",
      userFname: "",
      userLname: "",
      userPhone: "",
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get("/api/userdata");
        if (response.data.status === "success") {
          this.items = response.data.data;
        } else {
          this.error = "ไม่พบข้อมูล";
        }
        console.log(this.items);
      } catch (error) {
        this.error = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },
    editProduct(user) {
      this.userId = user.user_id;
      this.userUid = user.uid;
      this.userEmail = user.email;
      this.userPassword = user.password;
      this.userFname = user.fname;
      this.userLname = user.lname;
      this.userPhone = user.phone;
      this.dialogEdit = true;
    },
    saveUserEdit() {
      if (confirm("Are you sure you want to edit this user?")) {
        const updatedUser = {
          id: this.userId,
          userUid: this.userUid,
          userEmail: this.userEmail,
          userPassword: this.userPassword,
          userFname: this.userFname,
          userLname: this.userLname,
          userPhone: this.userPhone,
        };

        axios.put(`/api/user/${this.userId}`, updatedUser)
          .then((response) => {
            console.log("User updated successfully:", response.data);
            this.dialogEdit = false;
            this.fetchData();
            this.resetForm();
          })
          .catch((error) => {
            console.error("Error updating user:", error);
          });
      }
    },
    close_dialog() {
      this.dialogEdit = false;
      this.resetForm();
    },
    deleteProduct(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        axios.delete(`/api/user/${id}`)
          .then(response => {
            this.fetchData();
            console.log("User deleted successfully:", response.data);
          })
          .catch(error => {
            console.error("Error deleting user:", error);
          });
      }
    },
    resetForm() {
      this.userId = null;
      this.userUid = "";
      this.userEmail = "";
      this.userPassword = "";
      this.userFname = "";
      this.userLname = "";
      this.userPhone = "";
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>


<style>
/* Optional custom styles */
</style>