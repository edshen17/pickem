<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import NProgress from 'nprogress'
import { ErrorMessage, useForm } from 'vee-validate'
import { type UserValidator, getUserValidator } from '~/validators/user'
import type { ISupabaseToken } from '~/services/auth'
import { handleSignIn, handleSignUp } from '~/services/auth'
import type { IUser } from '~/view-models/user'

const { auth } = useSupabaseClient()

const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`
const supabaseOptions = { redirectTo }

const router = useRouter()
const isSignupPage = computed(() => router.currentRoute.value.path === '/sign-up').value
const showPassword = ref(false)
const invitedUser = ref<IUser | null>(null)
const isInvitation = ref(false)
const isInviteExpired = ref(false)
const supabaseToken = reactive<ISupabaseToken>({ access_token: '', refresh_token: '' })

const buttonClass = 'u-py-3 u-px-4 u-rounded u-w-full u-my-6 btn-hover-gradient'
const redirectLinkClass = 'u-text-blue-500 hover:u-text-blue-400'

const validationSchema = toTypedSchema(getUserValidator(isSignupPage))

const { values, handleSubmit, setFieldValue } = useForm<UserValidator>({ validationSchema })
const { hash } = router.currentRoute.value

if (hash) {
  const params = new URLSearchParams(hash.substring(1))
  supabaseToken.access_token = params.get('access_token') ?? ``
  supabaseToken.refresh_token = params.get('refresh_token') ?? ``
  isInviteExpired.value = Boolean(params.get('error'))

  if (supabaseToken.access_token) {
    const invited = await $fetch('/api/users/invite', { query: { inviteToken: supabaseToken.access_token } })
    invitedUser.value = JSON.parse(JSON.stringify(invited))
  }
}

onMounted(async () => {
  if (invitedUser.value) {
    setFieldValue('email', invitedUser.value.email)
    isInvitation.value = true
  }
})

const onSubmit = handleSubmit(async () => {
  NProgress.start()
  await _handleLogin()
  NProgress.done()
})

function togglePasswordView() {
  showPassword.value = !showPassword.value
}

async function _handleLogin(): Promise<void> {
  const { email, password } = values

  const { error } = isSignupPage
    ? await handleSignUp(email, password, supabaseToken)
    : await handleSignIn(email, password)

  if (error)
    throw new Error(error.message)

  router.push('/dashboard')
}
</script>

<template>
  <div class="auth u-min-h-screen">
    <div class="u-flex u-flex-wrap u-justify-center">
      <img
        src="../assets/img/paddles.png"
        class="u-mt-3 u-h-28 u-w-full u-object-contain md:u-mt-10 2xl:u-h-44 md:u-h-36"
      >
    </div>
    <div class="u-flex u-flex-wrap u-justify-center">
      <div class="u-mb-28 u-w-11/12 u-rounded-lg u-px-6 u-pt-10 2xl:u-w-3/12 md:u-w-6/12 xl:u-w-4/12">
        <div v-if="isInviteExpired" className="u-flex u-flex-col u-text-center u-gap-y-5">
          <p>Looks like your invite expired.</p>
          <p>Please contact your administrator to re-invite you.</p>
        </div>
        <div v-else>
          <form class="q-gutter-y-lg u-mb-0">
            <!-- can add additional fields for sign up if needed -->
            <TextInput :readonly="isInvitation" name="email" type="email" placeholder="Email address" :focused="!isSignupPage" @keyup.enter="onSubmit" />
            <div class="u-flex">
              <TextInput name="password" :type="showPassword ? 'text' : 'password'" placeholder="Password" :show-error-message="false" class-name="u-border-r-none! u-rounded-r-0! u-border-2 u-border-gray-300 u-rounded-md" @keyup.enter="onSubmit" />
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
            @click="auth.signInWithOAuth({ provider: 'google', options: supabaseOptions })"
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
  </div>
</template>
