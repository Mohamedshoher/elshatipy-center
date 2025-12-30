import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { PageSection, PageSectionType } from '../types';
import XIcon from './icons/XIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const ImagePreview = ({ src, alt = "معاينة" }: { src: string; alt?: string }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src) return null;

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-2">{alt}:</p>
      {!error ? (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg max-h-48 object-cover border border-gray-200"
          onError={() => setError(true)}
        />
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <span className="font-bold">فشل تحميل الصورة</span>
          </div>

          {/* اكتشاف خطأ شائع: وضع رابط صفحة بدلاً من رابط صورة */}
          {(src.includes('vecteezy.com') || (!src.includes('drive.google.com') && !src.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i))) ? (
            <div className="mb-3 bg-white p-3 rounded border border-red-100">
              <p className="font-bold text-red-700 mb-1">💡 يبدو أنك وضعت رابط "الصفحة" وليس الصورة!</p>
              <p className="text-gray-700 mb-2">الرابط الذي وضعته لا ينتهي بلاحقة صورة (مثل .jpg).</p>
              <p className="font-semibold text-gray-800">كيف تحصل على الرابط الصحيح؟</p>
              <ol className="list-decimal list-inside text-gray-600 mt-1 space-y-1">
                <li>افتح الرابط الذي نسخته في متصفحك.</li>
                <li>اضغط <b>بزر الماوس الأيمن</b> فوق الصورة نفسها.</li>
                <li>اختر <b>"نسخ عنوان الصورة" (Copy Image Address)</b>.</li>
                <li>الصق ذلك الرابط هنا.</li>
              </ol>
            </div>
          ) : src.includes('drive.google.com') ? (
            <div className="mb-3 bg-white p-3 rounded border border-yellow-100 text-yellow-800">
              <p className="font-bold mb-1">💡 رابط Google Drive</p>
              <p className="mb-2">لقد قمنا بتحويل الرابط تلقائياً، ولكن الصورة لا تظهر؟</p>
              <p className="font-semibold">الحل:</p>
              <ul className="list-disc list-inside mt-1">
                <li>تأكد من إعدادات المشاركة في درايف.</li>
                <li>يجب أن تكون: <b>"أي شخص لديه الرابط" (Anyone with the link)</b>.</li>
                <li>وليس "حصري" (Restricted).</li>
              </ul>
            </div>
          ) : (
            <>
              <p className="mb-2">تأكد من الآتي:</p>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>الرابط صحيح ويعمل بشكل مباشر</li>
                <li>الرابط ينتهي بامتداد صورة (jpg, png, etc)</li>
                <li>الموقع المصدر يسمح بالمشاركة (ليس محمياً)</li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

interface SectionFormProps {
  section?: PageSection;
  onSave: (section: PageSection) => void;
  onCancel: () => void;
}

const SectionForm: React.FC<SectionFormProps> = ({ section, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PageSection>(
    section || {
      id: `sec-${Date.now()}`,
      type: 'text',
      order: 1,
      title: '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );



  const handleInputChange = (
    field: keyof PageSection,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleImageUrlChange = (
    imageField: 'imageUrl' | 'adImageUrl' | 'testimonialImage',
    url: string
  ) => {
    let finalUrl = url;

    // تحويل روابط Google Drive تلقائياً إلى روابط مباشرة
    // يحول من: https://drive.google.com/file/d/FILE_ID/view...
    // إلى: https://drive.google.com/uc?export=view&id=FILE_ID
    if (url.includes('drive.google.com') && url.includes('/file/d/')) {
      const match = url.match(/\/file\/d\/([^/]+)/);
      if (match && match[1]) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    setFormData(prev => ({
      ...prev,
      [imageField]: finalUrl,
      updatedAt: new Date().toISOString(),
    }));

  };

  const handleSave = () => {
    // التحقق من الحقول المطلوبة
    if (!formData.title.trim()) {
      alert('يرجى إدخال عنوان القسم');
      return;
    }

    if (formData.type === 'text' && !formData.content?.trim()) {
      alert('يرجى إدخال محتوى النص');
      return;
    }

    if (formData.type === 'image' && !formData.imageUrl) {
      alert('يرجى رفع صورة');
      return;
    }

    if (formData.type === 'video' && !formData.youtubeUrl?.trim()) {
      alert('يرجى إدخال رابط YouTube');
      return;
    }

    if (formData.type === 'cta' && !formData.ctaText?.trim()) {
      alert('يرجى إدخال نص الزر');
      return;
    }

    if (formData.type === 'advertisement' && !formData.adImageUrl) {
      alert('يرجى رفع صورة الإعلان');
      return;
    }

    onSave(formData);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex justify-center items-center p-2 md:p-4">
      <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {section ? 'تعديل القسم' : 'إضافة قسم جديد'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <XIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {/* اختيار نوع القسم - يمكن التغيير عند الإنشاء فقط */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              نوع القسم *
            </label>
            <select
              value={formData.type}
              onChange={e => handleInputChange('type', e.target.value as PageSectionType)}
              disabled={!!section}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="text">نص</option>
              <option value="image">صورة</option>
              <option value="video">فيديو YouTube</option>
              <option value="testimonial">شهادة عميل</option>
              <option value="cta">دعوة للعمل (زر)</option>
              <option value="advertisement">إعلان</option>
            </select>
          </div>

          {/* العنوان - مشترك لجميع الأنواع */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              عنوان القسم *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              placeholder="مثال: عن المركز"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* الترتيب */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ترتيب العرض
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={e => handleInputChange('order', parseInt(e.target.value))}
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* الوصف - اختياري */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الوصف (اختياري)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="وصف إضافي للقسم"
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* حقول خاصة بنوع القسم */}
          {formData.type === 'text' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                محتوى النص *
              </label>
              <textarea
                value={formData.content || ''}
                onChange={e => handleInputChange('content', e.target.value)}
                placeholder="أدخل محتوى النص..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {formData.type === 'image' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط الصورة (URL) *
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={e => handleImageUrlChange('imageUrl', e.target.value)}
                  placeholder="مثال: https://example.com/image.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">أدخل رابط الصورة مباشرة</p>
              </div>
              <ImagePreview src={formData.imageUrl || ''} alt="معاينة الصورة" />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تعليق على الصورة
                </label>
                <input
                  type="text"
                  value={formData.imageCaption || ''}
                  onChange={e => handleInputChange('imageCaption', e.target.value)}
                  placeholder="تعليق على الصورة"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                رابط YouTube *
              </label>
              <input
                type="url"
                value={formData.youtubeUrl || ''}
                onChange={e => handleInputChange('youtubeUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.youtubeUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">معاينة الفيديو:</p>
                  <iframe
                    width="100%"
                    height="315"
                    src={formData.youtubeUrl.replace('watch?v=', 'embed/')}
                    title="معاينة الفيديو"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          {formData.type === 'testimonial' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نص الشهادة *
                </label>
                <textarea
                  value={formData.testimonialText || ''}
                  onChange={e => handleInputChange('testimonialText', e.target.value)}
                  placeholder="أدخل نص الشهادة..."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم المُقيّم *
                </label>
                <input
                  type="text"
                  value={formData.testimonialAuthor || ''}
                  onChange={e => handleInputChange('testimonialAuthor', e.target.value)}
                  placeholder="اسم المُقيّم"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  دوره/موقعه (مثل: ولي أمر)
                </label>
                <input
                  type="text"
                  value={formData.testimonialRole || ''}
                  onChange={e => handleInputChange('testimonialRole', e.target.value)}
                  placeholder="مثال: ولي أمر"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط صورة المُقيّم (URL)
                </label>
                <input
                  type="url"
                  value={formData.testimonialImage || ''}
                  onChange={e => handleImageUrlChange('testimonialImage', e.target.value)}
                  placeholder="مثال: https://example.com/person.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">أدخل رابط الصورة مباشرة</p>
              </div>
            </>
          )}

          {formData.type === 'cta' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  نص الزر *
                </label>
                <input
                  type="text"
                  value={formData.ctaText || ''}
                  onChange={e => handleInputChange('ctaText', e.target.value)}
                  placeholder="مثال: سجل الآن"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط الزر *
                </label>
                <input
                  type="text"
                  value={formData.ctaLink || ''}
                  onChange={e => handleInputChange('ctaLink', e.target.value)}
                  placeholder="مثال: /login"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  لون الزر
                </label>
                <select
                  value={formData.ctaColor || 'blue'}
                  onChange={e => handleInputChange('ctaColor', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="blue">أزرق</option>
                  <option value="green">أخضر</option>
                  <option value="red">أحمر</option>
                </select>
              </div>
            </>
          )}

          {formData.type === 'advertisement' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط صورة الإعلان (URL) *
                </label>
                <input
                  type="url"
                  value={formData.adImageUrl || ''}
                  onChange={e => handleImageUrlChange('adImageUrl', e.target.value)}
                  placeholder="مثال: https://example.com/ad.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">أدخل رابط الصورة مباشرة</p>
              </div>
              <ImagePreview src={formData.adImageUrl || ''} alt="معاينة الإعلان" />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رابط الإعلان (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.adLink || ''}
                  onChange={e => handleInputChange('adLink', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* إظهار/إخفاء القسم */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
              إظهار هذا القسم على الصفحة الرئيسية
            </label>
          </div>
        </div>

        {/* أزرار الحفظ والإلغاء */}
        <div className="flex gap-3 mt-6 md:mt-8">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 md:py-3 rounded-lg transition text-sm md:text-base"
          >
            <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
            حفظ
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2.5 md:py-3 rounded-lg transition text-sm md:text-base"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SectionForm;
