"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUserProfile } from "@/app/_lib/actions";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import imageCompression from "browser-image-compression";

const compressionOptions = {
  maxSizeMB: 0.009765625,
  maxWidthOrHeight: 500,
  useWebWorker: true,
};

const genderArr = ["Male", "Female"];

function CreateProfile() {
  const [hasFile, setHasFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();

  const router = useRouter();

  async function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;
    setHasFile(file);
  }

  //
  //
  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  async function handleSubmission(e) {
    e.preventDefault();

    setIsSubmitting(true);

    const targetEls = e.target.elements;
    const isProfilePic = targetEls.profilePicId.files.length;
    const user_id = params.profileID;

    const formData = new FormData(e.target);

    if (isProfilePic <= 0 || isProfilePic > 1) {
      formData.delete("profilePicName");
      formData.append("profilePicName", "no-file");
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

    const formImage = formData.get("profilePicName");

    formData.append("user_id", user_id);

    const userProfile = await createUserProfile(formData);
    setIsSubmitting(false);

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

    const url = URL.createObjectURL(hasFile);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [hasFile]);

  return (
    <>
      <form onSubmit={handleSubmission} className="mt-3 w-[90%]">
        <fieldset
          disabled={isSubmitting}
          className={`flex flex-col gap-5 ${isSubmitting ? "text-[#6c757d] border-[#ced4da] cursor-not-allowed opacity-90" : ""}`}
        >
          <>
            {/* Avatar image */}
            <div className="flex flex-col gap-2 items-center mb-7">
              <input
                type="file"
                id="profilePicId"
                name="profilePicName"
                onChange={handleFileChange}
                hidden
              />
              <label
                htmlFor="profilePicId"
                className="file:bg-indigo-300 text-slate-200 rounded-xl px-5 py-2 text-sm font-semibold cursor-pointer flex justify-center items-center"
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

export default CreateProfile;
