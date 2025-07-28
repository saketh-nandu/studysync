import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  factory DatabaseHelper() => _instance;

  DatabaseHelper._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final String path = join(await getDatabasesPath(), 'studysync.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    // Create tables
    await db.execute('''
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        priority INTEGER,
        is_completed INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    ''');

    await db.execute('''
      CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        category TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    ''');

    await db.execute('''
      CREATE TABLE flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        front_content TEXT NOT NULL,
        back_content TEXT NOT NULL,
        deck_name TEXT NOT NULL,
        last_reviewed TEXT,
        next_review TEXT,
        review_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    ''');

    await db.execute('''
      CREATE TABLE study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time TEXT NOT NULL,
        end_time TEXT,
        duration INTEGER,
        category TEXT,
        notes TEXT
      )
    ''');
  }

  // Tasks CRUD operations
  Future<int> insertTask(Map<String, dynamic> task) async {
    final Database db = await database;
    return await db.insert('tasks', task);
  }

  Future<List<Map<String, dynamic>>> getTasks() async {
    final Database db = await database;
    return await db.query('tasks', orderBy: 'due_date ASC');
  }

  Future<int> updateTask(Map<String, dynamic> task) async {
    final Database db = await database;
    return await db.update(
      'tasks',
      task,
      where: 'id = ?',
      whereArgs: [task['id']],
    );
  }

  Future<int> deleteTask(int id) async {
    final Database db = await database;
    return await db.delete(
      'tasks',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Notes CRUD operations
  Future<int> insertNote(Map<String, dynamic> note) async {
    final Database db = await database;
    return await db.insert('notes', note);
  }

  Future<List<Map<String, dynamic>>> getNotes() async {
    final Database db = await database;
    return await db.query('notes', orderBy: 'updated_at DESC');
  }

  Future<int> updateNote(Map<String, dynamic> note) async {
    final Database db = await database;
    note['updated_at'] = DateTime.now().toIso8601String();
    return await db.update(
      'notes',
      note,
      where: 'id = ?',
      whereArgs: [note['id']],
    );
  }

  Future<int> deleteNote(int id) async {
    final Database db = await database;
    return await db.delete(
      'notes',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Flashcards CRUD operations
  Future<int> insertFlashcard(Map<String, dynamic> flashcard) async {
    final Database db = await database;
    return await db.insert('flashcards', flashcard);
  }

  Future<List<Map<String, dynamic>>> getFlashcards(String deckName) async {
    final Database db = await database;
    return await db.query(
      'flashcards',
      where: 'deck_name = ?',
      whereArgs: [deckName],
      orderBy: 'next_review ASC',
    );
  }

  Future<int> updateFlashcard(Map<String, dynamic> flashcard) async {
    final Database db = await database;
    return await db.update(
      'flashcards',
      flashcard,
      where: 'id = ?',
      whereArgs: [flashcard['id']],
    );
  }

  Future<int> deleteFlashcard(int id) async {
    final Database db = await database;
    return await db.delete(
      'flashcards',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // Study Sessions CRUD operations
  Future<int> insertStudySession(Map<String, dynamic> session) async {
    final Database db = await database;
    return await db.insert('study_sessions', session);
  }

  Future<List<Map<String, dynamic>>> getStudySessions() async {
    final Database db = await database;
    return await db.query('study_sessions', orderBy: 'start_time DESC');
  }

  Future<Map<String, dynamic>> getStudyStats() async {
    final Database db = await database;
    final List<Map<String, dynamic>> result = await db.rawQuery('''
      SELECT 
        COUNT(*) as total_sessions,
        SUM(duration) as total_duration,
        AVG(duration) as avg_duration
      FROM study_sessions
      WHERE start_time >= date('now', '-30 days')
    ''');
    return result.first;
  }
}