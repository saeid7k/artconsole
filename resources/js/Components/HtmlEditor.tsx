import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Props = {
  value?: string;
  onChange?: (content: string) => void;
  showMediaToolbar?: boolean;
};

const HtmlEditor = ({ value, onChange, showMediaToolbar = true }: Props) => {

  const mediaToolbar = showMediaToolbar ? ['link', 'image', 'video'] : ['link'];

  const modules = {
    clipboard: {
      matchVisual: false,
    },
    toolbar: [
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Headings
      [{ 'font': [] }], // Font Family
      [{ 'size': ['small', false, 'large', 'huge'] }], // Font Size
      [{ 'color': [] }, { 'background': [] }], // Dropdowns for color
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'], // Toggles
      [{ 'script': 'sub'}, { 'script': 'super' }], // Superscript/Subscript
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Lists
      [{ 'direction': 'rtl' }, { 'align': [] }, { 'indent': '-1'}, { 'indent': '+1' }], // Text Direction, Align and Indent
      mediaToolbar, // Media buttons
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
