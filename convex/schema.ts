import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    message: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    profileImageUrl: v.optional(v.string()),
  }),
});
