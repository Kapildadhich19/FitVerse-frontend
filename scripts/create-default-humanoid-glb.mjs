import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const targetDirectory = path.join(root, "public", "models");
const targetFile = path.join(targetDirectory, "default-humanoid.glb");

const positions = new Float32Array([
  -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
  -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
  0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
  -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5
]);

const normals = new Float32Array([
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
  0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
]);

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3,
  4, 5, 6, 4, 6, 7,
  8, 9, 10, 8, 10, 11,
  12, 13, 14, 12, 14, 15,
  16, 17, 18, 16, 18, 19,
  20, 21, 22, 20, 22, 23
]);

function padBuffer(buffer, padByte = 0) {
  const padding = (4 - (buffer.byteLength % 4)) % 4;
  return padding ? Buffer.concat([buffer, Buffer.alloc(padding, padByte)]) : buffer;
}

const positionBuffer = Buffer.from(positions.buffer);
const normalBuffer = Buffer.from(normals.buffer);
const indexBuffer = padBuffer(Buffer.from(indices.buffer));
const binaryBuffer = Buffer.concat([positionBuffer, normalBuffer, indexBuffer]);

const indexOffset = positionBuffer.byteLength + normalBuffer.byteLength;

const gltf = {
  asset: { version: "2.0", generator: "FitVerse default humanoid" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [
    { name: "Default Humanoid", children: [1, 2, 3, 4, 5, 6] },
    { name: "Head", mesh: 0, translation: [0, 1.85, 0], scale: [0.38, 0.38, 0.38] },
    { name: "Torso", mesh: 0, translation: [0, 0.95, 0], scale: [0.55, 0.9, 0.32] },
    { name: "Left Arm", mesh: 0, translation: [-0.72, 0.9, 0], scale: [0.16, 0.78, 0.16] },
    { name: "Right Arm", mesh: 0, translation: [0.72, 0.9, 0], scale: [0.16, 0.78, 0.16] },
    { name: "Left Leg", mesh: 0, translation: [-0.22, -0.25, 0], scale: [0.2, 0.9, 0.2] },
    { name: "Right Leg", mesh: 0, translation: [0.22, -0.25, 0], scale: [0.2, 0.9, 0.2] }
  ],
  meshes: [
    {
      primitives: [
        {
          attributes: { POSITION: 0, NORMAL: 1 },
          indices: 2,
          material: 0
        }
      ]
    }
  ],
  materials: [
    {
      name: "FitVerse Teal",
      pbrMetallicRoughness: {
        baseColorFactor: [0.18, 0.62, 0.56, 1],
        metallicFactor: 0,
        roughnessFactor: 0.72
      }
    }
  ],
  buffers: [{ byteLength: binaryBuffer.byteLength }],
  bufferViews: [
    { buffer: 0, byteOffset: 0, byteLength: positionBuffer.byteLength, target: 34962 },
    { buffer: 0, byteOffset: positionBuffer.byteLength, byteLength: normalBuffer.byteLength, target: 34962 },
    { buffer: 0, byteOffset: indexOffset, byteLength: indexBuffer.byteLength, target: 34963 }
  ],
  accessors: [
    { bufferView: 0, componentType: 5126, count: 24, type: "VEC3", min: [-0.5, -0.5, -0.5], max: [0.5, 0.5, 0.5] },
    { bufferView: 1, componentType: 5126, count: 24, type: "VEC3" },
    { bufferView: 2, componentType: 5123, count: indices.length, type: "SCALAR" }
  ]
};

const jsonBuffer = padBuffer(Buffer.from(JSON.stringify(gltf)), 0x20);
const totalLength = 12 + 8 + jsonBuffer.byteLength + 8 + binaryBuffer.byteLength;
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(totalLength, 8);

const jsonHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonBuffer.byteLength, 0);
jsonHeader.writeUInt32LE(0x4e4f534a, 4);

const binaryHeader = Buffer.alloc(8);
binaryHeader.writeUInt32LE(binaryBuffer.byteLength, 0);
binaryHeader.writeUInt32LE(0x004e4942, 4);

await mkdir(targetDirectory, { recursive: true });
await writeFile(targetFile, Buffer.concat([header, jsonHeader, jsonBuffer, binaryHeader, binaryBuffer]));
