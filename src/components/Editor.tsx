import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface IValue {
    value: string;
    setValue: (value: string) => void;
    defaultValue?: string;
}

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }, { font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['clean'],
      ],
}

const Editor: React.FC<IValue> = ({value, setValue, defaultValue=''}) => {
  const quill = useRef(ReactQuill);
  return <ReactQuill theme="snow" defaultValue={defaultValue} onChange={setValue} modules={modules}/>;
}

export default Editor;