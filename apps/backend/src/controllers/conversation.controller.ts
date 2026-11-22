
import { Request, Response } from "express";
import { db } from "../db/db";

// create 
export const createOrGetConversation = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { bidId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 1. Find the bid and its job
    const bid = await db.bid.findUnique({
      where: {
        id: bidId as string,
      },
      include: {
        job: true,
      },
    });

    if (!bid) {
      return res.status(404).json({
        message: "Bid not found",
      });
    }

    // 2. Only accepted bids can start a conversation
    if (bid.status !== "ACCEPTED") {
      return res.status(403).json({
        message: "Chat is available only for accepted bids",
      });
    }

    // 3. Verify that the logged-in user is a participant
    const isClient = bid.job.clientId === userId;
    const isFreelancer = bid.freelancerId === userId;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        message: "You are not allowed to access this conversation",
      });
    }

    // 4. Create or retrieve the conversation
    const conversation = await db.conversation.upsert({
      where: {
        bidId: bid.id,
      },

      update: {},

      create: {
        bidId: bid.id,
        jobId: bid.jobId,
        clientId: bid.job.clientId,
        freelancerId: bid.freelancerId,
      },
    });

    return res.status(200).json({
      message: "Conversation ready",
      conversation,
    });

  } catch (error) {
    console.error("CREATE CONVERSATION ERROR:", error);

    return res.status(500).json({
      message: "Failed to create conversation",
    });
  }
};


//get conversation

export const getUserConversations = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const conversations = await db.conversation.findMany({
      where: {
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },

      include: {
        job: {
          select: {
            id: true,
            title: true,
          },
        },

        client: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },

        freelancer: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.status(200).json({
      message: "Conversations fetched successfully",
      conversations,
    });

  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};

// message history
export const getConversationMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 1. Verify that the conversation belongs to this user
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // 2. Fetch messages in chronological order
    const messages = await db.message.findMany({
      where: {
        conversationId,
      },

      include: {
        sender: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });

  } catch (error) {
    console.error("GET CONVERSATION MESSAGES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

//send message 

export const sendMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { conversationId } = req.params;
    const { text } = req.body;

    // 1. Authenticate user
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // 2. Validate message
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    // 3. Verify conversation access
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { clientId: userId },
          { freelancerId: userId },
        ],
      },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // 4. Save message
    const newMessage = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        text: text.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            picture: true,
          },
        },
      },
    });

    // 5. Update conversation activity
    await db.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};
