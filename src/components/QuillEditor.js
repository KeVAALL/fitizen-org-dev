import Quill from "quill";
import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import QuillBetterTable from "quill-better-table";
import { useEffect, useRef } from "react";

Quill.register({
  "modules/better-table": QuillBetterTable,
});

const QuillEditor = ({
  name,
  value,
  onChange,
  readOnly,
  placeholder,
  setFieldValue,
}) => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      // Initialize Quill only once
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: placeholder || "",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["table"], // Add table to the toolbar
            ["link", "image"],
            ["clean"],
          ],
          "better-table": true,
        },
      });

      // Handle content changes
      editorRef.current.on("text-change", () => {
        const content = editorRef.current.root.innerHTML;
        setFieldValue(name, content);
      });
    }

    // Dynamically set the readOnly state
    if (editorRef.current) {
      editorRef.current.enable(!readOnly);
    }
  }, [name, setFieldValue, placeholder, readOnly]);

  // Update editor content when `value` changes
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.root.innerHTML) {
      editorRef.current.root.innerHTML = value;
    }
  }, [value]);

  return <div ref={quillRef} />;
};

export default QuillEditor;
