<template>
  <v-container fluid class="d-flex justify-center align-center" style="height: 100%;">
    <v-row>
      <v-col>
        <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
          <v-card-title primary-title class="d-flex justify-center align-center">
            Sign In
          </v-card-title>
          <v-form ref="form" v-model="valid">
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field density="compact" placeholder="Email address" prepend-inner-icon="mdi-email-outline"
              variant="outlined" v-model="user.email" :rules="[rules.email, rules.required]" required></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
              Password
              <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
                Forgot login password?
              </a>
            </div>

            <v-text-field :append-inner-icon="visible ? 'mdi-eye-closed' : 'mdi-eye-outline'"
              :type="visible ? 'text' : 'password'" density="compact" placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline" variant="outlined" v-model="user.password" :rules="[rules.required]"
              required @click:append-inner="visible = !visible"></v-text-field>

            <!-- Remember me checkbox -->
            <v-checkbox v-model="rememberMe" label="Remember me"></v-checkbox>

            <v-btn :disabled="!valid || loading" class="mb-8" color="blue" size="large" variant="tonal" block
              @click="submitForm">
              <template v-if="!loading">Sign Up</template>
              <template v-else>
                <v-progress-circular indeterminate color="white" size="20" />
              </template>
            </v-btn>

            <v-card-text class="text-center">
              Are your not member?
              <a class="text-blue text-decoration-none" href="/signup" rel="noopener noreferrer">
                Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
              </a>
            </v-card-text>
            <v-alert v-if="responseMessage" :type="responseMessage === 'Login successfully' ? 'success' : 'error'">
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
    loading: false, // สำหรับแสดง state loading
    rememberMe: false, // สำหรับเก็บสถานะ Remember me
    user: {
      email: "",
      password: "",
    },
    responseMessage: null, // เก็บข้อความตอบกลับจาก API
    rules: {
      required: (v) => !!v || "จำเป็นต้องกรอกข้อมูล",
      email: (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
    },
  }),
  mounted() {
    // ตรวจสอบว่า authToken มีอยู่ใน LocalStorage หรือไม่
    if (localStorage.getItem("authToken")) {
      // ถ้ามี token อยู่แล้ว ให้ redirect ไปยังหน้า Home
      this.$router.push("/home");
    } else {
      // ถ้ามี Remember me ก็ให้เอา email และ password จาก LocalStorage
      if (localStorage.getItem("rememberMe")) {
        this.user.email = localStorage.getItem("email") || "";
        this.user.password = localStorage.getItem("password") || "";
        this.rememberMe = true;
      }
    }
  },
  methods: {
    async submitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true; // เปิด state loading
        try {
          console.log("Submitting user data:", this.user);

          // ส่ง POST request
          const response = await axios.post("/api/login", this.user);

          // ตรวจสอบการตอบกลับจาก API
          if (response.data.status === "success") {
            // เก็บ Token ใน LocalStorage
            localStorage.setItem("authToken", response.data.token);

            // เก็บข้อมูลชื่อผู้ใช้ใน LocalStorage รวมถึง user_lv
            localStorage.setItem("userInfo", JSON.stringify({
              fname: response.data.data.fname,
              lname: response.data.data.lname,
              user_lv: response.data.data.user_lv,
              user_id: response.data.data.user_id, // เพิ่ม user_lv
            }));

            // ถ้า Remember me ถูกเลือกให้เก็บ email และ password
            if (this.rememberMe) {
              localStorage.setItem("rememberMe", true);
              localStorage.setItem("email", this.user.email);
              localStorage.setItem("password", this.user.password);
            } else {
              localStorage.removeItem("rememberMe");
              localStorage.removeItem("email");
              localStorage.removeItem("password");
            }

            // ส่งข้อความตอบกลับ
            this.responseMessage = "Login successfully";

            // Redirect ไปยังหน้า Home
            setTimeout(() => {
              if(response.data.data.user_lv == 1){
                this.$router.push("/home");
              }
              else{
                this.$router.push("/shopping");
              }
              
            }, 1000);
          } else {
            this.responseMessage = response.data.message || "Login failed";
          }
        } catch (error) {
          console.error("Submission error:", error.response || error.message);
          this.responseMessage = "เกิดข้อผิดพลาดในการส่งข้อมูล";
        } finally {
          this.loading = false; // ปิด state loading
        }
      }
    },
  },
};
</script>
