import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { MeshData } from '../src/types';
import { Mesh } from '../src/Mesh';
import { ViewSpotFinder } from '../src/ViewSpotFinder';
import { RequestPayloadValidationError } from './RequestPayloadValidationError';

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { viewSpotCount, meshData } = validateRequestPayload(event.body ?? '');

    const mesh = new Mesh(meshData);
    const viewSpotFinder = new ViewSpotFinder(mesh);

    const foundViewSpots = viewSpotFinder.findViewSpots(viewSpotCount);

    return {
      statusCode: 200,
      body: JSON.stringify(foundViewSpots),
    };
  } catch (error) {
    console.log(error);

    if (error instanceof RequestPayloadValidationError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

const validateRequestPayload = (
  eventBody: string
): { viewSpotCount: number; meshData: MeshData } => {
  if (!eventBody) {
    throw new RequestPayloadValidationError('No request payload found.');
  }

  const parsedBodyPayload = JSON.parse(eventBody);

  if (!parsedBodyPayload.viewSpotCount) {
    throw new RequestPayloadValidationError('No viewSpotCount found in request payload.');
  }

  const viewSpotCount = Number.parseInt(parsedBodyPayload.viewSpotCount);

  if (isNaN(viewSpotCount)) {
    throw new RequestPayloadValidationError('Given viewSpotCount is not a number.');
  }

  if (!parsedBodyPayload.mesh) {
    throw new RequestPayloadValidationError('No mesh data found in request payload.');
  }

  const meshData = parsedBodyPayload.mesh as MeshData;

  return { viewSpotCount, meshData };
};
