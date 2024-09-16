'use strict';

var jsxRuntime = require('@viewfly/core/jsx-runtime');
var scopedCss = require('@viewfly/scoped-css');
var core = require('@viewfly/core');
var core$1 = require('@textbus/core');
var platformBrowser = require('@textbus/platform-browser');
var platformBrowser$1 = require('@viewfly/platform-browser');
var hooks = require('@viewfly/hooks');
var highlightjs = require('highlight.js');
var Katex = require('katex');
var adapterViewfly = require('@textbus/adapter-viewfly');
var color = require('@tanbo/color');
var collaborate = require('@textbus/collaborate');

var scopedId$n = "vf-d94b56";

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

exports.DropdownService = class DropdownService {
    constructor() {
        this.siblingOpenEvent = new core$1.Subject();
        this.onSiblingOpen = this.siblingOpenEvent.asObservable();
    }
    notify(id) {
        this.siblingOpenEvent.next(id);
    }
};
exports.DropdownService = __decorate([
    core.Injectable({
        provideIn: 'root'
    }),
    __metadata("design:paramtypes", [])
], exports.DropdownService);

var DropdownContextService_1;
let i = 0;
exports.DropdownContextService = DropdownContextService_1 = class DropdownContextService {
    constructor(dropdownService, injector) {
        this.dropdownService = dropdownService;
        this.injector = injector;
        this.id = i;
        this.isOpen = false;
        this.canHide = true;
        this.openStateChangeEvent = new core$1.Subject();
        this.timer = null;
        this.parentDropdownContextService = this.injector.get(DropdownContextService_1, null, core.InjectFlags.SkipSelf);
        this.onOpenStateChange = this.openStateChangeEvent.asObservable();
        dropdownService.onSiblingOpen.subscribe(id => {
            if (id === this.id) {
                return;
            }
            this.isOpen = false;
            this.openStateChangeEvent.next(false);
        });
        i++;
    }
    open() {
        this.isOpen = true;
        clearTimeout(this.timer);
        this.timer = null;
        this.openStateChangeEvent.next(true);
        this.dropdownService.notify(this.id);
        if (this.parentDropdownContextService) {
            this.parentDropdownContextService.open();
        }
    }
    hide(delay = true) {
        if (!this.canHide) {
            return;
        }
        if (this.parentDropdownContextService) {
            this.parentDropdownContextService.hide();
        }
        if (delay) {
            this.timer = setTimeout(() => {
                this.isOpen = false;
                this.openStateChangeEvent.next(false);
            }, 200);
            return;
        }
        this.isOpen = false;
        this.openStateChangeEvent.next(false);
        if (this.parentDropdownContextService) {
            this.parentDropdownContextService.hide();
        }
    }
};
exports.DropdownContextService = DropdownContextService_1 = __decorate([
    core.Injectable(),
    __metadata("design:paramtypes", [exports.DropdownService,
        core.Injector])
], exports.DropdownContextService);

function Button(props) {
    const dropdownContextService = core.inject(exports.DropdownContextService, null);
    const isActive = core.createSignal((dropdownContextService === null || dropdownContextService === void 0 ? void 0 : dropdownContextService.isOpen) || false);
    if (dropdownContextService) {
        const subscription = dropdownContextService.onOpenStateChange.subscribe(b => {
            isActive.set(b);
        });
        core.onUnmounted(() => {
            subscription.unsubscribe();
        });
    }
    return scopedCss.withScopedCSS(scopedId$n, () => {
        return (jsxRuntime.jsxs("button", Object.assign({ type: "button" }, props, { class: [
                'btn',
                {
                    active: props.ordinary ? false : isActive(),
                    highlight: props.highlight
                },
                props.class
            ], children: [jsxRuntime.jsx("span", { children: props.children }), props.arrow && jsxRuntime.jsx("span", { class: ['btn-arrow', 'xnote-icon-arrow-bottom'] })] })));
    });
}

var scopedId$m = "vf-ac7e8d";

function ComponentToolbar(props) {
    return scopedCss.withScopedCSS(scopedId$m, () => {
        return (jsxRuntime.jsx("div", { class: "component-toolbar", style: props.style, children: jsxRuntime.jsx("div", { class: [
                    'toolbar',
                    {
                        active: props.visible
                    }
                ], style: props.innerStyle, children: props.children }) }));
    });
}

var scopedId$l = "vf-ede279";

function Divider() {
    return scopedCss.withScopedCSS(scopedId$l, () => {
        return jsxRuntime.jsx("div", { class: "divider" });
    });
}

var scopedId$k = "vf-90d534";

function DragResize(props) {
    const isShow = core.createSignal(false);
    const selection = core.inject(core$1.Selection);
    const docContainer = core.inject(platformBrowser.VIEW_CONTAINER);
    const component = props.component;
    const ref = core.createRef();
    const sub = selection.onChange.subscribe(() => {
        var _a;
        const index = (_a = component.parent) === null || _a === void 0 ? void 0 : _a.indexOf(component);
        if (selection.startSlot !== component.parent ||
            selection.endSlot !== component.parent ||
            selection.startOffset !== index ||
            selection.endOffset !== index + 1) {
            isShow.set(false);
            return;
        }
        isShow.set(true);
        const width = ref.current.offsetWidth;
        const height = ref.current.offsetHeight;
        mask.current.innerText = `${Math.round(width)}px * ${Math.round(height)}px`;
    });
    function selectComponent() {
        selection.selectComponent(component, true);
    }
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    const btnGroup = core.createRef();
    const mask = core.createRef();
    function drag(ev) {
        docContainer.style.pointerEvents = 'none';
        const ele = props.source.current;
        const startRect = ele.getBoundingClientRect();
        const startX = ev.clientX;
        const startY = ev.clientY;
        const startWidth = startRect.width;
        const startHeight = startRect.height;
        const startHypotenuse = Math.sqrt(startWidth * startWidth + startHeight * startHeight);
        let endWidth = startWidth;
        let endHeight = startHeight;
        const handlers = Array.from(btnGroup.current.children);
        const index = handlers.indexOf(ev.target);
        const unMove = core$1.fromEvent(document, 'mousemove').subscribe(ev => {
            const moveX = ev.clientX;
            const moveY = ev.clientY;
            const offsetX = moveX - startX;
            const offsetY = moveY - startY;
            let gainHypotenuse;
            let proportion;
            let sideX;
            let sideY;
            switch (index) {
                case 0:
                case 4:
                    sideX = startWidth + offsetX;
                    sideY = startHeight + offsetY;
                    gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY);
                    proportion = gainHypotenuse / startHypotenuse;
                    if (index === 0) {
                        proportion = 1 - (proportion - 1);
                    }
                    endWidth = startWidth * proportion;
                    endHeight = startHeight * proportion;
                    break;
                case 2:
                    sideX = startWidth + offsetX;
                    sideY = startHeight - offsetY;
                    gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY);
                    proportion = gainHypotenuse / startHypotenuse;
                    endWidth = startWidth * proportion;
                    endHeight = startHeight * proportion;
                    break;
                case 6:
                    sideX = startWidth - offsetX;
                    sideY = startHeight + offsetY;
                    gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY);
                    gainHypotenuse = Math.sqrt(sideX * sideX + sideY * sideY);
                    proportion = gainHypotenuse / startHypotenuse;
                    endWidth = startWidth * proportion;
                    endHeight = startHeight * proportion;
                    break;
                case 1:
                    endHeight = startHeight - offsetY;
                    break;
                case 5:
                    endHeight = startHeight + offsetY;
                    break;
                case 3:
                    endWidth = startWidth + offsetX;
                    break;
                case 7:
                    endWidth = startWidth - offsetX;
                    break;
            }
            ele.style.width = endWidth + 'px';
            ele.style.height = endHeight + 'px';
            mask.current.innerText = `${Math.round(endWidth)}px * ${Math.round(endHeight)}px`;
        });
        const unUp = core$1.fromEvent(document, 'mouseup').subscribe(() => {
            component.state.width = endWidth + 'px';
            component.state.height = endHeight + 'px';
            docContainer.style.pointerEvents = '';
            unMove.unsubscribe();
            unUp.unsubscribe();
        });
    }
    return scopedCss.withScopedCSS(scopedId$k, () => {
        return (jsxRuntime.jsxs("div", { class: "drag-resize", onClick: selectComponent, children: [jsxRuntime.jsx("div", { class: "container", ref: ref, children: props.children }), jsxRuntime.jsxs("div", { class: ['resize-tool', {
                            active: isShow()
                        }], children: [jsxRuntime.jsxs("div", { class: "mask", ref: mask, children: [component.state.width, "*", component.state.height] }), jsxRuntime.jsxs("div", { class: "btn-group", ref: btnGroup, onMousedown: drag, children: [jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" }), jsxRuntime.jsx("button", { type: "button" })] })] })] }));
    });
}

var scopedId$j = "vf-a99c5e";

var scopedId$i = "vf-8a05e9";

const DropdownMenuPortal = core.withAnnotation({
    providers: [
        exports.DropdownService
    ]
}, function DropdownMenuPortal(props) {
    const dropdownContextService = core.inject(exports.DropdownContextService);
    const container = core.inject(platformBrowser.VIEW_CONTAINER);
    const menuRef = core.createRef();
    let timer = null;
    const delay = 10;
    function update() {
        const menuElement = menuRef.current;
        menuElement.style.height = 'auto';
        const containerRect = container.getBoundingClientRect();
        if (props.abreast) {
            const btnEle = props.triggerRef.current;
            const screenHeight = document.documentElement.clientHeight;
            const menuHeight = menuElement.scrollHeight;
            const maxHeight = Math.min(screenHeight - 20, menuHeight);
            menuElement.style.height = maxHeight + 'px';
            const btnRect = btnEle.getBoundingClientRect();
            let offsetTop = btnRect.top - maxHeight / 2;
            if (offsetTop < 10) {
                offsetTop = 10;
            }
            else if (offsetTop + maxHeight > screenHeight - 10) {
                offsetTop = screenHeight - 10 - maxHeight;
            }
            menuElement.style.top = offsetTop - containerRect.top + 'px';
            const triggerRect = props.triggerRef.current.getBoundingClientRect();
            const leftDistance = triggerRect.left;
            const isToLeft = leftDistance >= menuElement.offsetWidth + 20;
            if (isToLeft && props.toLeft) {
                menuElement.style.left = leftDistance - menuElement.offsetWidth - 20 - containerRect.left + 'px';
                timer = setTimeout(() => {
                    menuElement.style.transform = 'translateX(10px)';
                    menuElement.style.opacity = '1';
                }, delay);
            }
            else {
                menuElement.style.left = triggerRect.right + 20 - containerRect.left + 'px';
                timer = setTimeout(() => {
                    menuElement.style.transform = 'translateX(-10px)';
                    menuElement.style.opacity = '1';
                }, delay);
            }
        }
        else {
            const triggerRect = props.triggerRef.current.getBoundingClientRect();
            const documentClientHeight = document.documentElement.clientHeight;
            const bottomDistance = documentClientHeight - triggerRect.bottom;
            const isToTop = bottomDistance < 200 && triggerRect.top > bottomDistance;
            menuElement.style.left = triggerRect.left - containerRect.left + 'px';
            if (isToTop) {
                const maxHeight = Math.max(menuElement.scrollHeight, menuElement.offsetHeight);
                const height = Math.min(triggerRect.top - 20, maxHeight, 400);
                menuElement.style.height = height + 'px';
                menuElement.style.top = triggerRect.top - 20 - height - containerRect.top + 'px';
                timer = setTimeout(() => {
                    menuElement.style.transform = 'translateY(10px)';
                    menuElement.style.opacity = '1';
                }, delay);
            }
            else {
                menuElement.style.height = Math.min(bottomDistance - 20, menuElement.scrollHeight) + 'px';
                menuElement.style.top = triggerRect.bottom + 20 - containerRect.top + 'px';
                timer = setTimeout(() => {
                    menuElement.style.transform = 'translateY(-10px)';
                    menuElement.style.opacity = '1';
                }, delay);
            }
        }
    }
    core.onUpdated(() => {
        update();
    });
    core.onUnmounted(() => {
        clearTimeout(timer);
    });
    function onEnter() {
        if (props.noTrigger) {
            return;
        }
        dropdownContextService.canHide = false;
        dropdownContextService.open();
    }
    function onLeave() {
        if (props.noTrigger) {
            return;
        }
        dropdownContextService.canHide = true;
        dropdownContextService.hide();
    }
    return platformBrowser$1.createPortal(scopedCss.withScopedCSS(scopedId$i, () => {
        return (jsxRuntime.jsx("div", { onMouseenter: onEnter, onMouseleave: onLeave, ref: menuRef, style: {
                width: props.width
            }, class: "dropdown-menu", children: jsxRuntime.jsx("div", { class: "dropdown-menu-content", style: {
                    padding: props.padding
                }, children: props.children }) }));
    }), container);
});

const Dropdown = core.withAnnotation({
    providers: [exports.DropdownContextService]
}, function Dropdown(props) {
    const isShow = core.createSignal(false);
    const dropdownContextService = core.inject(exports.DropdownContextService);
    const toggle = () => {
        if (dropdownContextService.isOpen) {
            dropdownContextService.hide(false);
        }
        else {
            dropdownContextService.open();
        }
    };
    const triggerRef = core.createRef();
    const dropdownRef = core.createRef();
    core.onMounted(() => {
        const sub = dropdownContextService.onOpenStateChange.subscribe(b => {
            var _a;
            (_a = props.onExpendStateChange) === null || _a === void 0 ? void 0 : _a.call(props, b);
            isShow.set(b);
        });
        return () => sub.unsubscribe();
    });
    const subscription = new core$1.Subscription();
    core.onMounted(() => {
        if (props.trigger === 'none') {
            return;
        }
        if (props.trigger === 'click') {
            subscription.add(core$1.fromEvent(triggerRef.current, 'click').subscribe(toggle));
            return;
        }
        let leaveSub;
        const bindLeave = function () {
            leaveSub = core$1.fromEvent(dropdownRef.current, 'mouseleave').subscribe(() => {
                dropdownContextService.hide();
            });
        };
        bindLeave();
        subscription.add(core$1.fromEvent(dropdownRef.current, 'mouseenter').subscribe(() => {
            if (leaveSub) {
                leaveSub.unsubscribe();
            }
            bindLeave();
            dropdownContextService.open();
        }));
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    return {
        isShow(b) {
            if (b) {
                dropdownContextService.open();
            }
            else {
                dropdownContextService.hide(false);
            }
        },
        $render: scopedCss.withScopedCSS(scopedId$j, () => {
            return (jsxRuntime.jsxs("div", { class: ['dropdown', props.class], style: props.style, ref: dropdownRef, children: [jsxRuntime.jsxs("div", { class: "dropdown-btn", ref: triggerRef, children: [jsxRuntime.jsx("div", { class: "dropdown-btn-inner", children: props.children }), jsxRuntime.jsx("div", { class: "dropdown-btn-arrow" })] }), isShow() && jsxRuntime.jsx(DropdownMenuPortal, { toLeft: props.toLeft, padding: props.padding, noTrigger: props.trigger === 'none', width: props.width, abreast: props.abreast, triggerRef: triggerRef, children: Array.isArray(props.menu) ?
                            props.menu.map(menu => {
                                return (jsxRuntime.jsx("div", { class: "dropdown-menu-item", onClick: () => {
                                        var _a;
                                        if (menu.disabled) {
                                            return;
                                        }
                                        (_a = props.onCheck) === null || _a === void 0 ? void 0 : _a.call(props, menu.value);
                                    }, children: menu.label }));
                            }) :
                            props.menu })] }));
        })
    };
});

var scopedId$h = "vf-c32a7b";

function Keymap(props) {
    const arr = [];
    const keymap = props.keymap;
    if (keymap.ctrlKey) {
        arr.push(platformBrowser.isMac() ? jsxRuntime.jsx("span", { class: "xnote-icon-command" }) : jsxRuntime.jsx("span", { children: "Ctrl" }));
    }
    if (keymap.shiftKey) {
        if (arr.length) {
            arr.push('+');
        }
        arr.push(platformBrowser.isMac() ? jsxRuntime.jsx("span", { class: "xnote-icon-shift" }) : jsxRuntime.jsx("span", { children: "Shift" }));
    }
    if (keymap.altKey) {
        if (arr.length) {
            arr.push('+');
        }
        arr.push(platformBrowser.isMac() ? jsxRuntime.jsx("span", { class: "xnote-icon-opt" }) : jsxRuntime.jsx("span", { children: "Alt" }));
    }
    if (keymap.key) {
        if (arr.length) {
            arr.push('+');
        }
        if (Array.isArray(keymap.key)) {
            arr.push(jsxRuntime.jsx("span", { children: keymap.key.join('/') }));
        }
        else {
            arr.push(jsxRuntime.jsx("span", { children: keymap.key }));
        }
    }
    return scopedCss.withScopedCSS(scopedId$h, () => {
        return (jsxRuntime.jsx("span", { class: "keymap", children: arr }));
    });
}

var scopedId$g = "vf-acaa5f";

function MenuHeading(props) {
    return scopedCss.withScopedCSS(scopedId$g, () => {
        return (jsxRuntime.jsx("div", { class: "menu-heading", children: props.children }));
    });
}

var scopedId$f = "vf-c3b9dc";

function MenuItem(props) {
    const dropdownContextService = core.inject(exports.DropdownContextService, null);
    const isActive = core.createSignal((dropdownContextService === null || dropdownContextService === void 0 ? void 0 : dropdownContextService.isOpen) || false);
    if (dropdownContextService) {
        const subscription = dropdownContextService.onOpenStateChange.subscribe(b => {
            isActive.set(b);
        });
        core.onUnmounted(() => {
            subscription.unsubscribe();
        });
    }
    function click() {
        var _a;
        if (props.disabled) {
            return;
        }
        (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, props.value);
    }
    return scopedCss.withScopedCSS(scopedId$f, () => {
        return (jsxRuntime.jsxs("div", { class: ['menu-item', { disabled: props.disabled, active: props.arrow && isActive() }], onClick: click, children: [jsxRuntime.jsxs("div", { class: "menu-item-content", children: [jsxRuntime.jsxs("div", { children: [props.icon && jsxRuntime.jsx("span", { class: "menu-icon", children: props.icon }), props.children] }), jsxRuntime.jsx("div", { children: props.desc })] }), props.arrow ?
                    jsxRuntime.jsx("div", { class: "arrow", children: jsxRuntime.jsx("span", { class: "xnote-icon-arrow-right" }) }) :
                    jsxRuntime.jsx("div", { class: [
                            'menu-check',
                            { checked: props.checked }
                        ], children: jsxRuntime.jsx("span", { class: "xnote-icon-checkmark" }) })] }));
    });
}

var scopedId$e = "vf-a23c47";

function Popup(props) {
    const host = core.inject(platformBrowser.VIEW_CONTAINER);
    return platformBrowser$1.createPortal(scopedCss.withScopedCSS(scopedId$e, () => {
        return (jsxRuntime.jsx("div", { class: "popup", style: {
                left: props.left + 'px',
                top: props.top + 'px'
            }, children: props.children }));
    }), host);
}

var scopedId$d = "vf-216815";

function ToolbarItem(props) {
    return scopedCss.withScopedCSS(scopedId$d, () => {
        return (jsxRuntime.jsx("div", { class: "toolbar-item", children: props.children }));
    });
}

var scopedId$c = "vf-2a8a65";

exports.RefreshService = class RefreshService {
    constructor() {
        this.onRefresh = new core$1.Subject();
    }
};
exports.RefreshService = __decorate([
    core.Injectable()
], exports.RefreshService);

const textAlignAttr = new core$1.Attribute('textAlign', {
    render(node, formatValue) {
        node.styles.set('text-align', formatValue);
    }
});
const textAlignAttrLoader = {
    match(element) {
        return !!element.style.textAlign;
    },
    read(element) {
        return {
            attribute: textAlignAttr,
            value: element.style.textAlign
        };
    }
};
function registerTextAlignShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    const commander = textbus.get(core$1.Commander);
    keyboard.addShortcut({
        keymap: {
            key: 'lrej'.split(''),
            ctrlKey: true
        },
        action(key) {
            const valueMap = {
                l: 'left',
                r: 'right',
                e: 'center',
                j: 'justify'
            };
            commander.applyAttribute(textAlignAttr, valueMap[key]);
        }
    });
}

function useReadonly() {
    const controller = core.inject(core$1.Controller);
    const is = core.createSignal(controller.readonly);
    controller.onReadonlyStateChange.subscribe(() => {
        is.set(controller.readonly);
    });
    return is;
}

const OutputInjectionToken = new core.InjectionToken('OutputInjectionToken');

function useOutput() {
    return core.createSignal(core.inject(OutputInjectionToken));
}

const headingAttr = new core$1.Attribute('Heading', {
    render(node, formatValue) {
        node.classes.add('xnote-' + formatValue);
    }
});
const headingAttrLoader = {
    match(element) {
        return /H[1-6]/.test(element.tagName) || /(^|\s)xnote-h[1-6](\s|$)/.test(element.className);
    },
    read(element) {
        if (/H[1-6]/.test(element.tagName)) {
            return {
                attribute: headingAttr,
                value: element.tagName.toLowerCase()
            };
        }
        return {
            attribute: headingAttr,
            value: element.className.substring(6)
        };
    }
};
function registerHeadingShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    const commander = textbus.get(core$1.Commander);
    const selection = textbus.get(core$1.Selection);
    keyboard.addShortcut({
        keymap: {
            key: '0123456'.split(''),
            ctrlKey: true
        },
        action(key) {
            if (key === '0') {
                commander.unApplyAttribute(headingAttr);
                return;
            }
            commander.applyAttribute(headingAttr, 'h' + key);
        }
    });
    keyboard.addZenCodingInterceptor({
        match(content) {
            return /^#{1,6}$/.test(content);
        },
        try(key) {
            return key === ' ';
        },
        action(content) {
            if (selection.commonAncestorComponent instanceof SourceCodeComponent) {
                return false;
            }
            const commonAncestorSlot = selection.commonAncestorSlot;
            commonAncestorSlot.cut();
            commander.applyAttribute(headingAttr, 'h' + content.length);
            selection.setPosition(commonAncestorSlot, 0);
            return true;
        }
    });
}

function useBlockContent(slot) {
    const textbus = core$1.useContext();
    const selection = textbus.get(core$1.Selection);
    core$1.onBreak(ev => {
        if (typeof slot === 'function' ? slot(ev.target) : ev.target === slot) {
            const p = new ParagraphComponent(textbus);
            ev.target.insert(p);
            selection.setPosition(p.state.slot, 0);
            ev.preventDefault();
        }
    });
    core$1.onContentInsert(ev => {
        if ((typeof slot === 'function' ? slot(ev.target) : ev.target === slot) &&
            (typeof ev.data.content === 'string' || ev.data.content.type !== core$1.ContentType.BlockComponent)) {
            const p = new ParagraphComponent(textbus);
            const childSlot = p.state.slot;
            childSlot.insert(ev.data.content);
            ev.target.insert(p);
            selection.setPosition(childSlot, childSlot.index);
            ev.preventDefault();
        }
    });
}

function SlotRender(props) {
    const adaper = core.inject(platformBrowser.DomAdapter);
    const instance = core.getCurrentInstance();
    const sub = props.slot.__changeMarker__.onChange.subscribe(() => {
        instance.markAsDirtied();
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return () => {
        const { slot, tag = 'div', renderEnv = false, elRef, elKey } = props, rest = __rest(props, ["slot", "tag", "renderEnv", "elRef", "elKey"]);
        return adaper.slotRender(slot, children => {
            return core$1.createVNode(tag, Object.assign({ ref: elRef, key: elKey }, rest), children);
        }, renderEnv);
    };
}

class BlockquoteComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        const slot = textbus.get(core$1.Registry).createSlot(json.slot);
        return new BlockquoteComponent(textbus, {
            slot
        });
    }
    constructor(textbus, state = {
        slot: new core$1.Slot([
            core$1.ContentType.BlockComponent
        ])
    }) {
        super(textbus, state);
    }
    setup() {
        useBlockContent(this.state.slot);
    }
}
BlockquoteComponent.type = core$1.ContentType.BlockComponent;
BlockquoteComponent.componentName = 'BlockquoteComponent';
BlockquoteComponent.zenCoding = {
    key: ' ',
    match(content, textbus) {
        const selection = textbus.get(core$1.Selection);
        if (selection.commonAncestorComponent instanceof ParagraphComponent) {
            return /^>$/.test(content);
        }
        return false;
    },
    createState(_, textbus) {
        const selection = textbus.get(core$1.Selection);
        const commonAncestorSlot = selection.commonAncestorSlot;
        const slot = new core$1.Slot([
            core$1.ContentType.BlockComponent
        ]);
        if (commonAncestorSlot === null || commonAncestorSlot === void 0 ? void 0 : commonAncestorSlot.hasAttribute(textIndentAttr)) {
            slot.setAttribute(textIndentAttr, commonAncestorSlot.getAttribute(textIndentAttr));
        }
        return {
            slot
        };
    }
};
function toBlockquote(textbus) {
    const query = textbus.get(core$1.Query);
    const commander = textbus.get(core$1.Commander);
    const selection = textbus.get(core$1.Selection);
    const state = query.queryComponent(BlockquoteComponent);
    if (state.state === core$1.QueryStateType.Enabled) {
        const current = state.value;
        const parent = current.parent;
        const index = parent.indexOf(current);
        parent.retain(index);
        commander.removeComponent(current);
        current.__slots__.get(0).sliceContent().forEach(i => {
            parent.insert(i);
        });
    }
    else {
        const block = new BlockquoteComponent(textbus);
        const slot = block.state.slot;
        if (selection.startSlot === selection.endSlot) {
            const parentComponent = selection.startSlot.parent;
            const parentSlot = parentComponent.parent;
            const position = parentSlot.indexOf(parentComponent);
            slot.insert(parentComponent);
            parentSlot.retain(position);
            parentSlot.insert(block);
        }
        else {
            const commonAncestorSlot = selection.commonAncestorSlot;
            const scope = selection.getCommonAncestorSlotScope();
            commonAncestorSlot.cut(scope.startOffset, scope.endOffset).sliceContent().forEach(i => {
                slot.insert(i);
            });
            commonAncestorSlot.retain(scope.startOffset);
            commonAncestorSlot.insert(block);
        }
    }
}
function registerBlockquoteShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            ctrlKey: true,
            key: '\''
        },
        action() {
            toBlockquote(textbus);
        }
    });
}
function BlockquoteView(props) {
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const slot = props.component.state.slot;
        return (jsxRuntime.jsx("blockquote", { class: "xnote-blockquote", ref: props.rootRef, "data-component": props.component.name, children: jsxRuntime.jsx(SlotRender, { slot: slot, renderEnv: readonly() || output() }) }));
    };
}
const blockquoteComponentLoader = {
    match(element, returnableContentTypes) {
        return returnableContentTypes.includes(core$1.ContentType.BlockComponent) && element.tagName === 'BLOCKQUOTE';
    },
    read(element, textbus, slotParser) {
        const delta = slotParser(new core$1.Slot([
            core$1.ContentType.BlockComponent,
            core$1.ContentType.InlineComponent,
            core$1.ContentType.Text
        ]), element).toDelta();
        const slot = new core$1.Slot([
            core$1.ContentType.BlockComponent,
        ]);
        deltaToBlock(delta, textbus).forEach(i => {
            slot.insert(i);
        });
        return new BlockquoteComponent(textbus, {
            slot
        });
    },
};

class HighlightBoxComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        return new HighlightBoxComponent(textbus, {
            type: json.type,
            slot: textbus.get(core$1.Registry).createSlot(json.slot)
        });
    }
    constructor(textbus, state = {
        type: '',
        slot: new core$1.Slot([
            core$1.ContentType.BlockComponent,
        ])
    }) {
        super(textbus, state);
    }
    setup() {
        useBlockContent(this.state.slot);
    }
}
HighlightBoxComponent.defaultTypes = ['❤️', '💡', '📌', '✅', '❎', '👍', '🎉', '🚫', '❗'];
HighlightBoxComponent.componentName = 'HighlightBoxComponent';
HighlightBoxComponent.type = core$1.ContentType.BlockComponent;
function HighlightBoxView(props) {
    const readonly = useReadonly();
    const output = useOutput();
    const emoji = [];
    for (let i = 0x1F600; i <= 0x1F64F; i++) {
        emoji.push(i);
    }
    const dropdownRef = core.createRef();
    function setType(type) {
        var _a;
        (_a = dropdownRef.current) === null || _a === void 0 ? void 0 : _a.isShow(false);
        props.component.state.type = type;
    }
    return () => {
        const { state, name } = props.component;
        if (readonly() || output()) {
            return (jsxRuntime.jsxs("div", { "data-component": name, ref: props.rootRef, "data-icon": state.type, class: "xnote-highlight-box", children: [jsxRuntime.jsx("div", { class: "xnote-highlight-box-left", children: jsxRuntime.jsx("div", { class: "xnote-highlight-box-icon", children: jsxRuntime.jsx("button", { type: "button", children: state.type || '❤️' }) }) }), jsxRuntime.jsx(SlotRender, { slot: state.slot, class: 'xnote-highlight-box-content', renderEnv: readonly() || output() })] }));
        }
        return (jsxRuntime.jsxs("div", { "data-component": name, ref: props.rootRef, "data-icon": state.type, class: "xnote-highlight-box", children: [jsxRuntime.jsx("div", { class: "xnote-highlight-box-left", children: jsxRuntime.jsx(Dropdown, { trigger: "click", ref: dropdownRef, width: "282px", menu: jsxRuntime.jsxs("div", { class: "xnote-highlight-box-icons", children: [jsxRuntime.jsx("div", { class: "xnote-highlight-box-heading", children: "\u5E38\u7528" }), HighlightBoxComponent.defaultTypes.map(icon => {
                                    return (jsxRuntime.jsx("button", { onClick: () => setType(icon), type: "button", children: icon }));
                                }), jsxRuntime.jsx("div", { class: "xnote-highlight-box-heading", children: "\u66F4\u591A" }), emoji.map(i => {
                                    const icon = String.fromCodePoint(i);
                                    return (jsxRuntime.jsx("button", { onClick: () => setType(icon), type: "button", children: icon }));
                                })] }), children: jsxRuntime.jsx("div", { class: "xnote-highlight-box-icon", children: jsxRuntime.jsx("button", { type: "button", children: state.type || '❤️' }) }) }) }), jsxRuntime.jsx(SlotRender, { slot: state.slot, class: 'xnote-highlight-box-content', renderEnv: readonly() || output() })] }));
    };
}
const highlightBoxComponentLoader = {
    match(element) {
        return element.tagName === 'DIV' && element.dataset.component === HighlightBoxComponent.componentName;
    },
    read(element, textbus, slotParser) {
        const delta = slotParser(new core$1.Slot([
            core$1.ContentType.BlockComponent,
            core$1.ContentType.InlineComponent,
            core$1.ContentType.Text
        ]), element.querySelector('.xnote-highlight-box-content')).toDelta();
        const slot = new core$1.Slot([
            core$1.ContentType.BlockComponent,
        ]);
        deltaToBlock(delta, textbus).forEach(i => {
            slot.insert(i);
        });
        return new HighlightBoxComponent(textbus, {
            type: element.dataset.icon || '',
            slot
        });
    }
};

class ParagraphComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        const slot = textbus.get(core$1.Registry).createSlot(json.slot);
        return new ParagraphComponent(textbus, {
            slot
        });
    }
    constructor(textbus, state = {
        slot: new core$1.Slot([
            core$1.ContentType.InlineComponent,
            core$1.ContentType.Text
        ])
    }) {
        super(textbus, state);
    }
    setup() {
        const injector = core$1.useContext();
        const commander = injector.get(core$1.Commander);
        const selection = injector.get(core$1.Selection);
        core$1.onBreak(ev => {
            const isEmpty = this.state.slot.isEmpty;
            const afterSlot = ev.target.cut(ev.data.index);
            afterSlot.removeAttribute(headingAttr);
            const nextParagraph = new ParagraphComponent(injector, {
                slot: afterSlot
            });
            if (isEmpty && (this.parentComponent instanceof BlockquoteComponent ||
                this.parentComponent instanceof HighlightBoxComponent)) {
                commander.insertAfter(nextParagraph, this.parentComponent);
                commander.removeComponent(this);
            }
            else {
                commander.insertAfter(nextParagraph, this);
            }
            selection.setPosition(afterSlot, 0);
            ev.preventDefault();
        });
    }
}
ParagraphComponent.componentName = 'ParagraphComponent';
ParagraphComponent.type = core$1.ContentType.BlockComponent;
function ParagraphView(props) {
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const slot = props.component.state.slot;
        return (jsxRuntime.jsx("div", { class: "xnote-paragraph", ref: props.rootRef, "data-component": ParagraphComponent.componentName, children: jsxRuntime.jsx(SlotRender, { tag: "div", slot: slot, renderEnv: readonly() || output() }) }));
    };
}
const paragraphComponentLoader = {
    match(element, returnableContentTypes) {
        return returnableContentTypes.includes(core$1.ContentType.BlockComponent) && (element.dataset.component === ParagraphComponent.componentName || /^P|H[1-6]$/.test(element.tagName));
    },
    read(element, textbus, slotParser) {
        let content;
        if (/^P|H[1-6]$/.test(element.tagName)) {
            content = element;
        }
        else {
            content = element.children[0];
            if (!content) {
                const p = document.createElement('p');
                p.append(element.innerText);
                content = p;
            }
        }
        const delta = slotParser(new core$1.Slot([
            core$1.ContentType.Text,
            core$1.ContentType.InlineComponent,
            core$1.ContentType.BlockComponent
        ]), content).toDelta();
        const results = deltaToBlock(delta, textbus);
        if (results.length === 1) {
            return results[0];
        }
        const containerSlot = new core$1.Slot([
            core$1.ContentType.BlockComponent
        ]);
        results.forEach(item => {
            containerSlot.insert(item);
        });
        return containerSlot;
    }
};
function deltaToBlock(delta, textbus) {
    const results = [];
    let slot = null;
    for (const item of delta) {
        if (typeof item.insert === 'string' || item.insert.type === core$1.ContentType.InlineComponent) {
            if (!slot) {
                slot = new core$1.Slot([
                    core$1.ContentType.InlineComponent,
                    core$1.ContentType.Text
                ]);
                delta.attributes.forEach((value, key) => {
                    slot.setAttribute(key, value);
                });
                results.push(new ParagraphComponent(textbus, {
                    slot
                }));
            }
            slot.insert(item.insert, item.formats);
        }
        else {
            results.push(item.insert);
            slot = null;
        }
    }
    return results;
}

const languageList = [{
        label: 'JavaScript',
        value: 'JavaScript',
    }, {
        label: 'HTML',
        value: 'HTML',
    }, {
        label: 'CSS',
        value: 'CSS',
    }, {
        label: 'TypeScript',
        value: 'TypeScript',
    }, {
        label: 'Java',
        value: 'Java',
    }, {
        label: 'C',
        value: 'C',
    }, {
        label: 'C++',
        value: 'CPP',
    }, {
        label: 'C#',
        value: 'CSharp',
    }, {
        label: 'Swift',
        value: 'Swift',
    }, {
        label: 'Go',
        value: 'Go'
    }, {
        label: 'Kotlin',
        value: 'kotlin'
    }, {
        label: 'Python',
        value: 'python'
    }, {
        label: 'PHP',
        value: 'php'
    }, {
        label: 'JSON',
        value: 'JSON',
    }, {
        label: 'Less',
        value: 'Less',
    }, {
        label: 'SCSS',
        value: 'SCSS',
    }, {
        label: 'Stylus',
        value: 'Stylus',
    }, {
        label: 'Tsx/Jsx',
        value: 'Tsx',
    }, {
        label: 'XML',
        value: 'xml',
    }, {
        label: 'Markdown',
        value: 'markdown',
    }, {
        label: 'Shell',
        value: 'shell',
    }, {
        label: 'Katex',
        value: 'latex',
    }, {
        label: 'Yaml',
        value: 'yaml',
    }, {
        label: 'Sql',
        value: 'sql',
    }, {
        label: 'Ruby',
        value: 'ruby',
    }, {
        label: 'Nginx',
        value: 'nginx',
    }, {
        label: 'Dockerfile',
        value: 'dockerfile',
    }, {
        label: 'Dart',
        value: 'dart',
    }, {
        label: 'Rust',
        value: 'rust',
    }, {
        label: '',
        value: '',
    }];
const sourceCodeThemes = [
    'xnote-dark',
    'xnote-dark-blue',
    'github',
    'atom-one-dark',
    'foundation',
    'stackoverflow-light',
    'vs2015',
    'xcode',
    'intellij-light',
    'idea'
];
function createCodeSlot() {
    return {
        slot: new core$1.Slot([core$1.ContentType.Text]),
        emphasize: false
    };
}
class SourceCodeComponent extends core$1.Component {
    constructor() {
        super(...arguments);
        this.focus = new core$1.BehaviorSubject(false);
        this.cancelEmphasize = () => {
            const selection = this.textbus.get(core$1.Selection);
            const slots = this.state.slots;
            const { startSlot, endSlot } = selection;
            let startIndex = slots.findIndex(i => i.slot === startSlot);
            const endIndex = slots.findIndex(i => i.slot === endSlot) + 1;
            for (; startIndex < endIndex; startIndex++) {
                slots[startIndex].emphasize = false;
            }
        };
        this.emphasize = () => {
            const selection = this.textbus.get(core$1.Selection);
            const slots = this.state.slots;
            const { startSlot, endSlot } = selection;
            let startIndex = slots.findIndex(i => i.slot === startSlot);
            const endIndex = slots.findIndex(i => i.slot === endSlot) + 1;
            for (; startIndex < endIndex; startIndex++) {
                slots[startIndex].emphasize = true;
            }
        };
    }
    static fromJSON(textbus, json) {
        const registry = textbus.get(core$1.Registry);
        return new SourceCodeComponent(textbus, {
            slots: json.slots.map(item => {
                return {
                    slot: registry.createSlot(item.slot),
                    emphasize: item.emphasize
                };
            }),
            autoBreak: json.autoBreak,
            lang: json.lang,
            lineNumber: json.lineNumber,
            theme: json.theme
        });
    }
    setup() {
        const textbus = core$1.useContext();
        const selection = core$1.useContext(core$1.Selection);
        core$1.onBreak(ev => {
            const slots = this.state.slots;
            const parentComponent = selection.commonAncestorComponent;
            const parentSlot = parentComponent.parent;
            if (parentSlot && ev.target.isEmpty && ev.target === slots[slots.length - 1].slot) {
                const prevSlot = slots[slots.length - 2];
                if (prevSlot === null || prevSlot === void 0 ? void 0 : prevSlot.slot.isEmpty) {
                    const slot = new core$1.Slot([
                        core$1.ContentType.InlineComponent,
                        core$1.ContentType.Text
                    ]);
                    const paragraph = new ParagraphComponent(textbus, {
                        slot
                    });
                    const index = parentSlot.indexOf(parentComponent);
                    parentSlot.retain(index + 1);
                    slots.pop();
                    if (slots.length > 1) {
                        const ref = slots.find(i => {
                            return i.slot === (prevSlot === null || prevSlot === void 0 ? void 0 : prevSlot.slot);
                        });
                        const index = slots.indexOf(ref);
                        slots.splice(index, 1);
                    }
                    parentSlot.insert(paragraph);
                    textbus.nextTick(() => {
                        selection.setPosition(slot, 0);
                    });
                    ev.preventDefault();
                    return;
                }
            }
            const nextSlot = ev.target.cut(ev.data.index);
            const ref = slots.find(i => i.slot === ev.target);
            const index = slots.indexOf(ref);
            slots.splice(index + 1, 0, { slot: nextSlot, emphasize: (ref === null || ref === void 0 ? void 0 : ref.emphasize) || false });
            textbus.nextTick(() => {
                selection.setPosition(nextSlot, 0);
            });
            ev.preventDefault();
        });
        core$1.onPaste(ev => {
            const codeList = [];
            const sourceCode = ev.data.text;
            let str = '';
            let isBreak = true;
            for (let i = 0; i < sourceCode.length; i++) {
                const char = sourceCode[i];
                if (char === '\r') {
                    if (sourceCode[i + 1] === '\n') {
                        i++;
                    }
                    if (str) {
                        codeList.push(str);
                        str = '';
                    }
                    if (!isBreak) {
                        codeList.push('');
                    }
                    else {
                        isBreak = false;
                    }
                }
                else if (char === '\n') {
                    if (str) {
                        codeList.push(str);
                        str = '';
                    }
                    if (!isBreak) {
                        codeList.push('');
                    }
                    else {
                        isBreak = false;
                    }
                }
                else {
                    isBreak = true;
                    str += char;
                }
            }
            if (str) {
                codeList.push(str);
            }
            const firstCode = codeList.shift();
            const target = ev.target;
            if (firstCode) {
                target.insert(firstCode);
            }
            const slots = this.state.slots;
            const index = slots.findIndex(i => i.slot === target);
            if (codeList.length) {
                const slotList = codeList.map(i => {
                    const item = createCodeSlot();
                    item.slot.insert(i);
                    return item;
                });
                slots.splice(index + 1, 0, ...slotList);
                const last = slotList[slotList.length - 1];
                selection.setPosition(last.slot, last.slot.length);
            }
            else {
                selection.setPosition(target, target.index);
            }
            ev.preventDefault();
        });
        core$1.onFocus(() => {
            this.focus.next(true);
        });
        core$1.onBlur(() => {
            this.focus.next(false);
        });
        const commander = core$1.useContext(core$1.Commander);
        core$1.useDynamicShortcut({
            keymap: {
                key: 'Tab'
            },
            action() {
                if (selection.isCollapsed) {
                    commander.insert('  ');
                    return;
                }
                const blocks = selection.getBlocks();
                blocks.forEach(block => {
                    block.slot.retain(0);
                    block.slot.insert('  ');
                });
                selection.setBaseAndExtent(selection.anchorSlot, selection.anchorOffset + 2, selection.focusSlot, selection.focusOffset + 2);
            }
        });
        core$1.useDynamicShortcut({
            keymap: {
                key: 'Tab',
                shiftKey: true
            },
            action() {
                const blocks = selection.getBlocks();
                blocks.forEach(block => {
                    if (block.slot.sliceContent(0, 2)[0] === '  ') {
                        block.slot.retain(0);
                        block.slot.delete(2);
                        if (block.slot === selection.anchorSlot) {
                            selection.setAnchor(block.slot, selection.anchorOffset - 2);
                        }
                        if (block.slot === selection.focusSlot) {
                            selection.setFocus(block.slot, selection.focusOffset - 2);
                        }
                    }
                });
            }
        });
    }
    removeSlot(slot) {
        const slots = this.state.slots;
        const index = slots.findIndex(i => i.slot === slot);
        if (index > -1) {
            slots.splice(index, 1);
            return true;
        }
        return false;
    }
}
SourceCodeComponent.type = core$1.ContentType.BlockComponent;
SourceCodeComponent.componentName = 'SourceCodeComponent';
SourceCodeComponent.zenCoding = {
    key: ['Enter', ' '],
    match(c, textbus) {
        const selection = textbus.get(core$1.Selection);
        if (selection.commonAncestorComponent instanceof ParagraphComponent) {
            const matchString = languageList.map(i => i.label || i.value).concat('js', 'ts').join('|').replace(/\+/, '\\+');
            const reg = new RegExp(`^\`\`\`(${matchString})$`, 'i');
            return reg.test(c);
        }
        return false;
    },
    createState(content) {
        const matchString = content.replace(/`/g, '').replace(/\+/, '\\+');
        for (const item of languageList) {
            const reg = new RegExp(`^${matchString}$`, 'i');
            if (reg.test(item.label || item.value)) {
                return {
                    lang: item.value,
                    theme: '',
                    lineNumber: true,
                    slots: [createCodeSlot()]
                };
            }
        }
        if (/^js$/i.test(matchString)) {
            return {
                lang: 'JavaScript',
                theme: '',
                lineNumber: true,
                slots: [createCodeSlot()]
            };
        }
        if (/^ts$/i.test(matchString)) {
            return {
                lang: 'TypeScript',
                theme: '',
                lineNumber: true,
                slots: [createCodeSlot()]
            };
        }
        return {
            lang: '',
            theme: '',
            lineNumber: true,
            slots: [createCodeSlot()]
        };
    }
};
function SourceCodeView(props) {
    const adapter = core.inject(platformBrowser.DomAdapter);
    const isFocus = core.createSignal(false);
    const subscription = props.component.focus.subscribe(b => {
        isFocus.set(b);
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    const state = props.component.state;
    function changeLang(lang) {
        state.lang = lang;
    }
    function changeTheme(theme) {
        state.theme = theme;
    }
    function setting(v) {
        switch (v) {
            case 'lineNumber':
                state.lineNumber = !state.lineNumber;
                break;
            case 'autoBreak':
                state.autoBreak = !state.autoBreak;
                break;
        }
    }
    const input = core.inject(platformBrowser.Input);
    function updateCaret() {
        input.caret.refresh();
    }
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const state = props.component.state;
        const slots = state.slots;
        let lang = '';
        languageList.forEach(i => {
            if (i.value === state.lang) {
                lang = i.label;
            }
        });
        const blockHighlight = slots.some(i => i.emphasize);
        const results = [];
        if (state.lang) {
            const str = slots.map(item => {
                const slot = item.slot;
                return (slot.isEmpty ? '' : slot.toString()) + '\n';
            }).join('');
            const highlightResult = highlightjs.highlight(state.lang, str);
            const dom = new DOMParser().parseFromString(highlightResult.value.replace(/\n/g, '<br>'), 'text/html').body;
            const range = new Range();
            range.selectNodeContents(dom);
            const brs = Array.from(dom.querySelectorAll('br'));
            while (brs.length) {
                const br = brs.shift();
                range.setEndBefore(br);
                results.push(range.extractContents());
                range.setStartAfter(br);
                if (!brs.length) {
                    range.selectNodeContents(dom);
                    range.setStartAfter(br);
                    results.push(range.extractContents());
                }
            }
        }
        return (jsxRuntime.jsxs("div", { ref: props.rootRef, class: {
                'xnote-source-code': true,
                'xnote-source-code-line-number': state.lineNumber,
                [state.theme || 'github']: true
            }, "data-lang": state.lang, "data-component": props.component.name, "data-auto-break": state.autoBreak + '', "data-theme": state.theme || null, "data-line-number": state.lineNumber + '', children: [(!readonly() && !output()) && jsxRuntime.jsxs(ComponentToolbar, { visible: isFocus(), children: [jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(Dropdown, { onCheck: changeLang, trigger: 'hover', menu: languageList.map(item => {
                                    return {
                                        label: jsxRuntime.jsx(MenuItem, { checked: state.lang === item.value, children: item.label || 'Plain Text' }),
                                        value: item.value
                                    };
                                }), children: jsxRuntime.jsx(Button, { arrow: true, children: lang || 'Plain Text' }) }) }), jsxRuntime.jsxs(ToolbarItem, { children: ["\u4E3B\u9898\uFF1A", jsxRuntime.jsx(Dropdown, { trigger: 'hover', onCheck: changeTheme, menu: sourceCodeThemes.map(item => {
                                        return {
                                            label: jsxRuntime.jsx(MenuItem, { checked: state.theme === item, children: item }),
                                            value: item
                                        };
                                    }), children: jsxRuntime.jsx(Button, { arrow: true, children: state.theme || 'github' }) })] }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(Dropdown, { onCheck: setting, menu: [
                                    {
                                        label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-list-numbered" }), checked: state.lineNumber, children: "\u884C\u53F7" }),
                                        value: 'lineNumber'
                                    }, {
                                        label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-text-wrap" }), checked: state.autoBreak, children: "\u81EA\u52A8\u6362\u884C" }),
                                        value: 'autoBreak'
                                    }
                                ], children: jsxRuntime.jsx(Button, { arrow: true, children: "\u8BBE\u7F6E" }) }) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(Button, { onClick: props.component.emphasize, children: "\u5F3A\u8C03" }) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(Button, { onClick: props.component.cancelEmphasize, children: "\u53D6\u6D88\u5F3A\u8C03" }) })] }), jsxRuntime.jsxs("div", { class: [
                        'xnote-source-code-container',
                        {
                            'hljs': true,
                            'xnote-source-code-auto-break': state.autoBreak
                        }
                    ], children: [jsxRuntime.jsx("div", { class: "xnote-source-code-line-number-bg", style: {
                                width: Math.max(String(slots.length).length, 2.5) + 'em'
                            } }), jsxRuntime.jsx("pre", { onScroll: updateCaret, class: {
                                'xnote-source-code-content': true,
                                'xnote-source-code-content-highlight': blockHighlight
                            }, style: {
                                'padding-left': Math.max(String(slots.length).length, 2.5) + 'em',
                                'margin-left': -Math.max(String(slots.length).length, 2.5) + 'em'
                            }, children: slots.map(item => {
                                return adapter.slotRender(item.slot, (children) => {
                                    if (state.lang) {
                                        const nodes = Array.from(results.shift().childNodes);
                                        children = nodesToVNodes(item.slot, nodes, 0);
                                        if (!children.length) {
                                            const br = core$1.createVNode('br');
                                            br.location = {
                                                slot: item.slot,
                                                startIndex: 0,
                                                endIndex: 1
                                            };
                                            children.push(br);
                                        }
                                    }
                                    return core$1.createVNode('div', {
                                        class: 'xnote-source-code-line' + (item.emphasize ? ' xnote-source-code-line-emphasize' : '')
                                    }, [
                                        core$1.createVNode('span', { class: 'xnote-source-code-line-content' }, children)
                                    ]);
                                }, readonly());
                            }) }), jsxRuntime.jsx("span", { class: "xnote-source-code-lang", children: lang })] })] }));
    };
}
function nodesToVNodes(slot, nodes, index) {
    return nodes.map(i => {
        const location = {
            slot,
            startIndex: index,
            endIndex: index + i.textContent.length
        };
        if (i.nodeType === Node.ELEMENT_NODE) {
            const childNodes = Array.from(i.childNodes);
            const vEle = core$1.createVNode('span', {
                class: i.className
            }, nodesToVNodes(slot, childNodes, index));
            index = location.endIndex;
            vEle.location = Object.assign({}, location);
            return vEle;
        }
        index = location.endIndex;
        const textNode = new core$1.VTextNode(i.textContent);
        textNode.location = location;
        return textNode;
    });
}
const sourceCodeComponentLoader = {
    match(element, returnableContentTypes) {
        return returnableContentTypes.includes(core$1.ContentType.BlockComponent) &&
            ((element.tagName === 'DIV' && element.dataset.component === SourceCodeComponent.componentName) ||
                element.tagName === 'PRE');
    },
    read(el, textbus) {
        let slots = [];
        if (el.tagName === 'DIV') {
            const lines = el.querySelectorAll('.xnote-source-code-line');
            slots = Array.from(lines).map(i => {
                const code = i.innerText.replace(/[\s\n]+$/, '');
                const item = createCodeSlot();
                const slot = item.slot;
                item.emphasize = i.classList.contains('xnote-source-code-line-emphasize');
                slot.insert(code);
                return item;
            });
        }
        else {
            el.querySelectorAll('br').forEach(br => {
                br.parentNode.replaceChild(document.createTextNode('\n'), br);
            });
            slots = el.innerText.split('\n').map(code => {
                const item = createCodeSlot();
                item.slot.insert(code);
                return item;
            });
        }
        return new SourceCodeComponent(textbus, {
            lang: el.dataset.lang || '',
            theme: el.dataset.theme || '',
            lineNumber: el.dataset.lineNumber === 'true',
            autoBreak: el.dataset.autoBreak === 'true',
            slots
        });
    },
};

const textIndentAttr = new core$1.Attribute('textIndent', {
    render(node, formatValue) {
        return node.styles.set('text-indent', formatValue * 24 + 'px');
    }
});
const textIndentAttrLoader = {
    match(element) {
        return !!element.style.textIndent;
    },
    read(element) {
        return {
            attribute: textIndentAttr,
            value: (parseInt(element.style.textIndent) || 0) / 24
        };
    }
};
function registerTextIndentShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    const selection = textbus.get(core$1.Selection);
    const commander = textbus.get(core$1.Commander);
    keyboard.addShortcut({
        keymap: {
            key: 'Tab',
        },
        action() {
            const blocks = selection.getBlocks();
            blocks.forEach(block => {
                if (block.slot.parent instanceof SourceCodeComponent) {
                    return;
                }
                const currentIndent = block.slot.getAttribute(textIndentAttr);
                if (typeof currentIndent === 'number') {
                    block.slot.setAttribute(textIndentAttr, currentIndent + 1);
                }
                else {
                    block.slot.setAttribute(textIndentAttr, 1);
                }
            });
        }
    });
    keyboard.addShortcut({
        keymap: {
            key: 'Tab',
            shiftKey: true,
        },
        action() {
            const blocks = selection.getBlocks();
            blocks.forEach(block => {
                const currentIndent = block.slot.getAttribute(textIndentAttr);
                if (typeof currentIndent === 'number' && currentIndent > 1) {
                    block.slot.setAttribute(textIndentAttr, currentIndent - 1);
                }
                else {
                    block.slot.removeAttribute(textIndentAttr);
                }
            });
        }
    });
    keyboard.addShortcut({
        keymap: {
            key: 'Backspace'
        },
        action() {
            if (!selection.isCollapsed) {
                return false;
            }
            const slot = selection.commonAncestorSlot;
            const currentIndent = slot.getAttribute(textIndentAttr);
            if (typeof currentIndent === 'number' && selection.startOffset === 0) {
                if (currentIndent > 1) {
                    slot.setAttribute(textIndentAttr, currentIndent - 1);
                }
                else {
                    slot.removeAttribute(textIndentAttr);
                }
            }
            else {
                commander.delete(true);
            }
        }
    });
}

function AttrTool(props) {
    const commander = core.inject(core$1.Commander);
    const selection = core.inject(core$1.Selection);
    const query = core.inject(core$1.Query);
    const refreshService = core.inject(exports.RefreshService);
    const [checkStates, setCheckStates] = hooks.useProduce({
        textAlign: 'left',
        textIndent: 0
    });
    function updateCheckStates() {
        if (!props.slot && !selection.isSelected) {
            return;
        }
        setCheckStates(draft => {
            const range = props.slot ? {
                startSlot: props.slot,
                endSlot: props.slot,
                startOffset: 0,
                endOffset: props.slot.length
            } : {
                startSlot: selection.startSlot,
                startOffset: selection.startOffset,
                endSlot: selection.endSlot,
                endOffset: selection.endOffset
            };
            const textAlignState = query.queryAttributeByRange(textAlignAttr, range);
            const textIndentState = query.queryAttributeByRange(textIndentAttr, range);
            draft.textAlign = textAlignState.state === core$1.QueryStateType.Enabled ? textAlignState.value : 'left';
            draft.textIndent = textIndentState.state === core$1.QueryStateType.Enabled ? textIndentState.value : 0;
        });
    }
    updateCheckStates();
    const subscription = refreshService.onRefresh.subscribe(() => {
        updateCheckStates();
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    function updateAttr(value) {
        var _a;
        (_a = props.applyBefore) === null || _a === void 0 ? void 0 : _a.call(props);
        switch (value) {
            case 't-l':
                commander.applyAttribute(textAlignAttr, '');
                break;
            case 't-r':
                commander.applyAttribute(textAlignAttr, 'right');
                break;
            case 't-c':
                commander.applyAttribute(textAlignAttr, 'center');
                break;
            case 't-j':
                commander.applyAttribute(textAlignAttr, 'justify');
                break;
            case 'i+':
                selection.getBlocks().forEach(block => {
                    const oldIndent = block.slot.getAttribute(textIndentAttr);
                    let value = 1;
                    if (oldIndent) {
                        value = oldIndent + 1;
                    }
                    block.slot.setAttribute(textIndentAttr, value);
                });
                break;
            case 'i-':
                selection.getBlocks().forEach(block => {
                    const oldIndent = block.slot.getAttribute(textIndentAttr);
                    let value = 0;
                    if (oldIndent) {
                        value = oldIndent - 1;
                    }
                    block.slot.setAttribute(textIndentAttr, value);
                });
                break;
        }
    }
    return scopedCss.withScopedCSS(scopedId$c, () => {
        const states = checkStates();
        return (jsxRuntime.jsx(Dropdown, { width: 'auto', style: props.style, abreast: props.abreast, onCheck: updateAttr, trigger: 'hover', menu: [
                {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-paragraph-left" }), desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'L', ctrlKey: true } }), checked: states.textAlign === 'left', children: "\u5DE6\u5BF9\u9F50" }),
                    value: 't-l'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-paragraph-right" }), desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'R', ctrlKey: true } }), checked: states.textAlign === 'right', children: "\u53F3\u5BF9\u9F50" }),
                    value: 't-r'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-paragraph-center" }), desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'E', ctrlKey: true } }), checked: states.textAlign === 'center', children: "\u5C45\u4E2D\u5BF9\u9F50" }),
                    value: 't-c'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-paragraph-justify" }), desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'J', ctrlKey: true } }), checked: states.textAlign === 'justify', children: "\u5206\u6563\u5BF9\u9F50" }),
                    value: 't-j'
                }, {
                    label: jsxRuntime.jsx(Divider, {}),
                    value: ''
                }, {
                    label: jsxRuntime.jsx(MenuItem, { desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'Tab' } }), icon: jsxRuntime.jsx("span", { class: "xnote-icon-indent-increase" }), children: "\u589E\u52A0\u7F29\u8FDB" }),
                    value: 'i+'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'Tab', shiftKey: true } }), icon: jsxRuntime.jsx("span", { class: "xnote-icon-indent-decrease" }), children: "\u51CF\u5C11\u7F29\u8FDB" }),
                    value: 'i-'
                }
            ], children: props.children || jsxRuntime.jsx(Button, { arrow: true, highlight: false, children: jsxRuntime.jsx("span", { class: `xnote-icon-paragraph-${states.textAlign || 'left'} icon` }) }) }));
    });
}

const defaultRowHeight = 30;
const defaultColumnWidth = 100;
class TableComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        const registry = textbus.get(core$1.Registry);
        return new TableComponent(textbus, {
            layoutWidth: json.layoutWidth || [],
            rows: json.rows.map(row => {
                return {
                    height: row.height,
                    cells: row.cells.map(cell => {
                        return {
                            colspan: cell.colspan,
                            rowspan: cell.rowspan,
                            slot: registry.createSlot(cell.slot)
                        };
                    })
                };
            })
        });
    }
    constructor(textbus, state = {
        layoutWidth: Array.from({ length: 5 }).fill(100),
        rows: Array.from({ length: 3 }).map(() => {
            return {
                height: defaultRowHeight,
                cells: Array.from({ length: 5 }).map(() => {
                    const p = new ParagraphComponent(textbus);
                    const slot = new core$1.Slot([core$1.ContentType.BlockComponent]);
                    slot.insert(p);
                    return {
                        rowspan: 1,
                        colspan: 1,
                        slot
                    };
                })
            };
        })
    }) {
        super(textbus, state);
        this.selection = this.textbus.get(core$1.Selection);
        this.focus = new core$1.Subject();
        this.tableSelection = core.createSignal(null);
    }
    setup() {
        const selection = core$1.useContext(core$1.Selection);
        core$1.onFocusIn(() => {
            this.focus.next(true);
        });
        core$1.onFocusOut(() => {
            this.focus.next(false);
        });
        useBlockContent((slot) => {
            return slot.parent === this;
        });
        const sub = selection.onChange.subscribe(() => {
            if (selection.commonAncestorComponent !== this || selection.isCollapsed) {
                this.tableSelection.set(null);
            }
        });
        core$1.onDestroy(() => {
            sub.unsubscribe();
        });
        const findPosition = (slot) => {
            let cell = slot;
            while ((cell === null || cell === void 0 ? void 0 : cell.parent) && cell.parent !== this) {
                cell = cell.parentSlot;
            }
            if (cell) {
                const rows = this.state.rows;
                for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                    const row = rows[rowIndex].cells;
                    for (let colIndex = 0; colIndex < row.length; colIndex++) {
                        const item = row[colIndex].slot;
                        if (item === cell) {
                            return {
                                rowIndex,
                                colIndex
                            };
                        }
                    }
                }
            }
            return null;
        };
        const select = (ev, selectPosition) => {
            this.tableSelection.set(selectPosition);
            if (selectPosition) {
                const cells = [];
                this.state.rows.slice(selectPosition.startRow, selectPosition.endRow).forEach(row => {
                    cells.push(...row.cells.slice(selectPosition.startColumn, selectPosition.endColumn).map(i => i.slot));
                });
                ev.useRanges(cells.map(i => {
                    return {
                        slot: i,
                        startIndex: 0,
                        endIndex: i.length
                    };
                }));
                ev.preventDefault();
            }
        };
        core$1.onGetRanges(ev => {
            var _a;
            const startPosition = findPosition(selection.startSlot);
            const endPosition = findPosition(selection.endSlot);
            if (startPosition && endPosition) {
                if (startPosition.rowIndex === endPosition.rowIndex && startPosition.colIndex === endPosition.colIndex) {
                    if (selection.startSlot === selection.endSlot && selection.startOffset === 0 && selection.endOffset === ((_a = selection.startSlot) === null || _a === void 0 ? void 0 : _a.length)) {
                        select(ev, {
                            startColumn: startPosition.colIndex,
                            startRow: startPosition.rowIndex,
                            endColumn: endPosition.colIndex + 1,
                            endRow: endPosition.rowIndex + 1
                        });
                        return;
                    }
                    select(ev, null);
                    return;
                }
                const [startColumn, endColumn] = [startPosition.colIndex, endPosition.colIndex].sort((a, b) => a - b);
                const [startRow, endRow] = [startPosition.rowIndex, endPosition.rowIndex].sort((a, b) => a - b);
                select(ev, {
                    startColumn,
                    startRow,
                    endColumn: endColumn + 1,
                    endRow: endRow + 1
                });
            }
            else {
                select(ev, null);
            }
        });
    }
    // afterContentCheck() {
    //   const selection = this.selection
    //   const rows = this.state.rows
    //   rows.forEach(row => {
    //     row.cells.forEach(cell => {
    //       const slot = cell.slot
    //       if (slot.isEmpty) {
    //         const childSlot = new Slot([
    //           ContentType.Text,
    //           ContentType.InlineComponent
    //         ])
    //         const p = new ParagraphComponent(this.textbus, {
    //           slot: childSlot
    //         })
    //         slot.insert(p)
    //         if (slot === selection.anchorSlot) {
    //           selection.setAnchor(childSlot, 0)
    //         }
    //         if (slot === selection.focusSlot) {
    //           selection.setFocus(childSlot, 0)
    //         }
    //       }
    //     })
    //   })
    // }
    deleteColumn(index) {
        this.state.layoutWidth.splice(index, 1);
        this.state.rows.forEach(row => {
            row.cells.splice(index, 1);
        });
        this.selection.unSelect();
    }
    deleteRow(index) {
        this.state.rows.splice(index, 1);
        this.selection.unSelect();
    }
    insertColumn(index) {
        this.state.layoutWidth.splice(index, 0, defaultColumnWidth);
        this.state.rows.forEach(row => {
            const slot = new core$1.Slot([
                core$1.ContentType.BlockComponent,
            ]);
            slot.insert(new ParagraphComponent(this.textbus, {
                slot: new core$1.Slot([
                    core$1.ContentType.InlineComponent,
                    core$1.ContentType.Text
                ])
            }));
            row.cells.splice(index, 0, {
                rowspan: 1,
                colspan: 1,
                slot
            });
        });
        this.textbus.nextTick(() => {
            var _a;
            const slot = (_a = this.state.rows[0].cells[index]) === null || _a === void 0 ? void 0 : _a.slot;
            if (slot) {
                this.selection.selectFirstPosition(slot.getContentAtIndex(0));
            }
        });
    }
    insertRow(index) {
        this.state.rows.splice(index, 0, {
            height: defaultRowHeight,
            cells: this.state.layoutWidth.map(() => {
                const slot = new core$1.Slot([
                    core$1.ContentType.BlockComponent,
                ]);
                slot.insert(new ParagraphComponent(this.textbus, {
                    slot: new core$1.Slot([
                        core$1.ContentType.InlineComponent,
                        core$1.ContentType.Text
                    ])
                }));
                return {
                    rowspan: 1,
                    colspan: 1,
                    slot
                };
            })
        });
        this.textbus.nextTick(() => {
            var _a;
            const slot = (_a = this.state.rows[index].cells[0]) === null || _a === void 0 ? void 0 : _a.slot;
            if (slot) {
                this.selection.selectFirstPosition(slot.getContentAtIndex(0));
            }
        });
    }
}
TableComponent.componentName = 'TableComponent';
TableComponent.type = core$1.ContentType.BlockComponent;

const strikeThroughFormatter = new core$1.Formatter('strike', {
    columned: true,
    render(children) {
        return core$1.createVNode('del', null, children);
    }
});
function toggleStrikeThrough(textbus) {
    const controller = textbus.get(core$1.Controller);
    if (controller.readonly) {
        return;
    }
    const query = textbus.get(core$1.Query);
    const commander = textbus.get(core$1.Commander);
    const state = query.queryFormat(strikeThroughFormatter);
    if (state.state === core$1.QueryStateType.Normal) {
        commander.applyFormat(strikeThroughFormatter, true);
    }
    else {
        commander.unApplyFormat(strikeThroughFormatter);
    }
}
function registerStrikeThroughShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            ctrlKey: true,
            key: 'd'
        },
        action: () => {
            toggleStrikeThrough(textbus);
        }
    });
}
const strikeThroughFormatLoader = {
    match(element) {
        return /^(strike|del|s)$/i.test(element.tagName) || /line-through/.test(element.style.textDecoration);
    },
    read() {
        return {
            formatter: strikeThroughFormatter,
            value: true
        };
    }
};

class TodolistComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        const slot = textbus.get(core$1.Registry).createSlot(json.slot);
        return new TodolistComponent(textbus, {
            slot,
            checked: json.checked
        });
    }
    setup() {
        const textbus = core$1.useContext();
        const commander = core$1.useContext(core$1.Commander);
        const selection = core$1.useContext(core$1.Selection);
        core$1.onBreak(ev => {
            const slot = ev.target.cut(ev.data.index);
            slot.removeAttribute(headingAttr);
            if (ev.target.isEmpty && slot.isEmpty) {
                const beforeIndex = this.parent.indexOf(this);
                const beforeComponent = this.parent.getContentAtIndex(beforeIndex - 1);
                if (beforeComponent instanceof TodolistComponent) {
                    const nextComponent = new ParagraphComponent(textbus, {
                        slot: new core$1.Slot([
                            core$1.ContentType.Text,
                            core$1.ContentType.InlineComponent
                        ])
                    });
                    nextComponent.state.slot.insertDelta(slot.toDelta());
                    commander.insertAfter(nextComponent, this);
                    commander.removeComponent(this);
                    selection.setPosition(nextComponent.state.slot, 0);
                    ev.preventDefault();
                    return;
                }
            }
            const nextParagraph = new TodolistComponent(textbus, {
                checked: this.state.checked,
                slot
            });
            commander.insertAfter(nextParagraph, this);
            selection.setPosition(slot, 0);
            ev.preventDefault();
        });
        core$1.useDynamicShortcut({
            keymap: {
                key: 'Backspace'
            },
            action: () => {
                if (!selection.isCollapsed || selection.startOffset !== 0) {
                    return false;
                }
                const slot = selection.commonAncestorSlot.cut();
                const paragraph = new ParagraphComponent(textbus, {
                    slot
                });
                commander.replaceComponent(this, paragraph);
                selection.setPosition(slot, 0);
            }
        });
    }
}
TodolistComponent.type = core$1.ContentType.BlockComponent;
TodolistComponent.componentName = 'TodoListComponent';
TodolistComponent.zenCoding = {
    match(content, textbus) {
        const selection = textbus.get(core$1.Selection);
        if (selection.commonAncestorComponent instanceof ParagraphComponent) {
            return /^\[(x|\s)?\]$/.test(content);
        }
        return false;
    },
    key: ' ',
    createState(content, textbus) {
        const selection = textbus.get(core$1.Selection);
        const commonAncestorSlot = selection.commonAncestorSlot;
        const slot = new core$1.Slot([
            core$1.ContentType.InlineComponent,
            core$1.ContentType.Text
        ]);
        if (commonAncestorSlot === null || commonAncestorSlot === void 0 ? void 0 : commonAncestorSlot.hasAttribute(textIndentAttr)) {
            slot.setAttribute(textIndentAttr, commonAncestorSlot.getAttribute(textIndentAttr));
        }
        const isChecked = content.charAt(1) === 'x';
        return {
            checked: isChecked,
            slot
        };
    }
};
function TodolistView(props) {
    const component = props.component;
    const state = component.state;
    function toggle() {
        if (readonly() || output()) {
            return;
        }
        state.checked = !state.checked;
        state.slot.applyFormat(strikeThroughFormatter, {
            startIndex: 0,
            endIndex: state.slot.length,
            value: state.checked ? true : null
        });
    }
    const align = {
        left: 'left',
        right: 'right',
        center: 'center',
        justify: 'left'
    };
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const { slot, checked } = state;
        const indent = slot.getAttribute(textIndentAttr) || 0;
        return (jsxRuntime.jsxs("div", { "data-component": TodolistComponent.componentName, ref: props.rootRef, class: "xnote-todolist", style: {
                marginLeft: indent * 24 + 'px',
                justifyContent: align[component.state.slot.getAttribute(textAlignAttr)],
                textAlign: component.state.slot.getAttribute(textAlignAttr) === 'justify' ? 'justify' : void 0
            }, children: [jsxRuntime.jsx("div", { class: "xnote-todolist-icon", onClick: toggle, children: jsxRuntime.jsx("span", { "data-checked": checked, class: [checked ? 'xnote-icon-checkbox-checked' : 'xnote-icon-checkbox-unchecked'] }) }), jsxRuntime.jsx(SlotRender, { slot: slot, tag: 'div', class: 'xnote-todolist-content', renderEnv: readonly() || output() })] }));
    };
}
const todolistComponentLoader = {
    match(element) {
        return element.dataset.component === TodolistComponent.componentName;
    },
    read(element, injector, slotParser) {
        const slot = slotParser(new core$1.Slot([
            core$1.ContentType.Text,
            core$1.ContentType.InlineComponent
        ]), element.children[1]);
        return new TodolistComponent(injector, {
            checked: element.children[0].hasAttribute('checked'),
            slot
        });
    }
};

function toList(textbus, type) {
    const commander = textbus.get(core$1.Commander);
    commander.transform({
        targetType: ListComponent.type,
        slotFactory() {
            return new core$1.Slot([
                core$1.ContentType.InlineComponent,
                core$1.ContentType.Text
            ]);
        },
        stateFactory(slots) {
            return slots.map((slot, index) => {
                return new ListComponent(textbus, {
                    type,
                    reorder: index === 0,
                    slot
                });
            });
        }
    });
}
function registerListShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            key: ['o', 'u'],
            ctrlKey: true,
            shiftKey: true
        },
        action(key) {
            toList(textbus, key === 'o' ? 'OrderedList' : 'UnorderedList');
        }
    });
}
class ListComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        return new ListComponent(textbus, {
            type: json.type,
            reorder: json.reorder,
            slot: textbus.get(core$1.Registry).createSlot(json.slot)
        });
    }
    setup() {
        const textbus = core$1.useContext();
        const commander = core$1.useContext(core$1.Commander);
        const selection = core$1.useContext(core$1.Selection);
        const updateAfterList = (ref) => {
            if (this.state.type === 'UnorderedList') {
                return;
            }
            const parentSlot = ref.parent;
            const index = parentSlot.indexOf(ref);
            const afterContent = parentSlot.sliceContent(index + 1);
            for (const item of afterContent) {
                if (item instanceof ListComponent &&
                    item.state.type === 'OrderedList') {
                    if (item.state.reorder) {
                        break;
                    }
                    item.changeMarker.forceMarkDirtied();
                }
            }
        };
        core$1.onParentSlotUpdated(() => {
            this.changeMarker.forceMarkDirtied();
        });
        core$1.onBreak(ev => {
            const slot = ev.target.cut(ev.data.index);
            slot.removeAttribute(headingAttr);
            if (ev.target.isEmpty && slot.isEmpty) {
                const beforeIndex = this.parent.indexOf(this);
                const beforeComponent = this.parent.getContentAtIndex(beforeIndex - 1);
                if (beforeComponent instanceof ListComponent) {
                    const nextComponent = new ParagraphComponent(textbus, {
                        slot: new core$1.Slot([
                            core$1.ContentType.Text,
                            core$1.ContentType.InlineComponent
                        ])
                    });
                    nextComponent.state.slot.insertDelta(slot.toDelta());
                    commander.insertAfter(nextComponent, this);
                    commander.removeComponent(this);
                    selection.setPosition(nextComponent.state.slot, 0);
                    updateAfterList(nextComponent);
                    ev.preventDefault();
                    return;
                }
            }
            const nextList = new ListComponent(textbus, {
                slot,
                reorder: false,
                type: this.state.type
            });
            commander.insertAfter(nextList, this);
            selection.setPosition(slot, 0);
            updateAfterList(nextList);
            ev.preventDefault();
        });
        core$1.useDynamicShortcut({
            keymap: {
                key: 'Backspace'
            },
            action: () => {
                if (!selection.isCollapsed || selection.startOffset !== 0) {
                    return false;
                }
                const slot = selection.commonAncestorSlot.cut();
                const paragraph = new ParagraphComponent(textbus, {
                    slot
                });
                commander.replaceComponent(this, paragraph);
                selection.setPosition(slot, 0);
            }
        });
        core$1.useDynamicShortcut({
            keymap: {
                key: 'Tab'
            },
            action: () => {
                Promise.resolve().then(() => updateAfterList(this));
                return false;
            }
        });
        core$1.useDynamicShortcut({
            keymap: {
                key: 'Tab',
                shiftKey: true
            },
            action: () => {
                Promise.resolve().then(() => updateAfterList(this));
                return false;
            }
        });
    }
}
ListComponent.componentName = 'ListComponent';
ListComponent.type = core$1.ContentType.BlockComponent;
ListComponent.zenCoding = {
    key: ' ',
    match(content, textbus) {
        const selection = textbus.get(core$1.Selection);
        if (selection.commonAncestorComponent instanceof ParagraphComponent) {
            return /^([1-9]\.|[+*-])$/.test(content);
        }
        return false;
    },
    createState(content, textbus) {
        const selection = textbus.get(core$1.Selection);
        const commonAncestorSlot = selection.commonAncestorSlot;
        const slot = new core$1.Slot([
            core$1.ContentType.InlineComponent,
            core$1.ContentType.Text
        ]);
        if (commonAncestorSlot === null || commonAncestorSlot === void 0 ? void 0 : commonAncestorSlot.hasAttribute(textIndentAttr)) {
            slot.setAttribute(textIndentAttr, commonAncestorSlot.getAttribute(textIndentAttr));
        }
        return {
            type: /[-+*]/.test(content) ? 'UnorderedList' : 'OrderedList',
            reorder: true,
            slot
        };
    }
};
const step = 26;
const chars = Array.from({ length: step }).map((_, index) => String.fromCharCode(96 + index + 1));
function numberToLetter(num) {
    const numbers = [];
    while (true) {
        const n = Math.floor(num / step);
        numbers.push(n);
        num = num % step;
        if (num < step) {
            numbers.push(num + 1);
            break;
        }
    }
    return numbers.map(i => {
        return chars[i - 1];
    }).join('');
}
function ListComponentView(props) {
    const component = props.component;
    function reorder(is) {
        component.state.reorder = is;
        const parentSlot = component.parent;
        const index = parentSlot.indexOf(component);
        const afterContent = parentSlot.sliceContent(index + 1);
        for (const item of afterContent) {
            if (item instanceof ListComponent) {
                if (item.state.reorder) {
                    break;
                }
                item.changeMarker.forceMarkDirtied();
            }
        }
    }
    const align = {
        left: 'left',
        right: 'right',
        center: 'center',
        justify: 'left'
    };
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const ListType = component.state.type === 'UnorderedList' ? 'ul' : 'ol';
        const ulIcons = ['•', '◦', '▪'];
        let icon;
        let listStep = 0;
        const indent = component.state.slot.getAttribute(textIndentAttr) || 0;
        if (ListType === 'ul') {
            icon = ulIcons[indent % 3];
        }
        else {
            const parentSlot = component.parent;
            const index = parentSlot.indexOf(component);
            if (!component.state.reorder) {
                const beforeContent = parentSlot.sliceContent(0, index);
                while (beforeContent.length) {
                    const content = beforeContent.pop();
                    if (content instanceof ListComponent &&
                        content.state.type === 'OrderedList') {
                        const beforeIndent = content.state.slot.getAttribute(textIndentAttr) || 0;
                        if (beforeIndent === indent) {
                            listStep++;
                            if (content.state.reorder) {
                                break;
                            }
                        }
                        else if (beforeIndent < indent) {
                            break;
                        }
                    }
                }
            }
            const level = indent % 3;
            if (level === 0) {
                icon = listStep + 1 + '.';
            }
            else if (level === 1) {
                icon = numberToLetter(listStep).toUpperCase() + '.';
            }
            else {
                icon = numberToLetter(listStep) + '.';
            }
        }
        return (jsxRuntime.jsx(ListType, { ref: props.rootRef, "data-component": component.name, "data-reorder": (listStep === 0) + '', class: "xnote-list", style: {
                marginLeft: indent * 24 + 'px'
            }, children: jsxRuntime.jsxs("li", { style: {
                    justifyContent: align[component.state.slot.getAttribute(textAlignAttr)],
                    textAlign: component.state.slot.getAttribute(textAlignAttr) === 'justify' ? 'justify' : void 0
                }, children: [jsxRuntime.jsx("div", { class: "xnote-list-type", children: (component.state.type === 'UnorderedList' || readonly() || output()) ?
                            jsxRuntime.jsx("span", { class: "xnote-order-btn", children: icon })
                            :
                                jsxRuntime.jsx(Dropdown, { menu: jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(MenuItem, { onClick: () => reorder(false), children: "\u7EE7\u7EED\u7F16\u53F7" }), jsxRuntime.jsx(MenuItem, { onClick: () => reorder(true), children: "\u91CD\u65B0\u7F16\u53F7" })] }), children: jsxRuntime.jsx(Button, { style: { color: 'inherit' }, children: icon }) }) }), jsxRuntime.jsx(SlotRender, { slot: component.state.slot, class: 'xnote-list-content', renderEnv: readonly() || output() })] }) }));
    };
}
const listComponentLoader = {
    match(element, returnableContentTypes) {
        return returnableContentTypes.includes(core$1.ContentType.BlockComponent) && (element.tagName === 'UL' || element.tagName === 'OL');
    },
    read(element, textbus, slotParser) {
        const type = element.tagName === 'OL' ? 'OrderedList' : 'UnorderedList';
        if (element.dataset.component === ListComponent.componentName) {
            const slot = slotParser(new core$1.Slot([
                core$1.ContentType.InlineComponent,
                core$1.ContentType.Text
            ]), element.querySelector('.xnote-list-content') || document.createElement('div'));
            return new ListComponent(textbus, {
                slot,
                reorder: element.dataset.reorder !== 'false',
                type
            });
        }
        const result = new core$1.Slot([
            core$1.ContentType.BlockComponent
        ]);
        Array.from(element.children).forEach((i, index) => {
            const slot = slotParser(new core$1.Slot([
                core$1.ContentType.InlineComponent,
                core$1.ContentType.Text
            ]), i);
            const component = new ListComponent(textbus, {
                slot,
                reorder: index === 0,
                type
            });
            result.insert(component);
        });
        return result;
    }
};

function useActiveBlock() {
    const query = core.inject(core$1.Query);
    const selection = core.inject(core$1.Selection);
    const refreshService = core.inject(exports.RefreshService);
    const [checkStates, setCheckStates] = hooks.useProduce({
        paragraph: false,
        h1: false,
        h2: false,
        h3: false,
        h4: false,
        h5: false,
        h6: false,
        orderedList: false,
        unorderedList: false,
        table: false,
        todolist: false,
        blockquote: false,
        sourceCode: false,
        highlightBox: false
    });
    function updateCheckStates(range) {
        setCheckStates(draft => {
            const heading = query.queryAttributeByRange(headingAttr, range);
            draft.paragraph = query.queryComponentByRange(ParagraphComponent, range).state === core$1.QueryStateType.Enabled;
            draft.h1 = draft.h2 = draft.h3 = draft.h4 = draft.h5 = draft.h6 = false;
            if (heading.state === core$1.QueryStateType.Enabled) {
                draft[heading.value] = true;
                draft.paragraph = false;
            }
            const queryList = query.queryComponentByRange(ListComponent, range);
            draft.unorderedList = queryList.state === core$1.QueryStateType.Enabled && queryList.value.state.type === 'UnorderedList';
            draft.orderedList = queryList.state === core$1.QueryStateType.Enabled && queryList.value.state.type === 'OrderedList';
            draft.table = query.queryComponentByRange(TableComponent, range).state === core$1.QueryStateType.Enabled;
            draft.todolist = query.queryComponentByRange(TodolistComponent, range).state === core$1.QueryStateType.Enabled;
            draft.blockquote = query.queryComponentByRange(BlockquoteComponent, range).state === core$1.QueryStateType.Enabled;
            draft.sourceCode = query.queryComponentByRange(SourceCodeComponent, range).state === core$1.QueryStateType.Enabled;
        });
    }
    const subscription = refreshService.onRefresh.subscribe(() => {
        if (!selection.isSelected) {
            return;
        }
        updateCheckStates({
            startOffset: selection.startOffset,
            startSlot: selection.startSlot,
            endSlot: selection.endSlot,
            endOffset: selection.endOffset
        });
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    return function (slot = null) {
        if (slot) {
            updateCheckStates({
                startOffset: 0,
                endOffset: slot.length,
                startSlot: slot,
                endSlot: slot
            });
        }
        else if (selection.isSelected) {
            updateCheckStates({
                startOffset: selection.startOffset,
                startSlot: selection.startSlot,
                endSlot: selection.endSlot,
                endOffset: selection.endOffset
            });
        }
        return checkStates();
    };
}

function useBlockTransform() {
    const commander = core.inject(core$1.Commander);
    const textbus = core.inject(core$1.Textbus);
    const query = core.inject(core$1.Query);
    const selection = core.inject(core$1.Selection);
    return function (value) {
        var _a, _b;
        switch (value) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                commander.applyAttribute(headingAttr, value);
                break;
            case 'paragraph':
                commander.unApplyAttribute(headingAttr);
                commander.transform({
                    targetType: ParagraphComponent.type,
                    slotFactory() {
                        return new core$1.Slot([
                            core$1.ContentType.InlineComponent,
                            core$1.ContentType.Text
                        ]);
                    },
                    stateFactory(slots) {
                        return slots.map(slot => new ParagraphComponent(textbus, {
                            slot
                        }));
                    }
                });
                break;
            case 'table':
                {
                    const table = new TableComponent(textbus);
                    if (((_a = selection.commonAncestorSlot) === null || _a === void 0 ? void 0 : _a.isEmpty) && ((_b = selection.commonAncestorComponent) === null || _b === void 0 ? void 0 : _b.name) === ParagraphComponent.componentName) {
                        commander.replaceComponent(selection.commonAncestorComponent, table);
                    }
                    else {
                        commander.insert(table);
                    }
                }
                break;
            case 'todolist':
                commander.unApplyAttribute(headingAttr);
                commander.transform({
                    targetType: TodolistComponent.type,
                    slotFactory() {
                        return new core$1.Slot([
                            core$1.ContentType.InlineComponent,
                            core$1.ContentType.Text
                        ]);
                    },
                    stateFactory(slots) {
                        return slots.map(slot => {
                            return new TodolistComponent(textbus, {
                                checked: false,
                                slot
                            });
                        });
                    }
                });
                break;
            case 'ol':
            case 'ul':
                toList(textbus, value === 'ol' ? 'OrderedList' : 'UnorderedList');
                break;
            case 'blockquote':
                toBlockquote(textbus);
                break;
            case 'sourceCode':
                {
                    const state = query.queryComponent(SourceCodeComponent);
                    if (state.state === core$1.QueryStateType.Enabled) {
                        commander.transform({
                            targetType: ParagraphComponent.type,
                            slotFactory() {
                                return new core$1.Slot([
                                    core$1.ContentType.InlineComponent,
                                    core$1.ContentType.Text
                                ]);
                            },
                            stateFactory(slots) {
                                return slots.map(slot => {
                                    return new ParagraphComponent(textbus, {
                                        slot
                                    });
                                });
                            }
                        });
                    }
                    else {
                        commander.transform({
                            targetType: SourceCodeComponent.type,
                            slotFactory() {
                                return new core$1.Slot([
                                    core$1.ContentType.Text
                                ]);
                            },
                            stateFactory(slots) {
                                return [new SourceCodeComponent(textbus, {
                                        lang: '',
                                        lineNumber: true,
                                        autoBreak: true,
                                        slots: slots.map(slot => {
                                            slot.cleanFormats();
                                            slot.cleanAttributes();
                                            return {
                                                slot,
                                                emphasize: false
                                            };
                                        })
                                    })];
                            }
                        });
                    }
                }
                break;
            case 'highlightBox':
                {
                    const state = query.queryComponent(HighlightBoxComponent);
                    if (state.state === core$1.QueryStateType.Enabled) {
                        const current = state.value;
                        const parent = current.parent;
                        const index = parent.indexOf(current);
                        parent.retain(index);
                        commander.removeComponent(current);
                        current.__slots__.get(0).sliceContent().forEach(i => {
                            parent.insert(i);
                        });
                    }
                    else {
                        const block = new HighlightBoxComponent(textbus);
                        const slot = block.state.slot;
                        if (selection.startSlot === selection.endSlot) {
                            const parentComponent = selection.startSlot.parent;
                            const parentSlot = parentComponent.parent;
                            const position = parentSlot.indexOf(parentComponent);
                            slot.insert(parentComponent);
                            parentSlot.retain(position);
                            parentSlot.insert(block);
                        }
                        else {
                            const commonAncestorSlot = selection.commonAncestorSlot;
                            const scope = selection.getCommonAncestorSlotScope();
                            commonAncestorSlot.cut(scope.startOffset, scope.endOffset).sliceContent().forEach(i => {
                                slot.insert(i);
                            });
                            commonAncestorSlot.retain(scope.startOffset);
                            commonAncestorSlot.insert(block);
                        }
                    }
                }
                break;
        }
    };
}

function BlockTool() {
    const checkStates = useActiveBlock();
    const transform = useBlockTransform();
    return scopedCss.withScopedCSS(scopedId$c, () => {
        const states = checkStates();
        const types = [
            [states.paragraph, 'xnote-icon-pilcrow'],
            [states.h1, 'xnote-icon-heading-h1'],
            [states.h2, 'xnote-icon-heading-h2'],
            [states.h3, 'xnote-icon-heading-h3'],
            [states.h4, 'xnote-icon-heading-h4'],
            [states.h5, 'xnote-icon-heading-h5'],
            [states.h6, 'xnote-icon-heading-h6'],
            [states.orderedList, 'xnote-icon-list-numbered'],
            [states.unorderedList, 'xnote-icon-list'],
            [states.todolist, 'xnote-icon-checkbox-checked'],
            [states.blockquote, 'xnote-icon-quotes-right'],
            [states.sourceCode, 'xnote-icon-source-code'],
            [states.highlightBox, 'xnote-icon-highlight-box'],
        ];
        let currentType = 'xnote-icon-pilcrow';
        for (const t of types) {
            if (t[0]) {
                currentType = t[1];
                break;
            }
        }
        return (jsxRuntime.jsx(Dropdown, { width: 'auto', onCheck: transform, trigger: 'hover', menu: [
                {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-pilcrow" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '0'
                            } }), checked: states.paragraph, children: "\u6B63\u6587" }),
                    value: 'paragraph'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h1" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '1'
                            } }), checked: states.h1, children: "\u4E00\u7EA7\u6807\u9898" }),
                    value: 'h1'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h2" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '2'
                            } }), checked: states.h2, children: "\u4E8C\u7EA7\u6807\u9898" }),
                    value: 'h2'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h3" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '3'
                            } }), checked: states.h3, children: "\u4E09\u7EA7\u6807\u9898" }),
                    value: 'h3'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h4" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '4'
                            } }), checked: states.h4, children: "\u56DB\u7EA7\u6807\u9898" }),
                    value: 'h4'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h5" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '5'
                            } }), checked: states.h5, children: "\u4E94\u7EA7\u6807\u9898" }),
                    value: 'h5'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h6" }), desc: jsxRuntime.jsx(Keymap, { keymap: {
                                ctrlKey: true,
                                key: '6'
                            } }), checked: states.h6, children: "\u516D\u7EA7\u6807\u9898" }),
                    value: 'h6'
                }, {
                    label: jsxRuntime.jsx(Divider, {}),
                    value: ''
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-checkbox-checked" }), checked: states.todolist, children: "\u5F85\u529E\u4E8B\u9879" }),
                    value: 'todolist'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'O', shiftKey: true, ctrlKey: true } }), icon: jsxRuntime.jsx("span", { class: "xnote-icon-list-numbered" }), checked: states.orderedList, children: "\u6709\u5E8F\u5217\u8868" }),
                    value: 'ol'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { desc: jsxRuntime.jsx(Keymap, { keymap: { key: 'U', shiftKey: true, ctrlKey: true } }), icon: jsxRuntime.jsx("span", { class: "xnote-icon-list" }), checked: states.unorderedList, children: "\u65E0\u5E8F\u5217\u8868" }),
                    value: 'ul'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { desc: jsxRuntime.jsx(Keymap, { keymap: { key: '\'', ctrlKey: true } }), icon: jsxRuntime.jsx("span", { class: "xnote-icon-quotes-right" }), checked: states.blockquote, children: "\u5F15\u7528" }),
                    value: 'blockquote'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-source-code" }), checked: states.sourceCode, children: "\u4EE3\u7801\u5757" }),
                    value: 'sourceCode'
                }, {
                    label: jsxRuntime.jsx(MenuItem, { icon: jsxRuntime.jsx("span", { class: "xnote-icon-hightlight-box" }), checked: states.highlightBox, children: "\u9AD8\u4EAE\u5757" }),
                    value: 'highlightBox'
                }
            ], children: jsxRuntime.jsx(Button, { arrow: true, highlight: false, children: jsxRuntime.jsx("span", { class: currentType }) }) }));
    });
}

const backgroundColorFormatter = new core$1.Formatter('backgroundColor', {
    columned: true,
    render(children, formatValue) {
        return {
            fallbackTagName: 'span',
            attach(host) {
                host.styles.set('backgroundColor', formatValue);
            }
        };
    }
});
const backgroundColorFormatLoader = {
    match(element) {
        return !!element.style.backgroundColor;
    },
    read(element) {
        return {
            formatter: backgroundColorFormatter,
            value: element.style.backgroundColor
        };
    }
};

const boldFormatter = new core$1.Formatter('bold', {
    render(children) {
        return core$1.createVNode('strong', null, children);
    }
});
function toggleBold(textbus) {
    const controller = textbus.get(core$1.Controller);
    if (controller.readonly) {
        return;
    }
    const query = textbus.get(core$1.Query);
    const commander = textbus.get(core$1.Commander);
    const state = query.queryFormat(boldFormatter);
    if (state.state === core$1.QueryStateType.Normal) {
        commander.applyFormat(boldFormatter, true);
    }
    else {
        commander.unApplyFormat(boldFormatter);
    }
}
function registerBoldShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            ctrlKey: true,
            key: 'b'
        },
        action: () => {
            toggleBold(textbus);
        }
    });
}
const boldFormatLoader = {
    match(element) {
        return element.tagName === 'STRONG' || element.tagName === 'B' || /bold|[5-9]00/.test(element.style.fontWeight);
    },
    read() {
        return {
            formatter: boldFormatter,
            value: true
        };
    }
};

const codeFormatter = new core$1.Formatter('code', {
    inheritable: false,
    render(children) {
        return core$1.createVNode('code', {
            class: 'xnote-code'
        }, children);
    }
});
function toggleCode(textbus) {
    const controller = textbus.get(core$1.Controller);
    if (controller.readonly) {
        return;
    }
    const query = textbus.get(core$1.Query);
    const commander = textbus.get(core$1.Commander);
    const state = query.queryFormat(codeFormatter);
    if (state.state === core$1.QueryStateType.Normal) {
        commander.applyFormat(codeFormatter, true);
    }
    else {
        commander.unApplyFormat(codeFormatter);
    }
}
function registerCodeShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            ctrlKey: true,
            key: ','
        },
        action: () => {
            toggleCode(textbus);
        }
    });
}
const codeFormatLoader = {
    match(element) {
        return element.tagName === 'CODE';
    },
    read() {
        return {
            formatter: codeFormatter,
            value: true
        };
    }
};

const colorFormatter = new core$1.Formatter('color', {
    render(children, formatValue) {
        return {
            fallbackTagName: 'span',
            attach(host) {
                host.styles.set('color', formatValue);
            }
        };
    }
});
const colorFormatLoader = {
    match(element) {
        return !!element.style.color;
    },
    read(element) {
        return {
            formatter: colorFormatter,
            value: element.style.color
        };
    }
};

const fontFamilyFormatter = new core$1.Formatter('fontFamily', {
    render(children, formatValue) {
        return {
            fallbackTagName: 'span',
            attach(host) {
                return host.styles.set('fontFamily', formatValue);
            }
        };
    }
});
const fontFamilyFormatLoader = {
    match(element) {
        return !!element.style.fontFamily;
    },
    read(element) {
        return {
            formatter: fontFamilyFormatter,
            value: element.style.fontFamily
        };
    }
};

const fontSizeFormatter = new core$1.Formatter('fontSize', {
    render(children, formatValue) {
        return {
            fallbackTagName: 'span',
            attach(host) {
                host.styles.set('fontSize', formatValue);
            }
        };
    }
});
const fontSizeFormatLoader = {
    match(element) {
        return !!element.style.fontSize;
    },
    read(element) {
        return {
            formatter: fontSizeFormatter,
            value: element.style.fontSize
        };
    }
};

const italicFormatter = new core$1.Formatter('italic', {
    render(children) {
        return core$1.createVNode('em', null, children);
    }
});
function toggleItalic(textbus) {
    const controller = textbus.get(core$1.Controller);
    if (controller.readonly) {
        return;
    }
    const query = textbus.get(core$1.Query);
    const commander = textbus.get(core$1.Commander);
    const state = query.queryFormat(italicFormatter);
    if (state.state === core$1.QueryStateType.Normal) {
        commander.applyFormat(italicFormatter, true);
    }
    else {
        commander.unApplyFormat(italicFormatter);
    }
}
function registerItalicShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            ctrlKey: true,
            key: 'i'
        },
        action: () => {
            toggleItalic(textbus);
        }
    });
}
const italicFormatLoader = {
    match(element) {
        return element.tagName === 'EM' || element.tagName === 'I' || /italic/.test(element.style.fontStyle);
    },
    read() {
        return {
            formatter: italicFormatter,
            value: true
        };
    }
};

const linkFormatter = new core$1.Formatter('link', {
    priority: -1,
    inheritable: false,
    render(children, formatValue, readonly = false) {
        if (readonly) {
            return core$1.createVNode('a', {
                href: formatValue.href,
                target: formatValue.target
            }, children);
        }
        return core$1.createVNode('a', {
            onClick(ev) {
                ev.preventDefault();
            },
            'data-href': formatValue.href,
            style: {
                color: '#296eff',
                textDecoration: 'underline'
            },
            target: formatValue.target
        }, children);
    }
});
const linkFormatLoader = {
    match(element) {
        return element.tagName === 'A';
    },
    read(element) {
        return {
            formatter: linkFormatter,
            value: {
                href: element.href || element.dataset.href,
                target: element.target || '_self'
            }
        };
    }
};

const underlineFormatter = new core$1.Formatter('underline', {
    columned: true,
    render(children) {
        return core$1.createVNode('u', null, children);
    }
});
function toggleUnderline(textbus) {
    const controller = textbus.get(core$1.Controller);
    if (controller.readonly) {
        return;
    }
    const query = textbus.get(core$1.Query);
    const commander = textbus.get(core$1.Commander);
    const state = query.queryFormat(underlineFormatter);
    if (state.state === core$1.QueryStateType.Normal) {
        commander.applyFormat(underlineFormatter, true);
    }
    else {
        commander.unApplyFormat(underlineFormatter);
    }
}
function registerUnderlineShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    keyboard.addShortcut({
        keymap: {
            ctrlKey: true,
            key: 'u'
        },
        action: () => {
            toggleUnderline(textbus);
        }
    });
}
const underlineFormatLoader = {
    match(element) {
        return element.tagName === 'U';
    },
    read() {
        return {
            formatter: underlineFormatter,
            value: true
        };
    }
};

function BoldTool() {
    const query = core.inject(core$1.Query);
    const textbus = core.inject(core$1.Textbus);
    const refreshService = core.inject(exports.RefreshService);
    const [viewModel, update] = hooks.useProduce({
        highlight: false,
        disabled: false,
    });
    function toggle() {
        toggleBold(textbus);
    }
    const sub = refreshService.onRefresh.subscribe(() => {
        const state = query.queryFormat(boldFormatter);
        update(draft => {
            draft.highlight = state.state === core$1.QueryStateType.Enabled;
        });
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return () => {
        const vm = viewModel();
        return jsxRuntime.jsx(Button, { highlight: vm.highlight, disabled: vm.disabled, onClick: toggle, children: jsxRuntime.jsx("span", { class: "xnote-icon-bold" }) });
    };
}

function CodeTool() {
    const query = core.inject(core$1.Query);
    const refreshService = core.inject(exports.RefreshService);
    const textbus = core.inject(core$1.Textbus);
    const [viewModel, update] = hooks.useProduce({
        highlight: false,
        disabled: false,
    });
    function toggle() {
        toggleCode(textbus);
    }
    const sub = refreshService.onRefresh.subscribe(() => {
        const state = query.queryFormat(codeFormatter);
        update(draft => {
            draft.highlight = state.state === core$1.QueryStateType.Enabled;
        });
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return () => {
        const vm = viewModel();
        return jsxRuntime.jsx(Button, { highlight: vm.highlight, disabled: vm.disabled, onClick: toggle, children: jsxRuntime.jsx("span", { class: "xnote-icon-code" }) });
    };
}

var scopedId$b = "vf-accb31";

function ColorTool(props) {
    const query = core.inject(core$1.Query);
    const refreshService = core.inject(exports.RefreshService);
    const commander = core.inject(core$1.Commander);
    const selection = core.inject(core$1.Selection);
    const textColor = core.createSignal('');
    const backgroundColor = core.createSignal('');
    const [viewModel] = hooks.useProduce({
        highlight: false,
        disabled: false,
    });
    function updateCheckState() {
        if (!props.slot && !selection.isSelected) {
            return;
        }
        const range = props.slot ? {
            startSlot: props.slot,
            endSlot: props.slot,
            startOffset: 0,
            endOffset: props.slot.length
        } : {
            startSlot: selection.startSlot,
            startOffset: selection.startOffset,
            endSlot: selection.endSlot,
            endOffset: selection.endOffset
        };
        const textState = query.queryFormatByRange(colorFormatter, range);
        const backgroundState = query.queryFormatByRange(backgroundColorFormatter, range);
        textColor.set(textState.state === core$1.QueryStateType.Enabled ? textState.value : '');
        backgroundColor.set(backgroundState.state === core$1.QueryStateType.Enabled ? backgroundState.value : '');
    }
    const sub = refreshService.onRefresh.subscribe(() => {
        updateCheckState();
    });
    updateCheckState();
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    const textColors = [
        '#000',
        '#aaa',
        '#ff2e2e',
        '#ff8d45',
        '#ffdf14',
        '#5eec75',
        '#5dfaff',
        '#1296db',
        '#617fff',
        '#c459ff',
        '#fff',
    ];
    const backgroundColors = [
        '#aaa',
        '#ef7373',
        '#ec9c6a',
        '#dccc64',
        '#96e3a3',
        '#a1e2e3',
        '#90a0e5',
        '#c596e0',
    ];
    return scopedCss.withScopedCSS(scopedId$b, () => {
        const vm = viewModel();
        return (jsxRuntime.jsx(Dropdown, { style: props.style, width: '180px', abreast: props.abreast, trigger: 'hover', menu: jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("div", { class: "color-type", children: "\u6587\u5B57\u989C\u8272" }), jsxRuntime.jsxs("div", { class: "text-colors", children: [jsxRuntime.jsx("div", { class: {
                                    'no-background': true,
                                    active: textColor() === ''
                                }, onClick: () => {
                                    var _a;
                                    (_a = props.applyBefore) === null || _a === void 0 ? void 0 : _a.call(props);
                                    commander.unApplyFormat(colorFormatter);
                                } }), textColors.map(c => {
                                return jsxRuntime.jsx("div", { class: {
                                        active: textColor() === c
                                    }, onClick: () => {
                                        var _a;
                                        (_a = props.applyBefore) === null || _a === void 0 ? void 0 : _a.call(props);
                                        commander.applyFormat(colorFormatter, c);
                                    }, style: { color: c }, children: "A" });
                            })] }), jsxRuntime.jsx("div", { class: "color-type", children: "\u80CC\u666F\u989C\u8272" }), jsxRuntime.jsxs("div", { class: "background-colors", children: [jsxRuntime.jsx("div", { class: {
                                    active: backgroundColor() === '',
                                    'no-background': true
                                }, onClick: () => {
                                    var _a;
                                    (_a = props.applyBefore) === null || _a === void 0 ? void 0 : _a.call(props);
                                    commander.unApplyFormat(backgroundColorFormatter);
                                } }), backgroundColors.map(c => {
                                return jsxRuntime.jsx("div", { class: {
                                        active: backgroundColor() === c
                                    }, onClick: () => {
                                        var _a;
                                        (_a = props.applyBefore) === null || _a === void 0 ? void 0 : _a.call(props);
                                        commander.applyFormat(backgroundColorFormatter, c);
                                    }, style: { backgroundColor: c }, children: "A" });
                            })] })] }), children: props.children || jsxRuntime.jsx(Button, { highlight: vm.highlight, arrow: true, disabled: vm.disabled, children: jsxRuntime.jsx("span", { class: "background", children: jsxRuntime.jsx("span", { style: {
                            backgroundColor: backgroundColor(),
                            color: textColor()
                        }, children: jsxRuntime.jsx("span", { class: "xnote-icon-color" }) }) }) }) }));
    });
}

const isSupportFont = (function () {
    const fullbackFontName = 'Arial';
    const text = 'HeRe-is*SoMe%tEst +99.? !@ #~ &^teXtWw L$VEY$U0';
    const fontSize = 20;
    const width = 200;
    const height = 50;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    context.textAlign = 'center';
    context.fillStyle = 'black';
    context.textBaseline = 'middle';
    function checker(fontName) {
        context.clearRect(0, 0, width, height);
        context.font = fontSize + 'px ' + fontName + ', ' + fullbackFontName;
        context.fillText(text, width / 2, height / 2);
        const data = context.getImageData(0, 0, width, height).data;
        return Array.from(data).filter(n => n !== 0);
    }
    return function (fontName) {
        if (fontName.toLowerCase() === fullbackFontName.toLowerCase()) {
            return true;
        }
        return checker(fullbackFontName).join('') !== checker(fontName).join('');
    };
})();
function FontFamilyTool() {
    const currentFontFamily = core.createSignal('');
    const fontFamilyOptions = [{
            label: '默认',
            value: ''
        }, {
            label: '宋体',
            value: 'SimSun, STSong'
        }, {
            label: '黑体',
            value: 'SimHei, STHeiti'
        }, {
            label: '微软雅黑',
            value: 'Microsoft YaHei'
        }, {
            label: '楷体',
            value: 'KaiTi, STKaiti'
        }, {
            label: '仿宋',
            value: 'FangSong, STFangsong',
        }, {
            label: '冬青黑简体中文',
            value: '"Hiragino Sans GB", 冬青黑简体中文'
        }, {
            label: '苹方',
            value: '"PingFang SC", 苹方'
        }, {
            label: '隶书',
            value: 'SimLi'
        }, {
            label: 'Andale Mono',
            value: 'Andale Mono'
        }, {
            label: 'Arial',
            value: 'Arial'
        }, {
            label: 'Helvetica',
            value: 'Helvetica'
        }, {
            label: 'Impact',
            value: 'Impact'
        }, {
            label: 'Times New Roman',
            value: 'Times New Roman'
        }];
    const commander = core.inject(core$1.Commander);
    function check(v) {
        if (v) {
            commander.applyFormat(fontFamilyFormatter, v);
        }
        else {
            commander.unApplyFormat(fontFamilyFormatter);
        }
    }
    const refreshService = core.inject(exports.RefreshService);
    const query = core.inject(core$1.Query);
    const highlight = core.createSignal(false);
    const subscription = refreshService.onRefresh.subscribe(() => {
        const result = query.queryFormat(fontFamilyFormatter);
        const isHighlight = result.state === core$1.QueryStateType.Enabled;
        highlight.set(isHighlight);
        currentFontFamily.set(isHighlight ? result.value : '');
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    return () => {
        var _a;
        return (jsxRuntime.jsx(Dropdown, { onCheck: check, menu: fontFamilyOptions.map(i => {
                const disabled = i.value ? !i.value.split(',').map(i => isSupportFont(i.trim())).some(v => v) : false;
                return {
                    label: jsxRuntime.jsx(MenuItem, { disabled: disabled, checked: currentFontFamily() === i.value, children: i.label }),
                    disabled,
                    value: i.value,
                };
            }), children: jsxRuntime.jsx(Button, { arrow: true, highlight: highlight(), children: ((_a = fontFamilyOptions.find(v => {
                    return v.value === currentFontFamily();
                })) === null || _a === void 0 ? void 0 : _a.label) || '默认' }) }));
    };
}

function FontSizeTool() {
    const currentFontSize = core.createSignal('');
    const fontSizeOptions = [
        '',
        '12px',
        '13px',
        '14px',
        '15px',
        '16px',
        '18px',
        '20px',
        '22px',
        '26px',
        '30px',
        '36px',
        '48px',
        '72px',
    ];
    const commander = core.inject(core$1.Commander);
    function check(v) {
        if (v) {
            commander.applyFormat(fontSizeFormatter, v);
        }
        else {
            commander.unApplyFormat(fontSizeFormatter);
        }
    }
    const refreshService = core.inject(exports.RefreshService);
    const query = core.inject(core$1.Query);
    const highlight = core.createSignal(false);
    const subscription = refreshService.onRefresh.subscribe(() => {
        const result = query.queryFormat(fontSizeFormatter);
        const isHighlight = result.state === core$1.QueryStateType.Enabled;
        highlight.set(isHighlight);
        currentFontSize.set(isHighlight ? result.value : '');
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    return () => {
        return (jsxRuntime.jsx(Dropdown, { onCheck: check, menu: fontSizeOptions.map(i => {
                return {
                    label: jsxRuntime.jsx(MenuItem, { checked: currentFontSize() === i, children: i || '默认' }),
                    value: i
                };
            }), children: jsxRuntime.jsxs(Button, { arrow: true, highlight: highlight(), children: [jsxRuntime.jsx("span", { class: "xnote-icon-font-size" }), jsxRuntime.jsx("span", { children: currentFontSize() || '默认' })] }) }));
    };
}

function ItalicTool() {
    const query = core.inject(core$1.Query);
    const refreshService = core.inject(exports.RefreshService);
    const textbus = core.inject(core$1.Textbus);
    const [viewModel, update] = hooks.useProduce({
        highlight: false,
        disabled: false,
    });
    function toggle() {
        toggleItalic(textbus);
    }
    const sub = refreshService.onRefresh.subscribe(() => {
        const state = query.queryFormat(italicFormatter);
        update(draft => {
            draft.highlight = state.state === core$1.QueryStateType.Enabled;
        });
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return () => {
        const vm = viewModel();
        return jsxRuntime.jsx(Button, { highlight: vm.highlight, disabled: vm.disabled, onClick: toggle, children: jsxRuntime.jsx("span", { class: "xnote-icon-italic" }) });
    };
}

var scopedId$a = "vf-e74208";

exports.EditorService = class EditorService {
    constructor() {
        this.hideInlineToolbar = false;
        this.canShowLeftToolbar = true;
        this.onLeftToolbarCanVisibleChange = new core$1.Subject();
    }
    changeLeftToolbarVisible(b) {
        this.canShowLeftToolbar = b;
        this.onLeftToolbarCanVisibleChange.next();
    }
};
exports.EditorService = __decorate([
    core.Injectable({
        provideIn: 'root'
    })
], exports.EditorService);

function LinkTool(props) {
    const selectionBridge = core.inject(platformBrowser.SelectionBridge);
    const selection = core.inject(core$1.Selection);
    const commander = core.inject(core$1.Commander);
    const editorService = core.inject(exports.EditorService);
    const container = core.inject(platformBrowser.VIEW_CONTAINER);
    const isShow = core.createSignal(false);
    const inputRef = core.createRef();
    function setLink(ev) {
        ev.preventDefault();
        const value = inputRef.current.value;
        if (value) {
            commander.applyFormat(linkFormatter, {
                href: value,
                target: '_blanK'
            });
        }
        isShow.set(false);
    }
    let isClickFromSelf = false;
    const sub = core$1.fromEvent(document, 'click').subscribe(() => {
        if (isClickFromSelf) {
            isClickFromSelf = false;
            return;
        }
        editorService.hideInlineToolbar = false;
        isShow.set(false);
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return scopedCss.withScopedCSS(scopedId$a, () => {
        const containerRect = container.getBoundingClientRect();
        const rect = isShow() ? selectionBridge.getRect({
            slot: selection.focusSlot,
            offset: selection.focusOffset
        }) : {};
        return (jsxRuntime.jsxs("span", { children: [jsxRuntime.jsx(Button, { onClick: () => {
                        var _a;
                        isShow.set(true);
                        isClickFromSelf = true;
                        (_a = props.hideToolbar) === null || _a === void 0 ? void 0 : _a.call(props);
                    }, children: jsxRuntime.jsx("span", { class: "xnote-icon-link" }) }), isShow() &&
                    jsxRuntime.jsx(Popup, { left: rect.left - containerRect.left, top: rect.top + rect.height - containerRect.top, children: jsxRuntime.jsxs("form", { onSubmit: setLink, onClick: () => {
                                isClickFromSelf = true;
                            }, class: "input-group", children: [jsxRuntime.jsx("input", { ref: inputRef, placeholder: "\u8BF7\u8F93\u5165\u94FE\u63A5\u5730\u5740", type: "text" }), jsxRuntime.jsx(Button, { type: "submit", children: "\u786E\u5B9A" })] }) })] }));
    });
}

function StrikeThroughTool() {
    const query = core.inject(core$1.Query);
    const refreshService = core.inject(exports.RefreshService);
    const textbus = core.inject(core$1.Textbus);
    const [viewModel, update] = hooks.useProduce({
        highlight: false,
        disabled: false,
    });
    function toggle() {
        toggleStrikeThrough(textbus);
    }
    const sub = refreshService.onRefresh.subscribe(() => {
        const state = query.queryFormat(strikeThroughFormatter);
        update(draft => {
            draft.highlight = state.state === core$1.QueryStateType.Enabled;
        });
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return () => {
        const vm = viewModel();
        return jsxRuntime.jsx(Button, { highlight: vm.highlight, disabled: vm.disabled, onClick: toggle, children: jsxRuntime.jsx("span", { class: "xnote-icon-strikethrough" }) });
    };
}

function UnderlineTool() {
    const query = core.inject(core$1.Query);
    const refreshService = core.inject(exports.RefreshService);
    const textbus = core.inject(core$1.Textbus);
    const [viewModel, update] = hooks.useProduce({
        highlight: false,
        disabled: false,
    });
    function toggle() {
        toggleUnderline(textbus);
    }
    const sub = refreshService.onRefresh.subscribe(() => {
        const state = query.queryFormat(underlineFormatter);
        update(draft => {
            draft.highlight = state.state === core$1.QueryStateType.Enabled;
        });
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    return () => {
        const vm = viewModel();
        return jsxRuntime.jsx(Button, { highlight: vm.highlight, disabled: vm.disabled, onClick: toggle, children: jsxRuntime.jsx("span", { class: "xnote-icon-underline" }) });
    };
}

var scopedId$9 = "vf-cf8e1c";

class FileUploader {
}

class ImageComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        return new ImageComponent(textbus, Object.assign({}, json));
    }
}
ImageComponent.type = core$1.ContentType.InlineComponent;
ImageComponent.componentName = 'ImageComponent';
function ImageView(props) {
    const { name, state } = props.component;
    const imageRef = core.createRef();
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        if (readonly() || output()) {
            return (jsxRuntime.jsx("div", { class: "xnote-image", ref: props.rootRef, "data-component": name, children: jsxRuntime.jsx("img", { alt: "", src: state.src, style: {
                        width: state.width,
                        height: state.height
                    } }) }));
        }
        return (jsxRuntime.jsx("div", { class: "xnote-image", ref: props.rootRef, "data-component": name, children: jsxRuntime.jsx(DragResize, { source: imageRef, component: props.component, children: jsxRuntime.jsx("img", { alt: "", ref: imageRef, src: state.src, style: {
                        width: state.width,
                        height: state.height
                    } }) }) }));
    };
}
const imageComponentLoader = {
    match(element) {
        return element.tagName === 'IMG' || element.dataset.component === ImageComponent.componentName;
    },
    read(element, textbus) {
        const img = element instanceof HTMLImageElement ? element : (element.querySelector('img') || document.createElement('img'));
        return new ImageComponent(textbus, {
            src: img.src,
            width: img.style.width || 'auto',
            height: img.style.height || 'auto'
        });
    }
};

class VideoComponent extends core$1.Component {
    static fromJSON(textbus, json) {
        return new VideoComponent(textbus, Object.assign({}, json));
    }
    setup() {
        //
    }
}
VideoComponent.type = core$1.ContentType.InlineComponent;
VideoComponent.componentName = 'VideoComponent';
function VideoView(props) {
    const { name, state } = props.component;
    const videoRef = core.createRef();
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        if (readonly() || output()) {
            return (jsxRuntime.jsx("div", { class: "xnote-video", ref: props.rootRef, "data-component": name, children: jsxRuntime.jsx("video", { ref: videoRef, src: state.src, style: {
                        width: state.width,
                        height: state.height
                    } }) }));
        }
        return (jsxRuntime.jsx("div", { ref: props.rootRef, class: "xnote-video", "data-component": name, children: jsxRuntime.jsx(DragResize, { source: videoRef, component: props.component, children: jsxRuntime.jsx("video", { ref: videoRef, src: state.src, style: {
                        width: state.width,
                        height: state.height
                    } }) }) }));
    };
}
const videoComponentLoader = {
    match(element) {
        return element.tagName === 'VIDEO' || element.dataset.component === VideoComponent.componentName;
    },
    read(element, textbus) {
        const video = element instanceof HTMLVideoElement ? element : (element.querySelector('video') || document.createElement('video'));
        return new VideoComponent(textbus, {
            src: video.src,
            width: video.style.width || 'auto',
            height: video.style.height || 'auto'
        });
    }
};

class KatexEditor extends core$1.Textbus {
    constructor() {
        const adapter = new adapterViewfly.ViewflyAdapter({
            [SourceCodeComponent.componentName]: SourceCodeView
        }, (host, root, injector) => {
            const appInjector = new core.ReflectiveInjector(injector, [{
                    provide: OutputInjectionToken,
                    useValue: true
                }]);
            const app = platformBrowser$1.createApp(root, {
                context: appInjector
            }).mount(host);
            return () => {
                app.destroy();
            };
        });
        const browserModule = new platformBrowser.BrowserModule({
            adapter,
            renderTo: () => {
                return this.host;
            }
        });
        super({
            components: [
                SourceCodeComponent
            ],
            imports: [browserModule]
        });
        this.onValueChange = new core$1.Subject();
    }
    mount(host, code) {
        this.host = host;
        const model = new SourceCodeComponent(this, {
            lineNumber: true,
            autoBreak: true,
            lang: 'latex',
            theme: 'github',
            slots: code.split('\n').map(i => {
                const slot = new core$1.Slot([core$1.ContentType.Text]);
                slot.insert(i);
                return {
                    slot,
                    emphasize: false
                };
            })
        });
        this.onChange.subscribe(() => {
            const str = model.state.slots.map(i => {
                if (i.slot.isEmpty) {
                    return '';
                }
                return i.slot.toString();
            }).join('\n');
            this.onValueChange.next(str);
        });
        return this.render(model);
    }
}

class KatexComponent extends core$1.Component {
    static fromJSON(textbus, state) {
        return new KatexComponent(textbus, state);
    }
    constructor(textbus, state = {
        text: '% \\f is defined as #1f(#2) using the macro\n' +
            '\\f\\relax{x} = \\int_{-\\infty}^\\infty\n' +
            '\\f\\hat\\xi\\,e^{2 \\pi i \\xi x}\n' +
            '\\,d\\xi'
    }) {
        super(textbus, state);
    }
}
KatexComponent.componentName = 'KatexComponent';
KatexComponent.type = core$1.ContentType.InlineComponent;
function domToVDom(el) {
    const attrs = {};
    el.getAttributeNames().forEach(key => {
        attrs[key] = el.getAttribute(key);
    });
    attrs.children = Array.from(el.childNodes).map(child => {
        if (child.nodeType === Node.ELEMENT_NODE) {
            return domToVDom(child);
        }
        return child.textContent || '';
    });
    return core.jsx(el.tagName.toLowerCase(), attrs);
}
function KatexComponentView(props) {
    function toDOM(value) {
        let htmlString;
        try {
            htmlString = Katex.renderToString(value, {
                displayMode: true,
                leqno: false,
                fleqn: false,
                throwOnError: true,
                errorColor: '#cc0000',
                strict: 'warn',
                output: 'html',
                trust: false,
                macros: { '\\f': '#1f(#2)' }
            });
        }
        catch (e) {
            htmlString = '<span style="color: red">公式错误</span>';
        }
        return new DOMParser().parseFromString(htmlString, 'text/html').body.children[0];
    }
    const selection = core.inject(core$1.Textbus);
    const editorRef = core.createDynamicRef(node => {
        const editor = new KatexEditor();
        editor.mount(node, props.component.state.text).then(() => {
            editor.focus();
        });
        selection.blur();
        const subscription = editor.onValueChange.subscribe((value) => {
            props.component.state.text = value;
        }).add(core$1.fromEvent(node, 'mousedown').subscribe(ev => ev.stopPropagation()), core$1.fromEvent(document, 'mousedown').subscribe(() => {
            var _a;
            (_a = dropdownRef.current) === null || _a === void 0 ? void 0 : _a.isShow(false);
        }));
        return () => {
            subscription.unsubscribe();
            editor.destroy();
        };
    });
    const dropdownRef = core.createRef();
    const output = useOutput();
    const readonly = useReadonly();
    return () => {
        const text = props.component.state.text;
        return (jsxRuntime.jsx("span", { onClick: () => {
                var _a;
                (_a = dropdownRef.current) === null || _a === void 0 ? void 0 : _a.isShow(true);
            }, ref: props.rootRef, "data-component": KatexComponent.componentName, "data-katex": encodeURIComponent(text), class: "xnote-katex", children: (output() || readonly()) ?
                domToVDom(toDOM(text))
                :
                    jsxRuntime.jsx(Dropdown, { padding: '0', ref: dropdownRef, trigger: 'none', width: '600px', menu: jsxRuntime.jsx("div", { class: "xnote-katex-input", ref: editorRef }), children: domToVDom(toDOM(text)) }) }));
    };
}
const katexComponentLoader = {
    match(element) {
        return element.dataset.component === KatexComponent.componentName;
    },
    read(element, textbus) {
        const value = element.dataset.katex || '';
        return new KatexComponent(textbus, {
            text: decodeURIComponent(value)
        });
    }
};

function InsertTool(props) {
    const commander = core.inject(core$1.Commander);
    const selection = core.inject(core$1.Selection);
    const textbus = core.inject(core$1.Textbus);
    const fileUploader = core.inject(FileUploader, null);
    const dropdownContextService = core.inject(exports.DropdownContextService);
    function insert(type) {
        var _a;
        const component = (_a = props.slot) === null || _a === void 0 ? void 0 : _a.parent;
        if (!component) {
            return;
        }
        function insertComponent(comp) {
            if (props.replace) {
                commander.replaceComponent(component, comp);
            }
            else {
                commander.insertAfter(comp, component);
            }
            dropdownContextService.canHide = true;
            dropdownContextService.hide(false);
        }
        switch (type) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
            case 'paragraph':
                {
                    const slot = new core$1.Slot([
                        core$1.ContentType.InlineComponent,
                        core$1.ContentType.Text
                    ]);
                    if (/h[1-6]/.test(type)) {
                        slot.setAttribute(headingAttr, type);
                    }
                    const p = new ParagraphComponent(textbus, {
                        slot
                    });
                    insertComponent(p);
                    selection.setPosition(slot, 0);
                }
                break;
            case 'ol':
            case 'ul':
                {
                    const slot = new core$1.Slot([
                        core$1.ContentType.InlineComponent,
                        core$1.ContentType.Text
                    ]);
                    const list = new ListComponent(textbus, {
                        slot,
                        reorder: true,
                        type: type === 'ol' ? 'OrderedList' : 'UnorderedList'
                    });
                    insertComponent(list);
                    selection.setPosition(slot, 0);
                }
                break;
            case 'sourceCode':
                {
                    const slot = new core$1.Slot([
                        core$1.ContentType.Text
                    ]);
                    const comp = new SourceCodeComponent(textbus, {
                        lang: '',
                        lineNumber: true,
                        slots: [{
                                slot,
                                emphasize: false
                            }]
                    });
                    insertComponent(comp);
                    selection.setPosition(slot, 0);
                }
                break;
            case 'table':
                {
                    const table = new TableComponent(textbus);
                    insertComponent(table);
                    textbus.nextTick(() => {
                        selection.selectFirstPosition(table, true, true);
                    });
                }
                break;
            case 'todolist':
                {
                    const slot = new core$1.Slot([
                        core$1.ContentType.Text,
                        core$1.ContentType.InlineComponent
                    ]);
                    const comp = new TodolistComponent(textbus, {
                        slot,
                        checked: false
                    });
                    insertComponent(comp);
                    selection.setPosition(slot, 0);
                }
                break;
            case 'image':
                if (fileUploader) {
                    Promise.resolve().then(() => fileUploader.uploadFile('image')).then(url => {
                        const img = new ImageComponent(textbus, {
                            src: url
                        });
                        commander.insert(img);
                    });
                }
                break;
            case 'video':
                if (fileUploader) {
                    Promise.resolve().then(() => fileUploader.uploadFile('video')).then(url => {
                        const img = new VideoComponent(textbus, {
                            src: url
                        });
                        commander.insert(img);
                    });
                }
                break;
            case 'highlightBox':
                {
                    const p = new ParagraphComponent(textbus);
                    const comp = new HighlightBoxComponent(textbus);
                    comp.state.slot.insert(p);
                    insertComponent(comp);
                    selection.setPosition(p.state.slot, 0);
                }
                break;
            case 'katex':
                {
                    const p = new ParagraphComponent(textbus);
                    const comp = new KatexComponent(textbus);
                    p.state.slot.insert(comp);
                    insertComponent(p);
                    selection.selectComponent(comp);
                }
                break;
        }
    }
    return scopedCss.withScopedCSS(scopedId$9, () => {
        return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [props.hideTitle ? null : jsxRuntime.jsx(MenuHeading, { children: props.replace ? '替换为' : '在下面添加' }), jsxRuntime.jsxs("div", { class: "btn-group", children: [jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('paragraph'), children: jsxRuntime.jsx("span", { class: "xnote-icon-pilcrow" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('h1'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h1" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('h2'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h2" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('h3'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h3" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('h4'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h4" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('h5'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h5" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('h6'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h6" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('ol'), children: jsxRuntime.jsx("span", { class: "xnote-icon-list-numbered" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('ul'), children: jsxRuntime.jsx("span", { class: "xnote-icon-list" }) }), jsxRuntime.jsx(Button, { ordinary: true, onClick: () => insert('sourceCode'), children: jsxRuntime.jsx("span", { class: "xnote-icon-source-code" }) })] }), jsxRuntime.jsx(Divider, {}), jsxRuntime.jsx(MenuItem, { onClick: () => insert('table'), icon: jsxRuntime.jsx("span", { class: "xnote-icon-table" }), children: "\u8868\u683C" }), jsxRuntime.jsx(MenuItem, { onClick: () => insert('todolist'), icon: jsxRuntime.jsx("span", { class: "xnote-icon-checkbox-checked" }), children: "\u5F85\u529E\u5217\u8868" }), jsxRuntime.jsx(MenuItem, { onClick: () => insert('image'), icon: jsxRuntime.jsx("span", { class: "xnote-icon-image" }), children: "\u56FE\u7247" }), jsxRuntime.jsx(MenuItem, { onClick: () => insert('video'), icon: jsxRuntime.jsx("span", { class: "xnote-icon-video" }), children: "\u89C6\u9891" }), jsxRuntime.jsx(MenuItem, { onClick: () => insert('highlightBox'), icon: jsxRuntime.jsx("span", { class: "xnote-icon-hightlight-box" }), children: "\u9AD8\u4EAE\u5757" }), jsxRuntime.jsx(MenuItem, { onClick: () => insert('katex'), icon: jsxRuntime.jsx("span", { class: "xnote-icon-function" }), children: "\u6570\u5B66\u516C\u5F0F" })] });
    });
}

var scopedId$8 = "vf-b05292";

const LeftToolbar = core.withAnnotation({
    providers: [exports.RefreshService]
}, function LeftToolbar() {
    const adapter = core.inject(platformBrowser.DomAdapter);
    const textbus = core.inject(core$1.Textbus);
    const selection = core.inject(core$1.Selection);
    const rootComponentRef = core.inject(core$1.RootComponentRef);
    const refreshService = core.inject(exports.RefreshService);
    const editorService = core.inject(exports.EditorService);
    const checkStates = useActiveBlock();
    const toBlock = useBlockTransform();
    const activeSlot = core.createSignal(null);
    function transform(v) {
        const active = activeSlot();
        if (active) {
            selection.setBaseAndExtent(active, 0, active, active.length);
            selection.restore();
            toBlock(v);
            activeSlot.set(selection.focusSlot);
            refreshService.onRefresh.next();
        }
    }
    const [positionSignal, updatePosition] = hooks.useProduce({
        left: 0,
        top: 0,
        display: false
    });
    const sub = editorService.onLeftToolbarCanVisibleChange.subscribe(() => {
        updatePosition(d => {
            d.display = editorService.canShowLeftToolbar;
        });
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    let isIgnoreMove = false;
    core.onMounted(() => {
        const rootComponent = rootComponentRef.component;
        const docContentContainer = adapter.getNativeNodeBySlot(rootComponent.state.content);
        const sub = core$1.fromEvent(docContentContainer, 'mousemove').pipe(core$1.filter(() => {
            return !isIgnoreMove;
        }), core$1.map(ev => {
            var _a;
            let currentNode = ev.target;
            while (currentNode) {
                const slot = adapter.getSlotByNativeNode(currentNode);
                if (slot) {
                    if (((_a = slot === null || slot === void 0 ? void 0 : slot.parent) === null || _a === void 0 ? void 0 : _a.type) === core$1.ContentType.InlineComponent) {
                        currentNode = currentNode.parentNode;
                        continue;
                    }
                    return slot;
                }
                currentNode = currentNode.parentNode;
            }
            return null;
        }), core$1.distinctUntilChanged(), core$1.filter(slot => {
            return !slot || slot !== rootComponent.state.content;
        }), core$1.sampleTime(250), core$1.filter(() => {
            return !isShow();
        })).subscribe(slot => {
            activeSlot.set(slot);
            if (slot) {
                checkStates(slot);
                isEmptyBlock.set((slot.parent instanceof ParagraphComponent && slot.isEmpty) ||
                    slot.parent instanceof SourceCodeComponent ||
                    slot.parent instanceof TableComponent);
                const nativeNode = adapter.getNativeNodeByComponent(slot.parent);
                updatePosition(draft => {
                    const containerRect = docContentContainer.getBoundingClientRect();
                    const currentRect = nativeNode.getBoundingClientRect();
                    draft.display = true;
                    draft.left = currentRect.left - containerRect.left;
                    draft.top = currentRect.top - containerRect.top + docContentContainer.offsetTop;
                });
            }
            else {
                updatePosition(draft => {
                    draft.display = false;
                });
                isEmptyBlock.set(false);
            }
        });
        return () => sub.unsubscribe();
    });
    const subscription = core$1.merge(textbus.onChange, selection.onChange).pipe(core$1.debounceTime(20)).subscribe(() => {
        if (activeSlot()) {
            return;
        }
        refreshService.onRefresh.next();
    }).add(selection.onChange.pipe(core$1.throttleTime(30)).subscribe(() => {
        if (!selection.isCollapsed) {
            updatePosition(draft => {
                draft.display = false;
            });
        }
    }));
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    const toolbarRef = core.createRef();
    const btnRef = core.createRef();
    const isShow = core.createSignal(false);
    core.onMounted(() => {
        let leaveSub;
        const bindLeave = function () {
            leaveSub = core$1.fromEvent(toolbarRef.current, 'mouseleave').pipe(core$1.delay(200)).subscribe(() => {
                isShow.set(false);
            });
        };
        bindLeave();
        subscription.add(core$1.fromEvent(toolbarRef.current, 'mouseenter').subscribe(() => {
            if (leaveSub) {
                leaveSub.unsubscribe();
            }
            bindLeave();
            isShow.set(true);
        }));
    });
    function applyBefore() {
        const slot = activeSlot();
        if (slot) {
            selection.selectSlot(slot);
            textbus.nextTick(() => {
                refreshService.onRefresh.next();
            });
        }
    }
    const commander = core.inject(core$1.Commander);
    function copy() {
        const slot = activeSlot();
        if (!slot) {
            return;
        }
        selection.selectComponent(slot.parent, true);
        commander.copy();
    }
    function cut() {
        const slot = activeSlot();
        if (!slot) {
            return;
        }
        copy();
        remove();
    }
    function remove() {
        const slot = activeSlot();
        if (!slot) {
            return;
        }
        if (slot.parent.__slots__.length <= 1) {
            commander.removeComponent(slot.parent);
        }
        else {
            selection.selectSlot(slot);
            commander.delete();
        }
    }
    const isEmptyBlock = core.createSignal(true);
    function changeIgnoreMove(b) {
        isIgnoreMove = b;
    }
    return scopedCss.withScopedCSS(scopedId$8, () => {
        var _a;
        const position = positionSignal();
        const slot = activeSlot();
        let activeNode = jsxRuntime.jsx("span", { class: "xnote-icon-pilcrow" });
        const states = checkStates(slot);
        if (slot) {
            const types = [
                [states.paragraph, jsxRuntime.jsx("span", { class: "xnote-icon-pilcrow" })],
                [states.sourceCode, jsxRuntime.jsx("span", { class: "xnote-icon-source-code" })],
                [states.blockquote, jsxRuntime.jsx("span", { class: "xnote-icon-quotes-right" })],
                [states.todolist, jsxRuntime.jsx("span", { class: "xnote-icon-checkbox-checked" })],
                [states.table, jsxRuntime.jsx("span", { class: "xnote-icon-table" })],
                [states.unorderedList, jsxRuntime.jsx("span", { class: "xnote-icon-list" })],
                [states.orderedList, jsxRuntime.jsx("span", { class: "xnote-icon-list-numbered" })],
                [states.h1, jsxRuntime.jsx("span", { class: "xnote-icon-heading-h1" })],
                [states.h2, jsxRuntime.jsx("span", { class: "xnote-icon-heading-h2" })],
                [states.h3, jsxRuntime.jsx("span", { class: "xnote-icon-heading-h3" })],
                [states.h4, jsxRuntime.jsx("span", { class: "xnote-icon-heading-h4" })],
                [states.h5, jsxRuntime.jsx("span", { class: "xnote-icon-heading-h5" })],
                [states.h6, jsxRuntime.jsx("span", { class: "xnote-icon-heading-h6" })],
            ];
            for (const t of types) {
                if (t[0]) {
                    activeNode = t[1];
                    break;
                }
            }
        }
        const activeParentComponent = (_a = activeSlot()) === null || _a === void 0 ? void 0 : _a.parent;
        const needInsert = activeParentComponent instanceof TableComponent || activeParentComponent instanceof SourceCodeComponent;
        return (jsxRuntime.jsx("div", { class: "left-toolbar", ref: toolbarRef, children: jsxRuntime.jsx("div", { class: "left-toolbar-btn-wrap", ref: btnRef, style: {
                    left: position.left + 'px',
                    top: position.top + 'px',
                    display: position.display && selection.isCollapsed && editorService.canShowLeftToolbar ? 'block' : 'none'
                }, children: jsxRuntime.jsx(Dropdown, { toLeft: true, onExpendStateChange: changeIgnoreMove, abreast: true, style: {
                        position: 'absolute',
                        right: 0,
                        top: 0
                    }, menu: isEmptyBlock() ?
                        jsxRuntime.jsx(InsertTool, { replace: !needInsert, slot: activeSlot() })
                        :
                            jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs("div", { class: "btn-group", children: [jsxRuntime.jsx(Button, { ordinary: true, highlight: states.paragraph, onClick: () => transform('paragraph'), children: jsxRuntime.jsx("span", { class: "xnote-icon-pilcrow" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.h1, onClick: () => transform('h1'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h1" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.h2, onClick: () => transform('h2'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h2" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.h3, onClick: () => transform('h3'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h3" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.h4, onClick: () => transform('h4'), children: jsxRuntime.jsx("span", { class: "xnote-icon-heading-h4" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.todolist, onClick: () => transform('todolist'), children: jsxRuntime.jsx("span", { class: "xnote-icon-checkbox-checked" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.orderedList, onClick: () => transform('ol'), children: jsxRuntime.jsx("span", { class: "xnote-icon-list-numbered" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.unorderedList, onClick: () => transform('ul'), children: jsxRuntime.jsx("span", { class: "xnote-icon-list" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.blockquote, onClick: () => transform('blockquote'), children: jsxRuntime.jsx("span", { class: "xnote-icon-quotes-right" }) }), jsxRuntime.jsx(Button, { ordinary: true, highlight: states.sourceCode, onClick: () => transform('sourceCode'), children: jsxRuntime.jsx("span", { class: "xnote-icon-source-code" }) })] }), jsxRuntime.jsx(Divider, {}), jsxRuntime.jsx(AttrTool, { style: { display: 'block' }, abreast: true, slot: slot, applyBefore: applyBefore, children: jsxRuntime.jsx(MenuItem, { arrow: true, icon: jsxRuntime.jsx("span", { class: "xnote-icon-indent-decrease" }), children: "\u7F29\u8FDB\u548C\u5BF9\u9F50" }) }), jsxRuntime.jsx(ColorTool, { style: { display: 'block' }, abreast: true, applyBefore: applyBefore, children: jsxRuntime.jsx(MenuItem, { arrow: true, icon: jsxRuntime.jsx("span", { class: "xnote-icon-color" }), children: "\u989C\u8272" }) }), jsxRuntime.jsx(Divider, {}), jsxRuntime.jsx(MenuItem, { onClick: copy, icon: jsxRuntime.jsx("span", { class: "xnote-icon-copy" }), children: "\u590D\u5236" }), jsxRuntime.jsx(MenuItem, { onClick: remove, icon: jsxRuntime.jsx("span", { class: "xnote-icon-bin" }), children: "\u5220\u9664" }), jsxRuntime.jsx(MenuItem, { onClick: cut, icon: jsxRuntime.jsx("span", { class: "xnote-icon-cut" }), children: "\u526A\u5207" }), jsxRuntime.jsx(Divider, {}), jsxRuntime.jsx(Dropdown, { style: { display: 'block' }, abreast: true, menu: jsxRuntime.jsx(InsertTool, { hideTitle: true, slot: activeSlot() }), children: jsxRuntime.jsx(MenuItem, { arrow: true, icon: jsxRuntime.jsx("span", { class: "xnote-icon-plus" }), children: "\u5728\u4E0B\u9762\u6DFB\u52A0" }) })] }), children: jsxRuntime.jsx("button", { type: "button", class: "left-toolbar-btn", children: isEmptyBlock() ?
                            jsxRuntime.jsx("span", { children: jsxRuntime.jsx("i", { class: "xnote-icon-plus" }) })
                            :
                                jsxRuntime.jsxs("span", { children: [activeNode, jsxRuntime.jsx("i", { style: "font-size: 12px", class: "xnote-icon-more" })] }) }) }) }) }));
    });
});

class LeftToolbarPlugin {
    constructor() {
        this.app = null;
    }
    setup(injector) {
        const App = function () {
            const readonly = useReadonly();
            return () => {
                return readonly() ? null : jsxRuntime.jsx(LeftToolbar, {});
            };
        };
        this.app = core.viewfly({
            root: jsxRuntime.jsx(App, {}),
            context: injector,
            nativeRenderer: new platformBrowser$1.DomRenderer(),
            autoUpdate: true
        });
        const viewDocument = injector.get(platformBrowser.VIEW_CONTAINER);
        const host = document.createElement('div');
        viewDocument.appendChild(host);
        this.app.mount(host);
    }
    onDestroy() {
        var _a;
        (_a = this.app) === null || _a === void 0 ? void 0 : _a.destroy();
    }
}

var scopedId$7 = "vf-3073ba";

function LinkJump() {
    const selection = core.inject(core$1.Selection);
    const query = core.inject(core$1.Query);
    const bridge = core.inject(platformBrowser.SelectionBridge);
    const container = core.inject(platformBrowser.VIEW_CONTAINER);
    const href = core.createSignal('');
    const ref = core.createRef();
    const isShow = core.createSignal(false);
    function onSelectionChange() {
        if (selection.isCollapsed) {
            const queryState = query.queryFormat(linkFormatter);
            if (queryState.state === core$1.QueryStateType.Enabled) {
                const rect = bridge.getRect({
                    slot: selection.startSlot,
                    offset: selection.startOffset
                });
                if (rect) {
                    const offsetRect = container.getBoundingClientRect();
                    Object.assign(ref.current.style, {
                        left: rect.left - offsetRect.left + 'px',
                        top: rect.top - offsetRect.top + 'px'
                    });
                    isShow.set(true);
                    let url = queryState.value.href;
                    if (url.indexOf('://') < 0) {
                        url = 'http://' + url;
                    }
                    href.set(url);
                    return;
                }
            }
        }
        isShow.set(false);
    }
    selection.onChange.pipe(core$1.delay()).subscribe(() => {
        onSelectionChange();
    });
    function cleanLink() {
        isShow.set(false);
        const commonAncestorSlot = selection.commonAncestorSlot;
        const index = selection.focusOffset;
        const ranges = commonAncestorSlot.getFormatRangesByFormatter(linkFormatter, 0, commonAncestorSlot.length);
        ranges.forEach(range => {
            if (range.startIndex < index && range.endIndex >= index) {
                commonAncestorSlot.applyFormat(linkFormatter, {
                    startIndex: range.startIndex,
                    endIndex: range.endIndex,
                    value: null
                });
            }
        });
    }
    return platformBrowser$1.createPortal(scopedCss.withScopedCSS(scopedId$7, () => {
        return (jsxRuntime.jsxs("div", { ref: ref, class: "link-jump-plugin", style: { display: isShow() ? '' : 'none' }, children: [jsxRuntime.jsx("span", { onClick: cleanLink, children: "\u6E05\u9664" }), jsxRuntime.jsx("a", { target: "_blank", href: href(), children: "\u8DF3\u8F6C" })] }));
    }), container);
}

var scopedId$6 = "vf-fee98b";

const Toolbar = core.withAnnotation({
    providers: [exports.RefreshService]
}, function Toolbar() {
    const selection = core.inject(core$1.Selection);
    const viewDocument = core.inject(platformBrowser.VIEW_CONTAINER);
    const rootComponentRef = core.inject(core$1.RootComponentRef);
    const adapter = core.inject(platformBrowser.DomAdapter);
    const bridge = core.inject(platformBrowser.SelectionBridge);
    const textbus = core.inject(core$1.Textbus);
    const editorService = core.inject(exports.EditorService);
    const refreshService = core.inject(exports.RefreshService);
    const subscription = core$1.merge(textbus.onChange, selection.onChange).pipe(core$1.debounceTime(20)).subscribe(() => {
        refreshService.onRefresh.next();
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    const [viewPosition, updateViewPosition] = hooks.useProduce({
        left: 0,
        top: 0,
        isHide: true,
        opacity: 0,
        transitionDuration: 0
    });
    let mouseupSubscription = new core$1.Subscription();
    const toolbarRef = core.createRef();
    function getTop() {
        const docRect = viewDocument.getBoundingClientRect();
        const toolbarHeight = 36;
        // const documentHeight = document.documentElement.clientHeight
        const selectionFocusRect = bridge.getRect({
            slot: selection.focusSlot,
            offset: selection.focusOffset
        });
        if (!selectionFocusRect) {
            return null;
        }
        const centerLeft = selectionFocusRect.left;
        const toBottom = selectionFocusRect.top < toolbarHeight + 10;
        const top = toBottom ?
            selectionFocusRect.top + selectionFocusRect.height - docRect.top + 10 :
            selectionFocusRect.top - docRect.top - toolbarHeight - 10;
        updateViewPosition(draft => {
            draft.transitionDuration = .15;
            draft.left = centerLeft - docRect.left;
            draft.top = top + 10;
        });
        return top;
    }
    const sub = textbus.onChange.pipe(core$1.debounceTime(100)).subscribe(() => {
        if (!viewPosition().isHide) {
            const top = getTop();
            if (top !== null) {
                updateViewPosition(draft => {
                    draft.top = top;
                });
            }
        }
    });
    core.onUnmounted(() => {
        sub.unsubscribe();
    });
    function bindMouseup() {
        const docElement = adapter.getNativeNodeByComponent(rootComponentRef.component);
        mouseupSubscription = core$1.fromEvent(docElement, 'mouseup').pipe(core$1.filter(ev => {
            return !ev.composedPath().includes(toolbarRef.current);
        }), core$1.delay(100), core$1.filter(() => {
            return !selection.isCollapsed && !(selection.commonAncestorComponent instanceof SourceCodeComponent);
        }), core$1.map(getTop), core$1.delay(200)).subscribe((top) => {
            if (top !== null) {
                updateViewPosition(draft => {
                    draft.isHide = false;
                    draft.opacity = 1;
                    draft.top = top;
                });
            }
        });
    }
    const mousedownSubscription = core$1.fromEvent(document, 'mousedown').subscribe((ev) => {
        if (ev.composedPath().includes(toolbarRef.current)) {
            return;
        }
        mouseupSubscription.unsubscribe();
        updateViewPosition(draft => {
            draft.opacity = 0;
            draft.isHide = true;
            draft.transitionDuration = 0;
        });
        bindMouseup();
    });
    const instance = core.getCurrentInstance();
    function hideToolbar() {
        editorService.hideInlineToolbar = true;
        instance.markAsDirtied();
    }
    core.onUnmounted(() => {
        mousedownSubscription.unsubscribe();
        mouseupSubscription.unsubscribe();
    });
    return scopedCss.withScopedCSS(scopedId$6, () => {
        const p = viewPosition();
        return (jsxRuntime.jsxs("div", { class: "toolbar", ref: toolbarRef, style: {
                left: p.left + 'px',
                top: p.top + 'px',
                pointerEvents: p.isHide ? 'none' : 'initial',
                opacity: p.opacity,
                display: editorService.hideInlineToolbar ? 'none' : '',
                transitionDuration: p.transitionDuration + 's'
            }, children: [jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(BlockTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(AttrTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(BoldTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(ItalicTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(StrikeThroughTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(UnderlineTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(FontSizeTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(FontFamilyTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(LinkTool, { hideToolbar: hideToolbar }) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(CodeTool, {}) }), jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(ColorTool, {}) })] }));
    });
});

class ToolbarPlugin {
    constructor() {
        this.app = null;
    }
    setup(injector) {
        const App = function () {
            const readonly = useReadonly();
            return () => {
                return readonly() ? null : jsxRuntime.jsx(Toolbar, {});
            };
        };
        this.app = platformBrowser$1.createApp(jsxRuntime.jsx(App, {}), {
            context: injector
        });
        const viewDocument = injector.get(platformBrowser.VIEW_DOCUMENT);
        const host = document.createElement('div');
        viewDocument.appendChild(host);
        this.app.mount(host);
    }
    onDestroy() {
        var _a;
        (_a = this.app) === null || _a === void 0 ? void 0 : _a.destroy();
    }
}

class Matcher {
    constructor(target, rule) {
        this.target = target;
        this.rule = rule;
        this.validators = [];
        this.excludeValidators = [];
        if (rule.tags) {
            this.validators.push(this.makeTagsMatcher(rule.tags));
        }
        if (rule.styles) {
            this.validators.push(this.makeStyleMatcher(rule.styles));
        }
        if (rule.attrs) {
            this.validators.push(this.makeAttrsMatcher(rule.attrs));
        }
        if (rule.excludeStyles) {
            this.excludeValidators.push(this.makeStyleMatcher(rule.excludeStyles));
        }
        if (rule.excludeAttrs) {
            this.excludeValidators.push(this.makeAttrsMatcher(rule.excludeAttrs));
        }
    }
    match(element) {
        if (this.rule.filter) {
            const b = this.rule.filter(element);
            if (!b) {
                return false;
            }
        }
        const exclude = this.excludeValidators.map(fn => fn(element)).includes(true);
        if (exclude) {
            return false;
        }
        return this.validators.map(fn => fn(element)).includes(true);
    }
    extractFormatData(node, config) {
        const attrs = {};
        if (config.attrs) {
            config.attrs.forEach(key => {
                attrs[key] = node.getAttribute(key);
            });
        }
        const style = {};
        if (config.styleName) {
            (Array.isArray(config.styleName) ? config.styleName : [config.styleName]).forEach(name => {
                const v = node.style[name];
                if (v) {
                    style[name] = v;
                }
            });
        }
        return {
            tag: config.tag ? node.nodeName.toLowerCase() : null,
            attrs: Object.keys(attrs).length ? attrs : null,
            styles: style
        };
    }
    makeTagsMatcher(tags) {
        return (node) => {
            const tagName = node.nodeName.toLowerCase();
            return Array.isArray(tags) ? tags.includes(tagName) : tags.test(tagName);
        };
    }
    makeAttrsMatcher(attrs) {
        return (node) => {
            return attrs.map(attr => {
                if (attr.value) {
                    return node.getAttribute(attr.key) === attr.value;
                }
                return node.hasAttribute(attr.key);
            }).includes(true);
        };
    }
    makeStyleMatcher(styles) {
        return (node) => {
            return !Object.keys(styles).map(key => {
                const optionValue = (Array.isArray(styles[key]) ?
                    styles[key] :
                    [styles[key]]);
                let styleValue = node.style[key];
                if (key === 'fontFamily' && typeof styleValue === 'string') {
                    styleValue = styleValue.replace(/['"]/g, '');
                }
                if (styleValue) {
                    return optionValue.map(v => {
                        if (v instanceof RegExp) {
                            return v.test(styleValue);
                        }
                        return v === styleValue;
                    }).includes(true);
                }
                return false;
            }).includes(false);
        };
    }
}

class Organization {
}
function registerAtShortcut(textbus) {
    const keyboard = textbus.get(core$1.Keyboard);
    const selection = textbus.get(core$1.Selection);
    const commander = textbus.get(core$1.Commander);
    keyboard.addShortcut({
        keymap: {
            key: '@',
            shiftKey: true
        },
        action() {
            const { commonAncestorComponent } = selection;
            if (commonAncestorComponent instanceof SourceCodeComponent) {
                return false;
            }
            const at = new AtComponent(textbus);
            commander.insert(at);
            selection.setPosition(at.state.slot, 0);
        }
    });
}
class AtComponent extends core$1.Component {
    static fromJSON(textbus, { slot: slotState, userInfo }) {
        const registry = textbus.get(core$1.Registry);
        if (slotState) {
            const slot = registry.createSlot(slotState);
            return new AtComponent({
                slot
            });
        }
        return new AtComponent(textbus, {
            userInfo,
        });
    }
    constructor(textbus, state = {
        slot: new core$1.Slot([core$1.ContentType.Text])
    }) {
        if (!state.userInfo && !state.slot) {
            state.slot = new core$1.Slot([core$1.ContentType.Text]);
        }
        super(textbus, state);
        this.focus = new core$1.Subject();
        this.members = core.createSignal([]);
        this.selectedIndex = core.createSignal(0);
    }
    setup() {
        let isFocus = false;
        core$1.onFocus(() => {
            isFocus = true;
            this.focus.next(true);
            onChange.next();
        });
        core$1.onBlur(() => {
            isFocus = false;
            this.focus.next(false);
            setTimeout(() => {
                if (this.parent && !this.state.userInfo) {
                    const slot = this.state.slot;
                    let text = '@';
                    if (slot) {
                        text += slot.isEmpty ? '' : slot.toString();
                    }
                    const snapshot = selection.createSnapshot();
                    selection.selectComponent(this);
                    commander.insert(text);
                    snapshot.restore(true);
                }
            });
        });
        const organization = core$1.useContext(Organization);
        const selection = core$1.useContext(core$1.Selection);
        const commander = core$1.useContext(core$1.Commander);
        const onChange = new core$1.Subject();
        core$1.onContentInserted((ev) => {
            const key = this.state.slot.toString();
            if (key.length > 10) {
                selection.selectComponent(this);
                commander.insert(key);
                ev.preventDefault();
                return;
            }
            onChange.next();
        });
        core$1.onContentDeleted(() => {
            onChange.next();
        });
        core$1.onBreak((ev) => {
            const member = this.members()[this.selectedIndex()];
            if (member) {
                this.state.userInfo = Object.assign({}, member);
            }
            selection.selectComponentEnd(this);
            ev.preventDefault();
        });
        core$1.useDynamicShortcut({
            keymap: {
                key: ['ArrowDown', 'ArrowUp']
            },
            action: (key) => {
                let index = this.selectedIndex();
                if (key === 'ArrowUp') {
                    if (index > 0) {
                        index--;
                        this.selectedIndex.set(index);
                    }
                    return;
                }
                if (index < this.members().length - 1) {
                    index++;
                    this.selectedIndex.set(index);
                }
            }
        });
        const subs = onChange.pipe(core$1.switchMap(() => {
            const key = this.state.slot.toString();
            return core$1.fromPromise(organization.getMembers(key));
        })).subscribe((members) => {
            this.members.set(members);
            this.selectedIndex.set(0);
            if (isFocus) {
                this.focus.next(true);
            }
        });
        core$1.onDestroy(() => {
            subs.unsubscribe();
        });
    }
}
AtComponent.componentName = 'AtComponent';
AtComponent.type = core$1.ContentType.InlineComponent;

function AtComponentView(props) {
    const selection = core.inject(core$1.Selection);
    const dropdownRef = core.createRef();
    const subscription = props.component.focus.subscribe((b) => {
        if (dropdownRef.current && props.component.members().length) {
            dropdownRef.current.isShow(b);
        }
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    const readonly = useReadonly();
    const output = useOutput();
    const membersRef = core.createRef();
    core.onUpdated(() => {
        if (output() || readonly()) {
            return;
        }
        const container = membersRef.current;
        if (container) {
            const focusItem = container.children[props.component.selectedIndex()];
            if (focusItem) {
                const itemRect = focusItem.getBoundingClientRect();
                const dropdownMenu = container.parentNode.parentNode;
                const containerRect = dropdownMenu.getBoundingClientRect();
                if (itemRect.top - 5 < containerRect.top) {
                    dropdownMenu.scrollTop += itemRect.top - 5 - containerRect.top;
                }
                else if (itemRect.bottom + 5 > containerRect.bottom) {
                    dropdownMenu.scrollTop += itemRect.bottom + 5 - containerRect.bottom;
                }
            }
        }
    });
    return () => {
        const { slot, userInfo } = props.component.state;
        const selectedIndex = props.component.selectedIndex();
        if (userInfo) {
            return (jsxRuntime.jsxs("div", { class: "xnote-at xnote-at-complete", "data-info": encodeURIComponent(JSON.stringify(userInfo)), ref: props.rootRef, "data-component": props.component.name, children: [jsxRuntime.jsx("span", { children: "@" }), userInfo.name] }));
        }
        if (readonly() || output()) {
            return (jsxRuntime.jsxs("div", { class: "xnote-at", ref: props.rootRef, "data-component": props.component.name, children: [jsxRuntime.jsx("span", { children: "@" }), slot && jsxRuntime.jsx(SlotRender, { slot: slot, class: 'xnote-at-input', tag: "span" })] }));
        }
        const members = props.component.members();
        return (jsxRuntime.jsx("div", { class: "xnote-at", ref: props.rootRef, "data-component": props.component.name, children: jsxRuntime.jsxs(Dropdown, { trigger: 'none', ref: dropdownRef, menu: jsxRuntime.jsx("div", { class: "xnote-at-menu", ref: membersRef, children: members.map((member, index) => {
                        let hsl = color.any2Hsl(member.color);
                        if (hsl === 'unknown') {
                            hsl = color.any2Hsl('#000');
                        }
                        const rgb = color.hsl2Rgb(hsl);
                        const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
                        const color$1 = yiq >= 128 ? '#000' : '#fff';
                        return (jsxRuntime.jsxs("div", { onClick: () => {
                                props.component.state.userInfo = member;
                                selection.selectComponentEnd(props.component);
                            }, class: ['xnote-at-member', { selected: index === selectedIndex }], children: [jsxRuntime.jsx("div", { class: "xnote-at-member-avatar", children: member.avatar ? jsxRuntime.jsx("img", { src: member.avatar, alt: member.name }) :
                                        jsxRuntime.jsx("span", { class: "xnote-at-member-avatar-bg", style: { background: member.color, color: color$1 }, children: member.name }) }), jsxRuntime.jsxs("div", { class: "xnote-at-member-info", children: [jsxRuntime.jsx("div", { class: "xnote-at-member-name", children: member.name }), jsxRuntime.jsx("div", { class: "xnote-at-member-desc", children: member.groupName })] })] }, member.id));
                    }) }), children: [jsxRuntime.jsx("span", { children: "@" }), slot && jsxRuntime.jsx(SlotRender, { slot: slot, tag: 'span', class: 'xnote-at-input' })] }) }));
    };
}
const atComponentLoader = {
    match(element) {
        return element.dataset.component === AtComponent.componentName;
    },
    read(element, textbus, slotParser) {
        const data = element.dataset.info;
        if (data) {
            return new AtComponent(textbus, {
                userInfo: JSON.parse(decodeURIComponent(data))
            });
        }
        const slot = slotParser(new core$1.Slot([core$1.ContentType.Text]), element.querySelector('.xnote-at-input') || document.createElement('div'));
        return new AtComponent(textbus, {
            slot
        });
    }
};

class RootComponent extends core$1.Component {
    constructor() {
        super(...arguments);
        this.onCompositionStart = new core$1.Subject();
    }
    static fromJSON(textbus, json) {
        const content = textbus.get(core$1.Registry).createSlot(json.content);
        return new RootComponent(textbus, {
            content
        });
    }
    setup() {
        useBlockContent((slot) => slot === this.state.content);
        core$1.onCompositionStart(ev => {
            this.onCompositionStart.next(ev);
        });
    }
    afterCheck() {
        const content = this.state.content;
        const lastContent = content.getContentAtIndex(content.length - 1);
        if (lastContent instanceof ParagraphComponent ||
            lastContent instanceof ListComponent ||
            lastContent instanceof TodolistComponent) {
            return;
        }
        content.retain(content.length);
        content.insert(new ParagraphComponent(this.textbus));
    }
}
RootComponent.componentName = 'RootComponent';
RootComponent.type = core$1.ContentType.BlockComponent;
function RootView(props) {
    const { content } = props.component.state;
    const ref = core.createDynamicRef(node => {
        const sub = props.component.onCompositionStart.subscribe(() => {
            node.children[0].dataset.placeholder = '';
        });
        return () => {
            sub.unsubscribe();
        };
    });
    core.onUpdated(() => {
        props.component.afterCheck();
    });
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const { rootRef } = props;
        return (jsxRuntime.jsx("div", { class: "xnote-root", dir: 'auto', ref: [rootRef, ref], "data-component": props.component.name, children: jsxRuntime.jsx(SlotRender, { slot: content, tag: 'div', class: "xnote-content", "data-placeholder": content.isEmpty ? '请输入内容' : '', renderEnv: readonly() || output() }) }));
    };
}
const rootComponentLoader = {
    match() {
        return true;
    },
    read(element, textbus, slotParser) {
        const delta = slotParser(new core$1.Slot([
            core$1.ContentType.BlockComponent,
            core$1.ContentType.InlineComponent,
            core$1.ContentType.Text
        ]), element).toDelta();
        const slot = new core$1.Slot([
            core$1.ContentType.BlockComponent
        ]);
        deltaToBlock(delta, textbus).forEach(i => {
            slot.insert(i);
        });
        return slot;
    }
};

var scopedId$5 = "vf-681de2";

let TableService = class TableService {
    constructor() {
        this.onInsertRowBefore = new core$1.Subject();
        this.onInsertColumnBefore = new core$1.Subject();
        this.onSelectColumns = new core$1.Subject();
        this.onSelectRows = new core$1.Subject();
        this.onScroll = new core$1.Subject();
    }
};
TableService = __decorate([
    core.Injectable()
], TableService);

function ResizeColumn(props) {
    const dragLineRef = core.createRef();
    let activeCol = null;
    const editorService = core.inject(exports.EditorService);
    core.onMounted(() => {
        const { tableRef } = props;
        let isDrag = false;
        let ignoreMove = false;
        const subscription = core$1.fromEvent(document, 'mousedown').subscribe(() => {
            ignoreMove = true;
        }).add(core$1.fromEvent(document, 'mouseup').subscribe(() => {
            ignoreMove = false;
        })).add(core$1.fromEvent(tableRef.current.parentNode, 'mousemove').subscribe(ev => {
            if (isDrag || ignoreMove) {
                return;
            }
            const tableRect = tableRef.current.getBoundingClientRect();
            const leftDistance = ev.clientX - tableRect.x;
            const state = props.component.state;
            let x = 0;
            for (let i = 0; i < state.layoutWidth.length + 1; i++) {
                const n = leftDistance - x;
                if (i > 0 && Math.abs(n) < 5) {
                    Object.assign(dragLineRef.current.style, {
                        left: x + 'px',
                        display: 'block'
                    });
                    activeCol = i;
                    break;
                }
                activeCol = null;
                dragLineRef.current.style.display = 'none';
                x += state.layoutWidth[i];
            }
        })).add(core$1.fromEvent(dragLineRef.current, 'mousedown').subscribe(downEvent => {
            isDrag = true;
            editorService.changeLeftToolbarVisible(false);
            props.onActiveStateChange(true);
            const x = downEvent.clientX;
            const layoutWidth = props.component.state.layoutWidth;
            const initWidth = layoutWidth[activeCol - 1];
            const initLeft = layoutWidth.slice(0, activeCol).reduce((a, b) => a + b, 0);
            const minWidth = 30;
            const minLeft = initLeft - initWidth + minWidth;
            const layoutWidthArr = layoutWidth.slice();
            const moveEvent = core$1.fromEvent(document, 'mousemove').subscribe(moveEvent => {
                const distanceX = moveEvent.clientX - x;
                dragLineRef.current.style.left = Math.max(initLeft + distanceX, minLeft) + 'px';
                layoutWidthArr[activeCol - 1] = Math.max(initWidth + distanceX, minWidth);
                props.layoutWidth.set(layoutWidthArr.slice());
            }).add(core$1.fromEvent(document, 'mouseup').subscribe(upEvent => {
                isDrag = false;
                editorService.changeLeftToolbarVisible(true);
                props.onActiveStateChange(false);
                moveEvent.unsubscribe();
                const distanceX = upEvent.clientX - x;
                props.component.state.layoutWidth[activeCol - 1] = Math.max(initWidth + distanceX, minWidth);
                props.layoutWidth.set(props.component.state.layoutWidth);
            }));
        }));
        return () => {
            subscription.unsubscribe();
        };
    });
    const tableService = core.inject(TableService);
    core.onMounted(() => {
        const sub = tableService.onInsertColumnBefore.subscribe(n => {
            if (n === null) {
                dragLineRef.current.style.display = 'none';
                return;
            }
            const state = props.component.state;
            const left = state.layoutWidth.slice(0, n).reduce((a, b) => a + b, 0) - 0.5;
            dragLineRef.current.style.display = 'block';
            dragLineRef.current.style.left = left + 'px';
        });
        return () => sub.unsubscribe();
    });
    return scopedCss.withScopedCSS(scopedId$5, () => {
        return jsxRuntime.jsx("div", { ref: dragLineRef, class: ['drag-line'] });
    });
}

var scopedId$4 = "vf-39cb2c";

function TopBar(props) {
    const editorService = core.inject(exports.EditorService);
    const selection = core.inject(core$1.Selection);
    const tableService = core.inject(TableService);
    const textbus = core.inject(core$1.Textbus);
    const selectedColumnRange = core.createSignal(null);
    function selectColumn(index, isMultiple) {
        editorService.hideInlineToolbar = true;
        const currentSelectedColumnRange = selectedColumnRange();
        if (isMultiple && currentSelectedColumnRange) {
            selectedColumnRange.set({
                startIndex: currentSelectedColumnRange.startIndex,
                endIndex: index
            });
        }
        else {
            selectedColumnRange.set({
                startIndex: index, endIndex: index
            });
        }
        const range = selectedColumnRange();
        const [startIndex, endIndex] = [range.startIndex, range.endIndex].sort((a, b) => a - b);
        const selectedSlots = [];
        const rows = props.component.state.rows;
        rows.forEach(row => {
            selectedSlots.push(...row.cells.slice(startIndex, endIndex + 1).map(i => i.slot));
        });
        textbus.nextTick(() => {
            selection.setSelectedRanges(selectedSlots.map(i => {
                return {
                    slot: i,
                    startIndex: 0,
                    endIndex: i.length
                };
            }));
            selection.restore();
            textbus.focus();
        });
    }
    let mouseDownFromToolbar = false;
    core.onMounted(() => {
        const sub = core$1.fromEvent(document, 'click').subscribe(() => {
            if (mouseDownFromToolbar) {
                mouseDownFromToolbar = false;
                return;
            }
            deleteIndex.set(null);
            selectedColumnRange.set(null);
        });
        return () => sub.unsubscribe();
    });
    const leftDistance = core.createSignal(0);
    core.onMounted(() => {
        const sub = tableService.onScroll.subscribe(n => {
            leftDistance.set(n);
        });
        return () => sub.unsubscribe();
    });
    const instance = core.getCurrentInstance();
    const s = props.component.changeMarker.onChange.subscribe(() => {
        instance.markAsDirtied();
    });
    core.onUnmounted(() => {
        s.unsubscribe();
    });
    const deleteIndex = core.createSignal(null);
    return scopedCss.withScopedCSS(scopedId$4, () => {
        const { state, tableSelection } = props.component;
        const position = tableSelection();
        return (jsxRuntime.jsx("div", { class: ['top-bar', {
                    active: props.isFocus()
                }], children: jsxRuntime.jsxs("div", { class: "toolbar-wrapper", children: [jsxRuntime.jsx("div", { class: "insert-bar", children: jsxRuntime.jsx("table", { style: {
                                transform: `translateX(${-leftDistance()}px)`
                            }, children: jsxRuntime.jsx("tbody", { children: jsxRuntime.jsx("tr", { children: props.layoutWidth().map((i, index) => {
                                        return (jsxRuntime.jsx("td", { style: { width: i + 'px', minWidth: i + 'px' }, children: jsxRuntime.jsxs("div", { class: "tool-container", children: [index === 0 && (jsxRuntime.jsx("span", { onMouseenter: () => {
                                                            tableService.onInsertColumnBefore.next(0);
                                                        }, onMouseleave: () => {
                                                            tableService.onInsertColumnBefore.next(null);
                                                        }, class: "insert-btn-wrap", style: {
                                                            left: '-10px'
                                                        }, onClick: () => {
                                                            props.component.insertColumn(0);
                                                        }, children: jsxRuntime.jsx("button", { class: "insert-btn", type: "button", children: "+" }) })), jsxRuntime.jsx("span", { class: "insert-btn-wrap", onMouseenter: () => {
                                                            tableService.onInsertColumnBefore.next(index + 1);
                                                        }, onMouseleave: () => {
                                                            tableService.onInsertColumnBefore.next(null);
                                                        }, onClick: () => {
                                                            props.component.insertColumn(index + 1);
                                                        }, children: jsxRuntime.jsx("button", { class: "insert-btn", type: "button", children: "+" }) }), jsxRuntime.jsx(ComponentToolbar, { style: {
                                                            display: deleteIndex() === index ? 'inline-block' : 'none',
                                                            left: '50%',
                                                        }, innerStyle: {
                                                            transform: 'translateX(-50%)'
                                                        }, visible: deleteIndex() === index, children: jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(Button, { onClick: () => {
                                                                    props.component.deleteColumn(index);
                                                                    deleteIndex.set(null);
                                                                }, children: jsxRuntime.jsx("span", { class: "xnote-icon-bin" }) }) }) })] }) }));
                                    }) }) }) }) }), jsxRuntime.jsx("div", { class: ['action-bar', { active: props.isFocus() }], children: jsxRuntime.jsx("table", { style: {
                                transform: `translateX(${-leftDistance()}px)`
                            }, children: jsxRuntime.jsx("tbody", { children: jsxRuntime.jsx("tr", { children: props.layoutWidth().map((i, index) => {
                                        return jsxRuntime.jsx("td", { onClick: ev => {
                                                mouseDownFromToolbar = true;
                                                if (!ev.shiftKey) {
                                                    deleteIndex.set(index);
                                                }
                                                else {
                                                    deleteIndex.set(null);
                                                }
                                                selectColumn(index, ev.shiftKey);
                                            }, class: {
                                                active: !position ? false :
                                                    (position.startRow === 0 &&
                                                        position.endRow === state.rows.length &&
                                                        index >= position.startColumn && index < position.endColumn)
                                            }, style: { width: i + 'px', minWidth: i + 'px' } });
                                    }) }) }) }) })] }) }));
    });
}

var scopedId$3 = "vf-7bef30";

function Scroll(props) {
    const scrollRef = core.createRef();
    const input = core.inject(platformBrowser.Input);
    const tableService = core.inject(TableService);
    const [showShadow, updateShowShadow] = hooks.useProduce({
        leftEnd: false,
        rightEnd: false
    });
    core.onMounted(() => {
        const el = scrollRef.current;
        function update() {
            if (props.isFocus()) {
                input.caret.refresh();
            }
            updateShowShadow(draft => {
                draft.leftEnd = el.scrollLeft === 0;
                draft.rightEnd = el.scrollLeft === el.scrollWidth - el.offsetWidth;
            });
        }
        update();
        const s = core$1.fromEvent(el, 'scroll').subscribe(update);
        return () => s.unsubscribe();
    });
    core.onUpdated(() => {
        const el = scrollRef.current;
        updateShowShadow(draft => {
            draft.leftEnd = el.scrollLeft === 0;
            draft.rightEnd = el.scrollLeft === el.scrollWidth - el.offsetWidth;
        });
    });
    return scopedCss.withScopedCSS(scopedId$3, () => {
        return jsxRuntime.jsx("div", { ref: [scrollRef], class: ['scroll-container', {
                    'left-end': showShadow().leftEnd,
                    'right-end': showShadow().rightEnd,
                    'active': props.isFocus(),
                    // 'hide-selection': isSelectColumn()
                }], onScroll: ev => {
                setTimeout(() => {
                    tableService.onScroll.next(ev.target.scrollLeft);
                }, 30);
            }, children: props.children });
    });
}

var scopedId$2 = "vf-aaece0";

function LeftBar(props) {
    const editorService = core.inject(exports.EditorService);
    const selection = core.inject(core$1.Selection);
    const actionBarRef = core.createRef();
    const insertBarRef = core.createRef();
    const textbus = core.inject(core$1.Textbus);
    const tableService = core.inject(TableService);
    // 同步行高度
    core.onUpdated(() => {
        const insertBarRows = insertBarRef.current.rows;
        const actionBarRows = actionBarRef.current.rows;
        setTimeout(() => {
            Array.from(props.tableRef.current.rows).forEach((tr, i) => {
                insertBarRows.item(i).style.height = tr.getBoundingClientRect().height + 'px';
                actionBarRows.item(i).style.height = tr.getBoundingClientRect().height + 'px';
            });
        });
    });
    const instance = core.getCurrentInstance();
    const s = props.component.changeMarker.onChange.subscribe(() => {
        instance.markAsDirtied();
    });
    core.onUnmounted(() => {
        s.unsubscribe();
    });
    let mouseDownFromToolbar = false;
    core.onMounted(() => {
        const sub = core$1.fromEvent(document, 'click').subscribe(() => {
            if (mouseDownFromToolbar) {
                mouseDownFromToolbar = false;
                return;
            }
            deleteIndex.set(null);
            selectedRowRange.set(null);
        });
        return () => sub.unsubscribe();
    });
    const selectedRowRange = core.createSignal(null);
    const deleteIndex = core.createSignal(null);
    function selectRow(index, isMultiple) {
        editorService.hideInlineToolbar = true;
        const currentSelectedColumnRange = selectedRowRange();
        if (isMultiple && currentSelectedColumnRange) {
            selectedRowRange.set({
                startIndex: currentSelectedColumnRange.startIndex,
                endIndex: index
            });
        }
        else {
            selectedRowRange.set({
                startIndex: index, endIndex: index
            });
        }
        const range = selectedRowRange();
        const [startIndex, endIndex] = [range.startIndex, range.endIndex].sort((a, b) => a - b);
        const selectedSlots = [];
        const rows = props.component.state.rows;
        rows.slice(startIndex, endIndex + 1).forEach(row => {
            selectedSlots.push(...row.cells.map(i => i.slot));
        });
        textbus.nextTick(() => {
            selection.setSelectedRanges(selectedSlots.map(i => {
                return {
                    slot: i,
                    startIndex: 0,
                    endIndex: i.length
                };
            }));
            selection.restore();
            textbus.focus();
        });
    }
    return scopedCss.withScopedCSS(scopedId$2, () => {
        const { state, tableSelection } = props.component;
        const position = tableSelection();
        return (jsxRuntime.jsxs("div", { class: ['left-bar', { active: props.isFocus() }], children: [jsxRuntime.jsx("div", { class: "insert-bar", children: jsxRuntime.jsx("table", { ref: insertBarRef, children: jsxRuntime.jsx("tbody", { children: state.rows.map((_, index) => {
                                return (jsxRuntime.jsx("tr", { children: jsxRuntime.jsx("td", { children: jsxRuntime.jsxs("div", { class: "toolbar-item", children: [index === 0 && (jsxRuntime.jsx("span", { onMouseenter: () => {
                                                        tableService.onInsertRowBefore.next(-1);
                                                    }, onMouseleave: () => {
                                                        tableService.onInsertRowBefore.next(null);
                                                    }, class: "insert-btn-wrap", style: {
                                                        top: '-14px'
                                                    }, onClick: () => {
                                                        props.component.insertRow(0);
                                                    }, children: jsxRuntime.jsx("button", { class: "insert-btn", type: "button", children: "+" }) })), jsxRuntime.jsx("span", { onMouseenter: () => {
                                                        tableService.onInsertRowBefore.next(index);
                                                    }, onMouseleave: () => {
                                                        tableService.onInsertRowBefore.next(null);
                                                    }, class: "insert-btn-wrap", onClick: () => {
                                                        props.component.insertRow(index + 1);
                                                    }, children: jsxRuntime.jsx("button", { class: "insert-btn", type: "button", children: "+" }) }), jsxRuntime.jsx(ComponentToolbar, { style: {
                                                        display: deleteIndex() === index ? 'inline-block' : 'none',
                                                        left: '-35px'
                                                    }, innerStyle: {
                                                        top: 0,
                                                        transform: 'translateY(-50%)'
                                                    }, visible: deleteIndex() === index, children: jsxRuntime.jsx(ToolbarItem, { children: jsxRuntime.jsx(Button, { onClick: () => {
                                                                props.component.deleteRow(index);
                                                                deleteIndex.set(null);
                                                            }, children: jsxRuntime.jsx("span", { class: "xnote-icon-bin" }) }) }) })] }) }) }));
                            }) }) }) }), jsxRuntime.jsx("div", { class: "action-bar", children: jsxRuntime.jsx("table", { ref: actionBarRef, children: jsxRuntime.jsx("tbody", { children: props.component.state.rows.map((_, index) => {
                                return jsxRuntime.jsx("tr", { children: jsxRuntime.jsx("td", { onMousedown: (ev) => {
                                            mouseDownFromToolbar = true;
                                            if (!ev.shiftKey) {
                                                deleteIndex.set(index);
                                            }
                                            else {
                                                deleteIndex.set(null);
                                            }
                                            selectRow(index, ev.shiftKey);
                                        }, class: {
                                            active: !position ? false :
                                                (position.startColumn === 0 &&
                                                    position.endColumn === state.layoutWidth.length &&
                                                    index >= position.startRow && index < position.endRow)
                                        } }) });
                            }) }) }) })] }));
    });
}

var scopedId$1 = "vf-d4c4a9";

function sum(numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

function ResizeRow(props) {
    const dragLineRef = core.createRef();
    const tableService = core.inject(TableService);
    const [styles, updateStyles] = hooks.useProduce({
        visible: false,
        top: 0
    });
    core.onMounted(() => {
        const sub = tableService.onInsertRowBefore.subscribe(i => {
            if (i === null) {
                updateStyles(draft => {
                    draft.visible = false;
                });
                return;
            }
            updateStyles(draft => {
                draft.visible = true;
                if (i === -1) {
                    draft.top = 0;
                    return;
                }
                const row = props.tableRef.current.rows.item(i);
                draft.top = row.offsetTop + row.offsetHeight;
            });
        });
        return () => sub.unsubscribe();
    });
    return scopedCss.withScopedCSS(scopedId$1, () => {
        return jsxRuntime.jsx("div", { ref: dragLineRef, style: {
                display: styles().visible ? 'block' : 'none',
                top: styles().top + 'px',
                width: sum(props.component.state.layoutWidth) + 'px'
            }, class: 'drag-line' });
    });
}

var scopedId = "vf-4a5ad1";

function SelectionMask(props) {
    const [styles, updateStyles] = hooks.useProduce({
        visible: false,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto'
    });
    core.onMounted(() => {
        update();
    });
    core.watch(props.component.tableSelection, update);
    function update() {
        const selection = props.component.tableSelection();
        const state = props.component.state;
        if (selection) {
            let topCompensation = 0.5;
            let heightCompensation = -1;
            if (selection.startRow === 0) {
                topCompensation = 0;
                heightCompensation = -0.5;
            }
            if (selection.startRow > 0) {
                heightCompensation = -1;
            }
            if (selection.endRow === state.rows.length) {
                heightCompensation += 0.5;
            }
            const trs = Array.from(props.tableRef.current.rows);
            updateStyles(draft => {
                draft.visible = true;
                draft.left = sum(state.layoutWidth.slice(0, selection.startColumn));
                draft.top = trs[selection.startRow].offsetTop + topCompensation;
                draft.width = sum(state.layoutWidth.slice(selection.startColumn, selection.endColumn)) - 1 + 'px';
                draft.height = trs[selection.endRow - 1].offsetTop + trs[selection.endRow - 1].offsetHeight + heightCompensation - draft.top + 'px';
            });
        }
        else {
            updateStyles(draft => {
                draft.visible = false;
            });
        }
    }
    const s = props.component.changeMarker.onChange.pipe(core$1.debounceTime(30)).subscribe(() => {
        update();
    });
    core.onUnmounted(() => {
        s.unsubscribe();
    });
    return scopedCss.withScopedCSS(scopedId, () => {
        const style = styles();
        return (jsxRuntime.jsx("div", { class: "mask", style: {
                display: style.visible ? 'block' : 'none',
                left: style.left + 'px',
                top: style.top + 'px',
                right: style.right + 'px',
                width: style.width,
                height: style.height,
                bottom: style.bottom + 'px'
            } }));
    });
}

// import { SlotRender } from '../SlotRender'
const TableComponentView = core.withAnnotation({
    providers: [TableService]
}, function TableComponentView(props) {
    const adapter = core.inject(platformBrowser.DomAdapter);
    const editorService = core.inject(exports.EditorService);
    const isFocus = core.createSignal(false);
    const layoutWidth = core.createSignal(props.component.state.layoutWidth);
    const subscription = props.component.focus.subscribe(b => {
        isFocus.set(b);
        if (!b) {
            editorService.hideInlineToolbar = false;
        }
    });
    core.onUnmounted(() => {
        subscription.unsubscribe();
    });
    const tableRef = core.createRef();
    const isResizeColumn = core.createSignal(false);
    const rowMapping = new WeakMap();
    const readonly = useReadonly();
    const output = useOutput();
    return () => {
        const state = props.component.state;
        const rows = state.rows;
        rows.forEach(row => {
            if (rowMapping.has(row)) {
                return;
            }
            rowMapping.set(row, Math.random());
        });
        if (readonly() || output()) {
            return (jsxRuntime.jsx("div", { class: "xnote-table", "data-component": props.component.name, "data-layout-width": state.layoutWidth, children: jsxRuntime.jsx("div", { class: "xnote-table-inner", ref: props.rootRef, children: jsxRuntime.jsx("div", { class: "xnote-table-container", children: jsxRuntime.jsxs("table", { class: [
                                'xnote-table-content',
                                {
                                    'hide-selection': props.component.tableSelection()
                                }
                            ], children: [jsxRuntime.jsx("colgroup", { children: layoutWidth().map(w => {
                                        return jsxRuntime.jsx("col", { style: { width: w + 'px', minWidth: w + 'px' } });
                                    }) }), jsxRuntime.jsx("tbody", { children: rows.map((row) => {
                                        return (jsxRuntime.jsx("tr", { children: row.cells.map(cell => {
                                                return adapter.slotRender(cell.slot, children => {
                                                    return core$1.createVNode('td', {
                                                        key: cell.slot.id
                                                    }, children);
                                                }, readonly() || output());
                                            }) }, rowMapping.get(row)));
                                    }) })] }) }) }) }));
        }
        return (jsxRuntime.jsx("div", { class: "xnote-table", "data-component": props.component.name, "data-layout-width": state.layoutWidth, children: jsxRuntime.jsxs("div", { class: "xnote-table-inner", ref: props.rootRef, children: [jsxRuntime.jsx(TopBar, { isFocus: isFocus, layoutWidth: layoutWidth, component: props.component }), jsxRuntime.jsx(LeftBar, { tableRef: tableRef, isFocus: isFocus, component: props.component }), jsxRuntime.jsx(Scroll, { isFocus: isFocus, children: jsxRuntime.jsxs("div", { class: "xnote-table-container", children: [jsxRuntime.jsxs("table", { ref: tableRef, class: [
                                        'xnote-table-content',
                                        {
                                            'hide-selection': props.component.tableSelection()
                                        }
                                    ], children: [jsxRuntime.jsx("colgroup", { children: layoutWidth().map(w => {
                                                return jsxRuntime.jsx("col", { style: { width: w + 'px', minWidth: w + 'px' } });
                                            }) }), jsxRuntime.jsx("tbody", { children: rows.map((row) => {
                                                return (jsxRuntime.jsx("tr", { children: row.cells.map(cell => {
                                                        return adapter.slotRender(cell.slot, children => {
                                                            return core$1.createVNode('td', {
                                                                key: cell.slot.id
                                                            }, children);
                                                        }, readonly() || output());
                                                    }) }, rowMapping.get(row)));
                                            }) })] }), jsxRuntime.jsx(ResizeColumn, { tableRef: tableRef, component: props.component, layoutWidth: layoutWidth, onActiveStateChange: isActive => {
                                        isResizeColumn.set(isActive);
                                    } }), jsxRuntime.jsx(SelectionMask, { tableRef: tableRef, component: props.component })] }) }), jsxRuntime.jsx(ResizeRow, { component: props.component, tableRef: tableRef })] }) }));
    };
});
const tableComponentLoader = {
    match(element) {
        return element.dataset.component === TableComponent.componentName || element.tagName === 'TABLE';
    },
    read(element, textbus, slotParser) {
        if (element.tagName === 'DIV') {
            element = element.querySelector('.xnote-table-content');
        }
        const { tHead, tBodies, tFoot } = element;
        const headers = [];
        const bodies = [];
        if (tHead) {
            Array.from(tHead.rows).forEach(row => {
                const arr = [];
                headers.push(arr);
                Array.from(row.cells).forEach(cell => {
                    const slot = new core$1.Slot([
                        core$1.ContentType.BlockComponent,
                    ]);
                    arr.push({
                        slot,
                        rowspan: cell.rowSpan,
                        colspan: cell.colSpan
                    });
                    const delta = slotParser(new core$1.Slot([
                        core$1.ContentType.BlockComponent,
                        core$1.ContentType.InlineComponent,
                        core$1.ContentType.Text
                    ]), cell).toDelta();
                    const results = deltaToBlock(delta, textbus);
                    results.forEach(i => {
                        slot.insert(i);
                    });
                });
            });
        }
        if (tBodies) {
            Array.of(...Array.from(tBodies), tFoot || { rows: [] }).reduce((value, next) => {
                return value.concat(Array.from(next.rows));
            }, []).forEach((row) => {
                const arr = [];
                bodies.push(arr);
                Array.from(row.cells).forEach(cell => {
                    const slot = new core$1.Slot([
                        core$1.ContentType.BlockComponent,
                    ]);
                    arr.push({
                        slot,
                        rowspan: cell.rowSpan,
                        colspan: cell.colSpan
                    });
                    const delta = slotParser(new core$1.Slot([
                        core$1.ContentType.BlockComponent,
                        core$1.ContentType.InlineComponent,
                        core$1.ContentType.Text
                    ]), cell).toDelta();
                    const results = deltaToBlock(delta, textbus);
                    results.forEach(i => {
                        slot.insert(i);
                    });
                });
            });
        }
        bodies.unshift(...headers);
        const cells = autoComplete(bodies);
        let layoutWidth = null;
        try {
            const columnWidth = JSON.parse(element.dataset.layoutWidth || '');
            if (Array.isArray(columnWidth)) {
                layoutWidth = columnWidth;
            }
        }
        catch (e) {
            //
        }
        if (!layoutWidth) {
            layoutWidth = Array.from({ length: cells[0].length }).fill(100);
        }
        return new TableComponent(textbus, {
            rows: cells.map(i => {
                return {
                    height: 30,
                    cells: i
                };
            }),
            layoutWidth
        });
    }
};
function autoComplete(table) {
    const newTable = [];
    table.forEach((tr, rowIndex) => {
        if (!newTable[rowIndex]) {
            newTable[rowIndex] = [];
        }
        const row = newTable[rowIndex];
        let startColumnIndex = 0;
        tr.forEach(td => {
            while (row[startColumnIndex]) {
                startColumnIndex++;
            }
            let maxColspan = 1;
            while (maxColspan < td.colspan) {
                if (!row[startColumnIndex + maxColspan]) {
                    maxColspan++;
                }
                else {
                    break;
                }
            }
            td.colspan = maxColspan;
            for (let i = rowIndex, len = td.rowspan + rowIndex; i < len; i++) {
                if (!newTable[i]) {
                    newTable[i] = [];
                }
                const row = newTable[i];
                for (let j = startColumnIndex, max = startColumnIndex + maxColspan; j < max; j++) {
                    row[j] = td;
                }
            }
            startColumnIndex += maxColspan;
        });
    });
    const maxColumns = Math.max(...newTable.map(i => i.length));
    newTable.forEach(tr => {
        for (let i = 0; i < maxColumns; i++) {
            if (!tr[i]) {
                tr[i] = {
                    rowspan: 1,
                    colspan: 1,
                    slot: new core$1.Slot([
                        core$1.ContentType.BlockComponent
                    ])
                };
            }
        }
    });
    const recordCells = [];
    return newTable.map(tr => {
        return tr.filter(td => {
            const is = recordCells.includes(td);
            if (is) {
                return false;
            }
            recordCells.push(td);
            return true;
        });
    });
}

function findFocusCell(table, slot) {
    var _a;
    while (slot) {
        if (table.__slots__.includes(slot)) {
            return slot;
        }
        slot = (_a = slot.parent) === null || _a === void 0 ? void 0 : _a.parent;
    }
    return null;
}
let TableSelectionAwarenessDelegate = class TableSelectionAwarenessDelegate extends platformBrowser.CollaborateSelectionAwarenessDelegate {
    constructor(domAdapter, selection) {
        super();
        this.domAdapter = domAdapter;
        this.selection = selection;
    }
    getRects(abstractSelection) {
        const { focusSlot, anchorSlot } = abstractSelection;
        const focusPaths = this.selection.getPathsBySlot(focusSlot);
        const anchorPaths = this.selection.getPathsBySlot(anchorSlot);
        const focusIsStart = core$1.Selection.compareSelectionPaths(focusPaths, anchorPaths);
        let startSlot;
        let endSlot;
        if (focusIsStart) {
            startSlot = focusSlot;
            endSlot = anchorSlot;
        }
        else {
            startSlot = anchorSlot;
            endSlot = focusSlot;
        }
        const commonAncestorComponent = core$1.Selection.getCommonAncestorComponent(startSlot, endSlot);
        if (!(commonAncestorComponent instanceof TableComponent)) {
            return false;
        }
        const range = getSelectedRanges(commonAncestorComponent, findFocusCell(commonAncestorComponent, startSlot), findFocusCell(commonAncestorComponent, endSlot));
        const rows = commonAncestorComponent.state.rows;
        const startFocusSlot = rows[range.startRow].cells[range.startColumn].slot;
        const endFocusSlot = rows[range.endRow].cells[range.endColumn].slot;
        const renderer = this.domAdapter;
        const startRect = renderer.getNativeNodeBySlot(startFocusSlot).getBoundingClientRect();
        const endRect = renderer.getNativeNodeBySlot(endFocusSlot).getBoundingClientRect();
        return [{
                left: startRect.left,
                top: startRect.top,
                width: endRect.left + endRect.width - startRect.left,
                height: endRect.top + endRect.height - startRect.top
            }];
    }
};
TableSelectionAwarenessDelegate = __decorate([
    core.Injectable(),
    __metadata("design:paramtypes", [platformBrowser.DomAdapter,
        core$1.Selection])
], TableSelectionAwarenessDelegate);
function getSelectedRanges(component, startSlot, endSlot) {
    const p1 = finedPosition(component, startSlot);
    const p2 = finedPosition(component, endSlot);
    return {
        startRow: Math.min(p1.rowIndex, p2.rowIndex),
        endRow: Math.max(p1.rowIndex, p2.rowIndex),
        startColumn: Math.min(p1.columnIndex, p2.columnIndex),
        endColumn: Math.max(p1.columnIndex, p2.columnIndex)
    };
}
function finedPosition(component, slot) {
    const rows = component.state.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < row.cells.length; j++) {
            const cell = row.cells[j].slot;
            if (cell === slot) {
                return {
                    rowIndex: i,
                    columnIndex: j
                };
            }
        }
    }
    return null;
}

class Editor extends core$1.Textbus {
    constructor(editorConfig = {}) {
        const adapter = new adapterViewfly.ViewflyAdapter({
            [ParagraphComponent.componentName]: ParagraphView,
            [RootComponent.componentName]: RootView,
            [BlockquoteComponent.componentName]: BlockquoteView,
            [TodolistComponent.componentName]: TodolistView,
            [SourceCodeComponent.componentName]: SourceCodeView,
            [TableComponent.componentName]: TableComponentView,
            [HighlightBoxComponent.componentName]: HighlightBoxView,
            [ListComponent.componentName]: ListComponentView,
            [ImageComponent.componentName]: ImageView,
            [VideoComponent.componentName]: VideoView,
            [AtComponent.componentName]: AtComponentView,
            [KatexComponent.componentName]: KatexComponentView,
        }, (host, root, injector) => {
            const appInjector = new core.ReflectiveInjector(injector, [{
                    provide: OutputInjectionToken,
                    useValue: false
                }]);
            const app = platformBrowser$1.createApp(jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [root, jsxRuntime.jsx(LinkJump, {})] }), {
                context: appInjector
            }).mount(host);
            return () => {
                app.destroy();
            };
        });
        const browserModule = new platformBrowser.BrowserModule(Object.assign({ renderTo: () => {
                return this.host;
            }, useContentEditable: platformBrowser.isMobileBrowser(), adapter, componentLoaders: [
                atComponentLoader,
                sourceCodeComponentLoader,
                listComponentLoader,
                tableComponentLoader,
                imageComponentLoader,
                highlightBoxComponentLoader,
                blockquoteComponentLoader,
                videoComponentLoader,
                todolistComponentLoader,
                katexComponentLoader,
                paragraphComponentLoader,
            ], formatLoaders: [
                backgroundColorFormatLoader,
                boldFormatLoader,
                codeFormatLoader,
                colorFormatLoader,
                fontFamilyFormatLoader,
                fontSizeFormatLoader,
                italicFormatLoader,
                linkFormatLoader,
                strikeThroughFormatLoader,
                underlineFormatLoader
            ], attributeLoaders: [
                headingAttrLoader,
                textAlignAttrLoader,
                textIndentAttrLoader
            ] }, editorConfig.viewOptions));
        const modules = [browserModule];
        if (editorConfig.collaborateConfig) {
            modules.push(new collaborate.CollaborateModule(editorConfig.collaborateConfig));
            browserModule.providers.push({
                provide: platformBrowser.CollaborateSelectionAwarenessDelegate,
                useClass: TableSelectionAwarenessDelegate
            });
        }
        const vDomAdapter = new adapterViewfly.ViewflyVDomAdapter({
            [ParagraphComponent.componentName]: ParagraphView,
            [RootComponent.componentName]: RootView,
            [BlockquoteComponent.componentName]: BlockquoteView,
            [TodolistComponent.componentName]: TodolistView,
            [SourceCodeComponent.componentName]: SourceCodeView,
            [TableComponent.componentName]: TableComponentView,
            [HighlightBoxComponent.componentName]: HighlightBoxView,
            [ListComponent.componentName]: ListComponentView,
            [ImageComponent.componentName]: ImageView,
            [VideoComponent.componentName]: VideoView,
            [AtComponent.componentName]: AtComponentView,
            [KatexComponent.componentName]: KatexComponentView
        }, (host, root, injector) => {
            const appInjector = new core.ReflectiveInjector(injector, [{
                    provide: OutputInjectionToken,
                    useValue: true
                }, {
                    provide: platformBrowser.DomAdapter,
                    useFactory: () => {
                        return vDomAdapter;
                    }
                }]);
            const app = platformBrowser$1.createApp(root, {
                context: appInjector,
                nativeRenderer: new platformBrowser$1.HTMLRenderer()
            }).mount(host);
            return () => {
                app.destroy();
            };
        });
        super(Object.assign({ zenCoding: true, additionalAdapters: [vDomAdapter], imports: modules, components: [
                ImageComponent,
                ParagraphComponent,
                RootComponent,
                BlockquoteComponent,
                TodolistComponent,
                SourceCodeComponent,
                TableComponent,
                HighlightBoxComponent,
                ListComponent,
                VideoComponent,
                AtComponent,
                KatexComponent
            ], formatters: [
                backgroundColorFormatter,
                boldFormatter,
                codeFormatter,
                colorFormatter,
                fontFamilyFormatter,
                fontSizeFormatter,
                italicFormatter,
                linkFormatter,
                strikeThroughFormatter,
                underlineFormatter
            ], attributes: [
                headingAttr,
                textAlignAttr,
                textIndentAttr
            ], plugins: [
                new LeftToolbarPlugin(),
                new ToolbarPlugin(),
            ], onAfterStartup(textbus) {
                registerBoldShortcut(textbus);
                registerCodeShortcut(textbus);
                registerItalicShortcut(textbus);
                registerStrikeThroughShortcut(textbus);
                registerUnderlineShortcut(textbus);
                registerHeadingShortcut(textbus);
                registerTextAlignShortcut(textbus);
                registerTextIndentShortcut(textbus);
                registerAtShortcut(textbus);
                registerListShortcut(textbus);
                registerBlockquoteShortcut(textbus);
            } }, editorConfig));
        this.editorConfig = editorConfig;
        this.translator = new platformBrowser$1.OutputTranslator();
        this.vDomAdapter = vDomAdapter;
    }
    mount(host) {
        this.host = host;
        let rootComp;
        const config = this.editorConfig;
        if (config.content) {
            const parser = this.get(platformBrowser.Parser);
            const doc = parser.parseDoc(config.content, rootComponentLoader);
            if (doc instanceof core$1.Component) {
                rootComp = doc;
            }
            else {
                const content = new core$1.Slot([
                    core$1.ContentType.BlockComponent
                ]);
                if (doc instanceof core$1.Slot) {
                    deltaToBlock(doc.toDelta(), this).forEach(i => {
                        content.insert(i);
                    });
                }
                rootComp = new RootComponent(this, {
                    content
                });
            }
        }
        else {
            rootComp = new RootComponent(this, {
                content: new core$1.Slot([core$1.ContentType.BlockComponent])
            });
        }
        return this.render(rootComp);
    }
    getHTML() {
        return this.translator.transform(this.vDomAdapter.host);
    }
}

exports.AtComponent = AtComponent;
exports.AtComponentView = AtComponentView;
exports.AttrTool = AttrTool;
exports.BlockTool = BlockTool;
exports.BlockquoteComponent = BlockquoteComponent;
exports.BlockquoteView = BlockquoteView;
exports.BoldTool = BoldTool;
exports.Button = Button;
exports.CodeTool = CodeTool;
exports.ColorTool = ColorTool;
exports.ComponentToolbar = ComponentToolbar;
exports.Divider = Divider;
exports.DragResize = DragResize;
exports.Dropdown = Dropdown;
exports.DropdownMenuPortal = DropdownMenuPortal;
exports.Editor = Editor;
exports.FileUploader = FileUploader;
exports.FontFamilyTool = FontFamilyTool;
exports.FontSizeTool = FontSizeTool;
exports.HighlightBoxComponent = HighlightBoxComponent;
exports.HighlightBoxView = HighlightBoxView;
exports.ImageComponent = ImageComponent;
exports.ImageView = ImageView;
exports.InsertTool = InsertTool;
exports.ItalicTool = ItalicTool;
exports.KatexComponent = KatexComponent;
exports.KatexComponentView = KatexComponentView;
exports.Keymap = Keymap;
exports.LeftToolbar = LeftToolbar;
exports.LeftToolbarPlugin = LeftToolbarPlugin;
exports.LinkJump = LinkJump;
exports.LinkTool = LinkTool;
exports.ListComponent = ListComponent;
exports.ListComponentView = ListComponentView;
exports.Matcher = Matcher;
exports.MenuHeading = MenuHeading;
exports.MenuItem = MenuItem;
exports.Organization = Organization;
exports.OutputInjectionToken = OutputInjectionToken;
exports.ParagraphComponent = ParagraphComponent;
exports.ParagraphView = ParagraphView;
exports.Popup = Popup;
exports.RootComponent = RootComponent;
exports.RootView = RootView;
exports.SourceCodeComponent = SourceCodeComponent;
exports.SourceCodeView = SourceCodeView;
exports.StrikeThroughTool = StrikeThroughTool;
exports.TableComponent = TableComponent;
exports.TableComponentView = TableComponentView;
exports.TodolistComponent = TodolistComponent;
exports.TodolistView = TodolistView;
exports.Toolbar = Toolbar;
exports.ToolbarItem = ToolbarItem;
exports.ToolbarPlugin = ToolbarPlugin;
exports.UnderlineTool = UnderlineTool;
exports.VideoComponent = VideoComponent;
exports.VideoView = VideoView;
exports.atComponentLoader = atComponentLoader;
exports.autoComplete = autoComplete;
exports.backgroundColorFormatLoader = backgroundColorFormatLoader;
exports.backgroundColorFormatter = backgroundColorFormatter;
exports.blockquoteComponentLoader = blockquoteComponentLoader;
exports.boldFormatLoader = boldFormatLoader;
exports.boldFormatter = boldFormatter;
exports.codeFormatLoader = codeFormatLoader;
exports.codeFormatter = codeFormatter;
exports.colorFormatLoader = colorFormatLoader;
exports.colorFormatter = colorFormatter;
exports.deltaToBlock = deltaToBlock;
exports.fontFamilyFormatLoader = fontFamilyFormatLoader;
exports.fontFamilyFormatter = fontFamilyFormatter;
exports.fontSizeFormatLoader = fontSizeFormatLoader;
exports.fontSizeFormatter = fontSizeFormatter;
exports.headingAttr = headingAttr;
exports.headingAttrLoader = headingAttrLoader;
exports.highlightBoxComponentLoader = highlightBoxComponentLoader;
exports.imageComponentLoader = imageComponentLoader;
exports.isSupportFont = isSupportFont;
exports.italicFormatLoader = italicFormatLoader;
exports.italicFormatter = italicFormatter;
exports.katexComponentLoader = katexComponentLoader;
exports.languageList = languageList;
exports.linkFormatLoader = linkFormatLoader;
exports.linkFormatter = linkFormatter;
exports.listComponentLoader = listComponentLoader;
exports.paragraphComponentLoader = paragraphComponentLoader;
exports.registerAtShortcut = registerAtShortcut;
exports.registerBlockquoteShortcut = registerBlockquoteShortcut;
exports.registerBoldShortcut = registerBoldShortcut;
exports.registerCodeShortcut = registerCodeShortcut;
exports.registerHeadingShortcut = registerHeadingShortcut;
exports.registerItalicShortcut = registerItalicShortcut;
exports.registerListShortcut = registerListShortcut;
exports.registerStrikeThroughShortcut = registerStrikeThroughShortcut;
exports.registerTextAlignShortcut = registerTextAlignShortcut;
exports.registerTextIndentShortcut = registerTextIndentShortcut;
exports.registerUnderlineShortcut = registerUnderlineShortcut;
exports.rootComponentLoader = rootComponentLoader;
exports.sourceCodeComponentLoader = sourceCodeComponentLoader;
exports.sourceCodeThemes = sourceCodeThemes;
exports.strikeThroughFormatLoader = strikeThroughFormatLoader;
exports.strikeThroughFormatter = strikeThroughFormatter;
exports.tableComponentLoader = tableComponentLoader;
exports.textAlignAttr = textAlignAttr;
exports.textAlignAttrLoader = textAlignAttrLoader;
exports.textIndentAttr = textIndentAttr;
exports.textIndentAttrLoader = textIndentAttrLoader;
exports.toBlockquote = toBlockquote;
exports.toList = toList;
exports.todolistComponentLoader = todolistComponentLoader;
exports.toggleBold = toggleBold;
exports.toggleCode = toggleCode;
exports.toggleItalic = toggleItalic;
exports.toggleStrikeThrough = toggleStrikeThrough;
exports.toggleUnderline = toggleUnderline;
exports.underlineFormatLoader = underlineFormatLoader;
exports.underlineFormatter = underlineFormatter;
exports.useActiveBlock = useActiveBlock;
exports.useBlockContent = useBlockContent;
exports.useBlockTransform = useBlockTransform;
exports.useOutput = useOutput;
exports.useReadonly = useReadonly;
exports.videoComponentLoader = videoComponentLoader;
