import user from "../models/auth.js";
import transporter from "../config/mail.js";

export const sendLanguageOTP = async (req, res) => {
  try {
    const { userId, language } = req.body;

    const existingUser = await user.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    existingUser.languageOTP = otp;
    existingUser.languageOTPExpiry = Date.now() + 5 * 60 * 1000;
    existingUser.pendingLanguage = language;
    await existingUser.save();

    if (language === "fr") {

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: existingUser.email,
            subject: "Language Verification OTP",
    
            html: `
                <h2>Language Verification</h2>
    
                <p>Your OTP is:</p>
    
                <h1>${otp}</h1>
    
                <p>This OTP expires in 5 minutes.</p>
            `,
        });
    
        return res.status(200).json({
            message: "OTP sent to your registered email.",
        });
    }
    // Simulated Mobile OTP

    console.log("MOBILE OTP:", otp);

    res.status(200).json({
      message: "Mobile OTP sent successfully (Check server console)",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Something went wrong",
    });

  }
};
export const verifyOtp = async (req, res) => {
    try {
      const { userId, otp } = req.body;
  
      const currentUser = await user.findById(userId);
  
      if (!currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      if (currentUser.languageOTP !== otp) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }
  
      currentUser.language = currentUser.pendingLanguage;
      currentUser.languageOTP = "";
      currentUser.languageOTPExpiry = null;
      currentUser.pendingLanguage = "";
  
      await currentUser.save();
  
      res.status(200).json({
        message: "Language changed successfully",
        language: currentUser.language,
      });
  
    } catch (error) {
      console.log(error);
  
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  };