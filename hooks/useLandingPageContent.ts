import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import type { LandingPageContent } from '../types';

// IDs محددة لكل نوع محتوى
const DRAFT_DOC_ID = 'landing-draft';
const PUBLISHED_DOC_ID = 'landing-published';

export const useLandingPageContent = () => {
  const [draftContent, setDraftContent] = useState<LandingPageContent | null>(null);
  const [publishedContent, setPublishedContent] = useState<LandingPageContent | null>(() => {
    // محاولة استرجاع المحتوى المخزن مسبقاً لسرعة التحميل
    const cached = localStorage.getItem('shatibi_landing_cache');
    try {
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  });
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [loadingPublished, setLoadingPublished] = useState(!publishedContent);
  const [errorDraft, setErrorDraft] = useState<string | null>(null);
  const [errorPublished, setErrorPublished] = useState<string | null>(null);

  // جلب المسودة (للمدير فقط)
  useEffect(() => {
    // التحقق من الصلاحية من localStorage للهوك
    const userStr = localStorage.getItem('shatibi-center-currentUser');
    const isDirector = userStr && (userStr.includes('"director"') || userStr.includes('"supervisor"'));

    if (!isDirector) {
      setLoadingDraft(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'landingPageContent', DRAFT_DOC_ID),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as LandingPageContent;
          setDraftContent(data);
        } else {
          setDraftContent(null);
        }
        setLoadingDraft(false);
      },
      (error) => {
        console.error('خطأ في جلب المسودة:', error);
        setErrorDraft(error.message);
        setLoadingDraft(false);
      }
    );

    return unsubscribe;
  }, []);

  // جلب المحتوى المنشور (لجميع الزوار - جلب مرة واحدة لتوفير القراءات)
  useEffect(() => {
    const fetchPublished = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'landingPageContent', PUBLISHED_DOC_ID));
        if (snapshot.exists()) {
          const data = snapshot.data() as LandingPageContent;
          setPublishedContent(data);
          localStorage.setItem('shatibi_landing_cache', JSON.stringify(data));
        } else {
          setPublishedContent(null);
          localStorage.removeItem('shatibi_landing_cache');
        }
      } catch (error) {
        console.error('خطأ في جلب المحتوى المنشور:', error);
        setErrorPublished((error as any).message);
      } finally {
        setLoadingPublished(false);
      }
    };

    fetchPublished();
  }, []);

  // حفظ مسودة محتوى
  const saveDraft = async (content: LandingPageContent): Promise<void> => {
    try {
      const docRef = doc(db, 'landingPageContent', DRAFT_DOC_ID);
      await setDoc(docRef, {
        ...content,
        id: DRAFT_DOC_ID,
        isPublished: false,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('خطأ في حفظ المسودة:', error);
      throw error;
    }
  };

  // نشر محتوى
  const publishContent = async (
    directorName: string,
    contentOverride?: LandingPageContent
  ): Promise<void> => {
    try {
      // استخدام المحتوى الممرر أو المسودة الحالية
      const contentToPublish = contentOverride || draftContent;

      if (contentToPublish) {
        const publishedDoc = doc(db, 'landingPageContent', PUBLISHED_DOC_ID);
        await setDoc(publishedDoc, {
          ...contentToPublish,
          id: PUBLISHED_DOC_ID,
          isPublished: true,
          publishedAt: new Date().toISOString(),
          publishedBy: directorName,
        });
      }
    } catch (error) {
      console.error('خطأ في نشر المحتوى:', error);
      throw error;
    }
  };

  // إلغاء نشر
  const unpublishContent = async (): Promise<void> => {
    try {
      const publishedDoc = doc(db, 'landingPageContent', PUBLISHED_DOC_ID);
      await updateDoc(publishedDoc, {
        isPublished: false,
        publishedAt: null,
        publishedBy: null,
      });
    } catch (error) {
      console.error('خطأ في إلغاء النشر:', error);
      throw error;
    }
  };

  return {
    draftContent,
    publishedContent,
    loadingDraft,
    loadingPublished,
    errorDraft,
    errorPublished,
    saveDraft,
    publishContent,
    unpublishContent,
  };
};
