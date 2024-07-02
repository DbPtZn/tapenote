import { QueryState, Formatter, Injector } from '@textbus/core';

export declare function colorToolCreator(injector: Injector, formatter: Formatter<any>): {
    useValue(value: any): void;
    queryState(): QueryState<any>;
};
