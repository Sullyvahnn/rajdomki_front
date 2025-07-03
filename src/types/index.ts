export interface Cabin {
    id: number;
    name: string;
    capacity: number;
    occupied_places: number;
    is_locked: boolean;
    unlock_time: string | null;
    members: number[];
}


export interface GroupInfo {
    groupCode: string;
    members: string[];
}

export interface UserData{
    id: number;
    name: string;
    email: string;
    groupCode: string;
    is_admin: boolean;
}



export interface SendEmailResponse {
    email: string;
}

export interface RegisterResponse {
    token: string;
}