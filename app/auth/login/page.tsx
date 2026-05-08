import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Admin Login',
  description: 'Sign in to the admin panel',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-14">
        <div>
          <div className="w-8 h-8 bg-white" />
        </div>
        <div className="space-y-4">
          <p className="text-xs tracking-widest text-slate-500 uppercase">
            Admin Portal
          </p>
          <h1 className="text-4xl font-light text-white leading-tight">
            Manage your <br />
            <span className="font-semibold">content &amp; events</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
            Authorized personnel only. All activity is logged and monitored.
          </p>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Company. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-10">
          {/* Mobile logo */}
          <div className="lg:hidden">
            <div className="w-7 h-7 bg-slate-900" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-slate-400">
              Sign in to access the admin dashboard.
            </p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <p className="text-xs text-slate-300 text-center">
            Having trouble? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  )
}
