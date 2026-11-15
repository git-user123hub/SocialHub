import { Suspense } from "react";
import AboutCommentor from "./AboutCommentor";

export default function PostCommentSection({
  commentSys,
  postId,
  loggedInUserId,
  isPostModal,
}) {
  let parentComments = [];

  let prntChildSptr = commentSys;

  parentCall();

  function flatCildComments(arg1, arg2, arg3) {
    arg2.forEach((pCmt, pI) => {
      if (arg1.commented_on === pCmt.id) {
        if (arg2[pI].children) {
          if (!arg2[pI].firstLevelCmnt) {
            //
            if (arg2[pI]?.cmntChildLevel) {
              //
              if (arg2[pI]?.cmntChildLevel === 4) {
                arg1.cmntChildLevel = arg2[pI]?.cmntChildLevel;
                arg1.ml = arg2[pI].ml;
              }

              if (arg2[pI]?.cmntChildLevel < 4) {
                arg1.cmntChildLevel = arg2[pI]?.cmntChildLevel + 1;
              }
              //
            }
            //
          }
          //
          arg1.ml = pI + 10;
          //
          if (!arg1.cmntChildLevel) {
            arg1.cmntChildLevel = 1;
          }
          arg2[pI].children = [...arg2[pI].children, arg1];
        }

        if (!arg2[pI].children) {
          //
          if (!arg2[pI].firstLevelCmnt) {
            //
            if (arg2[pI]?.cmntChildLevel) {
              //
              if (arg2[pI]?.cmntChildLevel === 4) {
                arg1.cmntChildLevel = arg2[pI]?.cmntChildLevel;
              }

              if (arg2[pI]?.cmntChildLevel < 4) {
                arg1.cmntChildLevel = arg2[pI]?.cmntChildLevel + 1;
              }
              //
            }
            //
          }
          //
          arg1.ml = pI + 10;
          //
          if (!arg1.cmntChildLevel) {
            arg1.cmntChildLevel = 1;
          }

          //
          arg2[pI].children = [arg1];
        }
      }
    });
  }

  function parentCall() {
    for (let i = 0; i < prntChildSptr.length; i++) {
      const cmt = prntChildSptr[i];

      if (!cmt.commented_on) {
        cmt.ml = 0;
        cmt.firstLevelCmnt = true;
        cmt.cmntChildLevel = 0;
        parentComments.push(cmt);
      }
    }

    for (let i = 0; i < prntChildSptr.length; i++) {
      const cmt = prntChildSptr[i];

      flatCildComments(cmt, prntChildSptr, i);
    }
  }

  return (
    <div
      className={`${isPostModal ? "mt-7" : "md:h-10 md:mt-7"} mb-10 w-full md:mb-auto md:flex flex-col flex-grow`}
    >
      {commentSys.length > 0 && (
        <>
          <Suspense fallback={null}>
            {parentComments.map((comment, index) => {
              return (
                <AboutCommentor
                  key={comment.id}
                  comment={comment}
                  cmtsL={parentComments.length}
                  cmtI={index}
                  childCmts={comment.children ? comment.children : null}
                  postId={postId}
                  loggedInUserId={loggedInUserId}
                />
              );
            })}
          </Suspense>
        </>
      )}
    </div>
  );
}
