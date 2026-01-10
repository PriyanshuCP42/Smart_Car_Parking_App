import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Car, User, MapPin, ChevronLeft } from 'lucide-react';
import { parkingService } from '../services/parkingService';

export default function Retrieve() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [ticket, setTicket] = useState(null);

    const steps = [
        { label: 'Request Received', desc: 'We have received your request.', icon: Check },
        { label: 'Driver Assigned', desc: 'Valet is getting your car.', icon: User },
        { label: 'Car Arriving', desc: 'Your car is on the way to Exit.', icon: Car },
        { label: 'Ready for Pickup', desc: 'Please proceed to the exit.', icon: MapPin },
    ];

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // We use getActiveSession but strictly looking for retrieval status
                // Or getHistory if it's completed? 
                // getActiveSession returns the ticket if it's not COMPLETED.
                // If it IS completed, getActiveSession might return null (in current implementation).
                // But getHistory returns list.
                // Let's rely on getActiveSession returning the ticket if it's active OR check history if null.

                let currentTicket = await parkingService.getActiveSession();

                // If no active session found, it might be completed just now
                if (!currentTicket) {
                    const history = await parkingService.getHistory();
                    if (history && history.length > 0) {
                        // Check if the most recent one is the one we just finished
                        // Maybe check time?
                        currentTicket = history[0];
                    }
                }

                if (currentTicket) {
                    setTicket(currentTicket);
                    updateStep(currentTicket.status);
                }
            } catch (error) {
                console.error("Error polling status:", error);
            }
        };

        fetchStatus();
        const interval = setInterval(fetchStatus, 15000); // Poll every 15 seconds
        return () => clearInterval(interval);
    }, []);

    const updateStep = (status) => {
        switch (status) {
            case 'RETRIEVAL_REQUESTED':
                setStep(0);
                break;
            case 'RETRIEVING':
            case 'VALET_ASSIGNED_FOR_PARKING': // Should not happen here but safety
                setStep(1);
                // Simulate step 2 animation after a bit? 
                // Or just keep at 1 until completed.
                // Let's just make step 2 be "Car Arriving" which is same as retrieving really.
                // We can use a local timer to fake progress from 1 to 2 if status stays RETRIEVING for long?
                // For now, let's map RETRIEVING to 2 directly to look "in progress"
                setStep(2);
                break;
            case 'COMPLETED':
                setStep(3);
                break;
            default:
                setStep(0);
        }
    };

    return (
        <div className="flex flex-col relative overflow-hidden h-full">
            {/* Dynamic Background */}
            <div className={`absolute top-0 left-0 w-full h-[40vh] transition-colors duration-1000 ease-in-out z-0 ${step === 3 ? 'bg-success' : 'bg-primary'}`}></div>
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 p-6 flex items-center text-white">
                <button onClick={() => navigate('/')} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all">
                    <ChevronLeft size={24} />
                </button>
                <span className="ml-4 font-bold text-lg tracking-wide">Return Status</span>
            </div>

            {/* Main Status Card */}
            <div className="px-6 mb-8 relative z-10">
                <div className="bg-white/20 backdrop-blur-xl border border-white/20 text-white p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 shadow-inner ring-4 ring-white/10 relative">
                        {/* Animated Pulse Ring */}
                        <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-50"></div>

                        {/* Icon */}
                        {step === 0 && <Check size={32} />}
                        {step === 1 && <User size={32} />}
                        {step === 2 && <Car size={32} />}
                        {step === 3 && <MapPin size={32} />}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{steps[step].label}</h2>
                    <p className="text-white/80 font-medium">{steps[step].desc}</p>
                </div>
            </div>

            {/* Timeline Steps */}
            <div className="flex-1 bg-white rounded-t-[40px] shadow-sm z-10 relative mt-[-20px] p-8 pb-32">
                <h3 className="text-text-dark font-bold mb-6 text-lg">Timeline</h3>
                <div className="space-y-0 relative">
                    {/* Line */}
                    <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-gray-100"></div>

                    {steps.map((s, idx) => {
                        const isCompleted = idx < step;
                        const isCurrent = idx === step;

                        return (
                            <div key={idx} className={`relative flex items-start gap-4 pb-8 transition-all duration-500 ${idx === steps.length - 1 ? 'pb-0' : ''}`}>
                                {/* Dot / Icon */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all duration-500
                                 ${isCompleted || isCurrent ? (step === 3 ? 'bg-success text-white' : 'bg-primary text-white') : 'bg-gray-100 text-gray-300'}`}>
                                    <s.icon size={16} />
                                </div>

                                <div className={`flex-1 pt-1 transition-all duration-500 ${isCurrent ? 'transform translate-x-2' : ''}`}>
                                    <h4 className={`font-bold text-sm ${isCompleted || isCurrent ? 'text-text-dark' : 'text-gray-400'}`}>{s.label}</h4>
                                    <p className="text-xs text-text-muted mt-0.5">{s.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Complete Button - Inside the flow but at the bottom of the card area */}
                {step === 3 && (
                    <div className="mt-12 animate-fade-in-up">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-text-dark text-white font-bold py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
