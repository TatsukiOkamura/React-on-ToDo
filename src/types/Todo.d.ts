export type Todo = {
    value: string
    readonly id: number;
    // 完了/未完了を示すプロパティ
    checked: boolean;
    //削除のプロパティ
    removed: boolean;
}