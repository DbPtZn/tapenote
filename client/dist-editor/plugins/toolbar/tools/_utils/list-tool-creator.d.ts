import { ListComponentExtends } from '@textbus/editor';
import { ComponentInstance, QueryState, Injector } from '@textbus/core';

export declare function listToolCreator(injector: Injector, type: 'ul' | 'ol'): {
    queryState(): QueryState<ComponentInstance<ListComponentExtends>>;
    onClick(): void;
    toParagraph(): void;
    toList(): void;
};
