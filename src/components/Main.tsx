import {useRef, useState} from "react";
import {Image} from "astro:assets";
import {useEffect} from "react";
import {motion, useMotionValue} from "framer-motion";

const NUMBER_OF_PEOPLE = 6

const Main = () => {
    const [currentPersonID, setCurrentPersonID] = useState<number>(1)
    const [currentPersonSexuality, setCurrentPersonSexuality] = useState<"gay" | "straight">("gay")

    const [correctCount, setCorrectCount] = useState<number>(0)
    const [totalCount, setTotalCount] = useState<number>(0)
    const [currentIsCorrect, setCurrentIsCorrect] = useState<boolean | undefined>(undefined)

    const dragConstraintsRef = useRef(null)

    const [pastPeople, setPastPeople] = useState<{sexuality: "gay" | "straight", ID: number}[]>([])

    const guessGay = () => {
        if (currentIsCorrect !== undefined) return
        if (currentPersonSexuality === "gay") {
            setCorrectCount(correctCount + 1)
            setTotalCount(totalCount + 1)
            setCurrentIsCorrect(true)
        } else {
            setTotalCount(totalCount + 1)
            setCurrentIsCorrect(false)
        }
    }

    const guessStraight = () => {
        if (currentIsCorrect !== undefined) return
        if (currentPersonSexuality === "straight") {
            setCorrectCount(correctCount + 1)
            setTotalCount(totalCount + 1)
            setCurrentIsCorrect(true)
        } else {
            setTotalCount(totalCount + 1)
            setCurrentIsCorrect(false)
        }
    }

    const [x, setX] = useState<number>(0)
    const [y, setY] = useState<number>(0)

    const [baseX, setBaseX] = useState<number>(0)
    const [baseY, setBaseY] = useState<number>(0)

    return <div>
        <h1>TEST YOUR GAYDAR</h1>
        <h2>correct: {correctCount}/{totalCount}</h2>
        <motion.div style={{display: 'flex', flexDirection: "row", width: "100%"}} >
            {/* @ts-ignore */}
            <div style={{width: "33%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: x - baseX < -50 ? "tan" : ""}}>
                <h1>not gay</h1>
            </div>
        <motion.img src={`/${currentPersonSexuality}_${currentPersonID}.jpeg`} style={{width: "34%"}}
                    ref={dragConstraintsRef} drag dragConstraints={dragConstraintsRef} dragElastic={currentIsCorrect === undefined ? 0.7 : 0} onDrag={(event, info) => {
                        if (currentIsCorrect !== undefined) {
                            setX(baseX)
                            setY(baseY)
                            return
                        }
                        setX(info.point.x)
                        setY(info.point.y)
        }} onDragStart={(event, info) => {
            if (baseX !== 0 || baseY !== 0) return
            setBaseX(info.point.x)
            setBaseY(info.point.y)
        }} onDragEnd={() => {
            if (currentIsCorrect !== undefined) return
            if (x - baseX < -50) {
                guessStraight()
            } else if (x - baseX > 50) {
                guessGay()
            }
        }}/>
        <div style={{width: "33%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: x - baseX > 50 ? "tan" : ""}}>
            <h1>gay</h1>
        </div>
            </motion.div>
        {currentIsCorrect !== undefined && <h2 style={{color: currentIsCorrect ? 'green' : 'red'}} >{currentIsCorrect ? "Correct!" : "False!"}</h2>}
        <button onClick={() => {
            if (currentIsCorrect === undefined) return
            setCurrentIsCorrect(undefined)

            setPastPeople([...pastPeople, {sexuality: currentPersonSexuality, ID: currentPersonID}])

            let sexuality: "gay" | "straight" = Math.random() < 0.5 ? "gay" : "straight"
            let ID = Math.floor(Math.random() * NUMBER_OF_PEOPLE) + 1

            while (pastPeople.find(element => element.sexuality == sexuality && element.ID == ID) != undefined && pastPeople.length < NUMBER_OF_PEOPLE) {
                sexuality = Math.random() < 0.5 ? "gay" : "straight"
                ID = Math.floor(Math.random() * NUMBER_OF_PEOPLE) + 1
            }

            setCurrentPersonSexuality(sexuality)
            setCurrentPersonID(ID)

            setBaseY(0)
            setBaseX(0)
            setX(0)
            setY(0)
        }}>next</button>
    </div>
}

export default Main
