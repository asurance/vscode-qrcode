declare interface InMessageMap {
    Save: string;
}
declare interface OutMessageMap {
    Update: string;
}
declare type InMessageCB<T extends keyof InMessageMap> = (data: InMessageMap[T]) => void
declare interface OutMessage<T extends keyof OutMessageMap> {
    type: T;
    data: OutMessageMap[T];
}