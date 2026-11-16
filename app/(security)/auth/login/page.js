import GoogleOAuthBtn from "@/app/_components/GoogleOAuthBtn";
import LoginForm from "@/app/_components/LoginForm";
import LogoutToastWrapper from "@/app/_components/LogoutToastWrapper";

export const metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <div className="w-full min-h-dvh flex justify-center items-center">
      <div className="w-full h-full">
        <div className="w-full h-full flex justify-center bg-slate-200">
          <div className="md:max-w-[540px] lg:max-w-[540px] w-[80%] h-max overflow-auto mt-10 mb-14 rounded-lg bg-slate-100 flex justify-center">
            <div className="w-full flex flex-col pt-6 pb-16 items-center">
              <h2 className="mb-5 font-semibold text-xl text-slate-700 underline underline-offset-2">
                Login
              </h2>
              <LogoutToastWrapper />
              <LoginForm />
              <GoogleOAuthBtn authBtnType="LoginAuthButton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
