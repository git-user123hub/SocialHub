import { getRandomProfiles } from "../_lib/inServer-services";
import SuggestedAccount from "./SuggestedAccount";

export default async function SuggestionsBar({
  curUserProfile,
  loggedInUserId,
}) {
  const randomProfilesArr = await getRandomProfiles(loggedInUserId);

  if (!randomProfilesArr || randomProfilesArr.length === 0) {
    return null;
  }

  const randomProfiles =
    randomProfilesArr?.length > 5
      ? randomProfilesArr?.pop()
      : randomProfilesArr;

  return (
    <div className="w-full">
      <SuggestedAccount randProfile={curUserProfile} />
      <div className="flex items-center p-3 font-semibold text-sm">
        <p className="flex-grow text-strokeClr">Suggested for you</p>
      </div>

      {randomProfiles &&
        randomProfiles.length > 0 &&
        randomProfiles.map((randProfile) => (
          <SuggestedAccount
            key={randProfile.id}
            sFollow="Follow"
            randProfile={randProfile}
          />
        ))}
    </div>
  );
}
