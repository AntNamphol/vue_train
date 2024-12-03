<template>
  <div>
    <div class="text-left pa-4">
      <v-btn @click="dialog = true" color="primary">
        <v-icon left>mdi-store-plus-outline</v-icon>Add new product
      </v-btn>

      <v-dialog v-model="dialog" min-width="50%">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-store-plus-outline</v-icon>
            Add New Product
          </v-card-title>

          <v-card-text>
            <div>Product Name</div>
            <v-text-field v-model="productName" label="Enter product name"></v-text-field>

            <div>Values</div>
            <v-text-field v-model="productValues" label="Enter Values" type="number"></v-text-field>

            <div>Description</div>
            <v-text-field v-model="productDescription" label="Enter Description"></v-text-field>

            <div>Add Image</div>
            <v-file-input label="Choose an image" accept="image/*" @change="onFileChange" clearable></v-file-input>

            <!-- Display the selected image -->
            <v-img v-if="imageUrl" :src="imageUrl" max-width="200px"></v-img>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false" color="red darken-1">
              Cancel
            </v-btn>
            <v-btn text @click="saveProduct" color="green darken-1">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-dialog v-model="dialogEdit" min-width="50%">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-store-plus-outline</v-icon>
            Edit Product
          </v-card-title>

          <v-card-text>
            <div>Product Name</div>
            <v-text-field v-model="productName" label="Enter product name"></v-text-field>

            <div>Values</div>
            <v-text-field v-model="productValues" label="Enter Values" type="number"></v-text-field>

            <div>Description</div>
            <v-text-field v-model="productDescription" label="Enter Description"></v-text-field>

            <div>Add Image</div>
            <v-file-input label="Choose an image" accept="image/*" @change="onFileChange" clearable></v-file-input>

            <!-- Display the selected image -->
            <v-img v-if="imageUrl" :src="imageUrl" max-width="200px"></v-img>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="close_dialog" color="red darken-1">
              Cancel
            </v-btn>
            <v-btn text @click="saveProductEdit" color="green darken-1">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>

    <!-- Loading Skeleton -->
    <v-skeleton-loader v-if="loading" type="list-item-two-line" :loading="loading" />

    <div v-else-if="error">{{ error }}</div>

    <!-- Data Table -->
    <v-data-table v-else :headers="headers" :items="items" :loading="loading" item-value="id" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>ข้อมูลสินค้า</v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- Refresh Button -->
          <v-btn @click="fetchData" icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-toolbar>
      </template>

      <template v-slot:[`item.image`]="{ item }">
        <div v-if="item.image">
          <img :src="item.image" alt="Product Image" style="max-width: 150px; max-height: auto;" />
        </div>
        <img v-else src="https://via.placeholder.com/100" alt="No Image" style="max-width: 100px; max-height: 100px;" />
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn @click="editProduct(item)" icon color="yellow darken-1">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn @click="deleteProduct(item.id)" icon color="red darken-1">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>

      <!-- No Data Message -->
      <template v-slot:no-data>
        <v-alert :value="true" type="warning">ไม่มีข้อมูล</v-alert>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from "@/axios"; // Import axios
import Compressor from 'compressorjs';

export default {
  name: "ProductTable",
  data() {
    return {
      items: [],
      loading: true,
      error: null,
      headers: [
        { text: "ID", value: "id" },
        { text: "ชื่อสินค้า", value: "product_name" },
        { text: "img", value: "image" },
        { text: "จำนวน", value: "product_values" },
        { text: "คำอธิบาย", value: "product_description" },

        { text: "Actions", value: "actions", sortable: false }, // Add an 'Actions' column
      ],
      dialog: false,
      dialogEdit: false,
      productName: "",
      productValues: "",
      productDescription: "",
      imageUrl: null,
      editingProduct: null, // For tracking which product is being edited
    };
  },
  methods: {
    // Fetch data from the API
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

    onFileChange(file) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageUrl = e.target.result; // Store the image data URL
        };
        reader.readAsDataURL(file); // Read the selected file
      } else {
        this.imageUrl = null;
      }
    },

    saveProduct() {
      const productData = {
        productName: this.productName,
        productValues: this.productValues,
        productDescription: this.productDescription,
      };

      if (this.imageUrl) {
        // Check if imageUrl is a base64 string
        if (typeof this.imageUrl === 'string' && this.imageUrl.startsWith('data:')) {
          const byteString = atob(this.imageUrl.split(',')[1]);
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const uintArray = new Uint8Array(arrayBuffer);
          for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([uintArray], { type: 'image/jpeg' });
          this.imageUrl = blob;
        }

        const imageFile = this.imageUrl;

        new Compressor(imageFile, {
          quality: 0.6,
          success: (compressedImage) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              productData.image = reader.result;

              axios.post("/api/products", productData)
                .then(response => {
                  console.log(response)
                  this.dialog = false;
                  this.fetchData();
                  this.resetForm();
                })
                .catch(error => {
                  console.error("Error saving product:", error);
                });
            };
            reader.readAsDataURL(compressedImage);
          },
          error: (err) => {
            console.error("Error compressing image:", err);
          }
        });
      } else {
        axios.post("/api/products", productData)
          .then(response => {
            console.log(response)
            this.dialog = false;
            this.fetchData();
            this.resetForm();
          })
          .catch(error => {
            console.error("Error saving product:", error);
          });
      }
    },

    resetForm() {
      this.productName = "";
      this.productValues = "";
      this.productDescription = "";
      this.imageUrl = null;
    },

    editProduct(product) {
      this.editingProduct = product;
      this.productId = product.id;
      this.productName = product.product_name;
      this.productValues = product.product_values;
      this.productDescription = product.product_description;
      this.imageUrl = product.image; // ตั้งค่าภาพที่โหลดมาจาก API
      this.dialogEdit = true;
    },

    saveProductEdit() {
      if (confirm("Are you sure you want to edit this product?")) {
        if (this.imageUrl) {
          // ตรวจสอบว่า imageUrl เป็น base64 หรือไม่
          if (typeof this.imageUrl === "string" && this.imageUrl.startsWith("data:")) {
            const byteString = atob(this.imageUrl.split(",")[1]);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const uintArray = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
              uintArray[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([uintArray], { type: "image/jpeg" });
            this.imageUrl = blob;
          }

          const imageFile = this.imageUrl;

          // ใช้ Compressor สำหรับลดขนาดภาพ
          new Compressor(imageFile, {
            quality: 0.6,
            success: (compressedImage) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                // อ่าน compressed image เป็น base64
                const updatedProduct = {
                  id: this.productId,
                  productName: this.productName,
                  productValues: this.productValues,
                  productDescription: this.productDescription,
                  image: reader.result, // ใช้ base64 หลัง compression
                };

                // ส่งคำขออัปเดตไปยัง API
                axios
                  .put(`/api/products/${this.productId}`, updatedProduct)
                  .then((response) => {
                    console.log("Product updated successfully:", response.data);
                    this.dialogEdit = false; // ปิด dialog
                    this.fetchData(); // รีเฟรชข้อมูลสินค้า
                    this.resetForm(); // รีเซ็ตฟอร์ม
                  })
                  .catch((error) => {
                    console.error("Error updating product:", error);
                  });
              };
              reader.readAsDataURL(compressedImage); // อ่าน compressed image
            },
            error: (err) => {
              console.error("Error compressing image:", err);
            },
          });
        } else {
          // กรณีไม่มีภาพให้แก้ไข
          const updatedProduct = {
            id: this.productId,
            productName: this.productName,
            productValues: this.productValues,
            productDescription: this.productDescription,
            image: null, // หรือใช้ภาพเดิม
          };

          // ส่งคำขออัปเดตไปยัง API
          axios
            .put(`/api/products/${this.productId}`, updatedProduct)
            .then((response) => {
              console.log("Product updated successfully:", response.data);
              this.dialogEdit = false; // ปิด dialog
              this.fetchData(); // รีเฟรชข้อมูลสินค้า
              this.resetForm(); // รีเซ็ตฟอร์ม
            })
            .catch((error) => {
              console.error("Error updating product:", error);
            });
        }
      }
    },


    close_dialog() {
      this.dialogEdit = false;
      this.resetForm();
    },

    deleteProduct(id) {
      if (confirm("Are you sure you want to delete this product?")) {
        axios.delete(`/api/products/${id}`)
          .then(response => {
            this.fetchData(); // Refresh the product list
            console.log("Product deleted successfully:", response.data);
          })
          .catch(error => {
            console.error("Error deleting product:", error);
          });
      }
    }
  },

  mounted() {
    this.fetchData(); // Fetch data when the component is mounted
  },
};
</script>

<style scoped>
/* Optional custom styles */
</style>
