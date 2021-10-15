import { Container } from "./styles"

type PhotoItemProps = {
    name: string;
    url: string;
}

export const PhotoItem = ({ name, url }: PhotoItemProps) => {
    return (
        <Container>
            <img src={ url } alt={ name } />
            { name }
        </Container>
    )
}
