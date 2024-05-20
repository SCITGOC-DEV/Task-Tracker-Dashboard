import React from "react";
import profile from "../data/profile.png";
import { useStateContext } from "../contexts/ContextProvider";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useQuery } from "@apollo/client";
import { getAdminByID } from "../graphql/query/getAdminByID";
const Profile = () => {
  const { userId } = useAuth();
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const { data } = useQuery(getAdminByID, {
    variables: {
      id: userId,
    },
  });
  const admin = data?.admin_by_pk ? data?.admin_by_pk : null;
  const handleChangePassword = () => {
    navigate(`/profile/change-password`);
  };
  const handleEditAdmin = () => {
    navigate(`/profile/edit-admin`);
  };

  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <div className="grid grid-cols-12">
        <div className="lg:col-span-4 md:col-span-6 sm:col-span-7 col-span-12 ">
          <div className="bg-white dark:bg-box-dark-bg rounded-lg overflow-hidden flex flex-col justify-center items-center p-10 shadow">
            <div className=" flex flex-col justify-center items-center">
              <div className="h-24 w-24 rounded-full">
                <img
                  src={profile}
                  alt="profile"
                  className="w-full h-full rounded-full"
                ></img>
              </div>
              <p className="mt-3 text-lg font-semibold text-black/80  dark:text-white">
                {admin?.username}
              </p>
              <p className="font-semibold text-black/40 dark:text-white/70">
                {admin?.email}
              </p>
            </div>
            <div className="mt-5">
              <ul className="list-disc flex flex-col space-y-3">
                <li>
                  <h4 className="font-bold  text-gray-700 dark:text-white text-lg">
                    Username
                  </h4>
                  <p className="text-gray-500 mt-1">{admin?.username}</p>
                </li>
                <li>
                  <h4 className="font-bold  text-gray-700 dark:text-white text-lg">
                    Email
                  </h4>
                  <p className="text-gray-500 mt-1 ">{admin?.email}</p>
                </li>
                <li>
                  <h4 className=" font-bold  text-gray-700 dark:text-white text-lg">
                    Address
                  </h4>
                  <p className="text-gray-500 mt-1 ">{admin?.address}</p>
                </li>
                <li>
                  <h4 className="font-bold  text-gray-700 dark:text-white text-lg">
                    Role
                  </h4>
                  <div
                    className=" mt-1 inline-block px-2 capitalize rounded text-white"
                    style={{ background: currentColor }}
                  >
                    {admin?.role}
                  </div>
                </li>
              </ul>

              <div className="flex flex-row flex-wrap space-x-6 mt-6">
                <Button
                  disabled={true}
                  style={{ background: currentColor }}
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
                <Button
                  style={{ background: currentColor }}
                  onClick={handleEditAdmin}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
