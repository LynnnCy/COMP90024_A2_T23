import PageTransition from '../Components/PageTransition';
const Home = () => {
    return (
        <div className='home'>
            <PageTransition>
                <div className='center' style={{lineHeight: "20rem"}}>
                    <br />
                    <h1 className='text-center' style={{ color: "white", fontFamily: "impact" }}>Are people really happy?</h1>
                    <h2 className='text-center' style={{ color: "white", position: 'center', fontFamily: "impact" }}>Let's explore how people share happiness on Social Media</h2>
                </div>
            </PageTransition>
        </div>

    )
};

export default Home;