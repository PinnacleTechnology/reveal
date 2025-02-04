---
id: "cognite_reveal_extensions_datasource.ModelDataProvider"
title: "Interface: ModelDataProvider"
sidebar_label: "ModelDataProvider"
custom_edit_url: null
---

[@cognite/reveal/extensions/datasource](../modules/cognite_reveal_extensions_datasource.md).ModelDataProvider

Provides data for 3D models.

## Hierarchy

- [`JsonFileProvider`](cognite_reveal_extensions_datasource.JsonFileProvider.md)

- [`BinaryFileProvider`](cognite_reveal_extensions_datasource.BinaryFileProvider.md)

  ↳ **`ModelDataProvider`**

## Methods

### getBinaryFile

▸ **getBinaryFile**(`baseUrl`, `fileName`): `Promise`<`ArrayBuffer`\>

Downloads a binary blob.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` | Base URL of the model. |
| `fileName` | `string` | Filename of binary file. |

#### Returns

`Promise`<`ArrayBuffer`\>

#### Overrides

[BinaryFileProvider](cognite_reveal_extensions_datasource.BinaryFileProvider.md).[getBinaryFile](cognite_reveal_extensions_datasource.BinaryFileProvider.md#getbinaryfile)

#### Defined in

[packages/data-providers/src/ModelDataProvider.ts:22](https://github.com/cognitedata/reveal/blob/7a5de3c9/viewer/packages/data-providers/src/ModelDataProvider.ts#L22)

___

### getJsonFile

▸ **getJsonFile**(`baseUrl`, `fileName`): `Promise`<`any`\>

Download and parse a JSON file and return the resulting struct.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `baseUrl` | `string` | Base URL of the model. |
| `fileName` | `string` | Filename of JSON file. |

#### Returns

`Promise`<`any`\>

#### Overrides

[JsonFileProvider](cognite_reveal_extensions_datasource.JsonFileProvider.md).[getJsonFile](cognite_reveal_extensions_datasource.JsonFileProvider.md#getjsonfile)

#### Defined in

[packages/data-providers/src/ModelDataProvider.ts:16](https://github.com/cognitedata/reveal/blob/7a5de3c9/viewer/packages/data-providers/src/ModelDataProvider.ts#L16)
