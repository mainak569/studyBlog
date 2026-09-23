// Copies the self-hosted TinyMCE build into public/ so the rich text editor
// works without a Tiny Cloud API key. Runs on `npm install` (postinstall).
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "tinymce");
const dest = join(root, "public", "tinymce");

if (!existsSync(src)) {
  console.warn("tinymce is not installed, skipping copy");
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, {
  recursive: true,
  filter: (path) => !/(\.d\.ts|package\.json|README\.md|CHANGELOG\.md)$/.test(path),
});
console.log("Copied TinyMCE to public/tinymce");
