export type Connection = {
    id: string;
    _focused: boolean;
    activeDetailItem: ActiveDetailItem;
}

export type ActiveDetailItem = {
    sc_handler: SelfClientHandler;
}

export type SelfClientHandler = {
    id: string;
}

export type AppController = {
    connections: Connection[];
}

export type TSClientInternal = {
    saveJsonBlob(id: string, blob: string): void;
    getJsonBlob(id: string, callback: (error: any, blob: string) => void): void;
    setClientSelfVariables(id: string, options: { [key: string]: any }, unknown: boolean, callback: (e) => Promise<void>): void;
}
