import { Slot } from '@textbus/core';
export declare function useActiveBlock(): (slot?: Slot | null) => {
    paragraph: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
    h4: boolean;
    h5: boolean;
    h6: boolean;
    orderedList: boolean;
    unorderedList: boolean;
    table: boolean;
    todolist: boolean;
    blockquote: boolean;
    sourceCode: boolean;
    highlightBox: boolean;
};
