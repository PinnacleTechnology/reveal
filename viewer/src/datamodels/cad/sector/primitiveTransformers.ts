/*!
 * Copyright 2021 Cognite AS
 */

import { ParsePrimitiveAttribute } from '@cognite/reveal-parser-worker';

import * as THREE from 'three';

const boxInputStructSize = 52;
const circleInputStructSize = 40;
const closedConeInputStructSize = 48;
const closedCylinderInputStructSize = 44;
const closedEccentricConeInputStructSize = 60;
const closedEllipsoidSegmentInputStructSize = 48;
const closedExtrudedRingSegmentInputStructSize = 56;
const closedSphericalSegmentInputStructSize = 44;
const closedTorusSegmentInputStructSize = 52;
const ellipsoidInputStructSize = 48;
const extrudedRingInputStructSize = 48;
const nutInputStructSize = 48;
const openConeInputStructSize = 48;
const openCylinderInputStructSize = 44;
const openEccentricConeInputStructSize = 60;
const openEllipsoidSegmentInputStructSize = 48;
const openExtrudedRingSegmentInputStructSize = 56;
const openSphericalSegmentInputStructSize = 44;
const openTorusSegmentInputStructSize = 52;
const ringInputStructSize = 44;
const sphereInputStructSize = 28;
const torusInputStructSize = 44;
const openGeneralCylinderInputStructSize = 68;
const closedGeneralCylinderInputStructSize = 68;
const solidOpenGeneralCylinderInputStructSize = 72;
const solidClosedGeneralCylinderInputStructSize = 72;
const openGeneralConeInputStructSize = 72;
const closedGeneralConeInputStructSize = 72;
const solidOpenGeneralConeInputStructSize = 76;
const solidClosedGeneralConeInputStructSize = 76;

const boxOutputStructSize = 72;
const circleOutputStructSize = 84;
const coneOutputStructSize = 60;
const eccentricConeOutputStructSize = 52;
const ellipsoidSegmentOutputStructSize = 44;
const generalCylinderOutputStructSize = 88;
const generalRingOutputStructSize = 96;
const nutOutputStructSize = 72;
const quadOutputStructSize = 72;
const sphericalSegmentOutputStructSize = 40;
const torusSegmentOutputStructSize = 88;
const trapeziumOutputStructSize = 56;

export function getBoxOutputSize(boxInputBuffer: Uint8Array): number {
  return Math.round((boxInputBuffer.byteLength / boxInputStructSize) * boxOutputStructSize);
}

export function getCircleOutputSize(
  circleInputBuffer: Uint8Array,
  closedConeInputBuffer: Uint8Array,
  closedEccentricConeInputBuffer: Uint8Array,
  closedCylinderInputBuffer: Uint8Array,
  closedEllipsoidSegmentInputBuffer: Uint8Array,
  closedSphericalSegmentInputBuffer: Uint8Array
): number {
  return Math.round(
    (circleInputBuffer.byteLength / circleInputStructSize +
      (2 * closedConeInputBuffer.byteLength) / closedConeInputStructSize +
      (2 * closedEccentricConeInputBuffer.byteLength) / closedEccentricConeInputStructSize +
      (2 * closedCylinderInputBuffer.byteLength) / closedCylinderInputStructSize +
      closedEllipsoidSegmentInputBuffer.byteLength / closedEllipsoidSegmentInputStructSize +
      closedSphericalSegmentInputBuffer.byteLength / closedSphericalSegmentInputStructSize) *
      circleOutputStructSize
  );
}

export function getConeOutputSize(
  closedConeInputBuffer: Uint8Array,
  openConeInputBuffer: Uint8Array,
  openGeneralConeInputBuffer: Uint8Array,
  closedGeneralConeInputBuffer: Uint8Array,
  solidOpenGeneralConeInputBuffer: Uint8Array,
  solidClosedGeneralConeInputBuffer: Uint8Array,
  closedCylinderInputBuffer: Uint8Array,
  openCylinderInputBuffer: Uint8Array,
  closedExtrudedRingSegmentInputBuffer: Uint8Array,
  extrudedRingInputBuffer: Uint8Array,
  openExtrudedRingSegmentInputBuffer: Uint8Array
): number {
  return Math.round(
    (closedConeInputBuffer.byteLength / closedConeInputStructSize +
      openConeInputBuffer.byteLength / openConeInputStructSize +
      openGeneralConeInputBuffer.byteLength / openGeneralConeInputStructSize +
      closedGeneralConeInputBuffer.byteLength / closedGeneralConeInputStructSize +
      (2 * solidOpenGeneralConeInputBuffer.byteLength) / solidOpenGeneralConeInputStructSize +
      (2 * solidClosedGeneralConeInputBuffer.byteLength) / solidClosedGeneralConeInputStructSize +
      closedCylinderInputBuffer.byteLength / closedCylinderInputStructSize +
      openCylinderInputBuffer.byteLength / openCylinderInputStructSize +
      (2 * closedExtrudedRingSegmentInputBuffer.byteLength) / closedExtrudedRingSegmentInputStructSize +
      (2 * extrudedRingInputBuffer.byteLength) / extrudedRingInputStructSize +
      (2 * openExtrudedRingSegmentInputBuffer.byteLength) / openExtrudedRingSegmentInputStructSize) *
      coneOutputStructSize
  );
}

export function getEccentricConeOutputSize(
  closedEccentricConeInputBuffer: Uint8Array,
  openEccentricConeInputBuffer: Uint8Array
): number {
  return Math.round(
    (closedEccentricConeInputBuffer.byteLength / closedEccentricConeInputStructSize +
      openEccentricConeInputBuffer.byteLength / openEccentricConeInputStructSize) *
      eccentricConeOutputStructSize
  );
}

export function getEllipsoidSegmentOutputSize(
  closedEllipsoidSegmentInputBuffer: Uint8Array,
  ellipsoidInputBuffer: Uint8Array,
  openEllipsoidSegmentInputBuffer: Uint8Array
): number {
  return Math.round(
    (closedEllipsoidSegmentInputBuffer.byteLength / closedEllipsoidSegmentInputStructSize +
      ellipsoidInputBuffer.byteLength / ellipsoidInputStructSize +
      openEllipsoidSegmentInputBuffer.byteLength / openEllipsoidSegmentInputStructSize) *
      ellipsoidSegmentOutputStructSize
  );
}

export function getGeneralCylinderOutputSize(
  openGeneralCylinderInputBuffer: Uint8Array,
  closedGeneralCylinderInputBuffer: Uint8Array,
  solidOpenGeneralCylinderInputBuffer: Uint8Array,
  solidClosedGeneralCylinderInputBuffer: Uint8Array
): number {
  return Math.round(
    (openGeneralCylinderInputBuffer.byteLength / openGeneralCylinderInputStructSize +
      closedGeneralCylinderInputBuffer.byteLength / closedGeneralCylinderInputStructSize +
      (2 * solidOpenGeneralCylinderInputBuffer.byteLength) / solidOpenGeneralCylinderInputStructSize +
      (2 * solidClosedGeneralCylinderInputBuffer.byteLength) / solidClosedGeneralCylinderInputStructSize) *
      generalCylinderOutputStructSize
  );
}

export function getGeneralRingOutputSize(
  closedGeneralConeInputBuffer: Uint8Array,
  solidOpenGeneralConeInputBuffer: Uint8Array,
  solidClosedGeneralConeInputBuffer: Uint8Array,
  closedGeneralCylinderInputBuffer: Uint8Array,
  solidOpenGeneralCylinderInputBuffer: Uint8Array,
  solidClosedGeneralCylinderInputBuffer: Uint8Array,
  closedExtrudedRingSegmentInputBuffer: Uint8Array,
  extrudedRingInputBuffer: Uint8Array,
  openExtrudedRingSegmentInputBuffer: Uint8Array,
  ringInputBuffer: Uint8Array
): number {
  return Math.round(
    ((2 * closedGeneralConeInputBuffer.byteLength) / closedGeneralConeInputStructSize +
      (2 * solidOpenGeneralConeInputBuffer.byteLength) / solidOpenGeneralConeInputStructSize +
      (2 * solidClosedGeneralConeInputBuffer.byteLength) / solidClosedGeneralConeInputStructSize +
      (2 * closedGeneralCylinderInputBuffer.byteLength) / closedGeneralCylinderInputStructSize +
      (2 * solidOpenGeneralCylinderInputBuffer.byteLength) / solidOpenGeneralCylinderInputStructSize +
      (2 * solidClosedGeneralCylinderInputBuffer.byteLength) / solidClosedGeneralCylinderInputStructSize +
      (2 * closedExtrudedRingSegmentInputBuffer.byteLength) / closedExtrudedRingSegmentInputStructSize +
      (2 * extrudedRingInputBuffer.byteLength) / extrudedRingInputStructSize +
      (2 * openExtrudedRingSegmentInputBuffer.byteLength) / openExtrudedRingSegmentInputStructSize +
      ringInputBuffer.byteLength / ringInputStructSize) *
      generalRingOutputStructSize
  );
}

export function getNutOutputSize(nutInputBuffer: Uint8Array): number {
  return Math.round((nutInputBuffer.byteLength / nutInputStructSize) * nutOutputStructSize);
}

export function getQuadOutputSize(closedExtrudedRingSegmentInputBuffer: Uint8Array): number {
  return Math.round(
    ((2 * closedExtrudedRingSegmentInputBuffer.byteLength) / closedExtrudedRingSegmentInputStructSize) *
      quadOutputStructSize
  );
}

export function getSphericalSegmentOutputSize(
  openSphericalSegmentInputBuffer: Uint8Array,
  sphereInputBuffer: Uint8Array,
  closedSphericalSegmentInputBuffer: Uint8Array
): number {
  return Math.round(
    (openSphericalSegmentInputBuffer.byteLength / openSphericalSegmentInputStructSize +
      sphereInputBuffer.byteLength / sphereInputStructSize +
      closedSphericalSegmentInputBuffer.byteLength / closedSphericalSegmentInputStructSize) *
      sphericalSegmentOutputStructSize
  );
}

export function getTorusSegmentOutputSize(
  torusInputBuffer: Uint8Array,
  closedTorusSegmentInputBuffer: Uint8Array,
  openTorusSegmentInputBuffer: Uint8Array
): number {
  return Math.round(
    (torusInputBuffer.byteLength / torusInputStructSize +
      closedTorusSegmentInputBuffer.byteLength / closedTorusSegmentInputStructSize +
      openTorusSegmentInputBuffer.byteLength / openTorusSegmentInputStructSize) *
      torusSegmentOutputStructSize
  );
}

export function getTrapeziumOutputSize(
  solidClosedGeneralConeInputBuffer: Uint8Array,
  solidClosedGeneralCylinderInputBuffer: Uint8Array
): number {
  return Math.round(
    ((2 * solidClosedGeneralConeInputBuffer.byteLength) / solidClosedGeneralConeInputStructSize +
      (2 * solidClosedGeneralCylinderInputBuffer.byteLength) / solidClosedGeneralCylinderInputStructSize) *
      trapeziumOutputStructSize
  );
}

/**
 * Util functions
 */

function createTranslation(center: THREE.Vector3): THREE.Matrix4 {
  return new THREE.Matrix4().makeTranslation(center.x, center.y, center.z);
}

function createRotationBetweenZ(axis: THREE.Vector3): THREE.Matrix4 {
  return new THREE.Matrix4().makeRotationFromQuaternion(
    new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), axis)
  );
}

function createRotationAxisAngle(axis: THREE.Vector3, angle: number): THREE.Matrix4 {
  return new THREE.Matrix4().makeRotationAxis(axis, angle);
}

function createScale(scale: THREE.Vector3): THREE.Matrix4 {
  return new THREE.Matrix4().makeScale(scale.x, scale.y, scale.z);
}

function createRotationAroundZ(angle: number): THREE.Matrix4 {
  return new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), angle);
}

function createGeneralRingMatrix(
  center: THREE.Vector3,
  normal: THREE.Vector3,
  localXAxis: THREE.Vector3,
  radiusA: number,
  radiusB: number
): THREE.Matrix4 {
  const localYAxis = normal.cross(localXAxis);

  const rotationMatrix = new THREE.Matrix4().set(
    localXAxis.x,
    localYAxis.x,
    normal.x,
    0,
    localXAxis.y,
    localYAxis.y,
    normal.y,
    0,
    localXAxis.z,
    localYAxis.z,
    normal.z,
    0,
    0,
    0,
    0,
    1
  );

  const translationMatrix = createTranslation(center);
  const scale = createScale(new THREE.Vector3(2 * radiusA, 2 * radiusB, 1.0));
  return translationMatrix.multiply(rotationMatrix).multiply(scale);
}

/*
 * Read utils
 */

function getVector3(inView: DataView, offset: number): THREE.Vector3 {
  return new THREE.Vector3(
    inView.getFloat32(offset + 0, true),
    inView.getFloat32(offset + 4, true),
    inView.getFloat32(offset + 8, true)
  );
}

function getColor(inView: DataView, offset: number): THREE.Vector4 {
  return new THREE.Vector4(
    inView.getUint8(offset + 0),
    inView.getUint8(offset + 1),
    inView.getUint8(offset + 2),
    inView.getUint8(offset + 3)
  );
}

/**
 * Output utils
 */

interface CylinderCap {
  treeIndex: number;
  color: THREE.Vector4;
  normal: THREE.Vector3;
  thickness: number;
  angle: number;
  arcAngle: number;
  instanceMatrix: THREE.Matrix4;
  plane: THREE.Vector4;
  center: THREE.Vector3;
}

function getCylinderCap(
  treeIndex: number,
  color: THREE.Vector4,
  cylinderRotation: THREE.Matrix4,
  cylinderRotationAngle: number,
  axis: THREE.Vector3,
  extA: THREE.Vector3,
  extB: THREE.Vector3,
  center: THREE.Vector3,
  radius: number,
  thickness: number,
  arcAngle: number,
  slope: number,
  zAngle: number,
  height: number,
  invNormal: boolean
): CylinderCap {
  const slopeRotation = createRotationAxisAngle(new THREE.Vector3(0, 1, 0), slope);
  const zAngleRotation = createRotationAxisAngle(new THREE.Vector3(0, 0, 1), zAngle);
  const rotation = zAngleRotation.multiply(slopeRotation);
  const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);
  const localZAxis = new THREE.Vector3(0, 0, 1).applyMatrix4(rotation);
  const normal = localZAxis.multiplyScalar(invNormal ? -1 : 1);

  const centerAxisRotation = createRotationBetweenZ(axis);

  const plane = new THREE.Vector4(normal.x, normal.y, normal.z, height);
  const capXAxisA = localXAxis.applyMatrix4(centerAxisRotation).normalize();
  const capZAxisA = localZAxis.applyMatrix4(cylinderRotation).normalize();

  const capRadiusXA = radius / Math.abs(Math.cos(slope));
  const capRadiusY = radius;

  let linePoint = new THREE.Vector3(Math.cos(cylinderRotationAngle), Math.sin(cylinderRotationAngle), 0);

  linePoint = linePoint.applyMatrix4(cylinderRotation).normalize();
  const lineStartA = extB.sub(axis).add(linePoint);
  const lineEndA = extA.add(axis).add(linePoint);
  const lineVector = lineEndA.sub(lineStartA);

  const intersectionPoint = intersect(lineVector, lineStartA, capZAxisA, center);
  const capAngleAxisA = intersectionPoint.sub(center).normalize();
  const capAngleA = angleBetweenVectors(capAngleAxisA, capXAxisA, capZAxisA);

  const instanceMatrix = createGeneralRingMatrix(center, capZAxisA, capXAxisA, capRadiusXA, capRadiusY);

  return {
    treeIndex,
    color,
    normal,
    thickness,
    angle: capAngleA,
    arcAngle,
    instanceMatrix,
    plane,
    center
  };
}

interface GeneralCylinder {
  treeIndex: number;
  color: THREE.Vector4;
  centerA: THREE.Vector3;
  centerB: THREE.Vector3;
  radius: number;
  angle: number;
  planeA: THREE.Vector4;
  planeB: THREE.Vector4;
  arcAngle: number;
  localXAxis: THREE.Vector3;
  capA: CylinderCap;
  capB: CylinderCap;
}

function getGeneralCylinder(
  treeIndex: number,
  color: THREE.Vector4,
  center: THREE.Vector3,
  axis: THREE.Vector3,
  height: number,
  radius: number,
  thickness: number,
  rotationAngle: number,
  arcAngle: number,
  slopeA: number,
  slopeB: number,
  zAngleA: number,
  zAngleB: number
): GeneralCylinder {
  const centerA = center.addScaledVector(axis, height / 2);
  const centerB = center.addScaledVector(axis, -height / 2);

  const distFromAToExtA = radius + Math.tan(slopeA);
  const distFromBToExtB = radius + Math.tan(slopeB);

  const heightA = distFromBToExtB + height;
  const heightB = distFromBToExtB;

  const extA = centerA.addScaledVector(axis, distFromAToExtA);
  const extB = centerB.addScaledVector(axis, -distFromBToExtB);

  const normal = extA.sub(extB).normalize();

  const rotation = createRotationBetweenZ(normal);

  const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

  const capA = getCylinderCap(
    treeIndex,
    color,
    rotation,
    rotationAngle,
    axis,
    extA,
    extB,
    centerA,
    radius,
    thickness,
    arcAngle,
    slopeA,
    zAngleA,
    heightA,
    false
  );

  const capB = getCylinderCap(
    treeIndex,
    color,
    rotation,
    rotationAngle,
    axis,
    extA,
    extB,
    centerB,
    radius,
    thickness,
    arcAngle,
    slopeB,
    zAngleB,
    heightB,
    true
  );

  return {
    treeIndex,
    color,
    centerA,
    centerB,
    radius,
    angle: rotationAngle,
    planeA: capA.plane,
    planeB: capB.plane,
    arcAngle,
    localXAxis,
    capA,
    capB
  };
}

/**
 * Util write functions
 */

function writeFloat(float: number, dataView: DataView, byteOffset: number) {
  dataView.setFloat32(byteOffset, float, true);
}

function writeMatrix4(matrix: THREE.Matrix4, dataView: DataView, byteOffset: number) {
  const elements = matrix.elements;

  for (let i = 0; i < 16; i++) {
    writeFloat(elements[i], dataView, byteOffset + i * 4);
  }
}

function writeColor(outColor: THREE.Vector4, outView: DataView, offset: number) {
  outView.setUint8(offset + 0, outColor.z);
  outView.setUint8(offset + 1, outColor.y);
  outView.setUint8(offset + 2, outColor.x);
  outView.setUint8(offset + 3, outColor.w);
}

function writeVector3(outVector: THREE.Vector3, outView: DataView, offset: number) {
  writeFloat(outVector.x, outView, offset + 0);
  writeFloat(outVector.y, outView, offset + 4);
  writeFloat(outVector.z, outView, offset + 8);
}

function writeVector4(outVector: THREE.Vector4, outView: DataView, offset: number) {
  writeFloat(outVector.x, outView, offset + 0);
  writeFloat(outVector.y, outView, offset + 4);
  writeFloat(outVector.z, outView, offset + 8);
  writeFloat(outVector.w, outView, offset + 12);
}

/*
 * Primitive write functions
 */

function outputBox3(
  treeIndex: number,
  color: THREE.Vector4,
  instanceMatrix: THREE.Matrix4,
  outView: DataView,
  offset: number,
  boxAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const treeIndexOffset = offset + boxAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + boxAttributes.get('color')!.offset;
  const instanceMatrixOffset = offset + boxAttributes.get('instanceMatrix')!.offset;

  outView.setFloat32(treeIndexOffset, treeIndex, true);
  writeColor(color, outView, colorOffset);

  writeMatrix4(instanceMatrix, outView, instanceMatrixOffset);
}

function outputCircle(
  treeIndex: number,
  color: THREE.Vector4,
  center: THREE.Vector3,
  normal: THREE.Vector3,
  radius: number,
  outView: DataView,
  offset: number,
  circleAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const translationMatrix = createTranslation(center);
  const rotationMatrix = createRotationBetweenZ(normal);
  const scale = createScale(new THREE.Vector3(2 * radius, 2 * radius, 1));

  const instanceMatrix = translationMatrix.multiply(rotationMatrix).multiply(scale);

  const treeIndexOffset = offset + circleAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + circleAttributes.get('color')!.offset;
  const normalOffset = offset + circleAttributes.get('normal')!.offset;
  const instanceMatrixOffset = offset + circleAttributes.get('instanceMatrix')!.offset;

  writeFloat(treeIndex, outView, treeIndexOffset);
  writeColor(color, outView, colorOffset);
  writeVector3(normal, outView, normalOffset);
  writeMatrix4(instanceMatrix, outView, instanceMatrixOffset);
}

function outputRing(
  treeIndex: number,
  color: THREE.Vector4,
  normal: THREE.Vector3,
  thickness: number,
  rotationAngle: number,
  arcAngle: number,
  transformation: THREE.Matrix4,
  outView: DataView,
  offset: number,
  ringAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const treeIndexOffset = offset + ringAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + ringAttributes.get('color')!.offset;
  const normalOffset = offset + ringAttributes.get('normal')!.offset;
  const thicknessOffset = offset + ringAttributes.get('thickness')!.offset;
  const rotationAngleOffset = offset + ringAttributes.get('angle')!.offset;
  const arcAngleOffset = offset + ringAttributes.get('arcAngle')!.offset;
  const instanceMatrixOffset = offset + ringAttributes.get('instanceMatrix')!.offset;

  writeFloat(treeIndex, outView, treeIndexOffset);
  writeColor(color, outView, colorOffset);
  writeVector3(normal, outView, normalOffset);
  writeFloat(thickness, outView, thicknessOffset);
  writeFloat(rotationAngle, outView, rotationAngleOffset);
  writeFloat(arcAngle, outView, arcAngleOffset);
  writeMatrix4(transformation, outView, instanceMatrixOffset);
}

function outputCone(
  treeIndex: number,
  color: THREE.Vector4,
  centerA: THREE.Vector3,
  centerB: THREE.Vector3,
  radiusA: number,
  radiusB: number,
  rotationAngle: number,
  arcAngle: number,
  localXAxis: THREE.Vector3,
  outView: DataView,
  offset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const treeIndexOffset = offset + coneAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + coneAttributes.get('color')!.offset;
  const centerAOffset = offset + coneAttributes.get('centerA')!.offset;
  const centerBOffset = offset + coneAttributes.get('centerB')!.offset;
  const radiusAOffset = offset + coneAttributes.get('radiusA')!.offset;
  const radiusBOffset = offset + coneAttributes.get('radiusB')!.offset;
  const angleOffset = offset + coneAttributes.get('angle')!.offset;
  const arcAngleOffset = offset + coneAttributes.get('arcAngle')!.offset;
  const localXAxisOffset = offset + coneAttributes.get('localXAxis')!.offset;

  writeFloat(treeIndex, outView, treeIndexOffset);
  writeColor(color, outView, colorOffset);
  writeVector3(centerA, outView, centerAOffset);
  writeVector3(centerB, outView, centerBOffset);
  writeFloat(radiusA, outView, radiusAOffset);
  writeFloat(radiusB, outView, radiusBOffset);
  writeFloat(rotationAngle, outView, angleOffset);
  writeFloat(arcAngle, outView, arcAngleOffset);
  writeVector3(localXAxis, outView, localXAxisOffset);
}

function outputEccentricCone(
  treeIndex: number,
  color: THREE.Vector4,
  centerA: THREE.Vector3,
  centerB: THREE.Vector3,
  radiusA: number,
  radiusB: number,
  normal: THREE.Vector3,
  outView: DataView,
  offset: number,
  eccentricConeAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const treeIndexOffset = offset + eccentricConeAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + eccentricConeAttributes.get('color')!.offset;
  const centerAOffset = offset + eccentricConeAttributes.get('centerA')!.offset;
  const centerBOffset = offset + eccentricConeAttributes.get('centerB')!.offset;
  const radiusAOffset = offset + eccentricConeAttributes.get('radiusA')!.offset;
  const radiusBOffset = offset + eccentricConeAttributes.get('radiusB')!.offset;
  const normalOffset = offset + eccentricConeAttributes.get('normal')!.offset;

  writeFloat(treeIndex, outView, treeIndexOffset);
  writeColor(color, outView, colorOffset);
  writeVector3(centerA, outView, centerAOffset);
  writeVector3(centerB, outView, centerBOffset);
  writeFloat(radiusA, outView, radiusAOffset);
  writeFloat(radiusB, outView, radiusBOffset);
  writeVector3(normal, outView, normalOffset);
}

function outputGeneralCylinder(
  treeIndex: number,
  color: THREE.Vector4,
  centerA: THREE.Vector3,
  centerB: THREE.Vector3,
  radius: number,
  angle: number,
  planeA: THREE.Vector4,
  planeB: THREE.Vector4,
  arcAngle: number,
  localXAxis: THREE.Vector3,
  outView: DataView,
  offset: number,
  generalCylinderAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const treeIndexOffset = offset + generalCylinderAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + generalCylinderAttributes.get('color')!.offset;
  const centerAOffset = offset + generalCylinderAttributes.get('centerA')!.offset;
  const centerBOffset = offset + generalCylinderAttributes.get('centerB')!.offset;
  const radiusOffset = offset + generalCylinderAttributes.get('radius')!.offset;
  const angleOffset = offset + generalCylinderAttributes.get('angle')!.offset;
  const planeAOffset = offset + generalCylinderAttributes.get('planeA')!.offset;
  const planeBOffset = offset + generalCylinderAttributes.get('planeB')!.offset;
  const arcAngleOffset = offset + generalCylinderAttributes.get('arcAngle')!.offset;
  const localXAxisOffset = offset + generalCylinderAttributes.get('localXAxis')!.offset;

  writeFloat(treeIndex, outView, treeIndexOffset);
  writeColor(color, outView, colorOffset);
  writeVector3(centerA, outView, centerAOffset);
  writeVector3(centerB, outView, centerBOffset);
  writeFloat(radius, outView, radiusOffset);
  writeFloat(angle, outView, angleOffset);
  writeVector4(planeA, outView, planeAOffset);
  writeVector4(planeB, outView, planeBOffset);
  writeFloat(arcAngle, outView, arcAngleOffset);
  writeVector3(localXAxis, outView, localXAxisOffset);
}

function outputTrapezium(
  treeIndex: number,
  color: THREE.Vector4,
  vertices: THREE.Vector3[],
  outView: DataView,
  offset: number,
  trapeziumAttributes: Map<string, ParsePrimitiveAttribute>
) {
  const treeIndexOffset = offset + trapeziumAttributes.get('treeIndex')!.offset;
  const colorOffset = offset + trapeziumAttributes.get('color')!.offset;
  const vertexOffsets = [
    offset + trapeziumAttributes.get('vertex1')!.offset,
    offset + trapeziumAttributes.get('vertex2')!.offset,
    offset + trapeziumAttributes.get('vertex3')!.offset,
    offset + trapeziumAttributes.get('vertex4')!.offset
  ];

  writeFloat(treeIndex, outView, treeIndexOffset);
  writeColor(color, outView, colorOffset);

  for (const i of [0, 1, 2, 3]) {
    writeVector3(vertices[i], outView, vertexOffsets[i]);
  }
}

/*
 * Math utilities
 */

function intersect(
  rayDir: THREE.Vector3,
  rayPoint: THREE.Vector3,
  planeNormal: THREE.Vector3,
  planePoint: THREE.Vector3
): THREE.Vector3 {
  const diff = rayPoint.sub(planePoint);
  const prod1 = diff.dot(planeNormal);
  const prod2 = rayDir.dot(planeNormal);
  const prod3 = prod1 / prod2;
  return rayPoint.sub(rayDir.multiplyScalar(prod3));
}

function normalizeRadians(angle: number): number {
  while (angle < -Math.PI) {
    angle += 2 * Math.PI;
  }

  while (angle > Math.PI) {
    angle -= 2 * Math.PI;
  }

  return angle;
}

function angleBetweenVectors(v1: THREE.Vector3, v2: THREE.Vector3, up: THREE.Vector3) {
  const angle = v1.angleTo(v2);
  const right = v1.cross(up);
  const moreThanPi = right.dot(v2) < 0;

  if (moreThanPi) {
    return 2 * Math.PI - angle;
  } else {
    return angle;
  }
}

/**
 * Functions for transforming incoming primitive buffers into GPU-usable buffers
 * Returns number of bytes written + original offset = the offset for next write to the buffer
 */

export function transformBoxes(
  inputBuffer: Uint8Array,
  outArray: Uint8Array,
  originalOutputOffset: number,
  boxAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  const inputStructSize = boxInputStructSize;
  const outputStructSize = boxOutputStructSize;

  let currentInputOffset = 0;
  let currentOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, inputStructSize);
    const outView = new DataView(outArray.buffer, originalOutputOffset + currentOutputOffset, outputStructSize);

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const normal = getVector3(inView, 24);
    const delta = getVector3(inView, 36);
    const rotationAngle = inView.getFloat32(48, true);

    const translationMatrix = createTranslation(center);
    const firstRotation = createRotationAroundZ(rotationAngle);
    const secondRotation = createRotationBetweenZ(normal);
    const scaleMatrix = createScale(delta);

    const instanceMatrix = translationMatrix.multiply(firstRotation).multiply(secondRotation).multiply(scaleMatrix);

    outputBox3(treeIndex, color, instanceMatrix, outView, 0, boxAttributes);

    currentInputOffset += inputStructSize;
    currentOutputOffset += outputStructSize;
  }

  return currentOutputOffset;
}

export function transformCircles(
  inputBuffer: Uint8Array,
  outArray: Uint8Array,
  originalOutputOffset: number,
  circleAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  let currentInputOffset = 0;
  let currentOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, circleInputStructSize);
    const outView = new DataView(outArray.buffer, originalOutputOffset + currentOutputOffset, circleOutputStructSize);

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const normal = getVector3(inView, 24);
    const radius = inView.getFloat32(36, true);

    outputCircle(treeIndex, color, center, normal, radius, outView, 0, circleAttributes);

    currentInputOffset += circleInputStructSize;
    currentOutputOffset += circleOutputStructSize;
  }
  debugger;

  return currentOutputOffset;
}

export function transformClosedCones(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  outCirclesArray: Uint8Array,
  originalConesOutputOffset: number,
  originalCirclesOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>,
  circleAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number] {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;
  let currentCirclesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedConeInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      coneOutputStructSize
    );
    const outCirclesView = new DataView(
      outCirclesArray.buffer,
      originalCirclesOutputOffset + currentCirclesOutputOffset,
      2 * circleOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      0,
      2 * Math.PI,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    outputCircle(treeIndex, color, centerA, axis, radiusA, outCirclesView, 0, circleAttributes);
    outputCircle(
      treeIndex,
      color,
      centerB,
      new THREE.Vector3().copy(axis).negate(),
      radiusB,
      outCirclesView,
      circleOutputStructSize,
      circleAttributes
    );

    currentInputOffset += closedConeInputStructSize;
    currentConesOutputOffset += coneOutputStructSize;
    currentCirclesOutputOffset += 2 * circleOutputStructSize;
  }

  return [currentConesOutputOffset, currentCirclesOutputOffset];
}

export function transformOpenCones(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  originalConesOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, openConeInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      coneOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);

    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);

    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      0,
      2 * Math.PI,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    currentInputOffset += openConeInputStructSize;
    currentConesOutputOffset += coneOutputStructSize;
  }

  return currentConesOutputOffset;
}

export function transformClosedEccentricCones(
  inputBuffer: Uint8Array,
  outEccentricConesArray: Uint8Array,
  outCirclesArray: Uint8Array,
  originalEccentricConesOutputOffset: number,
  originalCirclesOutputOffset: number,
  eccentricConeAttributes: Map<string, ParsePrimitiveAttribute>,
  circleAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number] {
  let currentInputOffset = 0;
  let currentEccentricConesOutputOffset = 0;
  let currentCirclesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedEccentricConeInputStructSize);
    const outEccentricConesView = new DataView(
      outEccentricConesArray.buffer,
      originalEccentricConesOutputOffset + currentEccentricConesOutputOffset,
      eccentricConeOutputStructSize
    );
    const outCirclesView = new DataView(
      outCirclesArray.buffer,
      originalCirclesOutputOffset + currentCirclesOutputOffset,
      2 * circleOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);
    const capNormal = getVector3(inView, 48);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const dotProduct = capNormal.dot(centerA.sub(centerB));

    if (dotProduct < 0) {
      capNormal.negate();
    }

    outputEccentricCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      capNormal,
      outEccentricConesView,
      0,
      eccentricConeAttributes
    );

    outputCircle(treeIndex, color, centerA, axis, radiusA, outCirclesView, 0, circleAttributes);
    outputCircle(treeIndex, color, centerB, axis, radiusB, outCirclesView, circleOutputStructSize, circleAttributes);

    currentInputOffset += closedEccentricConeInputStructSize;
    currentEccentricConesOutputOffset += eccentricConeOutputStructSize;
    currentCirclesOutputOffset += 2 * circleOutputStructSize;
  }

  return [currentEccentricConesOutputOffset, currentCirclesOutputOffset];
}

export function transformOpenEccentricCones(
  inputBuffer: Uint8Array,
  outEccentricConesArray: Uint8Array,
  originalEccentricConesOutputOffset: number,
  eccentricConeAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  let currentInputOffset = 0;
  let currentEccentricConesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, openEccentricConeInputStructSize);
    const outEccentricConesView = new DataView(
      outEccentricConesArray.buffer,
      originalEccentricConesOutputOffset + currentEccentricConesOutputOffset,
      eccentricConeOutputStructSize
    );
    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);
    const capNormal = getVector3(inView, 48);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const dotProduct = capNormal.dot(centerA.sub(centerB));

    if (dotProduct < 0) {
      capNormal.negate();
    }

    outputEccentricCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      capNormal,
      outEccentricConesView,
      0,
      eccentricConeAttributes
    );

    currentInputOffset += openEccentricConeInputStructSize;
    currentEccentricConesOutputOffset += eccentricConeOutputStructSize;
  }

  return currentEccentricConesOutputOffset;
}

export function transformOpenGeneralCones(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  originalConesOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, openGeneralConeInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      coneOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);
    const rotationAngle = inView.getFloat32(48, true);
    const arcAngle = inView.getFloat32(52, true);
    // const slopeA = inView.getFloat32(56, true);
    // const slopeB = inView.getFloat32(60, true);
    // const zAngleA = inView.getFloat32(64, true);
    // const zAngleB = inView.getFloat32(68, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      rotationAngle,
      arcAngle,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    currentInputOffset += openGeneralConeInputStructSize;
    currentConesOutputOffset += coneOutputStructSize;
  }

  return currentConesOutputOffset;
}

export function transformClosedGeneralCones(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  outRingsArray: Uint8Array,
  originalConesOutputOffset: number,
  originalRingsOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>,
  ringAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number] {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;
  let currentRingsOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedGeneralConeInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      coneOutputStructSize
    );
    const outRingsView = new DataView(
      outRingsArray.buffer,
      originalRingsOutputOffset + currentRingsOutputOffset,
      2 * generalRingOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);
    const rotationAngle = inView.getFloat32(48, true);
    const arcAngle = inView.getFloat32(52, true);
    // const slopeA = inView.getFloat32(56, true);
    // const slopeB = inView.getFloat32(60, true);
    // const zAngleA = inView.getFloat32(64, true);
    // const zAngleB = inView.getFloat32(68, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    const ringTransformMatrixA = createGeneralRingMatrix(centerA, normal, localXAxis, radiusA, radiusA);
    const ringTransformMatrixB = createGeneralRingMatrix(centerB, normal, localXAxis, radiusB, radiusB);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      rotationAngle,
      arcAngle,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    outputRing(
      treeIndex,
      color,
      normal,
      1.0,
      rotationAngle,
      arcAngle,
      ringTransformMatrixA,
      outRingsView,
      0,
      ringAttributes
    );
    outputRing(
      treeIndex,
      color,
      normal,
      1.0,
      rotationAngle,
      arcAngle,
      ringTransformMatrixB,
      outRingsView,
      generalRingOutputStructSize,
      ringAttributes
    );

    currentInputOffset += closedConeInputStructSize;
    currentConesOutputOffset += coneOutputStructSize;
    currentRingsOutputOffset += 2 * generalRingOutputStructSize;
  }

  return [currentConesOutputOffset, currentRingsOutputOffset];
}

export function transformSolidOpenGeneralCones(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  outRingsArray: Uint8Array,
  originalConesOutputOffset: number,
  originalRingsOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>,
  ringAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number] {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;
  let currentRingsOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedGeneralConeInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      2 * coneOutputStructSize
    );
    const outRingsView = new DataView(
      outRingsArray.buffer,
      originalRingsOutputOffset + currentRingsOutputOffset,
      2 * generalRingOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);
    const thickness = inView.getFloat32(48, true);
    const rotationAngle = inView.getFloat32(52, true);
    const arcAngle = inView.getFloat32(56, true);
    // const slopeA = inView.getFloat32(60, true);
    // const slopeB = inView.getFloat32(64, true);
    // const zAngleA = inView.getFloat32(68, true);
    // const zAngleB = inView.getFloat32(72, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      rotationAngle,
      arcAngle,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA - thickness,
      radiusB - thickness,
      rotationAngle,
      arcAngle,
      localXAxis,
      outConesView,
      coneOutputStructSize,
      coneAttributes
    );

    const ringTransformMatrixA = createGeneralRingMatrix(centerA, normal, localXAxis, radiusA, radiusA);
    const ringTransformMatrixB = createGeneralRingMatrix(centerB, normal, localXAxis, radiusB, radiusB);

    outputRing(
      treeIndex,
      color,
      normal,
      thickness / radiusA,
      rotationAngle,
      arcAngle,
      ringTransformMatrixA,
      outRingsView,
      0,
      ringAttributes
    );
    outputRing(
      treeIndex,
      color,
      normal,
      thickness / radiusB,
      rotationAngle,
      arcAngle,
      ringTransformMatrixB,
      outRingsView,
      generalRingOutputStructSize,
      ringAttributes
    );

    currentInputOffset += closedConeInputStructSize;
    currentConesOutputOffset += 2 * coneOutputStructSize;
    currentRingsOutputOffset += 2 * generalRingOutputStructSize;
  }

  return [currentConesOutputOffset, currentRingsOutputOffset];
}

export function transformSolidClosedGeneralCones(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  outRingsArray: Uint8Array,
  outTrapeziumsArray: Uint8Array,
  originalConesOutputOffset: number,
  originalRingsOutputOffset: number,
  originalTrapeziumsOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>,
  ringAttributes: Map<string, ParsePrimitiveAttribute>,
  trapeziumAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number, number] {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;
  let currentRingsOutputOffset = 0;
  let currentTrapeziumsOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedGeneralConeInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      2 * coneOutputStructSize
    );
    const outRingsView = new DataView(
      outRingsArray.buffer,
      originalRingsOutputOffset + currentRingsOutputOffset,
      2 * generalRingOutputStructSize
    );
    const outTrapeziumsView = new DataView(
      outTrapeziumsArray.buffer,
      originalTrapeziumsOutputOffset + currentTrapeziumsOutputOffset,
      2 * trapeziumOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radiusA = inView.getFloat32(40, true);
    const radiusB = inView.getFloat32(44, true);
    const thickness = inView.getFloat32(48, true);
    const rotationAngle = inView.getFloat32(52, true);
    const arcAngle = inView.getFloat32(56, true);
    // const slopeA = inView.getFloat32(60, true);
    // const slopeB = inView.getFloat32(64, true);
    // const zAngleA = inView.getFloat32(68, true);
    // const zAngleB = inView.getFloat32(72, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA,
      radiusB,
      rotationAngle,
      arcAngle,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radiusA - thickness,
      radiusB - thickness,
      rotationAngle,
      arcAngle,
      localXAxis,
      outConesView,
      coneOutputStructSize,
      coneAttributes
    );

    const ringTransformMatrixA = createGeneralRingMatrix(centerA, normal, localXAxis, radiusA, radiusA);
    const ringTransformMatrixB = createGeneralRingMatrix(centerB, normal, localXAxis, radiusB, radiusB);

    outputRing(
      treeIndex,
      color,
      normal,
      thickness / radiusA,
      rotationAngle,
      arcAngle,
      ringTransformMatrixA,
      outRingsView,
      0,
      ringAttributes
    );
    outputRing(
      treeIndex,
      color,
      new THREE.Vector3().copy(normal).negate(),
      thickness / radiusB,
      rotationAngle,
      arcAngle,
      ringTransformMatrixB,
      outRingsView,
      generalRingOutputStructSize,
      ringAttributes
    );

    let trapeziumViewOffset = 0;

    for (const second of [false, true]) {
      const finalAngle = rotationAngle + (second ? arcAngle : 0);
      const rotation = createRotationBetweenZ(normal);
      let point = new THREE.Vector3(Math.cos(finalAngle), Math.sin(finalAngle), 0);
      point = point.applyMatrix4(rotation).normalize();

      const vertices = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
      let vertexIndex = 0;

      for (const isA of [false, true]) {
        const aForReal = second ? isA : !isA;
        const radius = aForReal ? radiusA : radiusB;
        const center = aForReal ? centerA : centerB;
        for (const offset of [0.0, -thickness]) {
          vertices[vertexIndex] = center.addScaledVector(point, radius + offset);
          vertexIndex += 1;
        }
      }

      outputTrapezium(treeIndex, color, vertices, outTrapeziumsView, trapeziumViewOffset, trapeziumAttributes);

      trapeziumViewOffset += 4 + 4 + 4 * 3 * 4;
    }

    currentInputOffset += closedConeInputStructSize;
    currentConesOutputOffset += 2 * coneOutputStructSize;
    currentRingsOutputOffset += 2 * generalRingOutputStructSize;
    currentTrapeziumsOutputOffset += 2 * trapeziumOutputStructSize;
  }

  return [currentConesOutputOffset, currentRingsOutputOffset, currentTrapeziumsOutputOffset];
}

export function transformClosedCylinders(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  outCirclesArray: Uint8Array,
  originalConesOutputOffset: number,
  originalCirclesOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>,
  circleAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number] {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;
  let currentCirclesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedCylinderInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      coneOutputStructSize
    );
    const outCirclesView = new DataView(
      outCirclesArray.buffer,
      originalCirclesOutputOffset + currentCirclesOutputOffset,
      2 * circleOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radius = inView.getFloat32(40, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radius,
      radius,
      0,
      2 * Math.PI,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    outputCircle(treeIndex, color, centerA, axis, radius, outCirclesView, 0, circleAttributes);
    outputCircle(
      treeIndex,
      color,
      centerB,
      new THREE.Vector3().copy(axis).negate(),
      radius,
      outCirclesView,
      circleOutputStructSize,
      circleAttributes
    );

    currentInputOffset += closedCylinderInputStructSize;
    currentConesOutputOffset += coneOutputStructSize;
    currentCirclesOutputOffset += 2 * circleOutputStructSize;
  }

  return [currentConesOutputOffset, currentCirclesOutputOffset];
}

export function transformOpenCylinders(
  inputBuffer: Uint8Array,
  outConesArray: Uint8Array,
  originalConesOutputOffset: number,
  coneAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  let currentInputOffset = 0;
  let currentConesOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, openCylinderInputStructSize);
    const outConesView = new DataView(
      outConesArray.buffer,
      originalConesOutputOffset + currentConesOutputOffset,
      coneOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radius = inView.getFloat32(40, true);

    const centerA = center.addScaledVector(axis, height / 2);
    const centerB = center.addScaledVector(axis, -height / 2);

    const normal = centerA.sub(centerB).normalize();

    const rotation = createRotationBetweenZ(normal);
    const localXAxis = new THREE.Vector3(1, 0, 0).applyMatrix4(rotation);

    outputCone(
      treeIndex,
      color,
      centerA,
      centerB,
      radius,
      radius,
      0,
      2 * Math.PI,
      localXAxis,
      outConesView,
      0,
      coneAttributes
    );

    currentInputOffset += openCylinderInputStructSize;
    currentConesOutputOffset += coneOutputStructSize;
  }

  return currentConesOutputOffset;
}

export function transformOpenGeneralCylinders(
  inputBuffer: Uint8Array,
  outCylindersArray: Uint8Array,
  originalCylindersOutputOffset: number,
  generalCylinderAttributes: Map<string, ParsePrimitiveAttribute>
): number {
  let currentInputOffset = 0;
  let currentCylindersOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, openCylinderInputStructSize);
    const outCylindersView = new DataView(
      outCylindersArray.buffer,
      originalCylindersOutputOffset + currentCylindersOutputOffset,
      generalCylinderOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radius = inView.getFloat32(40, true);
    const rotationAngle = inView.getFloat32(44, true);
    const arcAngle = inView.getFloat32(48, true);
    const slopeA = inView.getFloat32(52, true);
    const slopeB = inView.getFloat32(56, true);
    const zAngleA = inView.getFloat32(60, true);
    const zAngleB = inView.getFloat32(64, true);

    const cylinder = getGeneralCylinder(
      treeIndex,
      color,
      center,
      axis,
      height,
      radius,
      radius,
      rotationAngle,
      arcAngle,
      slopeA,
      slopeB,
      zAngleA,
      zAngleB
    );

    outputGeneralCylinder(
      cylinder.treeIndex,
      cylinder.color,
      cylinder.centerA,
      cylinder.centerB,
      cylinder.radius,
      cylinder.angle,
      cylinder.planeA,
      cylinder.planeB,
      cylinder.arcAngle,
      cylinder.localXAxis,
      outCylindersView,
      0,
      generalCylinderAttributes
    );

    currentInputOffset += openCylinderInputStructSize;
    currentCylindersOutputOffset += generalCylinderOutputStructSize;
  }

  return currentCylindersOutputOffset;
}

export function transformClosedGeneralCylinders(
  inputBuffer: Uint8Array,
  outCylindersArray: Uint8Array,
  outRingsArray: Uint8Array,
  originalCylindersOutputOffset: number,
  originalRingsOutputOffset: number,
  generalCylinderAttributes: Map<string, ParsePrimitiveAttribute>,
  generalRingAttributes: Map<string, ParsePrimitiveAttribute>
): [number, number] {
  let currentInputOffset = 0;
  let currentCylindersOutputOffset = 0;
  let currentRingsOutputOffset = 0;

  while (currentInputOffset < inputBuffer.byteLength) {
    const inView = new DataView(inputBuffer, currentInputOffset, closedCylinderInputStructSize);
    const outCylindersView = new DataView(
      outCylindersArray.buffer,
      originalCylindersOutputOffset + currentCylindersOutputOffset,
      generalCylinderOutputStructSize
    );
    const outRingsView = new DataView(
      outRingsArray,
      originalRingsOutputOffset + currentRingsOutputOffset,
      2 * generalRingOutputStructSize
    );

    const treeIndex = inView.getFloat32(0, true);
    const color = getColor(inView, 4);
    // const diagonal = inView.getFloat32(8, true);
    const center = getVector3(inView, 12);
    const axis = getVector3(inView, 24);
    const height = inView.getFloat32(36, true);
    const radius = inView.getFloat32(40, true);
    const rotationAngle = inView.getFloat32(44, true);
    const arcAngle = inView.getFloat32(48, true);
    const slopeA = inView.getFloat32(52, true);
    const slopeB = inView.getFloat32(56, true);
    const zAngleA = inView.getFloat32(60, true);
    const zAngleB = inView.getFloat32(64, true);

    const cylinder = getGeneralCylinder(
      treeIndex,
      color,
      center,
      axis,
      height,
      radius,
      radius,
      rotationAngle,
      arcAngle,
      slopeA,
      slopeB,
      zAngleA,
      zAngleB
    );

    outputGeneralCylinder(
      cylinder.treeIndex,
      cylinder.color,
      cylinder.centerA,
      cylinder.centerB,
      cylinder.radius,
      cylinder.angle,
      cylinder.planeA,
      cylinder.planeB,
      cylinder.arcAngle,
      cylinder.localXAxis,
      outCylindersView,
      0,
      generalCylinderAttributes
    );

    outputRing(
      cylinder.capA.treeIndex,
      cylinder.capA.color,
      cylinder.capA.normal,
      cylinder.capA.thickness,
      cylinder.capA.angle,
      cylinder.capA.arcAngle,
      cylinder.capA.instanceMatrix,
      outRingsView,
      0,
      generalRingAttributes
    );

    outputRing(
      cylinder.capB.treeIndex,
      cylinder.capB.color,
      cylinder.capB.normal,
      cylinder.capB.thickness,
      cylinder.capB.angle,
      cylinder.capB.arcAngle,
      cylinder.capB.instanceMatrix,
      outRingsView,
      generalRingOutputStructSize,
      generalRingAttributes
    );

    currentInputOffset += closedCylinderInputStructSize;
    currentCylindersOutputOffset += generalCylinderOutputStructSize;
    currentRingsOutputOffset += 2 * generalRingOutputStructSize;
  }

  return [currentCylindersOutputOffset, currentRingsOutputOffset];
}
