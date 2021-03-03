/*!
 * Copyright 2021 Cognite AS
 */

import * as THREE from 'three';

import { SectorMetadata, SectorGeometry, SectorScene } from './sector/types';
import { SectorQuads } from './rendering/types';
import { CadRenderHints } from './rendering/CadRenderHints';
import { LevelOfDetail } from './sector/LevelOfDetail';
import { ConsumedSector } from './sector/types';
import { RootSectorNode } from './sector/RootSectorNode';
import { RenderMode } from './rendering/RenderMode';
import { CadLoadingHints } from './CadLoadingHints';
import { MaterialManager } from './MaterialManager';
import { CadModelMetadata } from './CadModelMetadata';
import { suggestCameraConfig } from './cameraconfig';
import { toThreeVector3, toThreeJsBox3 } from '../../utilities';
import { EventTrigger } from '../../utilities/events';
import { NodeAppearanceProvider } from './styling/NodeAppearanceProvider';
import { NodeAppearance } from '.';

export type ParseCallbackDelegate = (parsed: { lod: string; data: SectorGeometry | SectorQuads }) => void;

export type LoadingHintsChangeListener = (loadingHint: CadLoadingHints) => void;
export type RenderHintsChangeListener = (renderHint: CadRenderHints) => void;

export interface SuggestedCameraConfig {
  position: THREE.Vector3;
  target: THREE.Vector3;
  near: number;
  far: number;
}

export class CadNode extends THREE.Object3D {
  private _renderHints: CadRenderHints;
  private _loadingHints: CadLoadingHints;

  private readonly _rootSector: RootSectorNode;
  private readonly _cadModelMetadata: CadModelMetadata;
  private readonly _materialManager: MaterialManager;
  private readonly _sectorScene: SectorScene;
  private readonly _previousCameraMatrix = new THREE.Matrix4();
  private readonly _boundingBoxNode: THREE.Object3D;

  private readonly _events = {
    renderHintsChanged: new EventTrigger<RenderHintsChangeListener>(),
    loadingHintsChanged: new EventTrigger<LoadingHintsChangeListener>()
  };

  constructor(model: CadModelMetadata, materialManager: MaterialManager) {
    super();
    this.type = 'CadNode';
    this.name = 'Sector model';
    this._materialManager = materialManager;

    const rootSector = new RootSectorNode(model);
    this._cadModelMetadata = model;
    const { scene } = model;

    this._sectorScene = scene;
    // Ensure camera matrix is unequal on first frame
    this._previousCameraMatrix.elements[0] = Infinity;

    // Prepare renderables
    this._rootSector = rootSector;
    this.add(rootSector);

    this._boundingBoxNode = this.createBoundingBoxNode(scene.getAllSectors());
    this.add(this._boundingBoxNode);

    // Apply default hints
    this._renderHints = {};
    this._loadingHints = {};

    this.matrixAutoUpdate = false;
    this.updateMatrixWorld();
    this.setModelTransformation(model.modelMatrix);
  }

  get nodeAppearanceProvider(): NodeAppearanceProvider {
    return this._materialManager.getModelNodeAppearanceProvider(this._cadModelMetadata.blobUrl);
  }

  get defaultNodeAppearance(): NodeAppearance {
    return this._materialManager.getModelDefaultNodeAppearance(this._cadModelMetadata.blobUrl);
  }

  set defaultNodeAppearance(appearance: NodeAppearance) {
    this._materialManager.setModelDefaultNodeAppearance(this._cadModelMetadata.blobUrl, appearance);
  }

  get clippingPlanes(): THREE.Plane[] {
    return this._materialManager.clippingPlanes;
  }

  set clippingPlanes(planes: THREE.Plane[]) {
    this._materialManager.clippingPlanes = planes;
  }

  get clipIntersection(): boolean {
    return this._materialManager.clipIntersection;
  }

  set clipIntersection(intersection: boolean) {
    this._materialManager.clipIntersection = intersection;
  }

  get cadModelMetadata() {
    return this._cadModelMetadata;
  }

  get sectorScene() {
    return this._sectorScene;
  }

  get rootSector() {
    return this._rootSector;
  }

  get materialManager() {
    return this._materialManager;
  }

  set renderMode(mode: RenderMode) {
    this._materialManager.setRenderMode(mode);
  }

  get renderMode() {
    return this._materialManager.getRenderMode();
  }

  set renderHints(hints: Readonly<CadRenderHints>) {
    this._renderHints = hints;
    this._events.renderHintsChanged.fire(hints);
    // this._boundingBoxNode.visible = this.shouldRenderSectorBoundingBoxes;
  }

  get renderHints(): Readonly<CadRenderHints> {
    return this._renderHints;
  }

  set loadingHints(hints: Readonly<CadLoadingHints>) {
    this._loadingHints = hints;
    this._events.loadingHintsChanged.fire(hints);
  }

  get loadingHints(): Readonly<CadLoadingHints> {
    return this._loadingHints;
  }

  /**
   * Sets transformation matrix of the model. This overrides the current transformation.
   * @param matrix Transformation matrix.
   */
  setModelTransformation(matrix: THREE.Matrix4): void {
    this._rootSector.setModelTransformation(matrix);
    this._cadModelMetadata.modelMatrix.copy(matrix);
    this._boundingBoxNode.matrix.copy(matrix);
    this._boundingBoxNode.updateMatrixWorld(true);
  }

  /**
   * Gets transformation matrix of the model
   * @param out Preallocated `THREE.Matrix4` (optional).
   */
  getModelTransformation(out?: THREE.Matrix4): THREE.Matrix4 {
    return this._rootSector.getModelTransformation(out);
  }

  public suggestCameraConfig(): SuggestedCameraConfig {
    const { position, target, near, far } = suggestCameraConfig(this._sectorScene.root);

    const modelMatrix = this.getModelTransformation();
    const threePos = toThreeVector3(new THREE.Vector3(), position);
    const threeTarget = toThreeVector3(new THREE.Vector3(), target);
    threePos.applyMatrix4(modelMatrix);
    threeTarget.applyMatrix4(modelMatrix);

    return {
      position: threePos,
      target: threeTarget,
      near,
      far
    };
  }

  // TODO 2020-05-22 larsmoa: Remove this function and move bounding box tree outside CadNode.
  updateSectorBoundingBox(sector: ConsumedSector) {
    const bboxNode = this._boundingBoxNode.children.find(x => x.userData.sectorId === sector.metadata.id)!;
    bboxNode.visible = sector.levelOfDetail !== LevelOfDetail.Discarded;
  }

  private createBoundingBoxNode(sectors: SectorMetadata[]): THREE.Object3D {
    function sectorDepth(s: SectorMetadata) {
      return s.path.length / 2; // Path are on format 'x/y/z/'
    }
    const maxColorDepth = sectors.reduce((max, s) => Math.max(max, sectorDepth(s)), 0.0);
    const from = new THREE.Color(0xff0000);
    const to = new THREE.Color(0x00ff00);
    const colors = [...Array(maxColorDepth).keys()].map(d => {
      const color = new THREE.Color().copy(from);
      color.lerpHSL(to, d / (maxColorDepth - 1));
      return color;
    });

    const boxesNode = new THREE.Group();
    boxesNode.name = 'Bounding boxes (for debugging)';
    sectors.forEach(sector => {
      const bbox = toThreeJsBox3(new THREE.Box3(), sector.bounds);
      const color = colors[sectorDepth(sector)];
      const boxMesh = new THREE.Box3Helper(bbox, color);
      boxMesh.name = `${sector.id}`;
      boxMesh.userData.sectorId = sector.id;
      boxMesh.visible = false;
      boxesNode.add(boxMesh);

      boxMesh.matrixAutoUpdate = false;
      boxMesh.updateMatrixWorld(true);
    });
    boxesNode.matrixAutoUpdate = false;
    boxesNode.applyMatrix4(this.getModelTransformation());
    boxesNode.updateMatrixWorld(true);
    return boxesNode;
  }

  public on(event: 'loadingHintsChanged', listener: LoadingHintsChangeListener): void;
  public on(event: 'renderHintsChanged', listener: RenderHintsChangeListener): void;
  public on(
    event: 'loadingHintsChanged' | 'renderHintsChanged',
    listener: LoadingHintsChangeListener | RenderHintsChangeListener
  ): void {
    switch (event) {
      case 'loadingHintsChanged':
        this._events.loadingHintsChanged.subscribe(listener as LoadingHintsChangeListener);
        break;

      case 'renderHintsChanged':
        this._events.renderHintsChanged.subscribe(listener as RenderHintsChangeListener);
        break;

      default:
        throw new Error(`Unsupported event '${event}'`);
    }
  }

  public off(event: 'loadingHintsChanged', listener: LoadingHintsChangeListener): void;
  public off(event: 'renderHintsChanged', listener: RenderHintsChangeListener): void;
  public off(
    event: 'loadingHintsChanged' | 'renderHintsChanged',
    listener: LoadingHintsChangeListener | RenderHintsChangeListener
  ): void {
    switch (event) {
      case 'loadingHintsChanged':
        this._events.loadingHintsChanged.unsubscribe(listener as LoadingHintsChangeListener);
        break;

      case 'renderHintsChanged':
        this._events.renderHintsChanged.unsubscribe(listener as RenderHintsChangeListener);
        break;

      default:
        throw new Error(`Unsupported event '${event}'`);
    }
  }
}
