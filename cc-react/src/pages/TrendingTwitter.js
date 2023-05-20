import PageTransition from '../Components/PageTransition';
import TwitterTrends from '../Components/TwitterTrends';
import TwitterTrendsToday from '../Components/TwitterTrendsToday';

const TrendingTwitter = () => {
    return (
        <PageTransition>
            {/* <StaticWordCloud tweets={tweets} height={"20rem"} title={"What are people talking about today?"}></StaticWordCloud> */}
            <TwitterTrendsToday/>
            <br />
            <TwitterTrends />
        </PageTransition>
    )
};

export default TrendingTwitter;