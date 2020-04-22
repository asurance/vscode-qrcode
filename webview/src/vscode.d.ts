// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface MessageMap {

}
declare interface State {
    text: string;
}
declare interface Message<T extends keyof MessageMap> {
    type: T;
    data: MessageMap[T];
}
declare interface VSCode<T> {
    getState(): T | undefined;
    setState(state: T): void;
    postMessage<K extends keyof MessageMap>(message: Message<K>): void;
}
declare function acquireVsCodeApi(): VSCode<State>;