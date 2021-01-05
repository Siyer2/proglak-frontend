import { Jumbotron, Container, Row, Col, Card } from 'react-bootstrap';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types'

// @ts-ignore
import ReactGiphySearchbox from 'react-giphy-searchbox';

const giphyKey = 'BppufVMMY118hX0xfjSv3KXzVKTebPKs';

async function getGif(id: string): Promise<IGif> {
    const gf = new GiphyFetch(giphyKey)
    const { data } = await gf.gif(id);

    return data;
}

function CourseRating() {
    function gifClicked(e: any) {
        console.log("e", e);
    }

    // const newGif = await getGif('ZgVTBM2Z6mb3EUqoKC');
    return (
        <>
            <Jumbotron fluid>
                <Container>
                    <h1>INFS1602</h1>
                    <>
                        Introduction to Business Programming
                    </>
                </Container>
            </Jumbotron>

            <Container style={{ padding: '20px' }}>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>This is some text within a card body.</Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Container fluid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactGiphySearchbox
                    apiKey={giphyKey}
                    onSelect={(e: any) => { gifClicked(e) }}
                    masonryConfig={[
                        { columns: 2, imageWidth: 110, gutter: 5 },
                        { mq: '300px', columns: 3, imageWidth: 150, gutter: 5 },
                        { mq: '1000px', columns: 4, imageWidth: 220, gutter: 10 },
                        { mq: '1200px', columns: 4, imageWidth: 250, gutter: 10 }
                    ]}
                    searchPlaceholder="Add your reaction to this course..."
                />
            </Container>


            {/* <Grid
                onGifClick={(e) => {gifClicked(e)}}
                width={800}
                columns={3}
                fetchGifs={fetchGifs}
                noLink={true}
            /> */}
        </>
    )
}

export default CourseRating;