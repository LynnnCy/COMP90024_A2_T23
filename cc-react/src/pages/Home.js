import PageTransition from '../Components/PageTransition';
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
                        <h2 className='text-center' style={{ color: "black", position: 'center', fontFamily: "impact" }}>We will explore how people share happiness on Social Media</h2>
                    </div>
                </div>
            </PageTransition>
        </div>

    )
};

export default Home;