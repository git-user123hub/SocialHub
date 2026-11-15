"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserNewProfile } from "@/app/_lib/actions";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import imageCompression from "browser-image-compression";

const compressionOptions = {
  maxSizeMB: 0.009765625,
  maxWidthOrHeight: 500,
  useWebWorker: true,
};

const genderArr = ["Male", "Female"];

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

function CreateNewProfile({ userAvatar }) {
  const [hasFile, setHasFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [checkUsername, setCheckUsername] = useState(false);
  const [usrnameStReset, setUsrnameStReset] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startYear = 1950;
  const curYear = new Date().getUTCFullYear();

  const params = useParams();

  const router = useRouter();

  async function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;
    setHasFile(file);
  }

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  async function handleSubmission(e) {
    e.preventDefault();

    setIsSubmitting(true);
    const targetEls = e.target.elements;
    const isProfilePic = targetEls.profilePicId.files.length;
    const user_id = params.profileID;
    const signupBdMonth = targetEls.signupBdMonth.value;
    const signupBdDay = targetEls.signupBdDay.value;
    const signupBdYear = targetEls.signupBdYear.value;
    const signupUsername = targetEls.signupUsername.value;

    const usernameRegex = /^[a-zA-Z0-9-_]+$/;

    if (!usernameRegex.test(signupUsername)) {
      setCheckUsername(true);
      return;
    }

    const monthsInNum = months.map((m, i) => {
      return { mName: m, mNum: i + 1 };
    });
    const birth = monthsInNum.filter((m, i) => {
      return m.mName === signupBdMonth;
    });

    const finalBd = `${signupBdYear}-${birth[0].mNum.toString().padStart(2, "0")}-${signupBdDay.toString().padStart(2, "0")}`;

    const formData = new FormData(e.target);

    formData.delete("signupBdMonth");
    formData.delete("signupBdDay");
    formData.delete("signupBdYear");
    formData.append("signupBirthday", finalBd);

    if ((isProfilePic <= 0 || isProfilePic > 1) && !hasFile && !userAvatar) {
      formData.delete("profilePicName");
      formData.append("profilePicName", "no-file");
    }

    if ((isProfilePic <= 0 || isProfilePic > 1) && hasFile && userAvatar) {
      formData.delete("profilePicName");
      formData.append("profilePicName", hasFile);
    }

    if (isProfilePic === 1) {
      const profilePhoto = targetEls?.profilePicId?.files[0];

      imageCompressionTryBlock: try {
        if (profilePhoto?.size <= 10 * 1024) {
          break imageCompressionTryBlock;
        }

        if (profilePhoto?.size > 10.1 * 1024) {
          const compressedBlob = await imageCompression(
            profilePhoto,
            compressionOptions,
          );

          let compressedFile = new File([compressedBlob], profilePhoto.name, {
            type: profilePhoto.type,
          });

          formData.delete("profilePicName");
          formData.append("profilePicName", compressedFile);
        }
      } catch (error) {
        // Intentionally empty
      }
    }

    formData.append("user_id", user_id);

    const userProfile = await createUserNewProfile(formData);

    if (userProfile) {
      setIsSubmitting(false);
      if (userProfile.success) {
        toast.success("Profile created successfully!");
        router.replace(userProfile.navigateTo);
      }

      if (!userProfile.success) {
        toast.error("Profile creation failed, please try again later");
      }
    }
  }

  useEffect(() => {
    if (!hasFile) {
      setPreview(null);
      return;
    }

    const imgType = typeof hasFile;

    let url;

    if (imgType === "string") {
      url = hasFile;
    }

    if (imgType !== "string") {
      url = URL.createObjectURL(hasFile);
    }

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [hasFile]);

  useEffect(() => {
    if (userAvatar) {
      setHasFile(userAvatar);
    }
  }, [userAvatar]);

  return (
    <>
      <form onSubmit={handleSubmission} className="mt-3 w-[90%]">
        <fieldset
          disabled={isSubmitting}
          className={`flex flex-col gap-5 ${isSubmitting ? "text-[#6c757d] border-[#ced4da] cursor-not-allowed opacity-90" : ""}`}
        >
          <>
            {/* Avatar image */}
            <div
              className={`flex flex-col gap-2 items-center mb-7 ${isSubmitting ? "opacity-50" : ""}`}
            >
              <input
                type="file"
                id="profilePicId"
                name="profilePicName"
                onChange={handleFileChange}
                hidden
              />
              <label
                htmlFor="profilePicId"
                className={`file:bg-indigo-300 text-slate-200 rounded-xl px-5 py-2 text-sm font-semibold flex justify-center items-center ${isSubmitting ? "cursor-auto" : "cursor-pointer"}`}
              >
                <div className="flex justify-center items-center bg-[#d4d4d4] w-[120px] h-[120px] rounded-full overflow-hidden">
                  {preview ? (
                    <div className={`w-full h-full flex items-center relative`}>
                      <Image
                        src={preview}
                        fill
                        quality={100}
                        className={`object-fill`}
                        alt="Mountains and forests with two cabins"
                      />
                    </div>
                  ) : (
                    <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-[1]" />
                  )}
                </div>
              </label>
              <p>Profile Picture</p>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-2">
              <label htmlFor="profileBioId" className="cursor-pointer">
                Bio
              </label>
              <input
                type="text"
                id="profileBioId"
                name="profileBioName"
                className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-full`}
                required
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <label htmlFor="profileGenderId" className="cursor-pointer">
                Gender
              </label>

              <select
                id="profileGenderId"
                name="profileGenderName"
                className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-full [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                required
              >
                <option value="" hidden selected>
                  Gender
                </option>
                {genderArr.map((v, i) => {
                  return (
                    <option key={i + 123} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
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
                  className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-[35%] [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                  required
                >
                  <option value="" hidden selected>
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
                  className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-[25%] [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                  required
                >
                  <option value="" hidden selected>
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
                  className={`h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-[30%] [&:has(option[value='']:checked)]:text-gray-400 [&>option]:text-gray-900`}
                  required
                >
                  <option value="" hidden selected>
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
                className="h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600"
                required
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
                className="h-11 px-4 rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600"
                value={usrnameStReset}
                onChange={(e) => {
                  setCheckUsername(false);
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
            </div>

            <button
              className={`h-10 bg-blue-600 rounded-lg text-slate-50 mt-4 flex justify-center items-center gap-2 ${isSubmitting ? "opacity-50" : ""}`}
              disabled={isSubmitting}
            >
              create profile {isSubmitting && <SpinnerMini />}
            </button>
          </>
        </fieldset>
      </form>
    </>
  );
}

export default CreateNewProfile;
