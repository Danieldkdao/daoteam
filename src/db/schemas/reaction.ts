import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";
import { ChannelTable } from "./channel";
import { MessageTable } from "./message";
import { relations } from "drizzle-orm";

export const ReactionTable = pgTable("reactions", {
  id: uuid().primaryKey().defaultRandom(),
  reaction: varchar("reaction").notNull(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  channelId: uuid("channel_id")
    .references(() => ChannelTable.id, { onDelete: "cascade" })
    .notNull(),
  messageId: uuid("message_id")
    .references(() => MessageTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reactionRelations = relations(ReactionTable, ({ one }) => ({
  user: one(user, {
    fields: [ReactionTable.userId],
    references: [user.id],
  }),
  message: one(MessageTable, {
    fields: [ReactionTable.messageId],
    references: [MessageTable.id],
  }),
  channelTable: one(ChannelTable, {
    fields: [ReactionTable.channelId],
    references: [ChannelTable.id],
  }),
}));
