import { useQuery } from "@apollo/client";
import React, {useEffect} from "react";
import { useParams } from "react-router-dom";
import { getTrackingByID } from "../graphql/query/getTrackingByID";
import { formatDate } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";

const TrackingDetail = () => {
  const { currentColor } = useStateContext();
  const { id } = useParams();
  const { data, loading, error } = useQuery(getTrackingByID, {
    variables: {
      id,
    },
  });

  useEffect(() => {
    console.log(error)
  },[error])

  const tracking = data?.tracking_by_pk ? data?.tracking_by_pk : null;
  if (loading) {
    return (
      <div
        style={{ color: currentColor }}
        className="flex flex-col text-2xl  font-semibold h-screen justify-center items-center"
      >
        Loading...
      </div>
    );
  }
  return (
    <div className="m-2 md:m-5 mt-24 p-2 md:p-5 dark:text-white">
      <div className="grid grid-cols-12 lg:gap-10 gap-6">
        <div className="lg:col-span-4 col-span-12">
          <img
            src={tracking?.signature_photo_url}
            alt="Tracking"
            className="rounded bg-contain"
          />
        </div>
        <div className="lg:col-span-8 col-span-12">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Username
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.fk_user_name}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Task Name
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.fk_task_name}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Location Name
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.fk_location_name}
              </p>
            </div>

            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Hardware
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.hardware}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Quantity
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.quantity}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Note
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.note}
              </p>
            </div>

            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Start Coordinate
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.start_coords}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                End Coordinate
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.end_coords}
              </p>
            </div>

            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Start DateTime
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {formatDate(tracking?.start_date_time)}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                End DateTime
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {formatDate(tracking?.end_date_time)}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Permit Image
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.dispatch ? "Yes" : "No"}
              </p>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h4 className="dark:text-white font-semibold text-xl text-gray-900">
                Dispatch
              </h4>
              <p className="text-gray-500 mt-1 dark:text-white/70">
                {tracking?.dispatch ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingDetail;
