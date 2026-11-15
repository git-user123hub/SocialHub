import FollowingAtTop from "./FollowingAtTop";

export default async function FollowedAccntsTopBar({ allFollowingOfCurUser }) {
  return (
    <div className="mb-5 p-5 mt-4 flex items-center gap-5 ml-[-50px]">
      {allFollowingOfCurUser.map((accFlwngProfile, i) => (
        <FollowingAtTop
          key={accFlwngProfile.id}
          accFlwngProfile={accFlwngProfile}
        />
      ))}
    </div>
  );
}
