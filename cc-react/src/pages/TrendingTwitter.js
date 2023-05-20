import PageTransition from '../Components/PageTransition';
import TwitterTrends from '../Components/TwitterTrends';
import TwitterTrendsToday from '../Components/TwitterTrendsToday';
import Dropdown from 'react-bootstrap/Dropdown';
import { Container } from "react-bootstrap";
import { useState } from 'react';
const TrendingTwitter = () => {
    const [today, setToday] = useState(false);
    return (
        <PageTransition>
            {/* <StaticWordCloud tweets={tweets} height={"20rem"} title={"What are people talking about today?"}></StaticWordCloud> */}
            <Container>
                <br />
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Change Data Timeline
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setToday(false)}>Recent</Dropdown.Item>
                        <Dropdown.Item onClick={() => setToday(true)}>Today</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>
            {
                today
                    ? <TwitterTrendsToday />
                    : <TwitterTrends />
            }
        </PageTransition>
    )
};

export default TrendingTwitter;