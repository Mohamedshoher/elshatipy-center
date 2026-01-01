import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Student, PageSection } from '../types';
import html2canvas from 'html2canvas';

interface BadgeCertificatesSliderProps {
    section: PageSection;
    students: Student[];
}

const BadgeCertificatesSlider: React.FC<BadgeCertificatesSliderProps> = ({ section, students }) => {
    const certificateStudents = useMemo(() => {
        const withBadges = students.filter(s => s.badges && s.badges.length > 0 && !s.isArchived);
        withBadges.sort((a, b) => {
            const dateA = a.badges && a.badges.length > 0 ? new Date(a.badges[a.badges.length - 1].dateEarned).getTime() : 0;
            const dateB = b.badges && b.badges.length > 0 ? new Date(b.badges[b.badges.length - 1].dateEarned).getTime() : 0;
            return dateB - dateA;
        });
        const limit = section.sliderInterval || 10;
        return withBadges.slice(0, limit);
    }, [students, section.sliderInterval]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isSharing, setIsSharing] = useState(false);

    const nextSlide = useCallback(() => {
        if (isSharing) return;
        setCurrentIndex((prev) => (prev === certificateStudents.length - 1 ? 0 : prev + 1));
    }, [certificateStudents.length, isSharing]);

    const prevSlide = useCallback(() => {
        if (isSharing) return;
        setCurrentIndex((prev) => (prev === 0 ? certificateStudents.length - 1 : prev - 1));
    }, [certificateStudents.length, isSharing]);

    useEffect(() => {
        const img = new Image();
        img.src = "/logo.png";
    }, []);

    useEffect(() => {
        if (certificateStudents.length <= 1 || isHovered || isSharing) return;
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [certificateStudents.length, nextSlide, isHovered, isSharing]);

    const handleCertificateClick = async () => {
        setIsSharing(true);
    };

    const generateAndShare = async () => {
        if (!certificateRef.current) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // High quality
                useCORS: true,
                backgroundColor: '#1a1a1a',
            });

            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], `certificate-${certificateStudents[currentIndex].name}.png`, { type: 'image/png' });

                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'شهادة تقدير',
                            text: `شهادة تقدير للطالب ${certificateStudents[currentIndex].name}`,
                            files: [file],
                        });
                        setIsSharing(false);
                    } catch (err) {
                        console.log('Error sharing:', err);
                        // Fallback to download if share fails/cancelled
                        saveAsImage(canvas);
                    }
                } else {
                    saveAsImage(canvas);
                }
            });
        } catch (error) {
            console.error("Error creating certificate image", error);
            setIsSharing(false);
        }
    };

    const saveAsImage = (canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `certificate-${certificateStudents[currentIndex].name}.png`;
        link.href = canvas.toDataURL();
        link.click();
        setIsSharing(false);
    };


    if (certificateStudents.length === 0) return null;

    // --- Certificate Component ---
    const CertificateDesign = ({ student }: { student: Student }) => {
        const latestBadge = student.badges ? student.badges[student.badges.length - 1] : null;
        if (!latestBadge) return null;

        // Mobile Optimized Sizes
        const containerPadding = 'p-3 sm:p-8';
        const logoSize = 'w-16 h-16 sm:w-36 sm:h-36';

        return (
            <div ref={certificateRef} className={`relative w-full h-full bg-[#fffcf5] overflow-hidden flex flex-col justify-between ${containerPadding} text-center shadow-2xl rounded-sm`}
                style={{
                    backgroundImage: `radial-gradient(circle at center, transparent 0%, #fffbeb 100%), url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            >
                {/* 1. Ornate Gold Border Frame */}
                <div className={`absolute inset-1 sm:inset-3 border-[3px] sm:border-[6px] border-double border-amber-500 pointer-events-none z-0`}></div>

                {/* 2. Corner Ornaments (Gold) */}
                <svg className={`absolute top-0 right-0 text-amber-500 w-8 h-8 sm:w-20 sm:h-20`} viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 L100,0 L100,100 C100,50 50,0 0,0 Z" fillOpacity="0.8" />
                    <path d="M10,10 L90,10 L90,90 C90,50 50,10 10,10 Z" fill="#fffcf5" />
                    <path d="M20,20 L80,20 L80,80 C80,50 50,20 20,20 Z" fillOpacity="0.3" />
                </svg>
                <svg className={`absolute bottom-0 left-0 text-amber-500 rotate-180 w-8 h-8 sm:w-20 sm:h-20`} viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 L100,0 L100,100 C100,50 50,0 0,0 Z" fillOpacity="0.8" />
                    <path d="M10,10 L90,10 L90,90 C90,50 50,10 10,10 Z" fill="#fffcf5" />
                </svg>

                {/* --- HEADER --- */}
                <div className="relative z-10 flex justify-between items-start w-full">
                    {/* Right: Logo */}
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center p-1 shadow-inner ${logoSize}`}>
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>

                    {/* Middle: Bismillah */}
                    <div className="absolute top-0 left-0 right-0 flex justify-center mt-3 sm:mt-8">
                        <span className={`font-bold text-amber-800 text-[9px] sm:text-2xl`}>
                            بسم الله الرحمن الرحيم
                        </span>
                    </div>

                    {/* --- BADGE ICON (Lowered Position on Mobile) --- */}
                    <div className="absolute left-1 top-0 bottom-0 w-1/3 flex items-center justify-center pointer-events-none z-0 overflow-hidden sm:-mt-16 mt-8">
                        <span className="text-[60px] sm:text-[220px] opacity-100 transform rotate-[-5deg] drop-shadow-md text-amber-500">
                            {latestBadge.icon}
                        </span>
                    </div>
                </div>

                {/* --- BODY (Flex Grow) --- */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full px-2 sm:px-8 -mt-1 sm:-mt-6 space-y-1 sm:space-y-4">
                    {/* Title */}
                    <h1 className={`font-bold text-amber-700 decoration-amber-300 decoration-double -mt-1 sm:-mt-8 text-base sm:text-5xl`}>
                        شهادة تقدير
                    </h1>

                    {/* Grant Text */}
                    <p className={`font-medium text-gray-600 text-[8px] sm:text-xl`}>
                        يمنح مركز الشاطبي هذه الشهادة إلى الطالب/ـة
                    </p>

                    {/* Name (Hero Text - Compact) */}
                    <h2 className={`font-black w-full text-center truncate px-2 border-b-2 sm:border-b-4 border-dashed border-amber-200/50 
                        text-base sm:text-5xl md:text-6xl`}
                        style={{ color: '#854d0e', lineHeight: '1.2' }}>
                        {student.name}
                    </h2>

                    {/* Reason Text (Compact) */}
                    <div className={`text-gray-700 leading-tight font-medium max-w-4xl mx-auto text-[8px] sm:text-lg`}>
                        <p>لجهده/ها المتميز وحصوله/ها على وسام <span className="text-amber-600 font-bold mx-1">"{latestBadge.title}"</span></p>
                        <p className="mt-1 text-gray-500 hidden sm:block">والمشاركة الفعالة في أنشطة المركز، راجين من الله له دوام التوفيق والسداد.</p>
                    </div>
                </div>

                {/* --- FOOTER (Ensured Visibility) --- */}
                <div className="w-full relative z-10 flex justify-between items-end pb-1 sm:pb-0 px-2 sm:px-4 mt-auto">
                    {/* Right: Date */}
                    <div className="text-right">
                        <p className={`font-bold text-amber-800 text-[7px] sm:text-base`}>التاريخ</p>
                        <p className={`font-mono text-gray-700 mt-0.5 text-[7px] sm:text-base`}>{latestBadge.dateEarned}</p>
                    </div>

                    {/* Left: Signature */}
                    <div className="text-left">
                        <p className={`font-bold text-amber-800 text-[7px] sm:text-base`}>مدير المركز</p>
                        <div className={`font-bold text-blue-900 mt-0.5 text-[8px] sm:text-xl`}>
                            د. محمد مصطفى شكر
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="py-8 sm:py-24 bg-[#1a1a1a] overflow-hidden relative border-t-4 border-amber-600">
            {/* Royal Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

            {/* Dynamic Glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="w-full max-w-[95%] lg:max-w-7xl mx-auto relative z-10">
                {section.title && (
                    <h2 className="text-2xl sm:text-5xl font-extrabold text-amber-400 py-4 mb-4 sm:mb-12 text-center tracking-wide" style={{ textShadow: '0 4px 20px rgba(245, 158, 11, 0.4)' }}>
                        ✨ {section.title} ✨
                    </h2>
                )}

                {/* Main Slider Area */}
                <div className="relative w-full aspect-[1.8/1] sm:aspect-[2/1] max-h-[700px] flex items-center justify-center">

                    {/* The Certificate Wrapper - Clickable for Share */}
                    <div
                        className="relative w-full h-full transition-all duration-700 hover:shadow-amber-500/20 group cursor-pointer"
                        onClick={handleCertificateClick}
                    >
                        {/* Content Transition - Simple Key Based */}
                        <div key={currentIndex} className="w-full h-full animate-in fade-in slide-in-from-right-8 duration-700">
                            <CertificateDesign student={certificateStudents[currentIndex]} />
                        </div>

                        {/* Share Overlay (Visible on Hover/Click Hint) */}
                        {!isSharing && (
                            <div className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </div>
                        )}

                        {/* Confirm Share Overlay */}
                        {isSharing && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-in fade-in text-white p-4">
                                <h3 className="text-xl sm:text-3xl font-bold mb-6 text-center">هل تريد مشاركة الشهادة؟</h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); generateAndShare(); }}
                                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        تحميل ومشاركة
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsSharing(false); }}
                                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-lg transition-transform hover:scale-105"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Arrows */}
                    {certificateStudents.length > 1 && !isSharing && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute -left-3 sm:-left-16 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 group z-30"
                                aria-label="Previous"
                            >
                                <svg className="w-5 h-5 sm:w-8 sm:h-8 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute -right-3 sm:-right-16 top-1/2 -translate-y-1/2 p-2 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 group z-30"
                                aria-label="Next"
                            >
                                <svg className="w-5 h-5 sm:w-8 sm:h-8 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </>
                    )}
                </div>

                {/* Indicators */}
                <div className="flex justify-center mt-4 sm:mt-10 gap-2 sm:gap-3">
                    {certificateStudents.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 sm:w-12 bg-amber-500 box-shadow-glow' : 'w-2 bg-gray-700 hover:bg-gray-600'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BadgeCertificatesSlider;
