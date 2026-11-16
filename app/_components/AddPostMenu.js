import {
  ArrowLeftIcon,
  ArrowUpOnSquareStackIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon as PlusIconOutline,
  XCircleIcon,
  UserIcon,
  Square2StackIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { createPortal, useFormState } from "react-dom";
import Image from "next/image";
import { createPostAction } from "../_lib/actions";
import { useRouter } from "next/navigation";
import { useMainContext } from "./MainContext";
import AddPostImageCorousal from "./AddPostImageCorousal";
import imageCompression from "browser-image-compression";

const compressionOptions = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 750,
  maxIteration: 1,
  initialQuality: 0.45,
  useWebWorker: true,
};

function AddPostMenu({ onSetOpen, listenCapturing = true, setCreateClicked }) {
  const [expandIt, setExpandIt] = useState(false);
  const [descLength, setDescLength] = useState("");
  const [hasFile, setHasFile] = useState(null);
  const [finalModalWindow, setFinalModalWindow] = useState(false);
  const [state, formAction] = useFormState(createPostAction, null);
  const [isPending, setIsPending] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const { isDarkTrue, curUsrPro } = useMainContext();
  const [miniPreview, setMiniPreview] = useState([]);
  const [pIndex, setPIndex] = useState(0);
  const [middleRmv, setMiddleRmv] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [formState, setFormState] = useState(state);
  const [changeMobileUI, setChangeMobileUI] = useState(false);

  const router = useRouter();

  const ref = useRef(null);
  const previewRef = useRef(hasFile);
  previewRef.current = hasFile;
  const closeRef = useRef(null);
  const fileRef = useRef([]);
  const formRef = useRef();
  const squareRef = useRef(null);
  const galleryRef = useRef(null);
  const submitBtnRef = useRef(null);
  const hideFormRef = useRef(false);

  useEffect(() => {
    setFormState(state);
  }, [state]);

  useEffect(() => {
    if (!hasFile) {
      setMiniPreview([]);
      return;
    }

    const url = URL.createObjectURL(hasFile);

    setMiniPreview((prevSt) => {
      if (!prevSt || prevSt?.length < 0) {
        return [{ imgUrl: url, imgOrgFile: hasFile }];
      }

      if (prevSt || prevSt?.length > 0) {
        const prevSts = prevSt.filter((imageUrl) => {
          if (
            imageUrl?.imgOrgFile?.lastModified === hasFile?.lastModified &&
            imageUrl?.imgOrgFile?.name === hasFile?.name &&
            imageUrl?.imgOrgFile?.size === hasFile?.size
          ) {
            return imageUrl;
          }
        });

        if (!prevSts || prevSts?.length === 0) {
          return [...prevSt, { imgUrl: url, imgOrgFile: hasFile }];
        }

        if (prevSt || prevSts?.length > 0) {
          return prevSt;
        }
      }
    });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [hasFile]);

  useEffect(() => {
    function handleClick(e) {
      if (
        !squareRef.current?.contains(e.target) &&
        !galleryRef.current?.contains(e.target)
      ) {
        setOpenGallery(false);
      }
    }

    document.addEventListener("mousedown", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("mousedown", handleClick, listenCapturing);
  }, [listenCapturing]);

  useEffect(() => {
    let mouseDownTarget = null;

    function handleMouseDown(e) {
      mouseDownTarget = e.target;
    }

    function handleMouseUp(e) {
      if (!ref.current) return;

      const startedInside = ref.current?.contains(mouseDownTarget);
      const endedInside = ref.current?.contains(e.target);

      if (!startedInside && !endedInside) {
        if (
          ref?.current &&
          !ref?.current?.contains(e.target) &&
          !closeRef?.current?.contains(e.target)
        ) {
          hideFormRef.current = false;
          if (state) {
            if (state.success) {
              setHasFile(null);
              setExpandIt(false);
              setIsPending(false);
              setFinalModalWindow(false);
              onSetOpen(false);
              router.push(`/user/${state.user_id}`);
            }
            if (!state.success) {
              setHasFile(null);
              setExpandIt(false);
              setIsPending(false);
              setFinalModalWindow(false);
              onSetOpen(false);
            }
          } else {
            if (previewRef.current) {
              const confirmation = confirm("are you sure");
              if (confirmation) {
                setHasFile(null);
                setExpandIt(false);
                setIsPending(false);
                setFinalModalWindow(false);
                onSetOpen(false);
              }
            } else if (isPending) {
              const confirmation = confirm("are you sure");
              if (confirmation) {
                setHasFile(null);
                setExpandIt(false);
                setIsPending(false);
                setFinalModalWindow(false);
                onSetOpen(false);
              }
            } else {
              setIsPending(false);
              setFinalModalWindow(false);
              onSetOpen(false);
            }
          }
          setCreateClicked(false);
        }
      }
    }

    // document.addEventListener("click", handleClick, listenCapturing);

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // return () =>
    //   document.removeEventListener("click", handleClick, listenCapturing);
  }, [
    onSetOpen,
    listenCapturing,
    hasFile,
    isPending,
    router,
    state,
    setCreateClicked,
  ]);

  useEffect(() => {
    if (formState) {
      setChangeMobileUI(true);
      setIsPending(false);
    }

    if (!formState) {
      setChangeMobileUI(false);
    }
  }, [formState]);

  async function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;
    setHasFile(file);

    fileRef.current.push(file);
  }

  async function handleFileChangeMore(e) {
    const file = e.target.files[0];

    if (!file) return;

    const fileNamesOnly = fileRef.current.map((obj) => obj.name);

    if (fileRef.current?.length + 1 > 3) {
      alert("You have already selected 3 images");
      return;
    }

    if (fileRef.current?.length + 1 <= 3) {
      if (!fileNamesOnly.includes(file.name)) {
        setHasFile(file);
        fileRef.current.push(file);
      }
    }
  }

  function handleSubmit(e) {
    hideFormRef.current = true;
    setHasFile(null);
    setExpandIt(false);
    setFinalModalWindow(true);
  }

  async function handleFormSubmission(e) {
    e.preventDefault();

    setIsPending(true);
    hideFormRef.current = true;
    setFinalModalWindow(true);

    const form = formRef.current;

    let compressedFiles = [];

    try {
      const filesArray = Array.from(fileRef.current);

      const compressedFilesArray = await Promise.all(
        filesArray.map(async (file) => {
          if (file.size < 250 * 1024)
            return new File([file], file.name, { type: file.type });

          const compressedBlob = await imageCompression(
            file,
            compressionOptions,
          );

          return new File([compressedBlob], file.name, { type: file.type });
        }),
      );

      compressedFiles = compressedFilesArray;
    } catch (error) {
      compressedFiles = fileRef.current;
    }

    compressedFiles.forEach((singleFile) => {
      const dt = new DataTransfer();
      dt.items.add(singleFile);

      const input = document.createElement("input");
      input.type = "file";
      input.classList.add("imageField");
      input.name = `imageField`;
      input.style.display = "none";
      input.files = dt.files;

      form.appendChild(input);
    });

    const allFormInputs = document.querySelectorAll(".imageField");

    submitBtnRef?.current?.click();

    setTimeout(() => {
      allFormInputs.forEach((el) => {
        form.removeChild(el);
      });
    }, 1000);
  }

  return createPortal(
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[4000]  bg-[#100f0fdb]">
      <div
        ref={ref}
        className={`fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-postIniBtm ${expandIt ? "max-h-[601px] md:max-w-[674px] lg:max-w-[1100px]" : "max-h-[392px] md:max-w-[400px] lg:max-w-[750px]"} max-w-[350px] md:max-h-[450px] lg:max-h-[798px] aspect-square w-full h-full rounded-3xl flex flex-col items-center overflow-hidden border border-primaryHvrClr z-[1]`}
        style={{
          minHeight: "300px",
          minWidth: "300px",
          width: "-webkit-fill-available",
          height: "-webkit-fill-available",
          width: "100%",
          height: "100%",
        }}
      >
        {!finalModalWindow && (
          <>
            {(!miniPreview && miniPreview?.length < 1) ||
              (miniPreview?.length === 0 && (
                <>
                  <div className="w-full bg-postIniTop flex justify-center items-center p-3 border-b-[1px] border-b-postIniBdrBtm">
                    <p className="font-semibold text-strokeClr">
                      Create new post
                    </p>
                  </div>
                  <div className="bg-postIniBtm flex-grow w-full flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <ArrowUpOnSquareStackIcon className="w-16 h-16 [&>path]:stroke-[1] [&>path]:stroke-postIniStroke" />
                      <p className="text-xl text-postIniStroke">
                        Drag photos and videos here
                      </p>
                      <input
                        type="file"
                        id="post-photo-id"
                        onChange={handleFileChange}
                        hidden
                      />
                      <label
                        htmlFor="post-photo-id"
                        className="file:bg-indigo-900 bg-mainBlueBtn text-globalWhite rounded-xl px-5 py-2 text-sm font-semibold cursor-pointer hover:bg-mainBlueBtnHvr"
                      >
                        Select from computer
                      </label>
                    </div>
                  </div>
                </>
              ))}
          </>
        )}

        {!changeMobileUI && (
          <>
            {miniPreview && miniPreview?.length > 0 && (
              <>
                <div
                  className={`${hideFormRef?.current ? "hidden" : ""} w-full flex justify-between items-center p-3 border-b-[1px] border-b-postIniBdrBtm z-40 bg-postIniTop`}
                  id="testingit"
                >
                  {expandIt ? (
                    <button
                      onClick={() => {
                        setExpandIt(false);
                      }}
                    >
                      <ArrowLeftIcon className="w-6 h-6 [&>path]:stroke-strokeClr [&>path]:stroke-[2]" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const confirmation = confirm("are you sure");
                        if (confirmation) {
                          setHasFile(null);
                          setExpandIt(false);
                          fileRef.current = [];
                        }
                      }}
                    >
                      <ArrowLeftIcon className="w-6 h-6 [&>path]:stroke-strokeClr [&>path]:stroke-[2]" />
                    </button>
                  )}
                  <p className="font-semibold text-strokeClr">
                    Create new post
                  </p>
                  {expandIt ? (
                    <button
                      type="button"
                      form="myFormId"
                      className={`text-blue-700 capitalize font-semibold text-sm hover:underline ${isDarkTrue ? "text-blue-400 hover:text-blue-300" : "hover:text-blue-800"}`}
                      onClick={handleFormSubmission}
                    >
                      share
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`text-blue-700 capitalize font-semibold text-sm hover:underline ${isDarkTrue ? "text-blue-400 hover:text-blue-300" : "hover:text-blue-800"}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandIt((t) => !t);
                      }}
                    >
                      next
                    </button>
                  )}
                </div>
                <div
                  className={`${hideFormRef?.current ? "hidden" : ""} w-full h-full flex rounded-b-3xl relative bg-postIniBtm flex-col md:flex-row`}
                >
                  <>
                    <AddPostImageCorousal
                      expandIt={expandIt}
                      miniPreview={miniPreview}
                      pIndex={pIndex}
                      setPIndex={setPIndex}
                      middleRmv={middleRmv}
                    />
                    {miniPreview && miniPreview?.length > 0 && !expandIt && (
                      <>
                        <input
                          type="file"
                          id="post-photo-id"
                          onChange={handleFileChangeMore}
                          hidden
                        />
                        <button
                          ref={squareRef}
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenGallery((prevSt) => !prevSt);
                          }}
                          className="absolute bottom-3 right-3 bg-slate-900 p-1 rounded-full flex justify-center items-center hover:bg-secBtnBgHvr"
                        >
                          <Square2StackIcon className="w-5 h-5 [&>path]:stroke-[1.7] [&>path]:stroke-slate-100" />
                        </button>

                        {openGallery && (
                          <div
                            ref={galleryRef}
                            className="absolute bottom-10 right-3 bg-[#3e404480] rounded-md w-auto h-max min-w-20 text-strokeClr flex p-3"
                          >
                            <div
                              className="flex gap-3 max-w-[200px] sm:max-w-[300px] overflow-x-scroll"
                              style={{ scrollbarWidth: "none" }}
                            >
                              {miniPreview && miniPreview?.length > 0 && (
                                <>
                                  {miniPreview?.map((sPreview, index) => (
                                    <div
                                      key={sPreview?.imgUrl}
                                      className={`w-[104px] h-[104px] flex items-center relative cursor-pointer  ${pIndex !== index ? "after:content-[''] after:absolute after:left-0 after:right-0 after:top-0 after:w-full after:h-full after:bg-slate-900/80" : ""} shrink-0`}
                                      onClick={(e) => setPIndex(index)}
                                    >
                                      <Image
                                        src={URL.createObjectURL(
                                          sPreview?.imgOrgFile,
                                        )}
                                        fill
                                        quality={100}
                                        className={`object-cover`}
                                        alt="Mountains and forests with two cabins"
                                        onLoad={(e) =>
                                          URL.revokeObjectURL(e.target.src)
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="absolute right-1 top-1 rounded-full bg-[#ffffff6b] p-[3px]"
                                        onClick={(e) => {
                                          setMiddleRmv(index);

                                          if (fileRef.current?.length < 2) {
                                            const confirmation =
                                              confirm("are you sure");
                                            if (confirmation) {
                                              setHasFile(null);
                                              setExpandIt(false);
                                              fileRef.current = [];
                                            }
                                          }

                                          if (fileRef.current?.length > 1) {
                                            const imageFile =
                                              sPreview?.imgOrgFile;

                                            fileRef.current =
                                              fileRef.current?.filter(
                                                (anImgFile) => {
                                                  if (
                                                    anImgFile?.name !==
                                                      imageFile?.name &&
                                                    anImgFile?.size !==
                                                      imageFile?.size
                                                  ) {
                                                    return anImgFile;
                                                  }
                                                },
                                              );

                                            setMiniPreview((prevSt) =>
                                              prevSt?.filter((anImgFile) => {
                                                if (
                                                  anImgFile?.imgOrgFile
                                                    ?.name !==
                                                    imageFile?.name &&
                                                  anImgFile?.imgOrgFile
                                                    ?.size !== imageFile?.size
                                                ) {
                                                  return anImgFile;
                                                }
                                              }),
                                            );
                                          }
                                        }}
                                      >
                                        <XMarkIcon className="w-3 h-3 [&>path]:stroke-[1.7] [&>path]:stroke-black" />
                                      </button>
                                    </div>
                                  ))}
                                </>
                              )}
                            </div>
                            <div className="pl-3 h-[104px] flex justify-center">
                              <label
                                htmlFor="post-photo-id"
                                className="file:bg-indigo-300 h-fit border border-borderClr p-[12px] rounded-full flex justify-center items-center cursor-pointer"
                              >
                                <PlusIconOutline className="w-5 h-5 [&>path]:stroke-[1.7] [&>path]:stroke-slate-100" />
                              </label>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {expandIt && (
                      <>
                        <form
                          id="myFormId"
                          key={formKey}
                          action={formAction}
                          onSubmit={handleSubmit}
                          ref={formRef}
                          className={`flex flex-col flex-grow p-3`}
                          style={{
                            width: "-webkit-fill-available",
                          }}
                        >
                          <>
                            <div
                              className={`flex items-center gap-4 pb-3 ${isDarkTrue ? "" : "border-b border-slate-200"}`}
                            >
                              <div className="w-[32px] h-[32px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4] flex-shrink-0">
                                {curUsrPro?.avatar ? (
                                  <Image
                                    src={curUsrPro?.avatar}
                                    alt="article photo"
                                    fill
                                    sizes="468px"
                                    className="rounded-md object-fill"
                                    quality={100}
                                    priority
                                  />
                                ) : (
                                  <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-[1]" />
                                )}
                              </div>
                              <div className="flex-grow text-sm font-semibold text-strokeClr">
                                {curUsrPro?.username}
                              </div>
                            </div>

                            <>
                              <div className="flex-grow border-0 bg-postIniBtm">
                                <textarea
                                  className="resize-none w-full !h-[100%] outline-none bg-postIniBtm caret-strokeClr text-strokeClr"
                                  name="postDesc"
                                  id="add-post-desc-name"
                                  maxLength={2200}
                                  value={descLength}
                                  onChange={(e) =>
                                    setDescLength(e.target.value)
                                  }
                                ></textarea>
                              </div>
                            </>
                            <div
                              className={`${isDarkTrue ? "" : "border-t border-slate-200"} pt-3 flex justify-end items-center text-slate-400 text-sm`}
                            >
                              {descLength.length}/2,200
                            </div>

                            <input type="hidden" name="postOwner" value={1} />
                            <button
                              ref={submitBtnRef}
                              type="submit"
                              hidden
                              style={{ display: "none" }}
                            ></button>
                          </>
                        </form>
                      </>
                    )}
                  </>
                </div>
              </>
            )}
          </>
        )}

        {finalModalWindow && (
          <>
            <div className="w-full flex justify-center items-center p-3 border-b-[1px] border-b-postIniBdrBtm z-40 rounded-t-3xl bg-postIniTop relative">
              <p className="font-semibold text-strokeClr">
                {!isPending ? "Post shared" : "Sharing"}
              </p>
              {!isPending && (
                <button
                  className={`text-blue-700 hover:underline ${isDarkTrue ? "text-blue-400 hover:text-blue-300" : "hover:text-blue-800"} capitalize font-semibold text-sm absolute right-3`}
                  onClick={(e) => {
                    setFormKey((prevSt) => prevSt + 1);
                    setFormState(null);
                    setHasFile(null);
                    setExpandIt(false);
                    setIsPending(false);
                    setFinalModalWindow(false);
                    setChangeMobileUI(false);
                    setCreateClicked(false);
                    if (formState) {
                      if (formState.success) {
                        onSetOpen(false);
                        router.push(`/user/${state.user_id}`);
                      }

                      if (!formState.success) {
                        setDescLength("");
                        fileRef.current = [];
                      }
                    }
                  }}
                >
                  {formState && formState?.success ? "Done" : "Try Again"}
                </button>
              )}
            </div>
            <div className="flex-grow w-full flex justify-center items-center bg-postIniBtm">
              <div className="flex flex-col justify-center items-center gap-2">
                {isPending && (
                  <div className="relative h-32 w-32 shrink-0 grow-0 aspect-square [&_path]:stroke-[url(#insta-gradient-id)]">
                    <div className="animate-spin h-full w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full"
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 24 24"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="url(#insta-gradient-id)"
                          strokeWidth="0.7"
                          fill="none"
                          shapeRendering="geometricPrecision"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {!isPending &&
                  formState &&
                  (formState.success ? (
                    <div className="[&_path]:stroke-[url(#insta-gradient-id)]">
                      <CheckCircleIcon className="w-32 h-32 [&>path]:stroke-[0.7]" />
                    </div>
                  ) : (
                    <div>
                      <XCircleIcon className="w-32 h-32 [&>path]:stroke-[0.7] [&>path]:stroke-red-500" />
                    </div>
                  ))}

                {!isPending &&
                  formState &&
                  (formState.success ? (
                    <p className="text-xl text-postIniStroke">
                      Your post has been shared.
                    </p>
                  ) : (
                    <p className="text-xl text-postIniStroke">
                      Post sharing failed!
                    </p>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <button
        className="absolute right-3 top-3"
        ref={closeRef}
        onClick={(e) => {
          hideFormRef.current = false;
          if (state) {
            if (state.success) {
              setHasFile(null);
              setExpandIt(false);
              setIsPending(false);
              setFinalModalWindow(false);
              onSetOpen(false);
              router.push(`/user/${state.user_id}`);
            }
            if (!state.success) {
              setHasFile(null);
              setExpandIt(false);
              setIsPending(false);
              setFinalModalWindow(false);
              onSetOpen(false);
            }
          } else {
            if (previewRef.current) {
              const confirmation = confirm("are you sure");
              if (confirmation) {
                setHasFile(null);
                setExpandIt(false);
                setIsPending(false);
                setFinalModalWindow(false);
                onSetOpen(false);
              }
            } else if (isPending) {
              const confirmation = confirm("are you sure");
              if (confirmation) {
                setHasFile(null);
                setExpandIt(false);
                setIsPending(false);
                setFinalModalWindow(false);
                onSetOpen(false);
              }
            } else {
              setIsPending(false);
              setFinalModalWindow(false);
              onSetOpen(false);
            }
          }
          setCreateClicked(false);
        }}
      >
        <XMarkIcon className="w-6 h-6 [&>path]:stroke-[2] [&>path]:stroke-slate-50" />
      </button>
    </div>,
    document.body,
  );
}

export default AddPostMenu;
