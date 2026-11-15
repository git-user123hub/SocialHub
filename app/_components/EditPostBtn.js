"use client";

function EditPostBtn({ setMenuClicked, setIsEditPostOpen }) {
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setMenuClicked(false);
          setIsEditPostOpen(true);
        }}
        className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
      >
        <span>Edit</span>
      </button>
    </>
  );
}

export default EditPostBtn;
