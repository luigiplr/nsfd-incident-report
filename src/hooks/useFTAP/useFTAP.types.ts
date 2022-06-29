export type Unit = {
    id: number;
    name: string;
    destination?: {
        codeName: string
        displayName: string
    }
    location?: {
        id: number;
        title: string;
    };
};