import 'package:go_router/go_router.dart';

// Import screens
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/tools/presentation/screens/tools_screen.dart';
import '../../features/resources/presentation/screens/resources_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';

// Import widgets
import '../presentation/widgets/root_layout.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    ShellRoute(
      builder: (context, state, child) => RootLayout(child: child),
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const DashboardScreen(),
        ),
        GoRoute(
          path: '/tools',
          builder: (context, state) => const ToolsScreen(),
        ),
        GoRoute(
          path: '/resources',
          builder: (context, state) => const ResourcesScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),
  ],
);