# Virtual DOM node diffing performance investigation

## Initial questions?

- Does reusing the same function (eg. `h`) all the VNodes is more performant than creating specialized function for each node type (eg. `createTextVNode`, `createElementVNode`, ...)?
- What is the performance impact of having a "sparce" `children` array that might contain VNode or `null`?

## Approach

1. Create different kind of VNode trees. Currently testing a tree of depth 3 with 100 children nodes at each level.
1. Measure performance of VDOM tree traversal. Currently returning the count of VNode in the sub tree.
1. Run the test for 10 seconds and compare the duration with other approaches.

## Conclusion

> Does reusing the same function (eg. `h`) all the VNodes is more performant than creating specialized function for each node type?

It is more performance to traverse a tree composed of VNodes with different kind of structures compared to reuse the same structure. Traversing a specialized VNode tree is 58% faster than a generic one (Chrome 98).

> What is the performance impact of having a "sparce" `children` array that might contain VNode or `null`?

The presence of `null` value in the `children` array has no visible performance impact on the traversal. 