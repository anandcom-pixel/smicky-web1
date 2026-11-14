import 'package:flutter/material.dart';

void main() {
  runApp(const AnandMohandasPlatformApp());
}

class AnandMohandasPlatformApp extends StatelessWidget {
  const AnandMohandasPlatformApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Anand Mohandas solo development platform',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFFBF9F5), // Soft warm ivory/cream
        colorScheme: const ColorScheme.light(
          primary: Color(0xFFD97706), // Warm amber/gold
          secondary: Color(0xFFB45309),
          surface: Color(0xFFFFFFFF),
        ),
        fontFamily: 'Roboto',
      ),
      home: const PlatformHomePage(),
    );
  }
}

class PlatformHomePage extends StatefulWidget {
  const PlatformHomePage({super.key});

  @override
  State<PlatformHomePage> createState() => _PlatformHomePageState();
}

class _PlatformHomePageState extends State<PlatformHomePage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBF9F5),
      appBar: AppBar(
        // Navigation & Header Bar: Deep Espresso Brown
        backgroundColor: const Color(0xFF1E1512),
        elevation: 2,
        title: const Text(
          'Anand Mohandas solo development platform',
          style: TextStyle(
            color: Color(0xFFFDFBF7),
            fontWeight: FontWeight.w700,
            fontSize: 16,
            letterSpacing: 0.5,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: const Color(0xFFD97706),
          labelColor: const Color(0xFFFDFBF7),
          unselectedLabelColor: const Color(0xFFD1C7BD),
          tabs: const [
            Tab(icon: Icon(Icons.person), text: 'For Me'),
            Tab(icon: Icon(Icons.auto_stories), text: 'For You'),
            Tab(icon: Icon(Icons.code), text: 'Projects'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // Section 1: For Me (Client Services & Hiring)
          ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _buildHeroCard(),
              const SizedBox(height: 24),
              _buildSectionHeader('Pathway 01', 'For Me: Client Services'),
              _buildServiceCard(
                title: 'Rapid MVP Trial Sprint (14–21 Days)',
                desc: 'Zero to live production deployment on Vercel or Android with billing and telemetry.',
              ),
              _buildServiceCard(
                title: 'Custom Full-Stack & Platforms',
                desc: 'Next.js, TypeScript, PostgreSQL, and high-performance real-time architectures.',
              ),
              _buildServiceCard(
                title: 'Android Tools & Utilities',
                desc: 'Kotlin, Jetpack Compose, and offline-first mobile applications.',
              ),
            ],
          ),

          // Section 2: For You (Stories & Blueprints)
          ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _buildSectionHeader('Pathway 02', 'For You: Blueprints & Essays'),
              _buildStoryCard(
                category: 'TRIAL PLAYBOOK',
                title: 'The Solo Trial-Firm Engine: Monetizing Hard Skills Without Burning Out',
                author: 'Created by Anandovsky',
              ),
              _buildStoryCard(
                category: 'ARCHITECTURE STACKS',
                title: 'Deploying Production MVPs to Vercel in 48 Hours: The Clean Stack',
                author: 'Created by Anandovsky',
              ),
              _buildStoryCard(
                category: 'PHILOSOPHY',
                title: 'The Fallacy of the 12-Month Build: Testing Markets on Day 3',
                author: 'Created by Anandovsky',
              ),
            ],
          ),

          // Section 3: Projects (Portfolio & Deployed Apps)
          ListView(
            padding: const EdgeInsets.all(20),
            children: [
              _buildSectionHeader('Pathway 03', 'Projects: Portfolio & Deployed Apps'),
              _buildProjectCard(
                badge: 'Deployed on Vercel',
                title: 'LingoPulse AI',
                tech: 'Next.js Edge • Web Audio API • TailwindCSS\nCreated by Anandovsky | Tester: Johnny hotbody (nick)',
              ),
              _buildProjectCard(
                badge: 'Production Release',
                title: 'LexiFlow Reader',
                tech: 'TypeScript • IndexedDB • Vercel KV\nCreated by Anandovsky | Tester: Gayathri',
              ),
              _buildProjectCard(
                badge: 'Android Native',
                title: 'DroidSprint Telemetry',
                tech: 'Kotlin • Jetpack Compose • Room DB\nCreated by Anandovsky',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCard() {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFD97706).withOpacity(0.35)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2C1E1A).withOpacity(0.06),
            blurRadius: 18,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'ANANDOVSKY // TRIAL FIRM STUDIO',
            style: TextStyle(
              color: Color(0xFFB45309),
              fontSize: 12,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.2,
            ),
          ),
          SizedBox(height: 12),
          Text(
            '"Test a business model, monetize existing skills, and build a revenue stream without betting everything on an unproven venture."',
            style: TextStyle(
              color: Color(0xFF1E1512),
              fontSize: 15,
              fontWeight: FontWeight.w600,
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String tag, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '// $tag',
            style: const TextStyle(
              color: Color(0xFFB45309),
              fontSize: 12,
              fontFamily: 'monospace',
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF1E1512),
              fontSize: 20,
              fontWeight: FontWeight.w800,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildServiceCard({required String title, required String desc}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF2C1E1A).withOpacity(0.09)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2C1E1A).withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF1E1512),
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: const TextStyle(
              color: Color(0xFF4A3B32),
              fontSize: 14,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStoryCard({
    required String category,
    required String title,
    required String author,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF2C1E1A).withOpacity(0.09)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2C1E1A).withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            category,
            style: const TextStyle(
              color: Color(0xFFB45309),
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 1.1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF1E1512),
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            author,
            style: const TextStyle(
              color: Color(0xFF78665B),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectCard({
    required String badge,
    required String title,
    required String tech,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF2C1E1A).withOpacity(0.09)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF2C1E1A).withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.12),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              badge,
              style: const TextStyle(
                color: Color(0xFF047857),
                fontSize: 11,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            title,
            style: const TextStyle(
              color: Color(0xFF1E1512),
              fontSize: 16,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            tech,
            style: const TextStyle(
              color: Color(0xFF4A3B32),
              fontSize: 12,
              fontFamily: 'monospace',
            ),
          ),
        ],
      ),
    );
  }
}
