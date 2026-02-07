import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
  value?: string;
  onChange?: (content: string) => void;
};

const HtmlEditor = ({ value, onChange }: Props) => {

  const modules = {
    clipboard: {
      matchVisual: false,
    },
    toolbar: [
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headings
      [{ 'font': [] }], // Font Family
      [{ 'size': ['small', false, 'large', 'huge'] }], // Font Size
      ['bold', 'italic', 'underline', 'strike'], // Toggles
      ['blockquote', 'code-block'], // Blocks
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
      [{ 'script': 'sub'}, { 'script': 'super' }], // Superscript/Subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }], // Indent
      [{ 'direction': 'rtl' }], // Text Direction
      [{ 'color': [] }, { 'background': [] }], // Dropdowns for color
      [{ 'align': [] }], // Text Align
      ['link', 'image', 'video'], // Media
      ['clean'] // Remove formatting button
    ]
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background', 'align',
    'script', 'direction', 'code-block'
  ];

  return (
    <div className="quill-wrapper">
      <ReactQuill
        theme="snow"
        value={value?.trim()}
        onChange={onChange}
        modules={modules}
        formats={formats}
        style={{ height: '200px', marginBottom: '50px' }} // marginBottom accounts for the toolbar
      />
    </div>
  );
};

export default HtmlEditor;
