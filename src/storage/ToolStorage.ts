export abstract class ToolStorage {
    abstract getItem<T>(PK: string, SK: string): Promise<T | null>;
    abstract createItem<T>(PK: string, SK: string, props: T): Promise<void>;
    abstract deleteItem(PK: string, SK: string): Promise<void>;
    abstract updateItem<T>(PK: string, SK: string, updateValues: T): Promise<void>;
    abstract query<T>(expression: any): Promise<Array<T>>;
    abstract scan<T>(expression: any): Promise<Array<T>>;
}
