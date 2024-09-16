import { Component, ComponentStateLiteral, ContentType, Slot, Subject, Textbus } from '@textbus/core';
export interface Member {
    /** 头像 url */
    avatar: string;
    /** 成员名称 */
    name: string;
    /** 成员 id */
    id: string;
    /** 成员所属群组名 */
    groupName: string;
    /** 成员所属群组 id */
    groupId: string;
    /** 成员背景色 */
    color?: string;
}
export declare abstract class Organization {
    abstract getMembers(name?: string): Promise<Member[]>;
    abstract getMemberById(id: string): Promise<Member | null>;
}
export interface AtComponentState {
    userInfo?: Member;
    slot?: Slot;
}
export declare function registerAtShortcut(textbus: Textbus): void;
export declare class AtComponent extends Component<AtComponentState> {
    static componentName: string;
    static type: ContentType;
    static fromJSON(textbus: Textbus, { slot: slotState, userInfo }: ComponentStateLiteral<AtComponentState>): AtComponent;
    focus: Subject<boolean>;
    members: import("@viewfly/core").Signal<Member[]>;
    selectedIndex: import("@viewfly/core").Signal<number>;
    constructor(textbus: any, state?: AtComponentState);
    setup(): void;
}
