import { useState, useEffect } from 'react';
import { X, MessageCircle, Car } from 'lucide-react';

export default function WhatsAppNotification({
    message,
    sender = "Parkin Valet",
    isVisible = true,
    onClose,
    onClear,
    vehicle = null
}) {
    if (!isVisible || !message) return null;

    const handleClose = () => {
        if (onClose) onClose();
        if (onClear) onClear();
    };

    return (
        <div className="absolute top-0 left-0 right-0 z-[100] px-3 pt-3 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto animate-notification-drop">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-white/20 flex items-stretch">
                    {/* WhatsApp Green Stripe */}
                    <div className="bg-[#25D366] w-1.5"></div>

                    <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <div className="bg-[#25D366] p-1 rounded-md">
                                    <MessageCircle size={14} className="text-white fill-white/20" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">WhatsApp • <span className="text-[#25D366]">Now</span></span>
                            </div>
                            <button onClick={handleClose} className="text-gray-300 hover:text-gray-500 transition-colors">
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>

                        <div className="flex flex-col">
                            <h4 className="font-black text-gray-900 text-sm leading-tight">{sender}</h4>
                            <p className="text-sm text-gray-700 leading-snug mt-0.5">{message}</p>

                            {vehicle && (
                                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-3">
                                    <div className="bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                                        <Car size={16} className="text-[#4F46E5]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Vehicle</span>
                                        <span className="text-[11px] font-bold text-gray-800">
                                            {vehicle.make} {vehicle.model} • <span className="font-mono">{vehicle.plateNumber}</span>
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pull Handle - Visual Decoration for "Shutter" feel */}
                <div className="flex justify-center -mt-1 opacity-50">
                    <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
