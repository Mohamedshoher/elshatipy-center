import React from 'react';
import type { PageSection } from '../types';
import Slider from './Slider';

interface SectionProps {
  section: PageSection;
}

const Section: React.FC<SectionProps> = ({ section }) => {
  const getColorClass = (color?: string) => {
    switch (color) {
      case 'green':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      case 'red':
        return 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700';
      default:
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
    }
  };

  const getYoutubeEmbedUrl = (url: string) => {
    // تحويل رابط YouTube إلى رابط embed
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url.replace('watch?v=', 'embed/');
  };

  const optimizeImageUrl = (url?: string) => {
    if (!url) return '';
    // تحسين روابط Cloudinary تلقائياً
    if (url.includes('cloudinary.com')) {
      if (url.includes('/upload/')) {
        return url.replace('/upload/', '/upload/f_auto,q_auto/');
      }
    }
    return url;
  };

  return (
    <div className="w-full">
      {section.type === 'text' && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
          <div className="max-w-4xl mx-auto">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 text-center">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="text-xl text-gray-700 mb-8 text-center font-medium leading-relaxed">
                {section.description}
              </p>
            )}
            {section.content && (
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                {section.content}
              </div>
            )}
          </div>
        </div>
      )}

      {section.type === 'image' && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-5xl mx-auto">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 text-center">
                {section.title}
              </h2>
            )}
            {section.imageUrl && (
              <div className="group relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500 aspect-video">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={optimizeImageUrl(section.imageUrl)}
                  alt={section.imageCaption || section.title}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: section.imagePosition || 'center center' }}
                  loading="lazy"
                />
              </div>
            )}
            {section.imageCaption && (
              <p className="text-center text-gray-600 mt-6 text-lg font-medium">{section.imageCaption}</p>
            )}
          </div>
        </div>
      )}

      {section.type === 'video' && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-10 text-center drop-shadow-lg">
                {section.title}
              </h2>
            )}
            {section.youtubeUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 transform hover:scale-[1.02] transition-all duration-500 bg-black group/video">
                <YouTubeLite
                  url={section.youtubeUrl}
                  title={section.title}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {section.type === 'testimonial' && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-3xl mx-auto">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-12 text-center">
                {section.title}
              </h2>
            )}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 sm:p-12 transform hover:scale-[1.02] transition-all duration-500 border border-blue-100">
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-6xl text-blue-100 opacity-50">"</div>

              {section.testimonialImage && (
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-lg opacity-50"></div>
                    <img
                      src={optimizeImageUrl(section.testimonialImage)}
                      alt={section.testimonialAuthor}
                      className="relative w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-xl"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
              {section.testimonialText && (
                <p className="text-xl text-gray-700 text-center mb-8 italic leading-relaxed font-medium">
                  "{section.testimonialText}"
                </p>
              )}
              <div className="text-center">
                {section.testimonialAuthor && (
                  <p className="font-bold text-gray-900 text-lg">{section.testimonialAuthor}</p>
                )}
                {section.testimonialRole && (
                  <p className="text-blue-600 font-medium mt-1">{section.testimonialRole}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {section.type === 'cta' && (
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 drop-shadow-lg">
                {section.title}
              </h2>
            )}
            {section.ctaText && (
              <a
                href={section.ctaLink || '#'}
                className={`inline-block px-10 py-5 rounded-2xl font-bold text-white text-lg transition-all transform hover:scale-110 shadow-2xl hover:shadow-3xl ${getColorClass(section.ctaColor)}`}
              >
                {section.ctaText} →
              </a>
            )}
          </div>
        </div>
      )}

      {section.type === 'advertisement' && (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-6xl mx-auto">
            {section.adImageUrl && (
              <a
                href={section.adLink || '#'}
                target={section.adLink ? '_blank' : undefined}
                rel={section.adLink ? 'noopener noreferrer' : undefined}
                className="block group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] aspect-[21/9]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={optimizeImageUrl(section.adImageUrl)}
                  alt={section.adAltText || section.title}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: section.imagePosition || 'center center' }}
                  loading="lazy"
                />
              </a>
            )}
          </div>
        </div>
      )}

      {section.type === 'slider' && (
        <div className="w-full">
          <Slider section={section} />
        </div>
      )}
    </div>
  );
};

export default Section;

// YouTube Lite Component for Performance
const YouTubeLite: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const videoId = React.useMemo(() => {
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0];
    if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0];
    if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0];
    return null;
  }, [url]);

  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  if (isLoaded) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        allowFullScreen
        className="absolute top-0 left-0"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black group/video"
      onClick={() => setIsLoaded(true)}
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover opacity-60 group-hover/video:opacity-80 transition-opacity"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-black/20 group-hover/video:bg-black/40 transition-colors"></div>
      <div className="relative w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform">
        <svg className="w-10 h-10 text-white translate-x-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
};
