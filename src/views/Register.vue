<template>

    <v-container fluid class="d-flex justify-center align-center" style="height: 100%;">
        <v-row>
            <v-col>
                <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                    <v-form ref="form" v-model="valid">
                        <v-card-title primary-title class="d-flex justify-center align-center">
                            Sign Up
                        </v-card-title>
                        <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                        <v-text-field density="compact" placeholder="Email address"
                            prepend-inner-icon="mdi-email-outline" variant="outlined" v-model="user.email"
                            :rules="[rules.email, rules.required]" required></v-text-field>

                        <div class="text-subtitle-1 text-medium-emphasis">
                            Password
                        </div>

                        <v-text-field :append-inner-icon="visible ? 'mdi-eye-closed' : 'mdi-eye-outline'"
                            :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
                            prepend-inner-icon="mdi-lock-outline" variant="outlined" v-model="user.password"
                            :rules="[rules.required]" required @click:append-inner="visible = !visible"></v-text-field>

                        <div class="text-subtitle-1 text-medium-emphasis">First Name</div>

                        <v-text-field density="compact" placeholder="Enter Firstname" prepend-inner-icon="mdi-account"
                            variant="outlined" v-model="user.fname" :rules="[rules.required]" required></v-text-field>

                        <div class="text-subtitle-1 text-medium-emphasis">Last Name</div>

                        <v-text-field density="compact" placeholder="Enter Lastname" prepend-inner-icon="mdi-account"
                            variant="outlined" v-model="user.lname" :rules="[rules.required]" required></v-text-field>

                        <div class="text-subtitle-1 text-medium-emphasis">Phone Number</div>

                        <v-text-field density="compact" placeholder="Enter Phone Number" prepend-inner-icon="mdi-phone"
                            variant="outlined" v-model="user.phone" :rules="[rules.required]" type="text" required
                            @input="formatPhoneNumber" @keypress="validatePhoneInput"></v-text-field>

                        <v-btn :disabled="!valid" class="mb-8" color="blue" size="large" variant="tonal" block
                            @click="submitForm">Sign Up</v-btn>

                        <v-card-text class="text-center">
                            <a class="text-blue text-decoration-none" href="/" rel="noopener noreferrer">
                                Sign in now <v-icon icon="mdi-chevron-right"></v-icon>
                            </a>
                        </v-card-text>
                        <v-alert v-if="responseMessage"
                            :type="responseMessage === 'Sign up successfully' ? 'success' : 'error'">
                            {{ responseMessage }}
                        </v-alert>
                    </v-form>
                </v-card>
            </v-col>
        </v-row>
    </v-container>



</template>

<script>
import axios from "@/axios"; // นำเข้า axios
export default {
    data: () => ({
        visible: false,
        valid: false, // สำหรับ validate ฟอร์ม
        user: {
            email: "",
            password: "",
            fname: "",
            lname: "",
            phone: "",
        },
        responseMessage: null, // เก็บข้อความตอบกลับจาก API
        rules: {
            required: (v) => !!v || "จำเป็นต้องกรอกข้อมูล",
            email: (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
        },
    }),
    methods: {
        async submitForm() {
            if (this.$refs.form.validate()) {
                try {
                    const response = await axios.post("/api/singup", this.user); // ส่ง POST request
                    this.responseMessage = response.data.message || "สำเร็จ!";
                    console.log("Response:", response.data);
                    if (response.data.status === "success") {
                        setTimeout(() => {
                            this.$router.push("/login"); // Redirect ไปยังหน้า Login
                        }, 3000); // 3 วินาที
                    }
                } catch (error) {
                    console.error("Error:", error);
                    this.responseMessage = "เกิดข้อผิดพลาดในการส่งข้อมูล";
                }
            }
        },
        formatPhoneNumber() {
            let phoneNumber = this.user.phone.replace(/\D/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลข
            if (phoneNumber.length <= 3) {
                this.user.phone = phoneNumber;
            } else if (phoneNumber.length <= 6) {
                this.user.phone = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3);
            } else {
                this.user.phone = phoneNumber.substring(0, 3) + "-" + phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, 10);
            }
        },
        // ฟังก์ชันตรวจสอบให้กรอกเฉพาะตัวเลข
        validatePhoneInput(event) {
            const char = event.key;
            // ป้องกันการพิมพ์ตัวอักษร
            if (isNaN(char) && char !== "Backspace" && char !== "Tab") {
                event.preventDefault(); // ป้องกันการพิมพ์ตัวอักษร
            }
        },
    }

}
</script>

<style>
/* Optional custom styles can be added here */
</style>