import AuthenticateForm from './components/AuthenticateForm'
import RegisterForm from './components/RegisterForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
            WebAuthn Passkey Demo
          </h1>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Register</h2>
            <RegisterForm />
          </div>
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authenticate</h2>
            <AuthenticateForm />
          </div>
        </div>
      </div>
    </div>
  )
}