import { z } from 'zod';

// =============================================================================
// COMMON SCHEMAS
// =============================================================================

export const uuidSchema = z.string().uuid('Geçersiz kimlik formatı');

// =============================================================================
// AUTH SCHEMAS
// =============================================================================

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'E-posta adresi gereklidir')
        .email('Geçerli bir e-posta adresi giriniz'),
    password: z
        .string()
        .min(1, 'Şifre gereklidir')
        .min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register form validation schema
 */
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Ad/İşletme adı gereklidir')
        .min(2, 'Ad en az 2 karakter olmalıdır')
        .max(100, 'Ad en fazla 100 karakter olabilir'),
    email: z
        .string()
        .min(1, 'E-posta adresi gereklidir')
        .email('Geçerli bir e-posta adresi giriniz')
        .regex(
            /@(gmail\.com|hotmail\.com)$/,
            'Sadece Gmail veya Hotmail adresleri kabul edilmektedir'
        ),
    password: z
        .string()
        .min(6, 'Şifre en az 6 karakter olmalıdır')
        .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
        .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
    accountType: z.enum(['business', 'individual']),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password reset form validation schema
 */
export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(6, 'Şifre en az 6 karakter olmalıdır')
        .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
        .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Forgot password form validation schema
 */
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'E-posta adresi gereklidir')
        .email('Geçerli bir e-posta adresi giriniz'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// =============================================================================
// PROFILE SCHEMAS
// =============================================================================

/**
 * User profile validation schema
 */
export const profileSchema = z.object({
    full_name: z
        .string()
        .min(1, 'Ad soyad gereklidir')
        .min(2, 'Ad soyad en az 2 karakter olmalıdır')
        .max(100, 'Ad soyad en fazla 100 karakter olabilir'),
    phone: z
        .string()
        .regex(
            /^(\+90|0)?[0-9]{10}$/,
            'Geçerli bir telefon numarası giriniz (örn: 5551234567)'
        )
        .optional()
        .or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// =============================================================================
// CUSTOMER SCHEMAS
// =============================================================================

/**
 * Customer creation/update validation schema
 */
export const customerSchema = z.object({
    full_name: z
        .string()
        .min(1, 'Müşteri adı gereklidir')
        .min(2, 'Ad en az 2 karakter olmalıdır')
        .max(100, 'Ad en fazla 100 karakter olabilir'),
    phone: z
        .string()
        .regex(
            /^(\+90|0)?[0-9]{10}$/,
            'Geçerli bir telefon numarası giriniz (örn: 5551234567)'
        )
        .optional()
        .or(z.literal('')),
    email: z
        .string()
        .email('Geçerli bir e-posta adresi giriniz')
        .optional()
        .or(z.literal('')),
    notes: z
        .string()
        .max(500, 'Not en fazla 500 karakter olabilir')
        .optional()
        .or(z.literal('')),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

// =============================================================================
// APPOINTMENT SCHEMAS
// =============================================================================

/**
 * Appointment creation/update validation schema
 */
export const appointmentSchema = z.object({
    customer_id: z
        .string()
        .uuid('Geçerli bir müşteri seçiniz'),
    service_id: z
        .string()
        .uuid('Geçerli bir hizmet seçiniz')
        .optional(),
    start_time: z.coerce
        .date({
            message: 'Geçerli bir randevu tarihi ve saati gereklidir',
        })
        .refine(
            (date) => date > new Date(),
            'Randevu tarihi gelecekte olmalıdır'
        ),
    end_time: z.coerce
        .date({
            message: 'Geçerli bir bitiş tarihi ve saati gereklidir',
        }),
    notes: z
        .string()
        .max(500, 'Not en fazla 500 karakter olabilir')
        .optional()
        .or(z.literal('')),
    status: z
        .enum(['pending', 'confirmed', 'cancelled', 'completed'])
        .default('pending'),
    created_by: z.string().uuid().optional().nullable(),
}).refine(
    (data) => data.end_time > data.start_time,
    {
        message: 'Bitiş zamanı başlangıç zamanından sonra olmalıdır',
        path: ['end_time'],
    }
);

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// =============================================================================
// SERVICE SCHEMAS
// =============================================================================

/**
 * Service creation/update validation schema
 */
export const serviceSchema = z.object({
    name: z
        .string()
        .min(1, 'Hizmet adı gereklidir')
        .min(2, 'Hizmet adı en az 2 karakter olmalıdır')
        .max(100, 'Hizmet adı en fazla 100 karakter olabilir'),
    duration_minutes: z
        .number()
        .int('Süre tam sayı olmalıdır')
        .min(5, 'Süre en az 5 dakika olmalıdır')
        .max(480, 'Süre en fazla 480 dakika (8 saat) olabilir')
        .default(30),
    price: z
        .number()
        .nonnegative('Fiyat negatif olamaz')
        .optional(),
    currency: z
        .string()
        .length(3, 'Para birimi 3 karakter olmalıdır (örn: TRY)')
        .default('TRY'),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

// =============================================================================
// NOTIFICATION SCHEMAS
// =============================================================================

/**
 * Notification validation schema
 */
export const notificationSchema = z.object({
    user_id: z.string().uuid('Geçerli bir kullanıcı ID gereklidir'),
    type: z.enum([
        'appointment_approved',
        'appointment_rejected',
        'appointment_reminder',
        'appointment_created',
        'system'
    ]),
    title: z.string().min(1, 'Başlık gereklidir').max(100),
    message: z.string().min(1, 'Mesaj gereklidir').max(500),
    related_appointment_id: z.string().uuid().optional().nullable(),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;

// =============================================================================
// TENANT SCHEMAS
// =============================================================================

/**
 * Tenant (business) settings validation schema
 */
export const tenantSettingsSchema = z.object({
    name: z
        .string()
        .min(1, 'İşletme adı gereklidir')
        .min(2, 'İşletme adı en az 2 karakter olmalıdır')
        .max(100, 'İşletme adı en fazla 100 karakter olabilir'),
    subscription_tier: z
        .enum(['free', 'pro'])
        .default('free'),
    settings: z
        .object({
            description: z.string().max(500).optional(),
            phone: z.string().optional(),
            address: z.string().max(200).optional(),
            city: z.string().optional(),
            district: z.string().optional(),
            working_hours: z.record(z.string(), z.string()).optional(),
        })
        .optional(),
});

export type TenantSettingsFormData = z.infer<typeof tenantSettingsSchema>;
