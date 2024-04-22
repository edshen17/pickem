<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import NProgress from 'nprogress'
import { ErrorMessage, useForm } from 'vee-validate'
import { type UserSchema, getUserSchema } from '~/schemas/user'

const route = useRoute()
const router = useRouter()
const isSignupPage = computed(() => route.path === '/sign-up').value
const showPassword = ref(false)
function togglePasswordView() {
  showPassword.value = !showPassword.value
}
const buttonClass = 'u-py-3 u-px-4 u-rounded u-w-full u-my-6 btn-hover-gradient'
const redirectLinkClass = 'u-text-blue-500 hover:u-text-blue-400'

const validationSchema = toTypedSchema(getUserSchema(isSignupPage))

const { handleSubmit } = useForm<UserSchema>({ validationSchema })

const onSubmit = handleSubmit(async () => {
  NProgress.start()
  await _handleLogin()
  NProgress.done()
})

async function _handleLogin(): Promise<void> {
  router.push('/dashboard')
}

async function _authorizeUser(): Promise<void> {

}
</script>

<template>
  <div class="u-min-h-screen">
    <div class="u-flex u-flex-wrap u-justify-center">
      <p>logo here</p>
    </div>
    <div class="u-flex u-flex-wrap u-justify-center">
      <div class="u-mb-28 u-w-11/12 u-rounded-lg u-px-6 u-pt-10 2xl:u-w-3/12 md:u-w-6/12 xl:u-w-4/12">
        <form class="q-gutter-y-lg u-mb-0">
          <TextInput v-if="isSignupPage" name="name" type="name" placeholder="userAuth.name" :focused="true" @keyup.enter="onSubmit" />
          <TextInput name="email" type="email" placeholder="Email address" :focused="!isSignupPage" @keyup.enter="onSubmit" />
          <div class="u-flex">
            <TextInput name="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" :show-error-message="false" class-name="u-border-r-0 u-rounded-r-none u-border-2 u-border-gray-300 u-rounded-md" @keyup.enter="onSubmit" />
            <button
              class="form-border u-text-center u-w-1/6! u-rounded-l-none!"
              type="button"
              @click="togglePasswordView"
            >
              <div :class="`${showPassword ? `i-fa6-solid:eye` : `i-fa6-solid:eye-slash`} u-w-full u-icon-btn`" />
            </button>
          </div>
          <ErrorMessage name="password" class="u-pt-1 u-text-sm u-text-red-400" />
        </form>
        <button
          :class="`${buttonClass} u-bg-gray-700 dark:u-bg-gray-800`"
          @click="onSubmit"
        >
          <div class="u-text-white u-font-bold">
            <span v-if="isSignupPage">Sign Up</span>
            <span v-else>Log In</span>
          </div>
        </button>
        <hr class="u-my-1 u-border-gray-300">
        <button
          :class="`${buttonClass} u-bg-red-500`"
        >
          <div class="u-flex u-items-center u-justify-center u-text-white u-font-bold">
            <div class="i-fa-brands:google u-mr-3" />
            Continue With Google
          </div>
        </button>
        <p class="u-float-right">
          <span v-if="isSignupPage">
            Already have an account?
            <router-link :to="{ path: 'log-in', query: $route.query }" :class="redirectLinkClass">
              Log in here
            </router-link>
          </span>
          <span v-else class="u-inline-block">
            Don't have an account?
            <router-link :to="{ path: 'sign-up', query: $route.query }" :class="redirectLinkClass">Sign up here</router-link>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
