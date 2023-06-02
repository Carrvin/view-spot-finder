# View Spot Finder

Solution for the XIBIX challenge `View Spot Finder`

## Setup

- `npm ci`
- Install the AWS SAM CLI on your machine for testing the local SAM invoke.

## Run it

- Locally with ts-node: `npm start "meshes/mesh_x_sin_cos_20000[1][1][1][1][1][1].json" 100`
- Locally with SAM: `npm run sam:build && npm run sam:local-invoke` (the [event-file](./events/event.json) uses the mesh-data from the mesh-file ["mesh_x_sin_cos_10000[82][1][1][1][1][1][1].json"](./meshes/mesh_x_sin_cos_10000%5B82%5D%5B1%5D%5B1%5D%5B1%5D%5B1%5D%5B1%5D%5B1%5D.json) in the request-payload)

## Assumptions

- Not only the elements that share a border (2 node IDs) are considered adjacent, but also those that only share a single node coordinate.
- We don't need the node coordinates (mesh->nodes). The node ids are perfectly sufficient to determine which elements are adjacent to each other.
- If a neighboring element has a lower height than the examined element, the neighboring element does not need to be examined for a view spot / local maxima.
- If a neighboring element has the same height as the examined element, the neighboring element does not need to be examined for a view spot / local maxima.

## Runtimes

When running the script using `ts-node src/index.ts <mesh file> 100`, i get the following runtimes on a MacBook Pro 16", 2021 with M1 Pro and 32GB RAM:

- mesh[1][1][1][1][1][1].json -> ~0.002 seconds
- mesh_x_sin_cos_10000[82][1][1][1][1][1][1].json -> ~0.180 seconds
- mesh_x_sin_cos_20000[1][1][1][1][1][1].json -> ~0.510 seconds

## Restrictions of the solution

- The instructions state `In the case when two or more neighboring elements have exactly the same value, only one of the elements should be reported as a view spot.`. In case there is a plateau in the mesh (elements with the same height) which spans over more than two elements (!), the solution is going to report multiple view spots. When examining an element, the solution only checks the direct neighbors of the element, but not their neighbors (and so on). This could be solved using a recursive function if required.
- The data-structure of the mesh file is not validated on startup. In case of an invalid json, there will be an error on startup. In case of a structural issue, there will be a runtime error.
- The data in the mesh file is not validated on startup. In case an element references a non existant node-id (e.g.), there will be a runtime error.
- No linter, static code analyzer etc. (only editorconfig)
- No testing.
