import {
  users,
  notes,
  flashcards,
  todos,
  projects,
  schedules,
  studySessions,
  newsFeeds,
  type User,
  type InsertUser,
  type Note,
  type InsertNote,
  type Flashcard,
  type InsertFlashcard,
  type Todo,
  type InsertTodo,
  type Project,
  type InsertProject,
  type Schedule,
  type InsertSchedule,
  type StudySession,
  type InsertStudySession,
  type NewsFeed,
  type InsertNewsFeed,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Note operations
  getNotesByUserId(userId: number): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: number): Promise<void>;
  
  // Flashcard operations
  getFlashcardsByUserId(userId: number): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, flashcard: Partial<InsertFlashcard>): Promise<Flashcard>;
  deleteFlashcard(id: number): Promise<void>;
  
  // Todo operations
  getTodosByUserId(userId: number): Promise<Todo[]>;
  createTodo(todo: InsertTodo): Promise<Todo>;
  updateTodo(id: number, todo: Partial<InsertTodo>): Promise<Todo>;
  deleteTodo(id: number): Promise<void>;
  
  // Project operations
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Schedule operations
  getSchedulesByUserId(userId: number): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule>;
  deleteSchedule(id: number): Promise<void>;
  
  // Study session operations
  getStudySessionsByUserId(userId: number): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  
  // News feed operations
  getNewsFeeds(): Promise<NewsFeed[]>;
  createNewsFeed(newsFeed: InsertNewsFeed): Promise<NewsFeed>;
  updateNewsFeed(id: number, newsFeed: Partial<InsertNewsFeed>): Promise<NewsFeed>;
  deleteNewsFeed(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Note operations
  async getNotesByUserId(userId: number): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note> {
    const [updatedNote] = await db
      .update(notes)
      .set({ ...note, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updatedNote;
  }

  async deleteNote(id: number): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // Flashcard operations
  async getFlashcardsByUserId(userId: number): Promise<Flashcard[]> {
    return await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.userId, userId))
      .orderBy(desc(flashcards.updatedAt));
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [newFlashcard] = await db.insert(flashcards).values(flashcard).returning();
    return newFlashcard;
  }

  async updateFlashcard(id: number, flashcard: Partial<InsertFlashcard>): Promise<Flashcard> {
    const [updatedFlashcard] = await db
      .update(flashcards)
      .set({ ...flashcard, updatedAt: new Date() })
      .where(eq(flashcards.id, id))
      .returning();
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    await db.delete(flashcards).where(eq(flashcards.id, id));
  }

  // Todo operations
  async getTodosByUserId(userId: number): Promise<Todo[]> {
    return await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.updatedAt));
  }

  async createTodo(todo: InsertTodo): Promise<Todo> {
    const [newTodo] = await db.insert(todos).values(todo).returning();
    return newTodo;
  }

  async updateTodo(id: number, todo: Partial<InsertTodo>): Promise<Todo> {
    const [updatedTodo] = await db
      .update(todos)
      .set({ ...todo, updatedAt: new Date() })
      .where(eq(todos.id, id))
      .returning();
    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<void> {
    await db.delete(todos).where(eq(todos.id, id));
  }

  // Project operations
  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, project: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Schedule operations
  async getSchedulesByUserId(userId: number): Promise<Schedule[]> {
    return await db
      .select()
      .from(schedules)
      .where(eq(schedules.userId, userId))
      .orderBy(schedules.startTime);
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async updateSchedule(id: number, schedule: Partial<InsertSchedule>): Promise<Schedule> {
    const [updatedSchedule] = await db
      .update(schedules)
      .set(schedule)
      .where(eq(schedules.id, id))
      .returning();
    return updatedSchedule;
  }

  async deleteSchedule(id: number): Promise<void> {
    await db.delete(schedules).where(eq(schedules.id, id));
  }

  // Study session operations
  async getStudySessionsByUserId(userId: number): Promise<StudySession[]> {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.createdAt));
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  // News feed operations
  async getNewsFeeds(): Promise<NewsFeed[]> {
    return await db
      .select()
      .from(newsFeeds)
      .orderBy(desc(newsFeeds.createdAt));
  }

  async createNewsFeed(newsFeed: InsertNewsFeed): Promise<NewsFeed> {
    const [newPost] = await db.insert(newsFeeds).values(newsFeed).returning();
    return newPost;
  }

  async updateNewsFeed(id: number, newsFeed: Partial<InsertNewsFeed>): Promise<NewsFeed> {
    const [updatedPost] = await db
      .update(newsFeeds)
      .set(newsFeed)
      .where(eq(newsFeeds.id, id))
      .returning();
    return updatedPost;
  }

  async deleteNewsFeed(id: number): Promise<void> {
    await db.delete(newsFeeds).where(eq(newsFeeds.id, id));
  }
}

export const storage = new DatabaseStorage();
