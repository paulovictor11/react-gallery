import { FormEvent, useEffect, useState } from "react";
import { Area, Container, Header, PhotoList, ScreeWarning, UploadForm } from "./App.styles";
import { PhotoItem } from "./components/PhotoItem";
import { getAll, insert } from "./services/photos";
import { Photo } from "./types/Photo";

export const App = () => {

  const [ loading, setLoading ] = useState(false);
  const [ uploading, setUploading ] = useState(false);
  const [ photos, setPhotos ] = useState<Photo[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await getAll());
      setLoading(false);
    }

    getPhotos();
  }, []);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const file = formData.get('image') as File;

    if (file && file.size) {
      setUploading(true);

      let result = await insert(file);

      setUploading(false);

      if (result instanceof Error) {
        alert(result.message);
        return;
      }

      setPhotos([...photos, result]);
    }
  }
  
  return (
    <Container>
      <Area>
        <Header>Galeria de Fotos</Header>

        <UploadForm method="POST" onSubmit={ handleFormSubmit }>
          <input type="file" name="image" id="image" />
          <input type="submit" value="Enviar" />

          { uploading && 'Enviando...' }
        </UploadForm>

        {
          loading &&
          <ScreeWarning>
            <div className="emoji">🤚</div>
            <div>Carregando...</div>
          </ScreeWarning>
        }

        {
          !loading && photos.length > 0 &&
          <PhotoList>
            {
              photos.map((item, index) => (
                <PhotoItem key={ index } url={ item.url } name={ item.name } />
              ))
            }
          </PhotoList>
        }

        {
          !loading && photos.length === 0 &&
          <ScreeWarning>
            <div className="emoji">😞</div>
            <div>Não há fotos cadastradas</div>
          </ScreeWarning>
        }
      </Area>
    </Container>
  );
}
