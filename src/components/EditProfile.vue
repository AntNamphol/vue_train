<template>
    <div class="d-flex justify-center ">
        <!-- Loader -->
        <v-skeleton-loader v-if="loading" type="list-item-two-line" class="mx-auto" />

        <!-- Error -->
        <div v-else-if="error" class="text-center text-danger">
            {{ error }}
        </div>

        <!-- User Card -->
        <v-card v-else min-width="75%" elevation="3">
            <v-card-title class="d-flex justify-center">
                <v-avatar size="180">
                    <img :src="user.avatar_img || 'https://via.placeholder.com/100'" alt="User Avatar" />
                </v-avatar>

            </v-card-title>
            <v-card-text class="text-center">
                <!-- User Information -->
                <div>
                    <h1><strong>{{ user.fname }} {{ user.lname }}</strong></h1>
                </div>
                <div>
                    <h3>{{ user.email }}</h3>
                </div>
                <div>
                    <h3>{{ user.phone }}</h3>
                </div>
                <div>
                    <h3>ระดับผู้ใช้: {{ user.user_lv }}</h3>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import axios from "@/axios";

export default {
    name: "EditProfile",
    data() {
        return {
            loading: true,
            error: null,
            user: {}, // User object to hold fetched data
            user_id: "", // The ID to fetch data
        };
    },
    methods: {
        async fetchData() {
            this.loading = true;
            this.error = null;
            try {
                // Fetch user data by user_id
                const response = await axios.get("/api/userdata", {
                    params: { user_id: this.user_id },
                });

                if (response.data.status === "success") {
                    this.user = response.data.data[0]; // Assuming the API returns a list
                } else {
                    this.error = "ไม่พบข้อมูล";
                }
            } catch (error) {
                this.error = "เกิดข้อผิดพลาดในการโหลดข้อมูล";
                console.error("Error fetching data:", error);
            } finally {
                this.loading = false;
            }
        },
    },
    created() {
        // Fetch user_id from LocalStorage
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            this.user_id = userInfo.user_id;
            this.fetchData();
        } else {
            this.error = "User information not found in local storage.";
            this.loading = false;
        }
    },
};
</script>
