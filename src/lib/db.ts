import Dexie, { type EntityTable } from 'dexie';

export interface Customer {
    id: string; // uuid
    name: string;
    phone: string;
    email?: string;
    notes?: string;
    createdAt: Date;
}

export interface Appointment {
    id: string; // uuid
    customerId: string;
    title: string;
    date: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    notes?: string;
    createdAt: Date;
}

const db = new Dexie('RandevuluDatabase') as Dexie & {
    customers: EntityTable<Customer, 'id'>
    appointments: EntityTable<Appointment, 'id'>
};

// Schema declaration:
db.version(1).stores({
    customers: 'id, name, phone',
    appointments: 'id, customerId, date, status'
});

export { db };
