"use client";

import { signupUser } from "@/app/_lib/actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { useAuthContext } from "./AuthContext";

const months = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function SignUpForm() {
  const [checkConfPass, setCheckConfPass] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setConfShowPass] = useState(false);
  const [passValue, setPassValue] = useState("");
  const [confPassValue, setConfPassValue] = useState("");
  const [checkUsername, setCheckUsername] = useState(false);
  const [usrnameStReset, setUsrnameStReset] = useState("");
  const [usernameExists, setUsernameExists] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [monthSt, setMonthSt] = useState("defaultMonthValue");

  const { setIsSigupSubmitting, isSigupSubmitting } = useAuthContext();

  const startYear = 1950;
  const curYear = new Date().getUTCFullYear();

  const router = useRouter();

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  async function handleSubmission(e) {
    e.preventDefault();

    setIsSubmitting(true);
    setIsSigupSubmitting(true);

    const targetEls = e.target.elements;

    const signupEmail = targetEls.signupEmail.value;
    const signupPassword = targetEls.signupPassword.value;
    const signupConfirmPassword = targetEls.signupConfirmPassword.value;
    const signupBdMonth = targetEls.signupBdMonth.value;
    const signupBdDay = targetEls.signupBdDay.value;
    const signupBdYear = targetEls.signupBdYear.value;
    const signupFullName = targetEls.signupFullName.value;
    const signupUsername = targetEls.signupUsername.value;

    const usernameRegex = /^[a-zA-Z0-9-_]+$/;

    if (!usernameRegex.test(signupUsername)) {
      setCheckUsername(true);
      setIsSubmitting(false);
      setIsSigupSubmitting(false);
      return;
    }

    if (signupConfirmPassword !== signupPassword) {
      setCheckConfPass(true);
      setIsSubmitting(false);
      setIsSigupSubmitting(false);
      return;
    }

    const monthsInNum = months.map((m, i) => {
      return { mName: m, mNum: i + 1 };
    });

    const birth = monthsInNum.filter((m, i) => {
      return m.mName === signupBdMonth;
    });

    const finalBd = `${signupBdYear}-${birth[0].mNum.toString().padStart(2, "0")}-${signupBdDay.toString().padStart(2, "0")}`;

    const signupObj = {
      email: signupEmail,
      password: signupPassword,
      birthday: finalBd,
      fullname: signupFullName,
      username: signupUsername,
    };

    const signupResult = await signupUser(signupObj);

    if (signupResult) {
      setIsSubmitting(false);
      setIsSigupSubmitting(false);
      if (signupResult?.success) {
        toast.success("Signup successful!");
        router.replace(signupResult?.navigateTo);
      }

      if (!signupResult?.success) {
        if (signupResult?.errorType === "signUpError") {
          setUsernameExists(signupResult?.signUpUsername);
        }

        if (signupResult?.errorType === "createProfileError") {
          toast.error("Signup failed, please try again later");
        }

        toast.error("Something went wrong, please try again later.");
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmission} className="mt-3 w-[90%]">
        <fieldset
          disabled={isSubmitting || isSigupSubmitting}
          className={`flex flex-col gap-5 ${isSubmitting || isSigupSubmitting ? "text-[#6c757d] border-[#ced4da] cursor-not-allowed opacity-90" : ""}`}
        >
          <>
            {/* Email */}
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
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-1">
                <label
                  htmlFor="signupConfirmPassword"
                  className="cursor-pointer"
                >
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
                  required
                  value={passValue}
                  onChange={(e) => {
                    setPassValue(e.target.value);
                  }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-1">
                <label
                  htmlFor="signupConfirmPassword"
                  className="cursor-pointer"
                >
                  Confirm Password
                </label>
                {confPassValue.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      setConfShowPass((s) => !s);
                    }}
                  >
                    {showConfPass ? (
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
                  id="signupConfirmPassword"
                  name="signupConfirmPassword"
                  placeholder="Confirm Password"
                  className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-full ${showConfPass ? "text-security-none" : "text-security-disc"}`}
                  required
                  value={confPassValue}
                  onChange={(e) => {
                    if (checkConfPass) {
                      setCheckConfPass(false);
                    }
                    setConfPassValue(e.target.value);
                  }}
                />
                {checkConfPass && (
                  <span className="text-red-600">
                    please confirm your password
                  </span>
                )}
              </div>
            </div>

            {/* Birthday */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between px-1">
                <label htmlFor="signupBdMonth" className="cursor-pointer">
                  Birthday
                </label>
              </div>
              <div className="w-full relative flex gap-7">
                <select
                  name="signupBdMonth"
                  id="signupBdMonth"
                  defaultValue=""
                  className={` h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-[35%] [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                  required
                >
                  <option value="" hidden>
                    Month
                  </option>

                  {months.map((v, i) => {
                    return (
                      <option key={i + 123} value={v}>
                        {v}
                      </option>
                    );
                  })}
                </select>
                <select
                  name="signupBdDay"
                  id="signupBdDay"
                  defaultValue=""
                  className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-[25%] [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                  required
                >
                  <option value="" hidden>
                    Day
                  </option>

                  {Array.from({ length: 31 }, (_, i) => {
                    return (
                      <option value={i + 1} key={i + 123}>
                        {i + 1}
                      </option>
                    );
                  })}
                </select>
                <select
                  name="signupBdYear"
                  id="signupBdYear"
                  defaultValue=""
                  className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-[30%] [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                  required
                >
                  <option value="" hidden>
                    Year
                  </option>

                  {Array.from({ length: curYear - startYear + 1 }, (_, i) => {
                    return (
                      <option value={i + 1950} key={i + 123}>
                        {i + 1950}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signupFullName" className="cursor-pointer">
                Full name
              </label>
              <input
                type="text"
                id="signupFullName"
                name="signupFullName"
                placeholder="Full Name"
                className="h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600"
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label htmlFor="signupUsername" className="cursor-pointer">
                Username
              </label>
              <input
                type="text"
                id="signupUsername"
                name="signupUsername"
                placeholder="Username"
                className="h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600"
                value={usrnameStReset}
                onChange={(e) => {
                  setCheckUsername(false);
                  setUsernameExists(null);
                  setUsrnameStReset(e.target.value);
                }}
                required
              />
              {checkUsername && (
                <p className="text-red-500 text-sm pl-2">
                  * Username cannot contain{" "}
                  <span className="text-slate-950">
                    &quot;space,*,%,&&quot;
                  </span>{" "}
                  or any other special characters
                </p>
              )}

              {usernameExists && (
                <p className="text-red-500 text-sm pl-2">
                  * Username with {usernameExists} already exists
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className={`h-10 bg-blue-600 rounded-lg text-slate-50 mt-4 flex justify-center items-center gap-2 ${
                isSubmitting ||
                isSigupSubmitting ||
                checkUsername ||
                usernameExists
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                isSubmitting ||
                isSigupSubmitting ||
                checkUsername ||
                usernameExists
              }
            >
              Sign up {isSubmitting && <SpinnerMini />}
            </button>

            <p>
              Already have an account?
              <Link
                href="/auth/login?signup=success"
                className="h-10 underline hover:text-blue-600"
              >
                Login here
              </Link>
            </p>
          </>
        </fieldset>
      </form>
    </>
  );
}

export default SignUpForm;
