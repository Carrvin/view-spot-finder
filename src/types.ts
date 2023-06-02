interface MeshNode {
  id: number;
  x: number;
  y: number;
}

export interface MeshElement {
  id: number;
  nodes: Array<number>;
}

export interface MeshElementValue {
  element_id: number;
  value: number;
}

export interface MeshData {
  nodes: Array<MeshNode>;
  elements: Array<MeshElement>;
  values: Array<MeshElementValue>;
}
