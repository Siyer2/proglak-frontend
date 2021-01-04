import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Jumbotron, Container } from 'react-bootstrap';

function CourseRating() {
    // use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
    const gf = new GiphyFetch('BppufVMMY118hX0xfjSv3KXzVKTebPKs')
    // configure your fetch: fetch 10 gifs at a time as the user scrolls (offset is handled by the grid)
    const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 })

    function gifClicked(e: any) {
        console.log("e", e);
    }

    return (
        <>
            <Jumbotron fluid>
                <Container>
                    <h1>INFS1602</h1>
                    <h5>
                        Introduction to Business Programming
                    </h5>
                </Container>
            </Jumbotron>
            <Grid
                onGifClick={(e) => {gifClicked(e)}}
                width={800}
                columns={3}
                fetchGifs={fetchGifs}
                noLink={true}
            />
        </>
    )
}

export default CourseRating;