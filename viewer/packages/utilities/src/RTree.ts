/*!
 * Copyright 2021 Cognite AS
 */
import { Box3, Vector3 } from 'three';

// IoU - Intersection over Union, measure of overlap between two boxes
export function iou(box1: Box3, box2: Box3): number {
  const intersection = box1.clone().intersect(box2);
  const union = box1.clone().union(box2);

  const intsize = intersection.getSize(new Vector3());
  const unsize = union.getSize(new Vector3());

  return (intsize.x * intsize.y * intsize.z) / (unsize.x * unsize.y * unsize.z);
}

function wouldExtendBy(originalBox: Box3, newBox: Box3) {
  const newMinExtent = new Vector3().subVectors(newBox.min, originalBox.min).min(new Vector3(0, 0, 0));
  const newMaxExtent = new Vector3().subVectors(originalBox.max, newBox.max).min(new Vector3(0, 0, 0));

  const fullExtentExpansion = new Vector3().addVectors(newMinExtent, newMaxExtent);
  return fullExtentExpansion.length();
}

const MERGE_VOLUME_LIMIT = 1.2;

function canMergeOnSameNode(box1: Box3, box2: Box3) {
  const unionBox = box1.clone().union(box2);
  const unionSize = unionBox.getSize(new Vector3());
  const unionVolume = unionSize.x * unionSize.y * unionSize.z;

  const size1 = box1.getSize(new Vector3());
  const size2 = box2.getSize(new Vector3());

  return (
    unionVolume <= size1.x * size1.y * size1.z * MERGE_VOLUME_LIMIT ||
    unionVolume <= size2.x * size2.y * size1.z * MERGE_VOLUME_LIMIT
  );
}

/*
 * RTree implementation
 */
export class RTree {
  root: RTreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(box: Box3) {
    if (this.root != null) {
      this.root = this.root.insert(box);
    } else {
      this.root = new RTreeNode(box);
    }
  }

  getBoxes(): Box3[] {
    if (this.root != null) {
      const result: Box3[] = [];
      this.root.getBoxes(result);
      return result;
    } else {
      return [];
    }
  }
}

export class RTreeNode {
  readonly bounds: Box3;
  readonly children: [RTreeNode, RTreeNode] | null;

  constructor(child0: RTreeNode, child1: RTreeNode);
  constructor(box: Box3);
  constructor(a1: Box3 | RTreeNode, a2: RTreeNode | undefined = undefined) {
    if (a1 instanceof Box3 && a2 === undefined) {
      this.children = null;
      this.bounds = a1;
    } else if (a1 instanceof RTreeNode && a2 instanceof RTreeNode) {
      this.children = [a1, a2];
      this.bounds = a1.bounds.clone().union(a2.bounds);
    } else {
      throw new Error('Invalid argument combination to RTreeNode constructor');
    }
  }

  insert(box: Box3): RTreeNode {
    if (this.children == null) {
      if (canMergeOnSameNode(this.bounds, box)) {
        this.bounds.union(box);
        return new RTreeNode(this.bounds.union(box));
      } else {
        return new RTreeNode(new RTreeNode(this.bounds), new RTreeNode(box));
      }
    } else {
      const expand1 = wouldExtendBy(this.children[0].bounds, box);
      const expand2 = wouldExtendBy(this.children[1].bounds, box);

      if (expand1 < expand2) {
        return new RTreeNode(this.children[0].insert(box), this.children[1]);
      } else {
        return new RTreeNode(this.children[0], this.children[1].insert(box));
      }
    }
  }

  getBoxes(result: Box3[]) {
    if (this.children != null) {
      this.children[0].getBoxes(result);
      this.children[1].getBoxes(result);
    } else {
      result.push(this.bounds);
    }
  }
}
