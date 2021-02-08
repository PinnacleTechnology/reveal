/*!
 * Copyright 2021 Cognite AS
 */

import * as THREE from 'three';
import { NumericRange } from '../../../utilities';

import { determinePowerOfTwoDimensions } from '../../../utilities/determinePowerOfTwoDimensions';

import { DefaultNodeAppearance, NodeAppearance } from '../NodeAppearance';
import { TransformOverrideBuffer } from '../rendering/TransformOverrideBuffer';
import { IndexSet } from '../../../utilities/IndexSet';
import { NodeStyleProvider } from './NodeStyleProvider';

export class NodeStyleTextureBuilder {
  private readonly _defaultStyle: NodeAppearance | undefined;
  private readonly _styleProvider: NodeStyleProvider;
  private readonly _handleStylesChangedListener = this.handleStylesChanged.bind(this);

  private _needsUpdate = true;
  private readonly _overrideColorPerTreeIndexTexture: THREE.DataTexture;
  private readonly _overrideTransformPerTreeIndexTexture: THREE.DataTexture;
  private readonly _transformOverrideBuffer: TransformOverrideBuffer;
  private readonly _regularNodesTreeIndices: IndexSet;
  private readonly _ghostedNodesTreeIndices: IndexSet;
  private readonly _infrontNodesTreeIndices: IndexSet;

  constructor(treeIndexCount: number, styleProvider: NodeStyleProvider) {
    this._defaultStyle = DefaultNodeAppearance.NoOverrides;
    this._styleProvider = styleProvider;
    this._styleProvider.on('changed', this._handleStylesChangedListener);

    const textures = allocateTextures(treeIndexCount, this._defaultStyle);
    this._overrideColorPerTreeIndexTexture = textures.overrideColorPerTreeIndexTexture;
    this._overrideTransformPerTreeIndexTexture = textures.transformOverrideIndexTexture;
    this._transformOverrideBuffer = new TransformOverrideBuffer(this.handleNewTransformTexture.bind(this));

    this._regularNodesTreeIndices = new IndexSet(new NumericRange(0, treeIndexCount).values());
    this._ghostedNodesTreeIndices = new IndexSet();
    this._infrontNodesTreeIndices = new IndexSet();
  }

  get regularNodeTreeIndices(): IndexSet {
    return this._regularNodesTreeIndices;
  }

  get ghostedNodeTreeIndices(): IndexSet {
    return this._ghostedNodesTreeIndices;
  }

  get infrontNodeTreeIndices(): IndexSet {
    return this._infrontNodesTreeIndices;
  }

  get needsUpdate(): boolean {
    return this._needsUpdate;
  }

  /**
   * A texture holding at least one element per node with color override
   * and style information. RGB is used to store color, A is used to store
   * style toggles, with the following bit layout:
   * - 0  : visible bit   - when set the node is visible
   * - 1  : in front bit  - when set the node is rendered in front of other objects
   * - 2  : ghosted bit   - when set the node is rendered 'ghosted'
   * - 3-5: outline color - outline toggle and color ({@see OutlineColor}).
   * - 6-7: unused
   * Note that in-front and ghost information also is available from
   * the {@see inFrontTreeIndices} and {@see ghostedTreeIndices} collections.
   */
  get overrideColorPerTreeIndexTexture(): THREE.DataTexture {
    return this._overrideColorPerTreeIndexTexture;
  }

  get overrideTransformPerTreeIndexTexture(): THREE.DataTexture {
    return this._overrideTransformPerTreeIndexTexture;
  }

  get transformsLookupTexture(): THREE.DataTexture {
    return this._transformOverrideBuffer.dataTexture;
  }

  dispose() {
    this._styleProvider.off('changed', this._handleStylesChangedListener);
    this._overrideColorPerTreeIndexTexture.dispose();
    this._overrideTransformPerTreeIndexTexture.dispose();
  }

  private readonly _currentlyAppliedStyles = new Map<number, { revision: number; treeIndices: IndexSet }>();

  build() {
    const defaultColorRgba = appearanceToColorOverride(this._defaultStyle);
    const defaultTransformLookupIndexRgb: [number, number, number] = [0, 0, 0]; // Special value for no transform

    const appliedStyleIds = new Set<number>(this._currentlyAppliedStyles.keys());
    // TODO 2021-02-04 larsmoa: Currently transform overrides are never removed
    this._styleProvider.applyStyles((styleId, revision, treeIndices, style) => {
      const currentlyApplied = this._currentlyAppliedStyles.get(styleId);
      if (currentlyApplied !== undefined && currentlyApplied.revision === revision) {
        // Unchanged - nothing to do
        return;
      }

      // Translate from style to magic values in textures
      const colorRgba = appearanceToColorOverride(style);
      const transformLookupIndexRgb = appearanceToTransformOverride(styleId, style, this._transformOverrideBuffer);

      if (currentlyApplied !== undefined) {
        // Apply difference (new revision)
        const addedTreeIndices = treeIndices.clone().differenceWith(currentlyApplied.treeIndices);
        const removedTreeIndices = currentlyApplied.treeIndices.differenceWith(treeIndices); // Note! We reuse the set here to avoid GC

        applyRGBA(this._overrideColorPerTreeIndexTexture, removedTreeIndices, defaultColorRgba);
        applyRGBA(this._overrideColorPerTreeIndexTexture, addedTreeIndices, colorRgba);
        applyRGB(this._overrideTransformPerTreeIndexTexture, removedTreeIndices, defaultTransformLookupIndexRgb);
        applyRGB(this._overrideTransformPerTreeIndexTexture, addedTreeIndices, transformLookupIndexRgb);

        const infront = !!style.renderInFront;
        const ghosted = !!style.renderGhosted;

        updateLookupSet(this._infrontNodesTreeIndices, addedTreeIndices, infront);
        updateLookupSet(this._ghostedNodesTreeIndices, addedTreeIndices, ghosted);
        updateLookupSet(this._regularNodesTreeIndices, addedTreeIndices, !infront && !ghosted);

        if (infront) {
          updateLookupSet(this._infrontNodesTreeIndices, removedTreeIndices, false);
        }
        if (ghosted) {
          updateLookupSet(this._ghostedNodesTreeIndices, removedTreeIndices, false);
        }
        if (infront || ghosted) {
          updateLookupSet(this._regularNodesTreeIndices, removedTreeIndices, true);
        }
      } else if (currentlyApplied === undefined) {
        // The first time this style is applied
        applyRGBA(this._overrideColorPerTreeIndexTexture, treeIndices, colorRgba);
        applyRGB(this._overrideTransformPerTreeIndexTexture, treeIndices, transformLookupIndexRgb);

        const infront = !!style.renderInFront;
        const ghosted = !!style.renderGhosted;
        updateLookupSet(this._infrontNodesTreeIndices, treeIndices, infront);
        updateLookupSet(this._ghostedNodesTreeIndices, treeIndices, ghosted);
        updateLookupSet(this._regularNodesTreeIndices, treeIndices, !infront && !ghosted);
      }

      appliedStyleIds.delete(styleId);
      this._currentlyAppliedStyles.set(styleId, { revision, treeIndices: treeIndices.clone() });
    });

    // Clean up orphan styles
    appliedStyleIds.forEach(styleId => this._currentlyAppliedStyles.delete(styleId));

    this._needsUpdate = false;
  }

  private handleStylesChanged() {
    this._needsUpdate = true;
  }

  private handleNewTransformTexture() {
    this._needsUpdate = true;
  }
}

function allocateTextures(
  treeIndexCount: number,
  style: NodeAppearance | undefined
): { overrideColorPerTreeIndexTexture: THREE.DataTexture; transformOverrideIndexTexture: THREE.DataTexture } {
  if (style !== undefined && style.worldTransform !== undefined) {
    throw new Error('Cannot allocate textures with for style with default world transform');
  }

  const { width, height } = determinePowerOfTwoDimensions(treeIndexCount);
  const textureElementCount = width * height;
  const defaultColorRgba = appearanceToColorOverride(style);

  // Color and style override texture
  const colors = new Uint8Array(4 * textureElementCount);
  // Set alpha to 1
  for (let i = 0; i < textureElementCount; ++i) {
    colors[4 * i + 0] = defaultColorRgba[0];
    colors[4 * i + 1] = defaultColorRgba[1];
    colors[4 * i + 2] = defaultColorRgba[2];
    colors[4 * i + 3] = defaultColorRgba[3];
  }
  const overrideColorPerTreeIndexTexture = new THREE.DataTexture(colors, width, height);

  // Texture for holding node transforms (translation, scale, rotation)
  const transformOverrideIndexBuffer = new Uint8ClampedArray(3 * textureElementCount);
  const transformOverrideIndexTexture = new THREE.DataTexture(
    transformOverrideIndexBuffer,
    width,
    height,
    THREE.RGBFormat
  );

  return { overrideColorPerTreeIndexTexture, transformOverrideIndexTexture };
}

function appearanceToColorOverride(appearance: NodeAppearance | undefined): [number, number, number, number] {
  if (appearance === undefined) {
    return [0, 0, 0, 1]; // Visible, no color override
  }
  const [r, g, b] = appearance.color || [0, 0, 0];
  const isVisible = appearance.visible !== undefined ? !!appearance.visible : true;
  const inFront = !!appearance.renderInFront;
  const ghosted = !!appearance.renderGhosted;
  const outlineColor = appearance.outlineColor ? appearance.outlineColor : 0;
  // Byte layout:
  // [isVisible, renderInFront, renderGhosted, outlineColor0, outlineColor1, outlineColor2, unused, unused]
  const bytePattern = (isVisible ? 1 << 0 : 0) + (inFront ? 1 << 1 : 0) + (ghosted ? 1 << 2 : 0) + (outlineColor << 3);

  return [r, g, b, bytePattern];
}

function appearanceToTransformOverride(
  overrideId: number,
  appearance: NodeAppearance,
  transformTextureBuffer: TransformOverrideBuffer
): [number, number, number] {
  if (appearance.worldTransform === undefined) {
    return [0, 0, 0];
  }

  // TODO 2021-02-04 larsmoa: Rename usage overrideId in TransformOverrideBuffer
  const lookupIndex = transformTextureBuffer.addOverrideTransform(overrideId, appearance.worldTransform);
  return [
    Math.min((lookupIndex + 1) >> 16, 255),
    Math.min((lookupIndex + 1) >> 8, 255),
    Math.min((lookupIndex + 1) >> 0, 255)
  ];
}

function applyRGBA(texture: THREE.DataTexture, treeIndices: IndexSet, rgba: [number, number, number, number]) {
  const buffer = texture.image.data;
  const [r, g, b, a] = rgba;
  for (const treeIndex of treeIndices.values()) {
    buffer[4 * treeIndex + 0] = r;
    buffer[4 * treeIndex + 1] = g;
    buffer[4 * treeIndex + 2] = b;
    buffer[4 * treeIndex + 3] = a;
  }
  texture.needsUpdate = true;
}

function applyRGB(texture: THREE.DataTexture, treeIndices: IndexSet, rgb: [number, number, number]) {
  const buffer = texture.image.data;
  const [r, g, b] = rgb;
  for (const treeIndex of treeIndices.values()) {
    buffer[3 * treeIndex + 0] = r;
    buffer[3 * treeIndex + 1] = g;
    buffer[3 * treeIndex + 2] = b;
  }
  texture.needsUpdate = true;
}

function updateLookupSet(set: IndexSet, treeIndices: IndexSet, addToSet: boolean) {
  if (addToSet) {
    set.unionWith(treeIndices);
  } else {
    set.differenceWith(treeIndices);
  }
}

function resetTransformTexel(
  treeIndex: number,
  indexTexture: THREE.DataTexture,
  transformTextureBuffer: TransformOverrideBuffer
) {
  indexTexture.image.data[treeIndex * 3 + 0] = 0;
  indexTexture.image.data[treeIndex * 3 + 1] = 0;
  indexTexture.image.data[treeIndex * 3 + 2] = 0;

  transformTextureBuffer.removeOverrideTransform(treeIndex);

  indexTexture.needsUpdate = true;
}

function setTransformTexel(
  treeIndex: number,
  transform: THREE.Matrix4,
  indexTexture: THREE.DataTexture,
  transformTextureBuffer: TransformOverrideBuffer
) {
  const transformIndex = transformTextureBuffer.addOverrideTransform(treeIndex, transform);

  indexTexture.image.data[treeIndex * 3 + 0] = (transformIndex + 1) >> 16;
  indexTexture.image.data[treeIndex * 3 + 1] = (transformIndex + 1) >> 8;
  indexTexture.image.data[treeIndex * 3 + 2] = (transformIndex + 1) >> 0;

  indexTexture.needsUpdate = true;
}
