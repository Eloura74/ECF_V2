import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    const handleResize = () => {
      editorRef.current?.layout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Editor
      height="70vh"
      defaultLanguage={language || 'javascript'}
      defaultValue={value}
      theme="vs-dark"
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true
      }}
    />
  );
}