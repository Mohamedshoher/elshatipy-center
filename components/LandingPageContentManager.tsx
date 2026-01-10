import React, { useState, useCallback, useMemo } from 'react';
import type { LandingPageContent, PageSection, CurrentUser } from '../types';
import { useLandingPageContent } from '../hooks/useLandingPageContent';
import SectionForm from './SectionForm';
import SectionPreview from './SectionPreview';
import InquiriesManager from './InquiriesManager';
import XIcon from './icons/XIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import { ImagePreview, ImagePositionControls } from './ImageContentControls';

interface LandingPageContentManagerProps {
  onClose: () => void;
  currentDirector?: CurrentUser;
}

const LandingPageContentManager: React.FC<LandingPageContentManagerProps> = ({
  onClose,
  currentDirector,
}) => {
  const { draftContent, publishedContent, loadingDraft, saveDraft, publishContent, unpublishContent } =
    useLandingPageContent();

  const [editingContent, setEditingContent] = useState<LandingPageContent | null>(null);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'inquiries'>('hero');
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  // تهيئة المحتوى عند التحميل
  React.useEffect(() => {
    if (draftContent && !editingContent) {
      setEditingContent(draftContent);
    } else if (!editingContent && !loadingDraft) {
      // إنشاء محتوى جديد
      const newContent: LandingPageContent = {
        id: 'landing-draft',
        heroTitle: 'مرحباً بك في مركز الشاطبي',
        heroSubtitle: 'تعليم عالي الجودة للقرآن والعلوم',
        sections: [],
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updatedBy: 'director',
      };
      setEditingContent(newContent);
    }
  }, [draftContent, loadingDraft, editingContent, currentDirector]);

  const handleHeroChange = useCallback(
    (field: 'heroTitle' | 'heroSubtitle' | 'heroImage' | 'heroImagePosition', value: string) => {
      if (editingContent) {
        setEditingContent(prev => ({
          ...prev!,
          [field]: value,
          updatedAt: new Date().toISOString(),
        }));
      }
    },
    [editingContent]
  );

  const handleHeroImageUrlChange = useCallback(
    (url: string) => {
      handleHeroChange('heroImage', url);
    },
    [handleHeroChange]
  );

  const handleAddSection = useCallback(() => {
    setEditingSectionId(null);
    setShowSectionForm(true);
  }, []);

  const handleEditSection = useCallback((sectionId: string) => {
    setEditingSectionId(sectionId);
    setShowSectionForm(true);
  }, []);

  const handleSaveSection = useCallback(
    (section: PageSection) => {
      if (!editingContent) return;

      const updatedSections = editingSectionId
        ? editingContent.sections.map(s => (s.id === editingSectionId ? section : s))
        : [...editingContent.sections, section].sort((a, b) => a.order - b.order);

      setEditingContent(prev => ({
        ...prev!,
        sections: updatedSections,
        updatedAt: new Date().toISOString(),
      }));

      setShowSectionForm(false);
      setEditingSectionId(null);
      setSuccessMessage(editingSectionId ? 'تم تحديث القسم بنجاح' : 'تم إضافة قسم جديد بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    [editingContent, editingSectionId]
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      if (!editingContent) return;

      if (window.confirm('هل أنت متأكد من حذف هذا القسم؟')) {
        setEditingContent(prev => ({
          ...prev!,
          sections: prev!.sections.filter(s => s.id !== sectionId),
          updatedAt: new Date().toISOString(),
        }));
        setSuccessMessage('تم حذف القسم بنجاح');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    },
    [editingContent]
  );

  const handleToggleSectionActive = useCallback(
    (sectionId: string) => {
      if (!editingContent) return;

      setEditingContent(prev => ({
        ...prev!,
        sections: prev!.sections.map(s =>
          s.id === sectionId ? { ...s, isActive: !s.isActive } : s
        ),
        updatedAt: new Date().toISOString(),
      }));
    },
    [editingContent]
  );

  const handleDragStart = useCallback((sectionId: string) => {
    setDraggedSectionId(sectionId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (targetSectionId: string) => {
      if (!editingContent || !draggedSectionId || draggedSectionId === targetSectionId) return;

      const draggedIndex = editingContent.sections.findIndex(s => s.id === draggedSectionId);
      const targetIndex = editingContent.sections.findIndex(s => s.id === targetSectionId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newSections = [...editingContent.sections];
      const [draggedSection] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedSection);

      // إعادة ترقيم الترتيبات
      const reorderedSections = newSections.map((s, index) => ({
        ...s,
        order: index + 1,
      }));

      setEditingContent(prev => ({
        ...prev!,
        sections: reorderedSections,
        updatedAt: new Date().toISOString(),
      }));

      setDraggedSectionId(null);
    },
    [editingContent, draggedSectionId]
  );

  const handleSaveDraft = useCallback(async () => {
    if (!editingContent) return;

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await saveDraft(editingContent);
      setSuccessMessage('تم حفظ المسودة بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setErrorMessage('فشل حفظ المسودة: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
    } finally {
      setIsSaving(false);
    }
  }, [editingContent, saveDraft]);

  const handlePublish = useCallback(async () => {
    if (!editingContent) return;

    if (window.confirm('هل أنت متأكد من نشر هذا المحتوى؟ سيظهر على الصفحة الرئيسية للجميع.')) {
      setIsPublishing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        // حفظ أولاً ثم نشر باستخدام المحتوى الحالي مباشرة
        await saveDraft(editingContent);
        const directorName = (currentDirector as any)?.name || 'المدير';
        await publishContent(directorName, editingContent);
        setSuccessMessage('✅ تم نشر المحتوى بنجاح! سيظهر على الصفحة الرئيسية الآن.');
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (error) {
        setErrorMessage('فشل النشر: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      } finally {
        setIsPublishing(false);
      }
    }
  }, [editingContent, saveDraft, publishContent]);

  const handleUnpublish = useCallback(async () => {
    if (!editingContent) return;

    if (window.confirm('هل أنت متأكد من إلغاء نشر هذا المحتوى؟')) {
      setIsPublishing(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        await unpublishContent();
        setSuccessMessage('تم إلغاء النشر بنجاح');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setErrorMessage('فشل إلغاء النشر: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      } finally {
        setIsPublishing(false);
      }
    }
  }, [editingContent, unpublishContent]);

  const isPublished = publishedContent && publishedContent?.id === editingContent?.id && publishedContent.isPublished;
  const sortedSections = useMemo(
    () => editingContent?.sections.sort((a, b) => a.order - b.order) || [],
    [editingContent]
  );

  if (loadingDraft) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* رأس الصفحة - تصميم محسّن */}
        {/* رأس الصفحة - تصميم محسّن متجاوب */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg z-20">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl md:text-2xl">📝</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-3xl font-extrabold drop-shadow-lg whitespace-nowrap overflow-hidden text-ellipsis">
                إدارة محتوى الصفحة الرئيسية
              </h1>
              {editingContent && (
                <p className="text-blue-100 text-xs md:text-sm mt-0.5 flex items-center gap-2 truncate">
                  <span>🕒</span>
                  <span className="truncate">
                    آخر تحديث: {new Date(editingContent.updatedAt).toLocaleDateString('ar-EG')}
                  </span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 md:p-2.5 hover:bg-white/20 rounded-xl transition-all transform hover:scale-110 active:scale-95 shrink-0"
            title="إغلاق"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* رسائل النجاح والخطأ - تصميم محسّن */}
        {successMessage && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-800 p-4 m-4 rounded-lg shadow-md animate-in slide-in-from-top-6 duration-300 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-800 p-4 m-4 rounded-lg shadow-md animate-in slide-in-from-top-6 duration-300 flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
          {/* التبويبات - تصميم محسّن */}
          {/* التبويبات - تصميم محسّن */}
          <div className="flex gap-2 md:gap-3 mb-4 md:mb-8 bg-white rounded-xl p-1.5 md:p-2 shadow-md">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex-1 px-3 py-2 md:px-6 md:py-3 font-bold rounded-lg transition-all transform ${activeTab === 'hero'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-100 md:scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              <span className="flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base">
                <span className="text-lg md:text-xl">🎨</span>
                <span className="whitespace-nowrap">قسم البطل</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 px-3 py-2 md:px-6 md:py-3 font-bold rounded-lg transition-all transform ${activeTab === 'sections'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-100 md:scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              <span className="flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base">
                <span className="text-lg md:text-xl">📋</span>
                <span className="whitespace-nowrap">الأقسام ({editingContent?.sections.length || 0})</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex-1 px-3 py-2 md:px-6 md:py-3 font-bold rounded-lg transition-all transform ${activeTab === 'inquiries'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-100 md:scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              <span className="flex items-center justify-center gap-1.5 md:gap-2 text-sm md:text-base">
                <span className="text-lg md:text-xl">📩</span>
                <span className="whitespace-nowrap">الطلبات</span>
              </span>
            </button>
          </div>

          {/* قسم البطل - تصميم محسّن */}
          {activeTab === 'hero' && editingContent && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">📝</span>
                  العنوان الرئيسي
                </label>
                <input
                  type="text"
                  value={editingContent.heroTitle || ''}
                  onChange={e => handleHeroChange('heroTitle', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="مثال: مرحباً بك في مركز الشاطبي"
                />
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">✍️</span>
                  العنوان الفرعي
                </label>
                <input
                  type="text"
                  value={editingContent.heroSubtitle || ''}
                  onChange={e => handleHeroChange('heroSubtitle', e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="مثال: تعليم عالي الجودة للقرآن والعلوم"
                />
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">🖼️</span>
                  صورة البطل (URL)
                </label>
                <input
                  type="url"
                  value={editingContent.heroImage || ''}
                  onChange={e => handleHeroChange('heroImage', e.target.value)}
                  placeholder="مثال: https://example.com/hero.jpg"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>💡</span>
                  أدخل رابط الصورة مباشرة
                </p>
                {editingContent.heroImage && (
                  <div className="mt-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <ImagePreview src={editingContent.heroImage} alt="صورة البطل" position={editingContent.heroImagePosition} />
                    </div>
                    <div className="flex-1">
                      <ImagePositionControls
                        value={editingContent.heroImagePosition}
                        onChange={(pos) => handleHeroChange('heroImagePosition', pos)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* الأقسام */}
          {activeTab === 'sections' && editingContent && (
            <div className="space-y-4">
              {sortedSections.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">لا توجد أقسام حالياً</p>
                  <button
                    onClick={handleAddSection}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    إضافة قسم جديد
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {sortedSections.map(section => {
                      if (!section || !section.id) return null;
                      return (
                        <div
                          key={section.id}
                          draggable
                          onDragStart={() => handleDragStart(section.id)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(section.id)}
                          className="cursor-move"
                        >
                          <SectionPreview
                            section={section}
                            onEdit={() => handleEditSection(section.id)}
                            onDelete={() => handleDeleteSection(section.id)}
                            onToggleActive={() => handleToggleSectionActive(section.id)}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleAddSection}
                    className="w-full flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 rounded-lg transition mt-6"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    إضافة قسم جديد
                  </button>
                </>
              )}
            </div>
          )}

          {/* تجميع البيانات */}
          {activeTab === 'inquiries' && (
            <div className="animate-in fade-in duration-500">
              {/* سيتم إنشاء مكون InquiriesManager لاحقاً أو تضمينه هنا */}
              <InquiriesManager />
            </div>
          )}
        </div>

        {/* أزرار التحكم - تصميم محسّن */}
        {/* أزرار التحكم - تصميم محسّن */}
        <div className="sticky bottom-0 bg-gradient-to-r from-gray-100 to-blue-50 border-t-2 border-blue-200 p-4 md:p-6 flex flex-wrap gap-2 md:gap-3 justify-end shadow-lg">
          {isPublished && (
            <button
              onClick={handleUnpublish}
              disabled={isPublishing}
              className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-orange-300 disabled:to-red-300 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-1.5 md:gap-2 text-sm md:text-base"
            >
              <span className="text-lg md:text-xl">🔄</span>
              <span className="whitespace-nowrap">إلغاء النشر</span>
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-1.5 md:gap-2 text-sm md:text-base mr-auto md:mr-0"
          >
            <span className="text-lg md:text-xl">💾</span>
            <span className="whitespace-nowrap">حفظ المسودة</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing || isSaving || !editingContent}
            className="px-4 py-2 md:px-8 md:py-3 flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-green-300 disabled:to-emerald-300 text-white font-bold rounded-xl transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-xl text-sm md:text-base"
          >
            <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="whitespace-nowrap">{isPublished ? '🔄 تحديث' : '📤 نشر الآن'}</span>
          </button>
        </div>

        {/* نموذج إضافة/تعديل قسم */}
        {showSectionForm && (
          <SectionForm
            section={
              editingSectionId
                ? editingContent?.sections.find(s => s.id === editingSectionId)
                : undefined
            }
            onSave={handleSaveSection}
            onCancel={() => {
              setShowSectionForm(false);
              setEditingSectionId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LandingPageContentManager;
