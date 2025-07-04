export type Cabin = {
    id: number;
    name: string;
    capacity: number;
    occupied_places: number;
    is_locked: boolean; // true if reservation is disabled
    unlock_time?: string; // ISO timestamp (e.g., "2025-07-03T14:00:00Z")
};


export interface UserData{
    id: number;
    name: string;
    email: string;
    groupCode: string;
    is_admin: boolean;
    cabin_id: number;

}



export interface SendEmailResponse {
    email: string;
}

export interface RegisterResponse {
    token: string;
}