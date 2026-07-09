import mongoose from "mongoose";
import question from "../models/question.js";
import user from "../models/auth.js";

export const Askanswer = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }
  const { noofanswer, answerbody, useranswered, userid } = req.body;
  updatenoofanswer(_id, noofanswer);

  // Give 5 reward points for answering
  await user.findByIdAndUpdate(
    userid,
    {
      $inc: {
        rewardPoints: 5,
      },
    }
  );

  try {
    const updatequestion = await question.findByIdAndUpdate(_id, {
      $addToSet: { answer: [{ answerbody, useranswered, userid }] },
    });
    res.status(200).json({ data: updatequestion });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
const updatenoofanswer = async (_id, noofanswer) => {
  try {
    await question.findByIdAndUpdate(_id, { $set: { noofanswer: noofanswer } });
  } catch (error) {
    console.log(error);
  }
};
export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noofanswer, answerid } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "question unavailable" });
  }

  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(400).json({ message: "answer unavailable" });
  }

  updatenoofanswer(_id, noofanswer);

  try {

    // Find the question
    const questionDoc = await question.findById(_id);

    // Find the answer that is being deleted
    const answer = questionDoc.answer.id(answerid);

    // Deduct 5 reward points from the answer owner
    if (answer) {
      await user.findByIdAndUpdate(
        answer.userid,
        {
          $inc: {
            rewardPoints: -5,
          },
        }
      );
    }

    // Delete the answer
    const updatequestion = await question.updateOne(
      { _id },
      {
        $pull: {
          answer: { _id: answerid },
        },
      }
    );

    res.status(200).json({
      data: updatequestion,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json("something went wrong..");
  }
};

export const voteAnswer = async (req, res) => {
  try {
    const { questionId, answerId, userId, value } = req.body;

    const questionDoc = await question.findById(questionId);

    if (!questionDoc) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const answer = questionDoc.answer.id(answerId);

    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
      });
    }

    const upIndex = answer.upvote.indexOf(userId);
    const downIndex = answer.downvote.indexOf(userId);

    if (value === "upvote") {

      if (downIndex !== -1)
        answer.downvote.splice(downIndex, 1);

      if (upIndex === -1)
        answer.upvote.push(userId);
      else
        answer.upvote.splice(upIndex, 1);

      // Bonus reward at 5 upvotes
      if (
        answer.upvote.length >= 5 &&
        !answer.bonusAwarded
      ) {
        await user.findByIdAndUpdate(
          answer.userid,
          {
            $inc: {
              rewardPoints: 5,
            },
          }
        );

        answer.bonusAwarded = true;
      }

    } else {

      if (upIndex !== -1)
        answer.upvote.splice(upIndex, 1);

      if (downIndex === -1)
        answer.downvote.push(userId);
      else
        answer.downvote.splice(downIndex, 1);
        await user.findByIdAndUpdate(
          answer.userid,
          {
            $inc: {
              rewardPoints: -1,
            },
          }
        );
    }

    await questionDoc.save();

    res.status(200).json({
      data: questionDoc,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
    });

  }
};
