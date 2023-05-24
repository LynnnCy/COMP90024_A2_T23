/*
 * 
 * ** COMP90024 Assignment 2 
 * Team: 23 
 * City: Victoria 
 * Members: Abrar Hayat(1220445) Yalin Chen(1218310) Qianchu Li(1433672) Jie Yang(1290106) Yadvika Jayam Nagaraj Yadav(1406716)
 * 
 */
import ReactWordcloud from "react-wordcloud";
import { Resizable } from "re-resizable";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

const resizeStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
};

const WordCloud = ({ title, words, fontSizes }) => {
    const options = {
        colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
        enableTooltip: true,
        deterministic: false,
        fontFamily: "impact",
        fontSizes: fontSizes ? fontSizes : words.length > 50 ? [30, 100] : [40, 100],
        fontStyle: "normal",
        fontWeight: "normal",
        padding: "100rem",
        rotations: 3,
        rotationAngles: [0, 90],
        scale: "sqrt",
        spiral: "archimedean",
        transitionDuration: 1000
    };
    const callbacks = {
        onWordClick: (word) => {
            console.log(word)
            window.open(`https://twitter.com/search?q=${word.text}`)
        }
    }
    return (
        <div>
            <h1 className="text-center">{title}</h1>
            <Resizable
                defaultSize={{
                    width: "auto",
                    height: "100vh"
                }}
                style={resizeStyle}
            >
                <div style={{ width: "100%", height: "100%" }}>
                    <ReactWordcloud words={words} options={options} callbacks={callbacks}/>
                </div>
            </Resizable>
        </div>
    );
}

export default WordCloud;
