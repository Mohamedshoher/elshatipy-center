import React from 'react';
import type { PageSection } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface SectionPreviewProps {
  section: PageSection;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const SectionPreview: React.FC<SectionPreviewProps> = ({
  section,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      text: 'نص',
      image: 'صورة',
      video: 'فيديو YouTube',
      testimonial: 'شهادة عميل',
      cta: 'دعوة للعمل',
      advertisement: 'إعلان',
      slider: 'سلايدر صور (Slideshow)',
      youtube_shorts: 'فيديوهات شورتس (YouTube Shorts)',
      library: '📚 مكتبة الملفات والأبحاث',
      student_certificates: '🎖️ شهادات التقدير',
      data_collection: '📝 نموذج تجميع بيانات',
    };
    return labels[type] || type;
  };

  const getPreview = () => {
    switch (section.type) {
      case 'text':
        return section.content?.substring(0, 100) + (section.content && section.content.length > 100 ? '...' : '');
      case 'image':
        return `صورة${section.imageCaption ? ': ' + section.imageCaption : ''}`;
      case 'video':
        return 'فيديو YouTube';
      case 'youtube_shorts':
        return `شورتس: ${(section.youtubeShortsUrls || []).filter(u => u).length} فيديو`;
      case 'testimonial':
        return `"${section.testimonialText?.substring(0, 50)}..."`;
      case 'cta':
        return `زر: ${section.ctaText}`;
      case 'advertisement':
        return 'إعلان';
      case 'slider':
        return `سلايدر: ${(section.sliderImages || []).length} صور`;
      case 'library':
        return `مكتبة: ${(section.libraryItems || []).length} ملف`;
      case 'student_certificates':
        return 'شهادات تقدير تلقائية';
      case 'data_collection':
        return `نموذج: ${(section.formFields || []).length} حقل`;
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white border-l-4 rounded-lg shadow hover:shadow-lg transition-shadow p-4 ${section.isActive ? 'border-l-blue-600' : 'border-l-gray-300'}`}>
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs md:text-sm font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded shrink-0">
                {section.order}
              </span>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">{section.title}</h3>
            </div>
            <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded whitespace-nowrap shrink-0">
              {getTypeLabel(section.type)}
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">{getPreview()}</p>
        </div>
      </div>

      {(section.imageUrl || section.adImageUrl || (section.sliderImages && section.sliderImages.length > 0) || (section.libraryItems && section.libraryItems.length > 0)) && (
        <div className="mb-4">
          <img
            src={section.imageUrl || section.adImageUrl || section.sliderImages?.[0]?.url || section.libraryItems?.[0]?.thumbnailUrl || 'https://via.placeholder.com/150?text=Library'}
            alt={section.title}
            className="h-24 w-24 object-cover rounded border border-gray-100 shadow-sm"
          />
        </div>
      )}

      {/* الأزرار */}
      <div className="flex flex-wrap gap-2 text-xs md:text-sm">
        <button
          onClick={onEdit}
          className="px-2 py-1.5 md:px-3 md:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded transition"
        >
          ✏️ تعديل
        </button>
        <button
          onClick={onToggleActive}
          className={`px-2 py-1.5 md:px-3 md:py-2 font-semibold rounded transition flex items-center gap-1 ${section.isActive
            ? 'bg-green-100 hover:bg-green-200 text-green-700'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          <CheckCircleIcon className="w-3 h-3 md:w-4 md:h-4" />
          {section.isActive ? 'مرئي' : 'مخفي'}
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1.5 md:px-3 md:py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded transition"
        >
          🗑️ حذف
        </button>
      </div>
    </div>
  );
};

export default SectionPreview;
