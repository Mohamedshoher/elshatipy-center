import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandingPageContent } from '../hooks/useLandingPageContent';
import Section from './Section';
import Skeleton from './Skeleton';

interface LandingPageProps {
  onBackToParent?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBackToParent }) => {
  const navigate = useNavigate();
  const { publishedContent, loadingPublished, errorPublished } = useLandingPageContent();

  if (loadingPublished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Skeleton className="w-full h-96 mb-6 rounded-2xl" />
          <Skeleton className="w-full h-64 mb-4 rounded-2xl" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorPublished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-8 max-w-md animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <p className="text-red-600 font-bold text-xl mb-6">حدث خطأ في تحميل الصفحة</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            🔄 حاول مجدداً
          </button>
        </div>
      </div>
    );
  }

  const content = publishedContent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* شريط أعلى بأزرار الدخول - تصميم محسّن */}
      {/* شريط أعلى بأزرار الدخول - تصميم محسّن ومتجاوب */}
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/95 shadow-md border-b border-blue-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center gap-2">
            {/* الشعار */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <span className="text-xl sm:text-2xl">🕌</span>
              </div>
              <div className="leading-tight">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent truncate max-w-[150px] sm:max-w-none">
                  مركز الشاطبي
                </h1>
                <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">للقرآن والعلوم الإسلامية</p>
              </div>
            </div>

            {/* أزرار الدخول */}
            <div className="flex gap-2 sm:gap-3 items-center">
              {onBackToParent ? (
                <button
                  onClick={onBackToParent}
                  className="group flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span className="hidden sm:inline">العودة إلى صفحتي</span>
                  <span className="sm:hidden">عودة</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center justify-center p-2 sm:px-6 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base ring-2 ring-white/50"
                    title="تسجيل الدخول"
                  >
                    <span className="text-lg sm:mr-2">🔐</span>
                    <span className="hidden sm:inline">تسجيل الدخول</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* قسم البطل - تصميم محسّن */}
      {content?.heroImage || content?.heroTitle ? (
        <div className="relative overflow-hidden">
          <div
            className="relative h-[500px] bg-cover flex items-center justify-center animate-in fade-in zoom-in-95 duration-700"
            style={content?.heroImage ? {
              backgroundImage: `url(${content.heroImage})`,
              backgroundPosition: content.heroImagePosition || 'center'
            } : {}}
          >
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-900/70"></div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {content?.heroTitle && (
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
                  {content.heroTitle}
                </h1>
              )}
              {content?.heroSubtitle && (
                <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 font-medium drop-shadow-lg">
                  {content.heroSubtitle}
                </p>
              )}

              {/* Decorative line */}
              <div className="mt-8 flex justify-center">
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* الأقسام الديناميكية */}
      {content?.sections && content.sections.length > 0 ? (
        <div className="relative">
          {content.sections
            .filter(section => section.isActive)
            .sort((a, b) => a.order - b.order)
            .map((section, index) => (
              <div
                key={section.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <Section section={section} />
              </div>
            ))}
        </div>
      ) : (
        <div className="py-24 px-4 text-center animate-in fade-in duration-500">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🚧</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">قريباً</h3>
            <p className="text-gray-600">الصفحة الرئيسية قيد الإعداد. يرجى العودة قريباً.</p>
          </div>
        </div>
      )}

      {/* التذييل - تصميم محسّن */}
      <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="text-center animate-in fade-in duration-700">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
                <span className="text-3xl">🕌</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
              مركز الشاطبي
            </h3>

            {/* Subtitle */}
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              تعليم عالي الجودة للقرآن والعلوم الإسلامية
            </p>

            {/* Divider */}
            <div className="flex justify-center mb-8">
              <div className="h-px w-64 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            </div>

            {/* Copyright */}
            <p className="text-blue-300 text-sm">
              © 2025 جميع الحقوق محفوظة - مركز الشاطبي
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
