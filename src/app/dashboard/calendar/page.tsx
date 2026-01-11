"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, isToday } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

// Mock Randevu Verisi
const MOCK_APPOINTMENTS = [
    {
        id: 1,
        title: "Saç Kesimi - Ahmet Y.",
        date: new Date(), // Bugün
        time: "14:00",
        type: "cut"
    },
    {
        id: 2,
        title: "Sakal Tıraşı - Mehmet K.",
        date: addDays(new Date(), 2), // 2 gün sonra
        time: "10:30",
        type: "shave"
    },
    {
        id: 3,
        title: "Cilt Bakımı - Ayşe S.",
        date: addDays(new Date(), 5), // 5 gün sonra
        time: "16:00",
        type: "care"
    }
];

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    // Ayın görsel başlangıç ve bitiş tarihlerini hesapla (Grid için)
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Pazartesi başlasın
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar zaten layout'ta var ama sticky olduğu için içerik padding almalı */}
            <main className="container mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Randevu Takvimi</h1>
                        <p className="text-slate-500 mt-1">Randevularınızı aylık ve günlük olarak yönetin.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="min-w-[150px] text-center font-semibold text-lg">
                            {format(currentDate, "MMMM yyyy", { locale: tr })}
                        </div>
                        <Button variant="ghost" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={goToToday} className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50">
                            Bugün
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Randevu
                        </Button>
                    </div>
                </div>

                {/* Takvim Grid */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Gün İsimleri */}
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-slate-50">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Günler */}
                    <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] text-sm">
                        {days.map((day, dayIdx) => {
                            // O güne ait randevuları bul
                            const dayAppointments = MOCK_APPOINTMENTS.filter(app => isSameDay(app.date, day));

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        relative border-b border-r border-gray-100 p-2 transition-colors hover:bg-slate-50 cursor-pointer
                                        ${!isSameMonth(day, monthStart) ? 'bg-slate-50/50 text-gray-400' : 'bg-white'}
                                        ${isToday(day) ? 'bg-blue-50/30' : ''}
                                        ${isSameDay(day, selectedDate) ? 'ring-2 ring-inset ring-blue-500 z-10' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <time
                                            dateTime={format(day, 'yyyy-MM-dd')}
                                            className={`
                                                flex h-7 w-7 items-center justify-center rounded-full font-semibold
                                                ${isToday(day) ? 'bg-blue-600 text-white' : 'text-slate-700'}
                                            `}
                                        >
                                            {format(day, 'd')}
                                        </time>
                                    </div>

                                    <div className="space-y-1 mt-2">
                                        {dayAppointments.map(app => (
                                            <div key={app.id} className="group flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors truncate">
                                                <Clock className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                <span className="truncate">{app.time} - {app.title}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mobil veya küçük ekranlar için "..." gösterimi eklenebilir eğer çok randevu varsa */}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Seçili Gün Detayı (Opsiyonel - Alt Kısım) */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                        {format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })}
                    </h2>

                    {MOCK_APPOINTMENTS.filter(app => isSameDay(app.date, selectedDate)).length > 0 ? (
                        <div className="space-y-3">
                            {MOCK_APPOINTMENTS.filter(app => isSameDay(app.date, selectedDate)).map(app => (
                                <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {app.time}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{app.title}</h3>
                                            <p className="text-sm text-slate-500">Standart İşlem</p>
                                        </div>
                                    </div>
                                    <Button variant="secondary" size="sm">Düzenle</Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">Bu tarih için planlanmış randevu bulunmuyor.</p>
                    )}
                </div>

            </main>
        </div>
    );
}
