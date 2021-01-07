import { Jumbotron, Container, Row, Col, Card, Button, Toast } from 'react-bootstrap';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types'

// @ts-ignore
import ReactGiphySearchbox from 'react-giphy-searchbox';
import { addReaction, getCourse, getReactions } from '../apiCalls';
import { useEffect, useState } from 'react';
import { Course } from '../types';
import ralphSad from '../images/ralph.gif';

const giphyKey = 'BppufVMMY118hX0xfjSv3KXzVKTebPKs';

function CourseRating(props: any) {
    //==== State ====//
    const [reactions, setReactions] = useState<[string, number][] | null>(null);
    const [loadingReactions, setLoadingReactions] = useState(true);

    const [topGifs, setTopGifs] = useState<IGif[]>([]);

    const [course, setCourse] = useState<Course | null>(null);

    const [showToast, setShowToast] = useState(false);
    //==== End State ====//

    const course_code = props.match.params.code.toUpperCase();

    /**
     * Set the gifs
     */
    useEffect(() => {
        async function initialiseReactionsPage() {
            const reactions = await getReactions(course_code);
            await setGifsInState(reactions);

            const course = await getCourse(course_code);
            if (course.Item) {
                setCourse(course.Item);
            }
        }
        initialiseReactionsPage();
        // eslint-disable-next-line
    }, [])

    /**
     * Handle when a new gif is clicked
     * @param gif
     */
    async function gifClicked(gif: any) {
        setShowToast(true);
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

    function GifAddedToast() {
        return (
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                    Reaction Added! ✅
                </Toast>
            </Container>
        )
    }

    return (
        <>
            <Jumbotron fluid>
                <Container>
                    <h1>{course_code}</h1>
                    <>
                        {course?.name}
                    </>
                </Container>
            </Jumbotron>

            <Container style={{ padding: '20px' }}>
                <h2>
                    {reactions && reactions.length > 0 ?
                    'Most Common Reactions' :
                    'No reactions yet'}
                    
                </h2>
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
                            <img src={ralphSad} width={300} alt="No reactions yet" />
                            <div>
                                Be the first to add one!
                            </div>
                        </Col>
                    :
                    reactions ? 
                        reactions.map((reaction, i) => {
                            return (
                                <Col key={i + reaction[0] + reaction[1]}>
                                    <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none' }}>
                                        <Card.Body>
                                            {topGifs[i] ? <Gif gif={topGifs[i]} width={300} hideAttribution={true} noLink={true} /> : null}
                                        </Card.Body>
                                        <Card.Body>
                                            Reactions: <strong>{reaction[1]}</strong>
                                        </Card.Body>
                                        <Card.Body>
                                            <Button onClick={() => {gifClicked( {id: reaction[0]} )}}>
                                                +1
                                            </Button>
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

            <GifAddedToast />

            <Container fluid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactGiphySearchbox
                    apiKey={giphyKey}
                    onSelect={(gif: any) => { gifClicked(gif) }}
                    masonryConfig={[
                        { columns: 3, imageWidth: 110, gutter: 5 },
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