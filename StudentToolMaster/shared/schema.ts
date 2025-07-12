import { 
  pgTable, 
  text, 
  serial, 
  integer, 
  boolean, 
  timestamp, 
  jsonb,
  varchar
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  deckName: text("deck_name").notNull(),
  cards: jsonb("cards").notNull(), // Array of {front: string, back: string}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  priority: varchar("priority", { length: 10 }).default("medium"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull(), // 'academic', 'personal', 'career'
  status: varchar("status", { length: 20 }).default("in_progress"),
  data: jsonb("data").notNull(), // Flexible JSON data for different project types
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  location: text("location"),
  type: varchar("type", { length: 20 }).notNull(), // 'class', 'study', 'assignment', 'exam'
  createdAt: timestamp("created_at").defaultNow(),
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  duration: integer("duration").notNull(), // in minutes
  subject: text("subject"),
  type: varchar("type", { length: 20 }).default("pomodoro"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsFeeds = pgTable("news_feeds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  flashcards: many(flashcards),
  todos: many(todos),
  projects: many(projects),
  schedules: many(schedules),
  studySessions: many(studySessions),
  newsFeeds: many(newsFeeds),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
}));

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  user: one(users, { fields: [flashcards.userId], references: [users.id] }),
}));

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, { fields: [todos.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  user: one(users, { fields: [schedules.userId], references: [users.id] }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, { fields: [studySessions.userId], references: [users.id] }),
}));

export const newsFeedsRelations = relations(newsFeeds, ({ one }) => ({
  user: one(users, { fields: [newsFeeds.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertFlashcardSchema = createInsertSchema(flashcards).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTodoSchema = createInsertSchema(todos).omit({ id: true, createdAt: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertScheduleSchema = createInsertSchema(schedules).omit({ id: true, createdAt: true });
export const insertStudySessionSchema = createInsertSchema(studySessions).omit({ id: true, createdAt: true });
export const insertNewsFeedSchema = createInsertSchema(newsFeeds).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Todo = typeof todos.$inferSelect;
export type InsertTodo = z.infer<typeof insertTodoSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type NewsFeed = typeof newsFeeds.$inferSelect;
export type InsertNewsFeed = z.infer<typeof insertNewsFeedSchema>;
