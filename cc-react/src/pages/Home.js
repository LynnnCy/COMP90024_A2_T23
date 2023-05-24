/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import { Button } from 'react-bootstrap';
import PageTransition from '../Components/PageTransition';
import { Link } from 'react-router-dom';
const Home = () => {
    return (
        <div className='home'>
            <PageTransition>
                <div className='center' style={{
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "height": "85vh"
                }}>
                    <br />
                    <div style={{ background: "gray", opacity: 0.8, padding: "2rem" }}>
                        <h1 className='text-center' style={{ color: "black", fontFamily: "impact" }}>Are people really happy?</h1>
                        <h5 className='text-center' style={{ color: "black", position: 'center', fontFamily: "impact" }}>We will conduct a comprehensive analysis to understand the intricate ways in which people express their emotions on various social media platforms.</h5>
                        <div style={{ display: "flex", "align-items": "center", "justify-content": "center", marginTop: "2rem" }}>
                            <Link className='nav-link' to="/trending"><Button variant="dark">Explore</Button></Link>
                        </div>
                    </div>
                </div>
            </PageTransition>
        </div>

    )
};

export default Home;