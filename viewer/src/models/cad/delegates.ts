/*!
 * Copyright 2020 Cognite AS
 */

/**
 * Delegate that handles removal of a sector from a view (e.g. by removing it from the scene).
 */
export type DiscardSectorDelegate = (sectorId: number) => void;

/**
 * Delegate for fetching raw data for the sector given.
 */
export type FetchSectorDelegate = (sectorId: number) => Promise<Uint8Array>;

/**
 * Delegate for parsing data retrieved using a `FetchSectorDelegate`  to a `Sector`.
 */
export type ParseSectorDelegate<T> = (buffer: Uint8Array) => Promise<T>;

/**
 * Delegate for fetching and parsing a `Sector`.
 */
export type GetSectorDelegate<T> = (sectorId: number) => Promise<T>;

/**
 * Delegate for 'consuming' a sector, e.g. by creating a 3D node for it.
 */
export type ConsumeSectorDelegate<T> = (sector: T) => void;

/**
 * Delegate for fetching raw data for a CTM file.
 */
export type FetchCtmDelegate = (fileId: number) => Promise<Uint8Array>;
