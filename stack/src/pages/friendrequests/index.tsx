import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

const FriendRequests = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const loginUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const res = await axiosInstance.get(
        "/user/getalluser"
      );

      const users = res.data.data;

      setAllUsers(users);

      const me = users.find(
        (u: any) => String(u._id) === String(loginUser._id)
      );

      console.log("Current User:", me);

      setCurrentUser(me);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const acceptRequest = async (senderId: string) => {
    try {
      await axiosInstance.patch(
        "/user/acceptrequest",
        {
          userId: currentUser._id,
          senderId,
        }
      );

      alert("Friend Added");

      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">
        Friend Requests
      </h1>

      {currentUser?.friendRequests?.length === 0 && (
        <h2>No Friend Requests</h2>
      )}

      {currentUser?.friendRequests?.map((id: string) => {
        const sender = allUsers.find(
          (u: any) => String(u._id) === String(id)
        );

        return (
          <div
            key={id}
            className="border p-4 mb-3 flex justify-between"
          >
            <div>
              {sender?.name}
            </div>

            <button
              onClick={() => acceptRequest(id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Accept
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default FriendRequests;