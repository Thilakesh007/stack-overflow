import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosinstance";

const Friends = () => {
  const [users, setUsers] = useState([]);

  const [currentUser, setCurrentUser] = useState<any>(null);

useEffect(() => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
  }
}, []);

  const fetchUsers = async () => {
    const res = await axiosInstance.get("/user/getalluser");
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const sendRequest = async (friendId: string) => {
    try {
      console.log("Current User:", currentUser);
  
      await axiosInstance.patch("/user/sendrequest", {
        userId: currentUser?._id,
        friendId: friendId,
      });
  
      alert("Friend Request Sent");
    } catch (err) {
      console.log(err);
    }
  };
  if (!currentUser) return <div>Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-5">
        All Users
      </h1>

      {users.map((u: any) => (
        <div
          key={u._id}
          className="border p-4 mb-3 flex justify-between"
        >
          <div>
            {u.name}
          </div>

          {currentUser && String(u._id) !== String(currentUser._id) && (
            <button
              onClick={() => sendRequest(u._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Add Friend
            </button>
          )}
        </div>
      ))}

    </div>
  );
};

export default Friends;