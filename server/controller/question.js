import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";

export const Askquestion = async (req, res) => {
  try {
    const { postquestiondata } = req.body;

    // Find current user
    const currentUser = await user.findById(postquestiondata.userid);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Subscription expired → Convert to Free Plan
    if (
      currentUser.subscriptionExpiry &&
      new Date() > currentUser.subscriptionExpiry
    ) {
      currentUser.subscriptionPlan = "Free";
      currentUser.subscriptionExpiry = null;

      await currentUser.save();
    }

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Count today's questions
    const todayQuestions = await question.countDocuments({
      userid: postquestiondata.userid,
      askedon: {
        $gte: today,
      },
    });

    const plan = currentUser.subscriptionPlan;

    // Free Plan → 1 question/day
    if (plan === "Free" && todayQuestions >= 1) {
      return res.status(403).json({
        message: "Free Plan allows only 1 question per day.",
      });
    }

    // Bronze → 5 questions/day
    if (plan === "Bronze" && todayQuestions >= 5) {
      return res.status(403).json({
        message: "Bronze Plan allows only 5 questions per day.",
      });
    }

    // Silver → 10 questions/day
    if (plan === "Silver" && todayQuestions >= 10) {
      return res.status(403).json({
        message: "Silver Plan allows only 10 questions per day.",
      });
    }

    // Gold → Unlimited

    const postques = new question({
      ...postquestiondata,
    });

    await postques.save();

    res.status(200).json({
      data: postques,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getallquestion = async (req, res) => {
  try {
    const allquestion = await question.find().sort({ askedon: -1 });
    res.status(200).json({ data: allquestion });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const deletequestion = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    await question.findByIdAndDelete(_id);
    res.status(200).json({ message: "question deleted" });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const votequestion = async (req, res) => {
  const { id: _id } = req.params;
  const { value ,userid} = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  try {
    const questionDoc = await question.findById(_id);
    const upindex = questionDoc.upvote.findIndex((id) => id === String(userid));
    const downindex = questionDoc.downvote.findIndex(
      (id) => id === String(userid)
    );
    if (value === "upvote") {
      if (downindex !== -1) {
        questionDoc.downvote = questionDoc.downvote.filter(
          (id) => id !== String(userid)
        );
      }
      if (upindex === -1) {
        questionDoc.upvote.push(userid);
      } else {
        questionDoc.upvote = questionDoc.upvote.filter((id) => id !== String(userid));
      }
    } else if (value === "downvote") {
      if (upindex !== -1) {
        questionDoc.upvote = questionDoc.upvote.filter((id) => id !== String(userid));
      }
      if (downindex === -1) {
        questionDoc.downvote.push(userid);
      } else {
        questionDoc.downvote = questionDoc.downvote.filter(
          (id) => id !== String(userid)
        );
      }
    }
    const questionvote = await question.findByIdAndUpdate(_id, questionDoc, { new: true });
    res.status(200).json({ data: questionvote });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
