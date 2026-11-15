"use client";

import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { editUserProfile } from "@/app/_lib/actions";
import toast from "react-hot-toast";
import RemoveAvatarImageMiniModalList from "./RemoveAvatarImageMiniModalList";
import imageCompression from "browser-image-compression";

const compressionOptions = {
  maxSizeMB: 0.009765625,
  maxWidthOrHeight: 500,
  useWebWorker: true,
};

const genderArr = ["Male", "Female"];

function EditProfile({ userProfile }) {
  const [hasFile, setHasFile] = useState(userProfile.avatar);
  const [preview, setPreview] = useState(userProfile.avatar);
  const [userProfStat, setUserProfState] = useState(userProfile);
  const [bioSt, setBioSt] = useState(userProfile.bio);
  const [genSt, setGenSt] = useState(userProfile.gender);
  const [startEdit, setStartEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removeOrUpload, setRemoveOrUpload] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const isUploadRef = useRef(false);

  let fileRef = useRef();

  async function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setHasFile(file);
    setStartEdit(true);
    setHasChanged(true);
  }

  function handleInputClick(e) {
    setStartEdit(true);
    if (preview || hasFile || fileRef?.current?.value) {
      if (isUploadRef?.current === false) {
        e.preventDefault();
        e.stopPropagation();
        setRemoveOrUpload(true);
      }

      if (isUploadRef?.current === true) {
      }
    } else {
    }
  }

  useEffect(() => {
    if (hasChanged) {
      if (isUploadRef?.current) isUploadRef.current = false;
      setHasChanged(false);
    }
  }, [hasChanged]);

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  async function handleSubmission(e) {
    e.preventDefault();

    setIsSubmitting(true);

    const user_id = userProfStat?.id;
    const targetEls = e.target.elements;
    const isProfilePic = targetEls?.profilePicName?.files?.length;
    const isProfileBio = targetEls?.profileBioName?.value
      .replace(/\s+/g, " ")
      .trim();
    const profGender = targetEls?.profileGenderName?.value;

    const formData = new FormData(e.target);

    if (
      (isProfilePic <= 0 || isProfilePic > 1) &&
      !hasFile &&
      userProfStat.avatar
    ) {
      formData.delete("profilePicName");
      formData.append("profilePicName", userProfStat.avatar);
      formData.append("profilePicStatus", "no-file");
    }

    if ((isProfilePic <= 0 || isProfilePic > 1) && hasFile) {
      formData.delete("profilePicName");
    }

    if (
      (isProfilePic <= 0 || isProfilePic > 1) &&
      !hasFile &&
      !userProfStat.avatar
    ) {
      formData.delete("profilePicName");
    }

    if (isProfilePic === 1) {
      const profilePhoto = targetEls?.profilePicName?.files[0];

      if (userProfStat?.avatar) {
        formData.append("profilePicPrev", userProfStat?.avatar);
        formData.append("profilePicStatus", "updated-file");
      }

      if (!userProfStat?.avatar) {
        formData.append("profilePicStatus", "fresh-upload");
      }

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

    if (isProfileBio?.length <= 0) {
      formData.delete("profileBioName");
    }

    if (isProfileBio.length > 0) {
      if (isProfileBio?.trim() === userProfStat?.bio?.trim()) {
        formData.delete("profileBioName");
      }

      if (isProfileBio !== userProfStat?.bio) {
        formData.delete("profileBioName");
        formData.append("profileBioName", isProfileBio?.trim());
      }
    }

    if (profGender?.trim() === userProfStat?.gender?.trim()) {
      formData.delete("profileGenderName");
    }

    formData.append("user_id", user_id);

    const userProfileSubmit = await editUserProfile(formData);

    if (userProfileSubmit) {
      setIsSubmitting(false);
      setStartEdit(false);
      if (userProfileSubmit.success) {
        toast.success("Profile updated successfully!");
      }

      if (!userProfileSubmit.success) {
        toast.success("Something went wrong, please try again later.");
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

  if (!userProfile) {
    return;
  }

  return (
    <>
      <form onSubmit={handleSubmission} className="mt-5 h-hStretch w-full">
        <fieldset
          disabled={isSubmitting || !userProfStat}
          className={`flex flex-col min-[500px]:gap-5 ${isSubmitting ? "text-[#6c757d] border-[#ced4da] cursor-not-allowed opacity-[0.6]" : ""}`}
        >
          {/* Avatar image */}
          <div className="flex gap-2 items-center mb-14 px-4 py-2 bg-editAccBgClr rounded-2xl">
            <input
              ref={fileRef}
              type="file"
              id="profilePicId"
              name="profilePicName"
              onClick={handleInputClick}
              onChange={handleFileChange}
              hidden
            />
            <label
              htmlFor="profilePicId"
              className="file:bg-indigo-300 text-slate-200 rounded-xl pr-1 py-2 text-sm font-semibold cursor-pointer flex justify-center items-center"
            >
              <div className="flex justify-center items-center bg-[#d4d4d4] w-14 h-14 rounded-full overflow-hidden">
                {preview ? (
                  <div className={`w-full h-full flex items-center relative`}>
                    <Image
                      src={preview}
                      fill
                      sizes="480px"
                      quality={100}
                      className={`object-fill`}
                      alt="Mountains and forests with two cabins"
                    />
                  </div>
                ) : (
                  <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-[1] [&>path]:stroke-globalBlack" />
                )}
              </div>
            </label>
            <div
              className="flex flex-col min-[500px]:flex-row w-hStretch h-hStretch justify-center min-[500px]:justify-between items-center"
              style={{
                width: "-webkit-fill-available",
              }}
            >
              <div className="text-strokeClr max-[500px]:self-start min-[500px]:pb-2">
                <p className=" max-[500px]:font-bold font-semibold text-lg max-[500px]:text-[17px]/[17px]">
                  {userProfStat?.username}
                </p>
                <p className="hidden min-[500px]:block font-normal text-editAccFullnameClr text-sm">
                  {userProfStat?.fullname}
                </p>
              </div>
              <button
                htmlFor="profilePicId"
                className={`w-max self-start text-mainBlueBtn max-[500px]:hover:underline max-[500px]:hover:text-mainBlueBtnHvr min-[500px]:self-auto  min-[500px]:h-8 min-[500px]:px-4 min-[500px]:bg-mainBlueBtn min-[500px]:hover:bg-mainBlueBtnHvr rounded-lg min-[500px]:text-[#ffffff] ${isSubmitting ? " min-[500px]:bg-blue-400 text-slate-400" : ""} font-semibold text-[15px]/[28px] min-[500px]:text-xs`}
                type="button"
                onClick={(e) => {
                  if (fileRef?.current?.value || preview || hasFile) {
                    setRemoveOrUpload(true);
                  }

                  if (!fileRef?.current?.value && !preview && !hasFile) {
                    fileRef?.current?.click();
                  }
                }}
              >
                Change photo
              </button>
            </div>
          </div>

          {/* Bio */}
          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="profileBioId"
                className={`cursor-pointer flex justify-between pr-1 items-center text-strokeClr`}
              >
                <span className="font-bold text-base">Bio</span>
                <span className="text-slate-500 text-sm">
                  {bioSt.length} / 150
                </span>
              </label>
              <textarea
                type="text"
                id="profileBioId"
                name="profileBioName"
                rows={3}
                cols={82}
                maxLength={150}
                value={bioSt}
                className={`h-16 px-4 bg-mainClr text-strokeClr rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-full resize-none relative py-1 ${isSubmitting ? "text-slate-400" : ""}`}
                onChange={(e) => {
                  setStartEdit(true);
                  setBioSt(e.target.value);
                }}
                required
                disabled={!bioSt || isSubmitting}
              ></textarea>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="profileGenderId"
                className={`cursor-pointer text-strokeClr font-bold text-base`}
              >
                Gender
              </label>

              <select
                id="profileGenderId"
                name="profileGenderName"
                value={genSt}
                className={`h-16 px-4 bg-mainClr text-strokeClr rounded-lg outline outline-1 outline-slate-400 focus:outline focus:outline-1 focus:outline-blue-600 w-full ${isSubmitting ? "text-slate-400" : ""}`}
                onChange={(e) => {
                  setStartEdit(true);
                  setGenSt(e.target.value);
                }}
                required
                disabled={!genSt || isSubmitting}
              >
                <option value="" hidden></option>
                {genderArr.map((v, i) => {
                  return (
                    <option key={i + 123} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            className="h-11 bg-mainBlueBtn rounded-lg text-[#ffffff] hover:bg-mainBlueBtnHvr mt-10 disabled:bg-editAccSbmtBtnGreyed disabled:cursor-not-allowed flex justify-center items-center gap-2"
            disabled={!userProfile || !startEdit || isSubmitting}
          >
            <span>{isSubmitting ? "Submitting..." : "Submit"}</span>
          </button>
        </fieldset>
      </form>

      {removeOrUpload && (
        <RemoveAvatarImageMiniModalList
          setRemoveOrUpload={setRemoveOrUpload}
          setPreview={setPreview}
          setHasFile={setHasFile}
          fileRef={fileRef}
          isUploadRef={isUploadRef}
          setStartEdit={setStartEdit}
        />
      )}
    </>
  );
}

export default EditProfile;
