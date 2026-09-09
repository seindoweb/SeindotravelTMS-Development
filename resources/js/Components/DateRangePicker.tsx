import { Popover, Transition } from '@headlessui/react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragment, useState } from 'react';

function generateCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        days.push({
            date: new Date(year, month - 1, daysInPrevMonth - i),
            isCurrentMonth: false
        });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: new Date(year, month, i),
            isCurrentMonth: true
        });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push({
            date: new Date(year, month + 1, i),
            isCurrentMonth: false
        });
    }
    
    return days;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function isSameDay(d1: Date | null, d2: Date | null) {
    if (!d1 || !d2) return false;
    return d1.getFullYear() === d2.getFullYear() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getDate() === d2.getDate();
}

interface Props {
    checkIn: Date | null;
    checkOut: Date | null;
    setCheckIn: (val: Date | null) => void;
    setCheckOut: (val: Date | null) => void;
}

export default function DateRangePicker({ checkIn, checkOut, setCheckIn, setCheckOut }: Props) {
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const [activeDateTab, setActiveDateTab] = useState<'checkIn' | 'checkOut'>('checkIn');
    
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const handleDateClick = (date: Date) => {
        if (activeDateTab === 'checkIn') {
            setCheckIn(date);
            if (checkOut && date > checkOut) {
                setCheckOut(null);
            }
            setActiveDateTab('checkOut');
        } else {
            if (!checkIn) {
                setCheckIn(date);
                setActiveDateTab('checkOut');
            } else if (date < checkIn) {
                setCheckIn(date);
                setCheckOut(null);
            } else {
                setCheckOut(date);
            }
        }
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const calendarDays = generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());

    const isDateInRange = (date: Date) => {
        if (checkIn && checkOut) {
            return date > checkIn && date < checkOut;
        }
        if (checkIn && !checkOut && hoverDate) {
            if (hoverDate > checkIn) {
                return date > checkIn && date <= hoverDate;
            }
        }
        if (!checkIn && checkOut && hoverDate) {
            if (hoverDate < checkOut) {
                return date >= hoverDate && date < checkOut;
            }
        }
        return false;
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Select Date';
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button as="div" className="w-full focus:outline-none cursor-pointer">
                        <div className={`flex relative w-full border rounded-xl transition-colors bg-white ${
                            open ? "border-primary ring-1 ring-primary" : "border-[#E2E8F0] hover:border-gray-400"
                        }`}>

                            <div 
                                onClick={() => setActiveDateTab('checkIn')}
                                className={`flex-1 px-4 py-2 flex flex-col border-r border-[#E2E8F0] transition-colors rounded-l-xl ${
                                    activeDateTab === 'checkIn' && open ? "bg-blue-50/50" : ""
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary">Check-in</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <Calendar size={16} className={checkIn ? 'text-primary' : 'text-quaternary-bright'} />
                                    <span className={`text-sm truncate ${checkIn ? "font-bold text-primary" : "text-quaternary font-normal"}`}>
                                        {formatDate(checkIn)}
                                    </span>
                                </div>
                            </div>

                            <div 
                                onClick={() => setActiveDateTab('checkOut')}
                                className={`flex-1 px-4 py-2 flex flex-col pl-4 transition-colors rounded-r-xl ${
                                    activeDateTab === 'checkOut' && open ? "bg-blue-50/50" : ""
                                }`}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-wider text-quaternary">Check-out</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-sm truncate ${checkOut ? "font-bold text-primary" : "text-quaternary font-normal"}`}>
                                        {formatDate(checkOut)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Popover.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-75"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute z-50 left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-3 flex justify-center">
                            <div className="w-[280px]">
                                <div className="flex items-center justify-between mb-3">
                                    <button onClick={prevMonth} type="button" className="p-1 hover:bg-[#F1F5F9] rounded-lg text-primary">
                                        <ChevronLeft size={16} />
                                    </button>
                                    <div className="font-bold text-sm text-primary">
                                        {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                    </div>
                                    <button onClick={nextMonth} type="button" className="p-1 hover:bg-[#F1F5F9] rounded-lg text-primary">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-7 gap-y-1 text-center mb-1">
                                    {DAY_NAMES.map(day => (
                                        <div key={day} className="text-[9px] font-bold text-quaternary uppercase tracking-wider">{day}</div>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-7 gap-y-1 text-center" onMouseLeave={() => setHoverDate(null)}>
                                    {calendarDays.map((item, idx) => {
                                        const isSelectedIn = isSameDay(item.date, checkIn);
                                        const isSelectedOut = isSameDay(item.date, checkOut);
                                        const isSelected = isSelectedIn || isSelectedOut;
                                        const inRange = isDateInRange(item.date);
                                        const isPast = item.date < startOfToday;

                                        return (
                                            <div 
                                                key={idx} 
                                                className={`h-7 flex items-center justify-center relative ${inRange ? "bg-blue-50" : ""} ${isSelectedIn && checkOut ? "bg-gradient-to-r from-transparent via-blue-50 to-blue-50" : ""} ${isSelectedOut ? "bg-gradient-to-l from-transparent via-blue-50 to-blue-50" : ""}`}
                                                onMouseEnter={() => !isPast && setHoverDate(item.date)}
                                            >
                                                <button
                                                    type="button"
                                                    disabled={isPast}
                                                    onClick={() => handleDateClick(item.date)}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors z-10 ${!item.isCurrentMonth && !isSelected ? "text-gray-300" : ""} ${item.isCurrentMonth && !isSelected && !isPast ? "text-primary hover:bg-gray-100" : ""} ${isPast ? "text-gray-200 cursor-not-allowed" : ""} ${isSelected ? "bg-primary text-white font-bold shadow-sm" : ""}`}
                                                >
                                                    {item.date.getDate()}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-3 pt-2 border-t border-[#F1F5F9] flex justify-end gap-2">
                                    <button onClick={() => { setCheckIn(null); setCheckOut(null); }} className="px-2 py-1 text-[11px] font-medium text-quaternary hover:text-primary">Clear</button>
                                    <button onClick={() => close()} className="px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg shadow-sm">Done</button>
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
