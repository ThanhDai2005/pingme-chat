import { SignInForm } from "@/components/auth/signin-form";

const SignInPage = () => {
  return (
    <>
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-6 bg-muted min-h-svh md:p-10 bg-gradient-purple">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignInForm />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
