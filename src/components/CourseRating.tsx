import { Jumbotron, Container } from 'react-bootstrap';

// @ts-ignore
import ReactGiphySearchbox from 'react-giphy-searchbox';

function CourseRating() {
    function gifClicked(e: any) {
        console.log("e", e);
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

            <Container fluid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReactGiphySearchbox
                    apiKey="BppufVMMY118hX0xfjSv3KXzVKTebPKs"
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