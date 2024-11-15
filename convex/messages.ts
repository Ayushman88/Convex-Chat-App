import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const createMessage = mutation({
  args: {
    message: v.string(),
    userId: v.string(),
    profileImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const insertMessage = await ctx.db.insert("messages", {
        message: args.message,
        userId: args.userId,
        createdAt: Date.now(),
        profileImageUrl: args.profileImageUrl,
      });
      return insertMessage;
    } catch (error) {
      console.error(error);
    }
  },
});

export const showMessageList = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(100);
    return messages;
  },
});
