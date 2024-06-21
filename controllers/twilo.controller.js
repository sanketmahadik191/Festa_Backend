import "dotenv/config";
import twilio from "twilio";

export const getTwilo = async (req, res) => {
  const accSid = process.env.TWILO_SID;
  const accToken = process.env.TWILO_TOKEN;
  const mobileNo = process.env.TWILO_MOB;

  if (!accSid || !accToken || !mobileNo) {
    console.error("Twilio credentials are not set properly");
    return res
      .status(500)
      .json({ message: "Twilio credentials are not set properly" });
  }

  const client = twilio(accSid, accToken);

  const sendSMS = async (body) => {
    let msgOptions = {
      from: mobileNo,
      to: "+918975911058",
      body,
    };

    try {
      const validateNumber = await client.validationRequests.create({
        friendlyName: "pruthvi",
        phoneNumber: "+918975911058",
      })
      .then(validation=>console.log(validation.friendlyName))

      const message = await client.messages.create(msgOptions);
      console.log(message);
      res.status(200).json({ message: "SMS sent successfully", data: message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send SMS", error: err });
    }
  };

  await sendSMS("Hi, your account was debited by Rs. 500");
  console.log("Message sent");
};
