import React, { useState, useEffect } from 'react';

export const ImagePreview: React.FC<{
    src: string;
    alt?: string;
    position?: string
}> = ({ src, alt = "معاينة", position = "center center" }) => {
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(false);
    }, [src]);

    if (!src) return null;

    return (
        <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">{alt}:</p>
            {!error ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover transition-all duration-300"
                        style={{ objectPosition: position }}
                        onError={() => setError(true)}
                    />
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-20">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="border border-white/40"></div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚠️</span>
                        <span className="font-bold">فشل تحميل الصورة</span>
                    </div>
                    <p className="text-xs opacity-90">يرجى التأكد من رابط الصورة المباشر.</p>
                </div>
            )}
        </div>
    );
};

export const ImagePositionControls: React.FC<{
    value?: string;
    onChange: (pos: string) => void
}> = ({ value, onChange }) => {
    const [posX, posY] = (value || "50% 50%").split(" ").map(v => parseInt(v) || 50);

    return (
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-4 mt-4 animate-in fade-in duration-300">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <span>🎯</span> تحديد بؤرة التركيز (الجزء الظاهر)
            </h4>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>أفقي (يمين - يسار)</span>
                        <span dir="ltr">{posX}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={posX}
                        onChange={(e) => onChange(`${e.target.value}% ${posY}%`)}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
                <div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                        <span>رأسي (أعلى - أسفل)</span>
                        <span dir="ltr">{posY}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={posY}
                        onChange={(e) => onChange(`${posX}% ${e.target.value}%`)}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>
            </div>
            <p className="text-[10px] text-blue-600/70 text-center font-medium">
                💡 اسحب المنزلقات لتحريك الصورة واختيار أفضل جزء ليظهر في الموقع
            </p>
        </div>
    );
};
