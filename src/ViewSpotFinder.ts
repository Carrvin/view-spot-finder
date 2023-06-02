import { Mesh } from './Mesh';
import { MeshElementValue } from './types';

export class ViewSpotFinder {
  // Cache for storing checked neighbor elements which have a lower or the same height as an examined neighbor.
  // These elements do not need to be examined for a view spot / local maxima.
  private skippableElementIds: Record<number, number> = {};

  constructor(private mesh: Mesh) {}

  public findViewSpots = (noOfViewSpotsToFind: number): Array<MeshElementValue> => {
    const sortedElementValues = this.mesh.getDescOrderedElementValues();

    const foundViewSpots: Array<MeshElementValue> = [];
    let searchElementIndex = 0;

    while (
      foundViewSpots.length < noOfViewSpotsToFind &&
      searchElementIndex < sortedElementValues.length
    ) {
      const probeElementValue = sortedElementValues[searchElementIndex];

      // In case we already found that this element has a neighbor with the same or higher height.
      if (this.skippableElementIds[probeElementValue.element_id]) {
        searchElementIndex++;
        continue;
      }

      const probeElement = this.mesh.getElement(probeElementValue.element_id);
      const probeElementNeighbors = this.mesh.getElementNeighbors(probeElement);

      // 3 possible scenarios:
      // All neighbors have a lower height than the element to be checked -> element has local maxima.
      // At least one neighbor is higher -> element has no local maxima.
      // There are one or more neighbors with the same height as the element (all others are lower)
      //  -> element has local maxima (the neighbors will be ignored and not checked separately)

      const allNeighborsHaveLowerOrEqualHeight = probeElementNeighbors.every((neighbor) => {
        const neighborValue = this.mesh.getElementValue(neighbor.id);

        if (neighborValue.value <= probeElementValue.value) {
          // Set dummy value which evaluates to true when checked.
          this.skippableElementIds[neighbor.id] = 1;
          return true;
        }

        return false;
      });

      if (allNeighborsHaveLowerOrEqualHeight) {
        foundViewSpots.push(probeElementValue);
      }

      searchElementIndex++;
    }

    return foundViewSpots;
  };
}
