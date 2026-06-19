import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/user.js";
import imagekit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      role: "assistant",
      content: choices[0].message.content,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -1 } }
    );

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({
      userId,
      _id: chatId,
    });

    if (!chat) {
      return res.json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const encodedPrompt = encodeURIComponent(prompt);

    const generatedImageUrl =
      `${process.env.IMAGEKIT_URL_ENDPOINT}` +
      `/ik-genimg-prompt-${encodedPrompt}` +
      `/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    console.log("================================");
    console.log("IMAGEKIT_URL_ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);
    console.log("Generated URL:", generatedImageUrl);
    console.log("Prompt:", prompt);
    console.log("================================");

    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = `data:image/png;base64,${Buffer.from(
      aiImageResponse.data
    ).toString("base64")}`;

    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "/quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    chat.messages.push(reply);

    await chat.save();

    await User.updateOne(
      { _id: userId },
      { $inc: { credits: -2 } }
    );

    return res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.log("===== IMAGE GENERATION ERROR =====");
    console.log("MESSAGE:", error.message);

    if (error.response) {
      console.log("STATUS:", error.response.status);

      try {
        console.log(
          "DATA:",
          Buffer.from(error.response.data).toString()
        );
      } catch {
        console.log("DATA:", error.response.data);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};