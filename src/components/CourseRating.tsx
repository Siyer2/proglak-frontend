import { Jumbotron, Container, Row, Col, Card } from 'react-bootstrap';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types'

// @ts-ignore
import ReactGiphySearchbox from 'react-giphy-searchbox';
import { addReaction, getReactions } from '../apiCalls';
import { useEffect, useState } from 'react';

const giphyKey = 'BppufVMMY118hX0xfjSv3KXzVKTebPKs';

function CourseRating() {
    //==== State ====//
    const [reactions, setReactions] = useState<[string, number][] | null>(null);
    const [loadingReactions, setLoadingReactions] = useState(true);

    const [topGifs, setTopGifs] = useState<IGif[]>([]);
    //==== End State ====//

    const course_code = "ECON3604";

    /**
     * Set the gifs
     */
    useEffect(() => {
        async function getReactionsFromDB() {
            const reactions = await getReactions(course_code);
            await setGifsInState(reactions);
        }
        getReactionsFromDB();
    }, [])

    /**
     * Handle when a new gif is clicked
     * @param gif
     */
    async function gifClicked(gif: any) {
        await addReaction(course_code, gif.id);
        
        // Refresh reactions
        const reactions = await getReactions(course_code);
        await setGifsInState(reactions);
    }

    /**
     * Take in all the reactions and then put it in state
     * @param reactions 
     */
    async function setGifsInState(reactions: [string, number][]) {
        setReactions(reactions);
        setLoadingReactions(false);

        const topGifsPromises: Promise<IGif>[] = reactions.map((reaction) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const gf = new GiphyFetch(giphyKey);
                    const { data } = await gf.gif(reaction[0]);
                    resolve(data);
                } catch (ex) {
                    console.log("EXCEPTION GETTING GIF", ex);
                    reject(ex);
                }
            });
        });

        const topGifsToSet: IGif[] = await Promise.all(topGifsPromises);
        setTopGifs(topGifsToSet);
    }

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
                                <Col key={i + reaction[0] + reaction[1]}>
                                    <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Card.Body>
                                            {topGifs[i] ? <Gif gif={topGifs[i]} width={300} /> : null}
                                        </Card.Body>
                                        <Card.Body>
                                            Votes: {reaction[1]}
                                        </Card.Body>
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
                    onSelect={(gif: any) => { gifClicked(gif) }}
                    masonryConfig={[
                        { columns: 2, imageWidth: 110, gutter: 5 },
                        { mq: '300px', columns: 2, imageWidth: 150, gutter: 5 },
                        { mq: '1000px', columns: 4, imageWidth: 220, gutter: 10 },
                        { mq: '1200px', columns: 4, imageWidth: 250, gutter: 10 }
                    ]}
                    searchPlaceholder="Add your reaction to this course..."
                />
            </Container>
        </>
    )
}

export default CourseRating;