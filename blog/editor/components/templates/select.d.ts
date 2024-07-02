export interface SelectOption {
    label: string;
    value: any;
}
export interface SelectConfig {
    items: SelectOption[];
    defaultValue: any;
}
export declare function useSelector(config: SelectConfig, callback: (current: SelectOption) => void): () => JSX.Element;
