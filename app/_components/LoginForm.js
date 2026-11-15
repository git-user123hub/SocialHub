"use client";

import { signinUser } from "@/app/_lib/actions";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { useAuthContext } from "./AuthContext";

function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [passValue, setPassValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setIsLoginSubmitting, isLoginSubmitting } = useAuthContext();

  const router = useRouter();

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  async function handleSubmission(e) {
    e.preventDefault();

    setIsSubmitting(true);
    setIsLoginSubmitting(true);

    const targetEls = e.target.elements;

    const signinEmail = targetEls.signupEmail.value;
    const signinPassword = targetEls.signupPassword.value;

    const loginObj = {
      email: signinEmail,
      password: signinPassword,
    };

    const loginResult = await signinUser(loginObj);

    if (loginResult) {
      setIsSubmitting(false);
      setIsLoginSubmitting(false);
      if (loginResult.success) {
        toast.success("Login successful!");
        router.replace("/");
      }

      if (!loginResult.success) {
        toast.error("Incorrect Email or Password");
        router.replace("/auth/login?error=invalid-credentials");
      }
    }
  }

  return (
    <form onSubmit={handleSubmission} className="mt-3 w-[90%]">
      <fieldset
        disabled={isSubmitting || isLoginSubmitting}
        className={`flex flex-col gap-5 ${isSubmitting || isLoginSubmitting ? "text-[#6c757d] border-[#ced4da] cursor-not-allowed opacity-90" : ""}`}
      >
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor="signupEmail" className="cursor-pointer">
              Email
            </label>
            <input
              type="text"
              id="signupEmail"
              name="signupEmail"
              placeholder="Email"
              className="h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between px-1">
              <label htmlFor="signupPassword" className="cursor-pointer">
                Password
              </label>
              {passValue.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    setShowPass((s) => !s);
                  }}
                >
                  {showPass ? (
                    <EyeIcon className="w-5 h-5 [&>path]:stroke-[1.7] cursor-pointer" />
                  ) : (
                    <EyeSlashIcon className="w-5 h-5 [&>path]:stroke-[1.7] cursor-pointer" />
                  )}
                </button>
              )}
            </div>
            <div className="w-full relative">
              <input
                type="text"
                id="signupPassword"
                name="signupPassword"
                placeholder="Password"
                className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-full ${showPass ? "text-security-none" : "text-security-disc"}`}
                value={passValue}
                onChange={(e) => {
                  setPassValue(e.target.value);
                }}
              />
            </div>
          </div>

          <button
            className={`h-10 bg-blue-600 rounded-lg text-slate-50 mt-4 flex justify-center items-center gap-2 ${isSubmitting || isLoginSubmitting ? "opacity-50" : ""}`}
            disabled={isSubmitting || isLoginSubmitting}
          >
            Login {isSubmitting && <SpinnerMini />}
          </button>

          <p>
            Does not have an account? First signup{" "}
            <Link
              href="/auth/signup"
              className="h-10 underline hover:text-blue-600"
            >
              here
            </Link>
          </p>
        </>
      </fieldset>
    </form>
  );
}

export default LoginForm;
