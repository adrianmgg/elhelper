

type TypeEquals<X, Y> = (<T>()=>T extends X ? 1 : 2) extends (<T>()=>T extends Y ? 1 : 2) ? true : false;

type ExcludeReadonlyPropKeys<T> = { [K in keyof T]: TypeEquals<Pick<T, K>, Readonly<Pick<T, K>>> extends true ? never : K }[keyof T];
type ExcludeReadonlyProps<T> = Pick<T, ExcludeReadonlyPropKeys<T>>;

type ExcludeFunctionPropKeys<T> = { [K in keyof T]: T[K] extends (...args: any) => any ? never : K }[keyof T];
type ExlcudeFunctionProps<T> = Pick<T, ExcludeFunctionPropKeys<T>>;


type SetupOptionsEventHelper<OurElemType extends Element, EventElemType extends Element, EventMap> = OurElemType extends EventElemType ? { [K in keyof EventMap]?: (this: EventElemType, event: EventMap[K]) => any } : {};

interface SetupOptions<ElemType extends Element> {
    style?: Partial<ExlcudeFunctionProps<ExcludeReadonlyProps<CSSStyleDeclaration>>> & {
        vars?: Record<`--${string}`, string>,
    },
    attrs?: Record<string, string>,
    dataset?: Record<string, string>,
    events?: {
        [K in keyof ElementEventMap]?: (this: Element, event: ElementEventMap[K]) => any;
    } & {
        [event: string]: EventListenerOrEventListenerObject;
    } & SetupOptionsEventHelper<ElemType, HTMLElement, HTMLElementEventMap>
      & SetupOptionsEventHelper<ElemType, HTMLBodyElement, HTMLBodyElementEventMap>
      & SetupOptionsEventHelper<ElemType, HTMLMediaElement, HTMLMediaElementEventMap>
      & SetupOptionsEventHelper<ElemType, HTMLVideoElement, HTMLVideoElementEventMap>,
    classList?: Iterable<string>,
    children?: Iterable<Node>,
    parent?: Element | null,
    insertBefore?: Node,
};


export function setup<Elem extends Element>(elem: Elem, {style:{vars:styleVars={}, ...style}={}, attrs={}, dataset={}, events={}, classList=[], children=[], parent=null, insertBefore=null, ...props}: SetupOptions<Elem>): Elem {
    // TODO Elem won't necessarily have a style prop, should handle that better than just casting it like this
    for(const k in style) (elem as Elem & ElementCSSInlineStyle).style[k] = style[k];
    for(const k in styleVars) (elem as Elem & ElementCSSInlineStyle).style.setProperty(k, styleVars[k]);
    for(const k in attrs) elem.setAttribute(k, attrs[k]);
    // TODO again, should probably handle this better than just casting
    for(const k in dataset) (elem as Elem & HTMLOrSVGElement).dataset[k] = dataset[k];
    for(const k in events) elem.addEventListener(k, events[k]);
    for(const c of classList) elem.classList.add(c);
    for(const k in props) elem[k] = props[k];
    for(const c of children) elem.appendChild(c);
    if(parent !== null) {
        if(insertBefore !== null) parent.insertBefore(elem, insertBefore);
        else parent.appendChild(elem);
    }
    return elem;
}

export function create<TagName extends keyof HTMLElementTagNameMap>(tagName: TagName, options?: SetupOptions<HTMLElementTagNameMap[TagName]>): HTMLElementTagNameMap[TagName];
export function create<TagName extends keyof HTMLElementDeprecatedTagNameMap>(tagName: TagName, options?: SetupOptions<HTMLElementDeprecatedTagNameMap[TagName]>): HTMLElementDeprecatedTagNameMap[TagName];
export function create(tagName: string, options?: SetupOptions<HTMLElement>): HTMLElement;
export function create(tagName: string, options: SetupOptions<HTMLElement>={}): HTMLElement {
    return setup(document.createElement(tagName), options);
}

export function createNS(namespace: 'http://www.w3.org/1999/xhtml', tagName: string, options?: SetupOptions<HTMLElement>): HTMLElement;
export function createNS<K extends keyof SVGElementTagNameMap>(namespace: 'http://www.w3.org/2000/svg', tagName: K, options?: SetupOptions<SVGElementTagNameMap[K]>): SVGElementTagNameMap[K];
export function createNS(namespace: 'http://www.w3.org/2000/svg', tagName: string, options?: SetupOptions<SVGElement>): SVGElement;
export function createNS(namespace: string | null, tagName: string, options?: SetupOptions<Element>): Element;
export function createNS(namespace: string | null, tagName: string, options: SetupOptions<Element>={}): Element {
    return setup(document.createElementNS(namespace, tagName), options);
}



