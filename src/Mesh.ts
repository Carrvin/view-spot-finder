import { MeshData, MeshElement, MeshElementValue } from './types';

export class Mesh {
  // Helper-construct for more performant querying of element neighbors.
  private nodeElementHelperCache = new Map<number, Array<MeshElement>>();

  constructor(private meshData: MeshData) {
    this.populateNodeElementHelperCache();
  }

  // Fill the map for making it easier to query element-neighbors later on.
  private populateNodeElementHelperCache = (): void => {
    this.meshData.elements.forEach((element) => {
      element.nodes.forEach((node) => {
        if (this.nodeElementHelperCache.has(node)) {
          this.nodeElementHelperCache.get(node)?.push(element);
          return;
        }

        this.nodeElementHelperCache.set(node, new Array<MeshElement>(element));
      });
    });
  };

  public getDescOrderedElementValues = (): Array<MeshElementValue> => {
    return this.meshData.values.sort((a, b) => b.value - a.value);
  };

  public getElement = (elementId: number): MeshElement => {
    const resultElement = this.meshData.elements.find((element) => element.id === elementId);

    if (!resultElement) {
      throw new Error(`No element found in given mesh with id=${elementId}`);
    }

    return resultElement;
  };

  public getElementValue = (elementId: number): MeshElementValue => {
    const resultElementValue = this.meshData.values.find(
      (element) => element.element_id === elementId
    );

    if (!resultElementValue) {
      throw new Error(`No element-value found in given mesh with element_id=${elementId}`);
    }

    return resultElementValue;
  };

  public getElementNeighbors = (originElement: MeshElement): Array<MeshElement> => {
    const elementNeighbors: Array<MeshElement> = [];

    originElement.nodes.forEach((node) => {
      elementNeighbors.push(...(this.nodeElementHelperCache.get(node) ?? []));
    });

    return elementNeighbors;
  };
}
