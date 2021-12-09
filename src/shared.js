export const ITERATION_COUNT = 100;

export const VNODE_COUNT = 100;
export const VNODE_DEPTH = 3;

export const TEXT_NODE_TYPE = 0;
export const COMMENT_NODE_TYPE = 1;
export const ELEMENT_NODE_TYPE = 2;
export const COMPONENT_NODE_TYPE = 3;

export const EMPTY_ARRAY = [];

export class ComponentConstructor {}

export function measure(name, fn) {
  const endTime = Date.now() + 10_000;

  const results = [];

  while (Date.now() < endTime) {
    const start = performance.now();
    fn();
    const end = performance.now();

    results.push(end - start);
  }

  const mean = results.reduce((acc, res) => acc + res, 0) / results.length;
  const median = [...results].sort()[Math.ceil(results.length / 2)];

  const msg = `[${name}]     mean: ${Math.floor(mean)} median: ${Math.floor(median)}`;
  
  console.log(msg);
  document.body.append(document.createTextNode(msg));
}
