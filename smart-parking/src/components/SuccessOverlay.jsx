import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessOverlay = ({ message, onComplete }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                setTimeout(onComplete, 500); // Wait for fade out
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
            <div className={`relative flex flex-col items-center text-center transform transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-90'}`}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4 animate-bounce">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Completed!</h2>
                <p className="text-gray-500 font-medium">{message}</p>
            </div>
        </div>
    );
};

export default SuccessOverlay;
