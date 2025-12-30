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
      case 'testimonial':
        return `"${section.testimonialText?.substring(0, 50)}..."`;
      case 'cta':
        return `زر: ${section.ctaText}`;
      case 'advertisement':
        return 'إعلان';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-white border-l-4 rounded-lg shadow hover:shadow-lg transition-shadow p-4 ${section.isActive ? 'border-l-blue-600' : 'border-l-gray-300'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {section.order}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">{section.title}</h3>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
              {getTypeLabel(section.type)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{getPreview()}</p>
        </div>
      </div>

      {/* صورة معاينة صغيرة */}
      {(section.imageUrl || section.adImageUrl) && (
        <div className="mb-4">
          <img
            src={section.imageUrl || section.adImageUrl}
            alt={section.title}
            className="h-24 w-24 object-cover rounded"
          />
        </div>
      )}

      {/* الأزرار */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-semibold rounded transition"
        >
          ✏️ تعديل
        </button>
        <button
          onClick={onToggleActive}
          className={`px-3 py-2 text-sm font-semibold rounded transition flex items-center gap-1 ${
            section.isActive
              ? 'bg-green-100 hover:bg-green-200 text-green-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <CheckCircleIcon className="w-4 h-4" />
          {section.isActive ? 'مرئي' : 'مخفي'}
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded transition"
        >
          🗑️ حذف
        </button>
      </div>
    </div>
  );
};

export default SectionPreview;
