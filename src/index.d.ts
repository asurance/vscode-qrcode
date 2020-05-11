export interface InMessageMap {
    Save: string;
}
export interface OutMessageMap {
    Text: string;
    Config: Configuration;
}
export type InMessageCB<T extends keyof InMessageMap> = (data: InMessageMap[T]) => void
export interface OutMessage<T extends keyof OutMessageMap> {
    type: T;
    data: OutMessageMap[T];
}
export interface Configuration {
    margin: number;
    width?: number;
    color: {
        dark: string;
        light: string;
    };
}