import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ProfileConfBtns from "./ProfileConfBtns";
import { getMyPostsCount } from "../_lib/inServer-services";

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

async function ProfileUserInfo({
  data,
  followersData,
  followingData,
  followersCountData,
  followingCountData,
  isUserItself,
  isFollowing,
}) {
  if (!data) return;

  const { bio, gender, username, fullname, avatar, birthday } = data;

  const numOfPosts = await getMyPostsCount(data?.id);
  const bYear = birthday?.split("-")[0];
  const bMonth = birthday?.split("-")[1];
  const bDay = birthday?.split("-")[2];

  const fullMonthName = months
    .filter((month, index) => {
      let actualI = index + 1;
      let bMInNum = Number(bMonth);

      return actualI === bMInNum && month;
    })
    .at(0);

  return (
    <div className="mx-auto mt-7 min-[500px]:mt-16 flex flex-col gap-7 items-center max-[767px]:w-[80%] min-[768px]:w-auto max-w-[700px]">
      <div className="flex gap-5 md:gap-8 items-center w-full">
        <div>
          <div className="flex justify-center items-center bg-[#d4d4d4] w-20 h-20 min-[500px]:w-[120px] min-[500px]:h-[120px] rounded-full relative overflow-hidden">
            {avatar ? (
              <Image
                src={avatar}
                alt="article photo"
                fill
                sizes="468px"
                className="rounded-md object-fill"
                quality={50}
                priority
              />
            ) : (
              <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-[1]" />
            )}
          </div>
        </div>
        <div
          className="text-strokeClr min-[500px]:min-w-[300px] min-[600px]:min-w-[400px] min-[700px]:min-w-[500px] w-hStretch"
          style={{ widows: "-webkit-fill-available" }}
        >
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-base/4 min-[500px]:text-2xl font-bold flex items-center">
                <div className="flex justify-center items-center">
                  {username}
                </div>
              </div>
            </div>
            <div className="flex items-center text-xs min-[500px]:text-[14px]">
              {fullname}
            </div>

            <div className="flex items-center gap-7 text-xs min-[500px]:text-[14px]">
              <div className="flex items-center gap-1">
                <span className="font-semibold">
                  {!numOfPosts || numOfPosts === 0 || numOfPosts < 0
                    ? 0
                    : numOfPosts}
                </span>
                <span>posts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{followersCountData}</span>
                <span>followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{followingCountData}</span>
                <span>following</span>
              </div>
            </div>

            <div className="flex items-center text-xs min-[500px]:text-[14px]">
              {gender}
            </div>

            <div className="flex items-center gap-1 text-xs min-[500px]:text-[14px]">
              <span className="font-semibold">🎉 Born:</span>
              <span>
                {bDay} {fullMonthName} {bYear}
              </span>
            </div>

            <div className="flex items-center text-xs min-[500px]:text-[14px]">
              {bio}
            </div>
          </div>
        </div>
      </div>

      <ProfileConfBtns
        isUserItself={isUserItself}
        curProfileId={data?.id}
        isFollowing={isFollowing}
        curProUsername={data?.username}
      />
    </div>
  );
}

export default ProfileUserInfo;
