"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getNotificationsByUser, markAsRead, markAllAsRead, type Notification } from "@/app/actions/notifications";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setUserId(user.id);
            const data = await getNotificationsByUser(user.id);
            setNotifications(data);
            setLoading(false);
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (notificationId: string) => {
        await markAsRead(notificationId);
        setNotifications(notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllAsRead = async () => {
        if (!userId) return;
        await markAllAsRead(userId);
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Yük leniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-2 transition-colors">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Panele Dön
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Bildirimler</h1>
                    </div>
                    {notifications.some(n => !n.read) && (
                        <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                            <CheckCheck className="mr-2 h-4 w-4" />
                            Tümünü Okundu İşaretle
                        </Button>
                    )}
                </div>

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Bell className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                                <p className="text-slate-500">Henüz bildiriminiz yok.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        notifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-blue-300 bg-blue-50' : ''}`}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Bell className={`h-5 w-5 ${!notification.read ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <CardTitle className="text-lg">{notification.title}</CardTitle>
                                        </div>
                                        {!notification.read && (
                                            <Button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                Okundu
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-700 mb-2">{notification.message}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(notification.created_at).toLocaleString('tr-TR')}
                                    </p>
                                    {notification.related_appointment_id && (
                                        <Link href="/dashboard/calendar" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                                            Randevuya Git →
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
