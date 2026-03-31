import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./user";
import { relations } from "drizzle-orm";
import { MessageTable } from "./message";
import { ReactionTable } from "./reaction";

export const ChannelTable = pgTable("channels", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull(),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  organizationId: varchar("organization_id")
    .references(() => organization.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const channelRelations = relations(ChannelTable, ({ one, many }) => ({
  user: one(user, {
    fields: [ChannelTable.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [ChannelTable.organizationId],
    references: [organization.id],
  }),
  messages: many(MessageTable),
  reactions: many(ReactionTable),
}));
