import React, { useState, useEffect } from 'react';
import { Form, FormControl } from 'react-bootstrap';

const ImageUpload = ({onInput}: {onInput: Function}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null | ArrayBuffer>(null);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
      if (!file) {
          return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
          setPreviewUrl(fileReader.result)
      };
      fileReader.readAsDataURL(file);
  }, [file])  

  const pickedHandler = (event: React.FormEvent) => {
    const target = event.target as HTMLInputElement;
    let pickedFile;
    let fileIsValid = isValid;
    if(target.files || target.files!.length === 1){
        pickedFile = target.files![0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;
    } else {
        setIsValid(false)
        fileIsValid = false;
    };
    onInput( pickedFile, fileIsValid );
  }  

  return (
    <Form.Group className='image-upload'>
        <Form.Label>Priložite sliku</Form.Label>
        <FormControl type='file' accept='.jpg,.png,.jpeg' onChange={pickedHandler}></FormControl>
        <div className="image-upload__preview">
            {typeof(previewUrl) === 'string' && <img src={previewUrl} alt="Preview" />}
            {!previewUrl && <p>Please pick an image.</p>}
        </div>
    </Form.Group>
  )
}

export default ImageUpload