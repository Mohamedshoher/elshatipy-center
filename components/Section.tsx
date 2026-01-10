import React from 'react';
import type { PageSection, Student } from '../types';
import Slider from './Slider';
import BadgeCertificatesSlider from './BadgeCertificatesSlider';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface SectionProps {
  section: PageSection;
  students?: Student[]; // Optional because some contexts might not have students
}

const Section: React.FC<SectionProps> = ({ section, students = [] }) => {
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
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-2 mb-6 text-center">
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
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-2 mb-8 text-center">
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
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-2 mb-12 text-center">
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

      {section.type === 'youtube_shorts' && (
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-2 mb-10 text-center">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="text-xl text-gray-700 mb-12 text-center font-medium max-w-3xl mx-auto">
                {section.description}
              </p>
            )}
            {section.youtubeShortsUrls && section.youtubeShortsUrls.length > 0 && (
              <div className="relative group/slider">
                {/* Scroll Buttons */}
                <button
                  onClick={() => {
                    document.getElementById(`shorts-slider-${section.id}`)?.scrollBy({ left: 320, behavior: 'smooth' });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur text-blue-600 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110 translate-x-1/2"
                  aria-label="Next"
                >
                  <svg className="w-6 h-6 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    document.getElementById(`shorts-slider-${section.id}`)?.scrollBy({ left: -320, behavior: 'smooth' });
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur text-blue-600 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110 -translate-x-1/2"
                  aria-label="Previous"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Slider Container */}
                <div
                  id={`shorts-slider-${section.id}`}
                  className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory px-4 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {section.youtubeShortsUrls.filter(url => url.trim() !== '').map((url, idx) => (
                    <div
                      key={idx}
                      className="flex-shrink-0 w-[280px] sm:w-[320px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 transform hover:scale-[1.02] transition-all duration-300 snap-center bg-black"
                    >
                      <YouTubeLite url={url} title={`${section.title} - ${idx + 1}`} isShorts />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {section.type === 'student_certificates' && (
        <BadgeCertificatesSlider section={section} students={students || []} />
      )}

      {section.type === 'library' && (
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20">
          <div className="max-w-7xl mx-auto">
            {section.title && (
              <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent py-2 mb-4 text-center">
                {section.title}
              </h2>
            )}
            {section.description && (
              <p className="text-xl text-gray-600 mb-12 text-center font-medium max-w-3xl mx-auto">
                {section.description}
              </p>
            )}

            {section.libraryItems && section.libraryItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                {section.libraryItems.map((item) => (
                  <div key={item.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-50">
                    {/* Item Cover */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-300">
                          <span className="text-6xl mb-2">📚</span>
                          <span className="text-xs font-bold opacity-40 uppercase tracking-widest">{item.category || 'PDF'}</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm">
                        {item.category || 'ملف'}
                      </div>

                      {/* Hover Overlay with Button */}
                      <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 bg-white text-blue-700 rounded-xl font-bold text-sm text-center shadow-xl hover:bg-blue-50 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform"
                        >
                          فتح الملف 📖
                        </a>
                      </div>
                    </div>

                    {/* Item Info */}
                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Mobile Only Quick Action */}
                      <div className="mt-auto sm:hidden">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold text-center border border-blue-100"
                        >
                          تحميل/فتح
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">لا توجد ملفات في المكتبة حالياً</p>
              </div>
            )}
          </div>
        </div>
      )}
      {section.type === 'data_collection' && (
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-blue-50/30">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-purple-100 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-bl-[5rem]"></div>

              <div className="p-8 md:p-12 relative z-10">
                <div className="text-center mb-10">
                  {section.title && (
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                      {section.title}
                    </h2>
                  )}
                  {section.description && (
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>

                <DataCollectionForm section={section} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DataCollectionForm: React.FC<{ section: PageSection }> = ({ section }) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const missingFields = (section.formFields || []).filter(f => f.required && !formData[f.id]);
      if (missingFields.length > 0) {
        throw new Error(`يرجى إكمال الحقول المطلوبة: ${missingFields.map(f => f.label).join(', ')}`);
      }

      await addDoc(collection(db, 'landingPageInquiries'), {
        sectionId: section.id,
        sectionTitle: section.title,
        data: formData,
        status: 'new',
        createdAt: new Date().toISOString(),
      });

      setIsSuccess(true);
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الإرسال');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-5xl">✅</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">تم الإرسال بنجاح!</h3>
        <p className="text-lg text-gray-600 mb-8">{section.successMessage || 'تم استلام بياناتك بنجاح، شكراً لتواصلك معنا.'}</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-purple-600 font-bold hover:underline"
        >
          إرسال طلب آخر
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(section.formFields || []).map((field) => (
          <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.id] || ''}
                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                required={field.required}
                placeholder={field.placeholder}
                rows={4}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all resize-none shadow-sm"
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.id] || ''}
                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                required={field.required}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="">اختر {field.label}...</option>
                {(field.options || []).map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={formData[field.id] || ''}
                onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-purple-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm animate-pulse">
          ⚠️ {error}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white font-black text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الإرسال...
            </>
          ) : (
            <>
              <span>{section.submitButtonText || 'إرسال المعلومات'}</span>
              <span className="text-2xl translate-y-0.5">🚀</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default Section;

// YouTube Lite Component for Performance
const YouTubeLite: React.FC<{ url: string; title: string; isShorts?: boolean }> = ({ url, title, isShorts }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const videoId = React.useMemo(() => {
    if (url.includes('shorts/')) return url.split('shorts/')[1]?.split('?')[0];
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
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
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
          className={`w-full h-full object-cover ${isShorts ? 'opacity-90 group-hover/video:opacity-100' : 'opacity-60 group-hover/video:opacity-80'} transition-opacity`}
          loading="lazy"
        />
      )}
      <div className={`absolute inset-0 bg-black/20 ${isShorts ? 'group-hover/video:bg-black/0' : 'group-hover/video:bg-black/40'} transition-colors`}></div>
      <div className={`${isShorts ? 'w-14 h-14' : 'w-20 h-20'} bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition-transform`}>
        <svg className={`${isShorts ? 'w-7 h-7' : 'w-10 h-10'} text-white translate-x-1`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </div>
  );
};
