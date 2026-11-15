import GoogleOAuthBtn from "@/app/_components/GoogleOAuthBtn";
import SignUpForm from "@/app/_components/SignUpForm";

export const metadata = {
  title: "Signup",
};

export default function Signup() {
  return (
    <div className="w-full min-h-dvh flex justify-center items-center">
      <div className="w-full h-hStretch">
        <div className="w-full h-full flex justify-center items-center bg-slate-200">
          <div className="md:max-w-[540px] lg:max-w-[540px] w-[80%] h-max overflow-auto rounded-lg bg-slate-100 flex justify-center">
            <div className="w-full flex flex-col pt-6 pb-16 items-center">
              <h2 className="mb-5 font-semibold text-xl text-slate-700 underline underline-offset-2">
                Signup
              </h2>
              <SignUpForm />
              <GoogleOAuthBtn authBtnType="SignupAuthButton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
