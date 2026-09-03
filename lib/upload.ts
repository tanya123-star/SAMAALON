import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function saveUploadedFile(
  file: File | Blob,
  options: { maxSize?: number; allowedTypes?: string[] } = {}
): Promise<string> {
  const maxSize = options.maxSize ?? 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options.allowedTypes ?? ["image/jpeg", "image/png", "image/webp"];

  const fileObj = file instanceof File ? file : new File([file], "upload.jpg", { type: "image/jpeg" });
  const size = fileObj.size;

  if (size > maxSize) {
    throw new Error(`File too large: ${(size / 1024 / 1024).toFixed(1)}MB (max ${maxSize / 1024 / 1024}MB)`);
  }

  if (allowedTypes.length > 0 && !fileObj.type.startsWith("image/")) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
  }

  const ext = fileObj.name.split(".").pop() || "jpg";
  const name = `${crypto.randomUUID()}-${Date.now()}.${ext}`;
  const dest = join("public", "uploads", name);

  // Ensure directory exists
  await mkdir(join("public", "uploads"), { recursive: true }).catch(() => {});

  const buffer = await fileObj.arrayBuffer();
  await writeFile(dest, Buffer.from(buffer));
  return `/uploads/${name}`;
}