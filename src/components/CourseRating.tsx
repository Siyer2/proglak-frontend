import { Jumbotron, Container, Row, Col, Card } from 'react-bootstrap';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types'

// @ts-ignore
import ReactGiphySearchbox from 'react-giphy-searchbox';
import { getReactions } from '../apiCalls';
import { useEffect, useState } from 'react';

const giphyKey = 'BppufVMMY118hX0xfjSv3KXzVKTebPKs';

function CourseRating() {
    //==== State ====//
    const [reactions, setReactions] = useState<[string, number][] | null>(null);
    const [loadingReactions, setLoadingReactions] = useState(true);
    //==== End State ====//

    function gifClicked(e: any) {
        console.log("e", e);
    }

    useEffect(() => {
        async function getReactionsFromDB() {
            const reactions = await getReactions('INFS2603');
            setReactions(reactions);
            setLoadingReactions(false);
        }
        getReactionsFromDB();
    }, [])

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
                    {loadingReactions ? 
                        <Col>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </Col>
                    :
                    reactions && reactions.length === 0 ? 
                        <Col>
                            <div>
                                No ratings yet!
                            </div>
                        </Col>
                    :
                    reactions ? 
                        reactions.map((reaction, i) => {
                            return (
                                <Col key={i + reaction[0]}>
                                    <Card>
                                        <Card.Body>{reaction[0]}</Card.Body>
                                        <Card.Body>{reaction[1]}</Card.Body>
                                    </Card>
                                </Col>
                            )
                        })
                    :
                    <Col>
                        <div>
                            Bug
                        </div>
                    </Col>
                }
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