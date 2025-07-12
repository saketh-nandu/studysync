import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertNoteSchema, 
  insertFlashcardSchema, 
  insertTodoSchema, 
  insertProjectSchema, 
  insertScheduleSchema, 
  insertStudySessionSchema, 
  insertNewsFeedSchema 
} from "@shared/schema";
import { summarizeArticle } from "./gemini";
import multer from "multer";
import { z } from "zod";
import QRCode from "qrcode";
import Tesseract from "tesseract.js";
import path from "path";

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for development (replace with actual authentication)
  const getCurrentUserId = () => 1;

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const notes = await storage.getNotesByUserId(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const noteData = insertNoteSchema.parse({ ...req.body, userId });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(id, updateData);
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNote(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Flashcards routes
  app.get("/api/flashcards", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const flashcards = await storage.getFlashcardsByUserId(userId);
      res.json(flashcards);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
      res.status(500).json({ message: "Failed to fetch flashcards" });
    }
  });

  app.post("/api/flashcards", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const flashcardData = insertFlashcardSchema.parse({ ...req.body, userId });
      const flashcard = await storage.createFlashcard(flashcardData);
      res.json(flashcard);
    } catch (error) {
      console.error("Error creating flashcard:", error);
      res.status(500).json({ message: "Failed to create flashcard" });
    }
  });

  app.put("/api/flashcards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertFlashcardSchema.partial().parse(req.body);
      const flashcard = await storage.updateFlashcard(id, updateData);
      res.json(flashcard);
    } catch (error) {
      console.error("Error updating flashcard:", error);
      res.status(500).json({ message: "Failed to update flashcard" });
    }
  });

  app.delete("/api/flashcards/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFlashcard(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      res.status(500).json({ message: "Failed to delete flashcard" });
    }
  });

  // Todos routes
  app.get("/api/todos", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const todos = await storage.getTodosByUserId(userId);
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  app.post("/api/todos", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const todoData = insertTodoSchema.parse({ ...req.body, userId });
      const todo = await storage.createTodo(todoData);
      res.json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Failed to create todo" });
    }
  });

  app.put("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTodoSchema.partial().parse(req.body);
      const todo = await storage.updateTodo(id, updateData);
      res.json(todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ message: "Failed to update todo" });
    }
  });

  app.delete("/api/todos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTodo(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Failed to delete todo" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const projectData = insertProjectSchema.parse({ ...req.body, userId });
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, updateData);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProject(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Schedules routes
  app.get("/api/schedules", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const schedules = await storage.getSchedulesByUserId(userId);
      res.json(schedules);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const scheduleData = insertScheduleSchema.parse({ ...req.body, userId });
      const schedule = await storage.createSchedule(scheduleData);
      res.json(schedule);
    } catch (error) {
      console.error("Error creating schedule:", error);
      res.status(500).json({ message: "Failed to create schedule" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateSchedule(id, updateData);
      res.json(schedule);
    } catch (error) {
      console.error("Error updating schedule:", error);
      res.status(500).json({ message: "Failed to update schedule" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSchedule(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Study sessions routes
  app.get("/api/study-sessions", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const sessions = await storage.getStudySessionsByUserId(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.post("/api/study-sessions", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const sessionData = insertStudySessionSchema.parse({ ...req.body, userId });
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  });

  // News feed routes
  app.get("/api/news-feed", async (req, res) => {
    try {
      const newsFeeds = await storage.getNewsFeeds();
      res.json(newsFeeds);
    } catch (error) {
      console.error("Error fetching news feed:", error);
      res.status(500).json({ message: "Failed to fetch news feed" });
    }
  });

  app.post("/api/news-feed", async (req, res) => {
    try {
      const userId = getCurrentUserId();
      const newsFeedData = insertNewsFeedSchema.parse({ ...req.body, userId });
      const newsFeed = await storage.createNewsFeed(newsFeedData);
      res.json(newsFeed);
    } catch (error) {
      console.error("Error creating news feed:", error);
      res.status(500).json({ message: "Failed to create news feed" });
    }
  });

  // AI Chatbot route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const response = await summarizeArticle(message);
      res.json({ response });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // File upload route for document conversion
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      res.json({ 
        success: true,
        message: "File uploaded successfully",
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Document conversion route
  app.post("/api/convert-document", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const { outputFormat } = req.body;
      if (!outputFormat) {
        return res.status(400).json({ message: "Output format is required" });
      }
      
      // In a real implementation, you would convert the document here
      // For now, we'll simulate the conversion
      const convertedFilename = `converted_${Date.now()}.${outputFormat}`;
      
      res.json({ 
        success: true,
        message: "Document converted successfully",
        originalFile: req.file.originalname,
        convertedFile: convertedFilename,
        outputFormat: outputFormat,
        downloadUrl: `/api/download/${convertedFilename}`
      });
    } catch (error) {
      console.error("Error converting document:", error);
      res.status(500).json({ message: "Failed to convert document" });
    }
  });

  // QR code generation route
  app.post("/api/generate-qr", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }
      
      // Generate QR code as data URL
      const qrDataURL = await QRCode.toDataURL(text, {
        width: 300,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      res.json({ 
        success: true,
        qrCode: qrDataURL,
        text: text
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  // Document scanning route
  app.post("/api/scan-document", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const filename = req.file.filename;
      const originalName = req.file.originalname;
      const filePath = path.join("uploads", filename);

      // Perform OCR using Tesseract
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m)
      });
      
      res.json({
        success: true,
        filename: `scanned_${originalName}`,
        originalName,
        extractedText: text,
        url: `/uploads/${filename}`,
      });
    } catch (error) {
      console.error("Document scan error:", error);
      res.status(500).json({ message: "Document scanning failed" });
    }
  });

  // Calendar events endpoint
  app.get("/api/calendar-events", async (req, res) => {
    try {
      const events = [
        {
          id: '1',
          title: 'Computer Science Lecture',
          description: 'Introduction to Algorithms',
          date: new Date().toISOString(),
          time: '10:00 AM',
          location: 'Room 101',
          type: 'class'
        },
        {
          id: '2',
          title: 'Assignment Due',
          description: 'Data Structures Project',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          time: '11:59 PM',
          location: 'Online',
          type: 'assignment'
        }
      ];
      res.json(events);
    } catch (error) {
      console.error("Calendar events error:", error);
      res.status(500).json({ message: "Failed to fetch calendar events" });
    }
  });

  // Email templates endpoint
  app.get("/api/email-templates", async (req, res) => {
    try {
      const templates = [
        {
          id: '1',
          name: 'Professor Meeting Request',
          subject: 'Request for Office Hours Meeting',
          body: 'Dear Professor [NAME],\n\nI hope this email finds you well. I am [YOUR NAME], a student in your [COURSE NAME] class.\n\nI would like to schedule a meeting during your office hours to discuss [SPECIFIC TOPIC/QUESTION]. I am available on [DAY/TIME] and would appreciate the opportunity to get your guidance on this matter.\n\nPlease let me know if this time works for you, or if you would prefer to meet at a different time.\n\nThank you for your time and consideration.\n\nBest regards,\n[YOUR NAME]\n[STUDENT ID]\n[EMAIL]',
          category: 'academic',
          tags: ['professor', 'meeting', 'office hours']
        },
        {
          id: '2',
          name: 'Assignment Extension Request',
          subject: 'Request for Assignment Extension - [ASSIGNMENT NAME]',
          body: 'Dear Professor [NAME],\n\nI am writing to request an extension for [ASSIGNMENT NAME] that is due on [DUE DATE].\n\nDue to [REASON], I have encountered difficulties completing the assignment by the original deadline. I would like to request an extension until [NEW DATE], which would allow me to submit quality work that meets the course standards.\n\nI understand that extensions are not always possible, and I take full responsibility for this situation. I have attached any relevant documentation that supports my request.\n\nThank you for considering my request. I look forward to your response.\n\nSincerely,\n[YOUR NAME]\n[STUDENT ID]',
          category: 'academic',
          tags: ['extension', 'assignment', 'deadline']
        }
      ];
      res.json(templates);
    } catch (error) {
      console.error("Email templates error:", error);
      res.status(500).json({ message: "Failed to fetch email templates" });
    }
  });

  // File manager endpoint
  app.get("/api/files", async (req, res) => {
    try {
      const files = [
        {
          id: '1',
          name: 'Lecture Notes',
          type: 'folder',
          size: 0,
          mimeType: '',
          dateModified: new Date('2024-01-15').toISOString(),
          dateCreated: new Date('2024-01-10').toISOString(),
          path: '/documents',
          isShared: false,
          tags: ['study', 'notes']
        },
        {
          id: '2',
          name: 'Assignment_1.pdf',
          type: 'file',
          size: 2048576,
          mimeType: 'application/pdf',
          dateModified: new Date('2024-01-20').toISOString(),
          dateCreated: new Date('2024-01-18').toISOString(),
          path: '/documents',
          isShared: true,
          tags: ['assignment', 'pdf']
        }
      ];
      res.json(files);
    } catch (error) {
      console.error("File manager error:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
