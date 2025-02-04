/*
 * Adapted from Potree:
 * https://github.com/potree/potree/blob/develop/src/loader/ept/BinaryLoader.js
 * License in LICENSE.potree
 */

import * as THREE from 'three';

import { WorkerPool } from '../utils/WorkerPool';
import { ILoader } from './ILoader';
import { ModelDataProvider, SerializableStylableObject, StylableObject } from '@reveal/data-providers';
import { PointCloudEptGeometryNode } from '../geometry/PointCloudEptGeometryNode';
import * as EptDecoderWorker from '../workers/eptBinaryDecoder.worker';

import { ParsedEptData, EptInputData } from '../workers/types';

import { decomposeStylableObjects } from '../../decomposeStylableObjects';

import { fromThreeVector3, setupTransferableMethodsOnMain } from '@reveal/utilities';
import { MetricsLogger } from '@reveal/metrics';

export class EptBinaryLoader implements ILoader {
  private readonly _dataLoader: ModelDataProvider;
  private readonly _stylableObjectsWithBox: [SerializableStylableObject, THREE.Box3][];

  static readonly WORKER_POOL = new WorkerPool(8, EptDecoderWorker as unknown as new () => Worker);

  extension(): string {
    return '.bin';
  }

  constructor(dataLoader: ModelDataProvider, stylableObjects: StylableObject[]) {
    this._dataLoader = dataLoader;
    this._stylableObjectsWithBox = decomposeStylableObjects(stylableObjects).map(obj => {
      const serializableShape = obj.shape.getSerializableShape();

      const boundingBox = obj.shape.createBoundingBox();

      return [{ shape: serializableShape, objectId: obj.objectId }, boundingBox];
    });
  }

  async load(node: PointCloudEptGeometryNode): Promise<void> {
    if (node.loaded) return;

    let data: ArrayBuffer = new ArrayBuffer(0);
    // Skip loading sectors if number of points is zero.
    if (node.getNumPoints() !== 0) {
      const fullFileName = node.fileName() + this.extension();
      data = await this._dataLoader.getBinaryFile(node.baseUrl(), fullFileName);
    }

    const parsedResultOrError = await this.parse(node, data);

    if (!(parsedResultOrError as any).position) {
      // Is an error
      const error = parsedResultOrError as Error;
      MetricsLogger.trackError(error, { moduleName: 'EptBinaryLoader', methodName: 'load' });

      node.markAsNotLoading();

      return;
    }

    this.finalizeLoading(parsedResultOrError as ParsedEptData, node);
  }

  private finalizeLoading(parsedData: ParsedEptData, node: PointCloudEptGeometryNode) {
    const geometry = createGeometryFromEptData(parsedData);

    const tightBoundingBox = createTightBoundingBox(parsedData);

    const numPoints = parsedData.numPoints;
    node.doneLoading(geometry, tightBoundingBox, numPoints, new THREE.Vector3(...parsedData.mean));
  }

  async parse(node: PointCloudEptGeometryNode, data: ArrayBuffer): Promise<ParsedEptData | Error> {
    const autoTerminatingWorker = await EptBinaryLoader.WORKER_POOL.getWorker();
    const eptDecoderWorker = autoTerminatingWorker.worker as unknown as typeof EptDecoderWorker;
    const eptData: EptInputData = {
      buffer: data,
      schema: node.ept.schema,
      scale: node.ept.eptScale.toArray(),
      offset: node.ept.eptOffset.toArray(),
      mins: fromThreeVector3(node.key.b.min)
    };

    setupTransferableMethodsOnMain(autoTerminatingWorker.worker, {
      parse: {
        pickTransferablesFromParams: (params: any) => {
          return params.buffer;
        }
      }
    });

    const relevantObjects = this._stylableObjectsWithBox
      .filter(objAndBox => objAndBox[1].intersectsBox(node.boundingBox))
      .map(objAndBox => objAndBox[0]);

    const result = await eptDecoderWorker.parse(eptData, relevantObjects, node.boundingBox.min.toArray(), {
      min: node.boundingBox.min.toArray(),
      max: node.boundingBox.max.toArray()
    });

    EptBinaryLoader.WORKER_POOL.releaseWorker(autoTerminatingWorker);
    return result;
  }
}

function createTightBoundingBox(data: ParsedEptData): THREE.Box3 {
  return new THREE.Box3(
    new THREE.Vector3().fromArray(data.tightBoundingBox.min),
    new THREE.Vector3().fromArray(data.tightBoundingBox.max)
  );
}

function createGeometryFromEptData(data: ParsedEptData): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  function addAttributeIfPresent<TypedArray extends ArrayLike<number>>(
    typedArrayConstructor: { new (data: ArrayBuffer): TypedArray },
    name: string,
    componentCount: number,
    data?: ArrayBuffer | undefined,
    normalized: boolean = false
  ): void {
    if (data) {
      const typedArray = new typedArrayConstructor(data);
      geometry.setAttribute(name, new THREE.BufferAttribute(typedArray, componentCount, normalized));
    }
  }

  addAttributeIfPresent<Float32Array>(Float32Array, 'position', 3, data.position);
  addAttributeIfPresent<Uint8Array>(Uint8Array, 'indices', 4, data.indices);
  addAttributeIfPresent<Uint8Array>(Uint8Array, 'color', 4, data.color, true);
  addAttributeIfPresent<Float32Array>(Float32Array, 'intensity', 1, data.intensity);
  addAttributeIfPresent<Uint8Array>(Uint8Array, 'classification', 1, data.classification);
  addAttributeIfPresent<Uint16Array>(Uint16Array, 'objectId', 1, data.objectId);

  (geometry.attributes.indices as THREE.BufferAttribute).normalized = true;

  return geometry;
}
