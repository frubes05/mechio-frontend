import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

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
        <FormControl type='file' accept='.jpg,.png,.jpeg' onChange={pickedHandler} name='image'></FormControl>
    </Form.Group>
  )
}

export default ImageUpload