import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String email;
  final String displayName;
  final String? photoURL;
  final String? bio;
  final DateTime createdAt;
  final DateTime lastLoginAt;
  final Map<String, dynamic> settings;
  final List<String> favoriteTools;
  final Map<String, int> studyStats;
  final List<String> achievements;

  UserModel({
    required this.uid,
    required this.email,
    required this.displayName,
    this.photoURL,
    this.bio,
    required this.createdAt,
    required this.lastLoginAt,
    required this.settings,
    required this.favoriteTools,
    required this.studyStats,
    required this.achievements,
  });

  factory UserModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return UserModel(
      uid: doc.id,
      email: data['email'] ?? '',
      displayName: data['displayName'] ?? '',
      photoURL: data['photoURL'],
      bio: data['bio'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      lastLoginAt: (data['lastLoginAt'] as Timestamp).toDate(),
      settings: Map<String, dynamic>.from(data['settings'] ?? {}),
      favoriteTools: List<String>.from(data['favoriteTools'] ?? []),
      studyStats: Map<String, int>.from(data['studyStats'] ?? {}),
      achievements: List<String>.from(data['achievements'] ?? []),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'email': email,
      'displayName': displayName,
      'photoURL': photoURL,
      'bio': bio,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastLoginAt': Timestamp.fromDate(lastLoginAt),
      'settings': settings,
      'favoriteTools': favoriteTools,
      'studyStats': studyStats,
      'achievements': achievements,
    };
  }

  UserModel copyWith({
    String? uid,
    String? email,
    String? displayName,
    String? photoURL,
    String? bio,
    DateTime? createdAt,
    DateTime? lastLoginAt,
    Map<String, dynamic>? settings,
    List<String>? favoriteTools,
    Map<String, int>? studyStats,
    List<String>? achievements,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      photoURL: photoURL ?? this.photoURL,
      bio: bio ?? this.bio,
      createdAt: createdAt ?? this.createdAt,
      lastLoginAt: lastLoginAt ?? this.lastLoginAt,
      settings: settings ?? this.settings,
      favoriteTools: favoriteTools ?? this.favoriteTools,
      studyStats: studyStats ?? this.studyStats,
      achievements: achievements ?? this.achievements,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'uid': uid,
      'email': email,
      'displayName': displayName,
      'photoURL': photoURL,
      'bio': bio,
      'createdAt': createdAt.toIso8601String(),
      'lastLoginAt': lastLoginAt.toIso8601String(),
      'settings': settings,
      'favoriteTools': favoriteTools,
      'studyStats': studyStats,
      'achievements': achievements,
    };
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      uid: json['uid'] as String,
      email: json['email'] as String,
      displayName: json['displayName'] as String,
      photoURL: json['photoURL'] as String?,
      bio: json['bio'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      lastLoginAt: DateTime.parse(json['lastLoginAt'] as String),
      settings: Map<String, dynamic>.from(json['settings'] as Map),
      favoriteTools: List<String>.from(json['favoriteTools'] as List),
      studyStats: Map<String, int>.from(json['studyStats'] as Map),
      achievements: List<String>.from(json['achievements'] as List),
    );
  }

  factory UserModel.empty() {
    return UserModel(
      uid: '',
      email: '',
      displayName: '',
      createdAt: DateTime.now(),
      lastLoginAt: DateTime.now(),
      settings: {},
      favoriteTools: [],
      studyStats: {},
      achievements: [],
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is UserModel && other.uid == uid;
  }

  @override
  int get hashCode => uid.hashCode;
}