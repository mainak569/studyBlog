"use client";

import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { useTheme } from "next-themes";

// TinyMCE served from /public/tinymce (see scripts/copy-tinymce.mjs), so no
// Tiny Cloud API key is needed
const RichTextEditor = ({ init, ...props }: IAllProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Editor
      // re-mount when the theme changes so the skin updates
      key={isDark ? "dark" : "light"}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="gpl"
      {...props}
      init={{
        promotion: false,
        branding: false,
        directionality: "ltr",
        content_style:
          "body { font-family:Inter,sans-serif; font-size:16px; direction:ltr !important; text-align:left !important; unicode-bidi: normal !important; }",
        forced_root_block: "p",
        forced_root_block_attrs: { dir: "ltr" },
        body_class: "mce-content-body",
        body_attrs: { dir: "ltr" },
        skin: isDark ? "oxide-dark" : "oxide",
        content_css: isDark ? "dark" : "default",
        ...init,
      }}
    />
  );
};

export default RichTextEditor;
