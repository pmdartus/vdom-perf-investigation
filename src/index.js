import {
  TEXT_NODE_TYPE,
  COMMENT_NODE_TYPE,
  ELEMENT_NODE_TYPE,
  COMPONENT_NODE_TYPE,
  EMPTY_ARRAY,
  VNODE_COUNT,
  VNODE_DEPTH,
  ComponentConstructor,
} from "./shared.js";

// Generic vNode factory method
function h(type, children) {
  return {
    type,
    children,
  };
}

// Text VNode factory
function vText(text) {
  return {
    type: TEXT_NODE_TYPE,
    children: EMPTY_ARRAY,
    text,
  };
}

// Comment vNode factory
function vComment(text) {
  return {
    children: EMPTY_ARRAY,
    text,
    type: COMMENT_NODE_TYPE,
  };
}

// Element vNode factory
function vElement(tagName, children = EMPTY_ARRAY) {
  return {
    children,
    type: ELEMENT_NODE_TYPE,
    tagName,
  };
}

// Component vNode factory
function vComponent(ctor, children = EMPTY_ARRAY) {
  return {
    ctor,
    type: COMPONENT_NODE_TYPE,
    children,
  };
}

export function generateGenericVNodes({ withHoles } = {}) {
  function generateChildren(depth) {
    if (depth === 0) {
      return EMPTY_ARRAY;
    }

    const children = [];
    for (let i = 0; i < VNODE_COUNT; i++) {
      let vNode;

      switch (i % 4) {
        case TEXT_NODE_TYPE:
          vNode = h(TEXT_NODE_TYPE, `text-${i}`);
          break;
        case COMMENT_NODE_TYPE:
          if (withHoles && i % 2 === 0) {
            vNode = null;
          } else {
            vNode = h(COMMENT_NODE_TYPE, `comment-${i}`);
          }
          break;
        case ELEMENT_NODE_TYPE:
          vNode = h("div", generateChildren(depth - 1));
          break;
        case COMPONENT_NODE_TYPE:
          vNode = h(ComponentConstructor, generateChildren(depth - 1));
          break;
      }

      children.push(vNode);
    }
    return children;
  }

  return h("div", generateChildren(VNODE_DEPTH));
}

export function generateSpecializedVNodes({ withHoles } = {}) {
  function generateChildren(depth) {
    if (depth === 0) {
      return EMPTY_ARRAY;
    }

    const children = [];
    for (let i = 0; i < VNODE_COUNT; i++) {
      let vNode;

      switch (i % 4) {
        case TEXT_NODE_TYPE:
          vNode = vText(`text-${i}`);
          break;
        case COMMENT_NODE_TYPE:
          if (withHoles && i % 2 === 0) {
            vNode = null;
          } else {
            vNode = vComment(`comment-${i}`);
          }
          break;
        case ELEMENT_NODE_TYPE:
          vNode = vElement("div", generateChildren(depth - 1));
          break;
        case COMPONENT_NODE_TYPE:
          vNode = vComponent(ComponentConstructor, generateChildren(depth - 1));
          break;
      }

      children.push(vNode);
    }

    return children;
  }

  return vComponent(ComponentConstructor, generateChildren(VNODE_DEPTH));
}

export function visitVNode(vnode) {
  const { type, children } = vnode;

  switch (type) {
    case TEXT_NODE_TYPE:
    case COMMENT_NODE_TYPE:
      return 1;

    default: {
      let count = 1;
      for (let i = 0; i < children.length; i++) {
        count += visitVNode(children[i]);
      }
      return count;
    }
  }
}

export function visitVNodeSparse(vnode) {
  if (vnode === null) {
    return 0;
  }
  const { type, children } = vnode;

  switch (type) {
    case TEXT_NODE_TYPE:
    case COMMENT_NODE_TYPE:
      return 1;

    default: {
      let count = 1;
      for (let i = 0; i < children.length; i++) {
        count += visitVNodeSparse(children[i]);
      }
      return count;
    }
  }
}
