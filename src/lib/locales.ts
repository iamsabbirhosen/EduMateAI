export const translations = {
  en: {
    // Login
    'login.title': 'Welcome to EduMate',
    'login.subtitle': 'Log in to your student account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.demo.title': 'Use a demo account',
    'login.language': 'Language',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.subjects': 'Subjects',
    'sidebar.profile': 'Profile',
    'sidebar.logout': 'Logout',
    'sidebar.theme': 'Theme',
    'sidebar.light': 'Light',
    'sidebar.dark': 'Dark',
    'sidebar.system': 'System',

    // Dashboard
    'dashboard.welcome': 'Welcome back',
    'dashboard.class': 'Class',
    'dashboard.progress.title': 'Your Progress Summary',
    'dashboard.completed_topics': 'Completed Topics',
    'dashboard.avg_score': 'Average Score',
    'dashboard.mastered_topics': 'Mastered Topics',
    'dashboard.weak_topics': 'Weak Topics',
    'dashboard.gamification.title': 'Your Achievements',
    'dashboard.points': 'Points',
    'dashboard.badges': 'Badges Earned',
    'dashboard.streak': 'Daily Streak',
    'dashboard.days': 'days',
    
    // Subjects
    'subjects.title': 'Browse Your Subjects',
    'subjects.subtitle': 'Select a topic to start learning',
    'subjects.select_class': 'Select Class',
    'subjects.no_class_assigned': 'No class has been assigned to your profile.',
    
    // Learn Page
    'learn.study_materials': 'Study Materials',
    'learn.youtube_videos': 'Related Videos',
    'learn.diagnostic_test': 'Diagnostic Test',
    'learn.start_test': 'Start Diagnostic Test',
    'learn.test.title': 'Diagnostic Test',
    'learn.test.submit': 'Submit Answers',
    'learn.test.generating': 'Generating questions...',
    'learn.test.result.title': 'Test Result',
    'learn.test.result.score': 'You scored',
    'learn.ai_explanation': 'AI Explanation',
    'learn.get_explanation': 'Get AI Explanation',
    'learn.explanation.generating': 'Generating explanation...',
    'learn.explanation.play_audio': 'Play Audio',
    'learn.chat.title': 'Ask a Follow-up Question',
    'learn.chat.placeholder': 'Type your question here...',
    'learn.chat.send': 'Send',
  },
  bn: {
    // Login
    'login.title': 'EduMate-এ স্বাগতম',
    'login.subtitle': 'আপনার ছাত্র অ্যাকাউন্টে লগ ইন করুন',
    'login.email': 'ইমেইল',
    'login.password': 'পাসওয়ার্ড',
    'login.button': 'লগইন করুন',
    'login.demo.title': 'একটি ডেমো অ্যাকাউন্ট ব্যবহার করুন',
    'login.language': 'ভাষা',
    
    // Sidebar
    'sidebar.dashboard': 'ড্যাশবোর্ড',
    'sidebar.subjects': 'বিষয়সমূহ',
    'sidebar.profile': 'প্রোফাইল',
    'sidebar.logout': 'লগআউট',
    'sidebar.theme': 'থিম',
    'sidebar.light': 'লাইট',
    'sidebar.dark': 'ডার্ক',
    'sidebar.system': 'সিস্টেম',

    // Dashboard
    'dashboard.welcome': 'আবারও স্বাগতম',
    'dashboard.class': 'শ্রেণী',
    'dashboard.progress.title': 'আপনার অগ্রগতির সারসংক্ষেপ',
    'dashboard.completed_topics': 'সম্পন্ন টপিক',
    'dashboard.avg_score': 'গড় স্কোর',
    'dashboard.mastered_topics': 'দক্ষ টপিক',
    'dashboard.weak_topics': 'দুর্বল টপিক',
    'dashboard.gamification.title': 'আপনার অর্জন',
    'dashboard.points': 'পয়েন্ট',
    'dashboard.badges': 'অর্জিত ব্যাজ',
    'dashboard.streak': 'দৈনিক স্ট্রিক',
    'dashboard.days': 'দিন',
    
    // Subjects
    'subjects.title': 'আপনার বিষয় ব্রাউজ করুন',
    'subjects.subtitle': 'শেখা শুরু করতে একটি বিষয় নির্বাচন করুন',
    'subjects.select_class': 'শ্রেণী নির্বাচন করুন',
    'subjects.no_class_assigned': 'আপনার প্রোফাইলে কোনো শ্রেণী বরাদ্দ করা হয়নি।',

    // Learn Page
    'learn.study_materials': '学习资料',
    'learn.youtube_videos': 'সম্পর্কিত ভিডিও',
    'learn.diagnostic_test': 'ডায়াগনস্টিক পরীক্ষা',
    'learn.start_test': 'ডায়াগনস্টিক পরীক্ষা শুরু করুন',
    'learn.test.title': 'ডায়াগনস্টিক পরীক্ষা',
    'learn.test.submit': 'উত্তর জমা দিন',
    'learn.test.generating': 'প্রশ্ন তৈরি করা হচ্ছে...',
    'learn.test.result.title': 'পরীক্ষার ফলাফল',
    'learn.test.result.score': 'আপনি স্কোর করেছেন',
    'learn.ai_explanation': 'AI ব্যাখ্যা',
    'learn.get_explanation': 'AI ব্যাখ্যা পান',
    'learn.explanation.generating': 'ব্যাখ্যা তৈরি করা হচ্ছে...',
    'learn.explanation.play_audio': 'অডিও চালান',
    'learn.chat.title': 'একটি ফলো-আপ প্রশ্ন জিজ্ঞাসা করুন',
    'learn.chat.placeholder': 'আপনার প্রশ্ন এখানে টাইপ করুন...',
    'learn.chat.send': 'পাঠান',
  },
};

export type TranslationKey = keyof typeof translations.en;
