<template>
    <div>
      <v-skeleton-loader v-if="loading" type="list-item-two-line" :loading="loading" />
  
      <div v-else-if="error">{{ error }}</div>
      <v-container v-else>
        <!-- Toolbar -->
        <v-toolbar flat>
          <v-toolbar-title>ข้อมูลสินค้า</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- Refresh Button -->
          <v-btn @click="fetchData" icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
          <!-- Shopping Cart -->
          <v-btn icon @click="toggleCart">
            <v-icon>mdi-cart</v-icon>
            <span v-if="cart.length" class="badge">{{ cart.length }}</span>
          </v-btn>
        </v-toolbar>
  
        <!-- Product List -->
        <v-row>
          <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="ma-2" outlined>
              <v-img
                :src="item.image || 'https://via.placeholder.com/100'"
                alt="Product Image"
                height="150"
              ></v-img>
              <v-card-title class="text-h5">{{ item.product_name }}</v-card-title>
              <v-card-subtitle class="text-body-2">{{ item.product_description }}</v-card-subtitle>
              <v-card-subtitle class="text-body-2">จำนวนในคลัง {{ item.product_values }} รายการ</v-card-subtitle>
              <v-card-actions>
                <v-btn color="primary" @click="addToCart(item)">เพิ่มลงในตะกร้า</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- No Data Message -->
        <v-alert v-if="items.length === 0" :value="true" type="warning" class="mt-4">
          ไม่มีข้อมูล
        </v-alert>
  
        <!-- Shopping Cart Modal -->
        <v-dialog v-model="cartDialog" max-width="600px">
          <v-card>
            <v-card-title>ตะกร้าสินค้า</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="(item, index) in cart" :key="index">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.product_name }}</v-list-item-title>
                    <v-list-item-subtitle>จำนวน: {{ item.quantity }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="removeFromCart(index)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-alert v-if="!cart.length" type="info">ยังไม่มีสินค้าในตะกร้า</v-alert>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="toggleCart">ปิด</v-btn>
              <v-btn color="green darken-1" text @click="checkout">ชำระเงิน</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </template>
  
  <script>
  import axios from "@/axios"; // Import axios
  export default {
    name: "ShoppingCard",
    data() {
      return {
        items: [],
        cart: [], // สำหรับเก็บสินค้าในตะกร้า
        cartDialog: false, // สำหรับเปิด/ปิด Modal ตะกร้าสินค้า
        loading: true,
        error: null,
      };
    },
    methods: {
      async fetchData() {
        this.loading = true;
        this.error = null;
        try {
          const response = await axios.get("/api/products");
          if (response.data.status === "success") {
            this.items = response.data.data;
          } else {
            this.error = "ไม่พบข้อมูล";
          }
        } catch (error) {
          this.error = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
        } finally {
          this.loading = false;
        }
      },
      addToCart(item) {
        const cartItem = this.cart.find((cartItem) => cartItem.id === item.id);
        if (cartItem) {
          cartItem.quantity++;
        } else {
          this.cart.push({ ...item, quantity: 1 });
        }
      },
      removeFromCart(index) {
        this.cart.splice(index, 1);
      },
      toggleCart() {
        this.cartDialog = !this.cartDialog;
      },
      checkout() {
        if (this.cart.length === 0) {
          alert("ไม่มีสินค้าในตะกร้า");
          return;
        }
        alert("ชำระเงินสำเร็จ");
        this.cart = [];
        this.cartDialog = false;
      },
    },
    mounted() {
      this.fetchData(); // เรียกใช้ fetchData เมื่อ Component ถูก mount
    },
  };
  </script>
  