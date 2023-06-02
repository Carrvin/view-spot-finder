import * as fs from 'fs';

import { Mesh } from './Mesh';
import { ViewSpotFinder } from './ViewSpotFinder';
import { MeshData } from './types';

const PROCESS_ARGS_FILE_INDEX = 2;
const PROCESS_ARGS_VIEW_SPOT_COUNT_INDEX = 3;
const MESH_FILE_ENCODING = 'utf8';

const main = async (): Promise<void> => {
  const { meshFilePath, viewSpotCount } = processStartupArguments();

  const meshData = readMeshFile(meshFilePath);
  const mesh = new Mesh(meshData);
  const viewSpotFinder = new ViewSpotFinder(mesh);

  const foundViewSpots = viewSpotFinder.findViewSpots(viewSpotCount);

  console.log(foundViewSpots);
};

const processStartupArguments = (): {
  meshFilePath: string;
  viewSpotCount: number;
} => {
  const meshFilePath = process.argv[PROCESS_ARGS_FILE_INDEX];
  if (!meshFilePath) {
    throw new Error('No mesh file given.');
  }

  if (!fs.existsSync(meshFilePath)) {
    throw new Error('The given mesh file does not exist.');
  }

  const viewSpotCountRaw = process.argv[PROCESS_ARGS_VIEW_SPOT_COUNT_INDEX];
  if (!viewSpotCountRaw) {
    throw new Error('No number of view spots given.');
  }
  const viewSpotCount = Number.parseInt(viewSpotCountRaw);

  if (isNaN(viewSpotCount)) {
    throw new Error('The given number of view spots is not a valid number.');
  }

  if (viewSpotCount === 0) {
    throw new Error('The given number of view spots is 0. Please define something > 0.');
  }

  return { meshFilePath, viewSpotCount };
};

const readMeshFile = (meshFilePath: string): MeshData => {
  const meshFileDataRaw = fs.readFileSync(meshFilePath, MESH_FILE_ENCODING);
  const meshFileData = JSON.parse(meshFileDataRaw) as MeshData;

  return meshFileData;
};

main().catch((error) => {
  console.error(`Catched error on main(): ${error}`);
  process.exit(1);
});
