"use client";

import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addDays, isToday, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const tenantId = user.user_metadata.tenant_id;

            let query = supabase.from('appointments').select('*, customers(full_name), tenants(name), services(name)');

            if (user.user_metadata.role === 'individual') {
                query = query.eq('created_by', user.id);
            } else if (tenantId) {
                query = query.eq('tenant_id', tenantId);
            }

            const { data } = await query;
            setAppointments(data || []);
            setLoading(false);
        };
        fetchAppointments();
    }, []);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <main className="container mx-auto px-4 py-8">
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
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-7 border-b border-gray-200 bg-slate-50">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)] text-sm">
                        {days.map((day) => {
                            const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.start_time), day));

                            return (
                                <div
                                    key={day.toString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={`
                                        relative border-b border-r border-gray-100 p-2 transition-colors hover:bg-slate-50 cursor-pointer min-h-[120px]
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
                                        {dayAppointments.slice(0, 3).map(app => (
                                            <div key={app.id} className="group flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors truncate">
                                                <Clock className="h-3 w-3 flex-shrink-0 opacity-70" />
                                                <span className="truncate">
                                                    {format(parseISO(app.start_time), "HH:mm")} - {app.customers?.full_name || app.tenants?.name}
                                                </span>
                                            </div>
                                        ))}
                                        {dayAppointments.length > 3 && (
                                            <div className="text-[10px] text-gray-400 text-center font-medium">
                                                + {dayAppointments.length - 3} daha
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                        {format(selectedDate, "d MMMM yyyy, EEEE", { locale: tr })}
                    </h2>

                    {appointments.filter(app => isSameDay(parseISO(app.start_time), selectedDate)).length > 0 ? (
                        <div className="space-y-3">
                            {appointments.filter(app => isSameDay(parseISO(app.start_time), selectedDate)).map(app => (
                                <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {format(parseISO(app.start_time), "HH:mm")}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">
                                                {app.customers?.full_name || app.tenants?.name}
                                            </h3>
                                            <p className="text-sm text-slate-500">{app.services?.name || "Hizmet belirtilmedi"}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                                        }`}>
                                        {app.status === 'pending' ? 'Bekliyor' : app.status}
                                    </span>
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
