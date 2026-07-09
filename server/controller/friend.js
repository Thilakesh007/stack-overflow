import user from "../models/auth.js";

// Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You cannot send a request to yourself",
      });
    }

    const receiver = await user.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({
        message: "Friend request already sent",
      });
    }

    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.status(200).json({
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, senderId } = req.body;

    const currentUser = await user.findById(userId);
    const senderUser = await user.findById(senderId);

    if (!currentUser || !senderUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    currentUser.friendRequests =
      currentUser.friendRequests.filter(
        (id) => id.toString() !== senderId
      );

    currentUser.friends.push(senderId);
    senderUser.friends.push(userId);

    await currentUser.save();
    await senderUser.save();

    res.status(200).json({
      message: "Friend request accepted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// Get Friends List
export const getFriends = async (req, res) => {
  try {
    const { id } = req.params;

    const currentUser = await user
      .findById(id)
      .populate("friends", "name email");

    res.status(200).json({
      friends: currentUser.friends,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};