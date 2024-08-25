import {Fragment, useEffect, useState} from "react";
import './index.css'

const App = () => {

    const [url, setUrl] = useState("");

    const [isCopyButtonActive, setIsCopyButtonActive] = useState(true);

    const [selected, setSelected] = useState({});

    const [savedSelections, setSavedSelections] = useState([]);

    useEffect(() => {
        window.api.selectedMessage('text:selected', (_, message) => {
            if (message) {
                setIsCopyButtonActive(false);
                setSelected(message);
            } else {
                setIsCopyButtonActive(true)
            }
        })
    }, [selected]);

    const toggleView = () => {
        window.api.openWebView('toggle:web-view', url)
    }

    const addSelected = () => {
        const newList = structuredClone(savedSelections)
        newList.push(selected)
        setSavedSelections(newList)
        setSelected({});
    }

    const saveSelected = () => {
        window.api.saveSelectedNotes('save:selected', savedSelections)
    }

    const clearSelections = () => {
        setSelected("");
        setSavedSelections([]);
    }

    return (
        <div className="grid-container">
            <div className="left-side-main">
                <h1>Your highlights</h1>
                <div className="action-button">
                    <button disabled={savedSelections.length <= 0} onClick={saveSelected}>save selected</button>
                </div>
                <div className="action-button">
                    <button disabled={savedSelections.length <= 0} onClick={clearSelections}>clear selected</button>
                </div>
                <hr/>
            </div>
            <div className="right-side-main">
                <input type="text" onChange={(e) => setUrl(e.target.value)} value={url}
                       placeholder="input url address"/>
                <button onClick={toggleView}>open web</button>
                <div className="action-button">
                    <button disabled={isCopyButtonActive} onClick={addSelected}>save highlight</button>
                </div>
            </div>
            <div className="left-side-footer">
                {savedSelections.map((item, index) => (
                    <Fragment key={index}>
                        <div className="card">
                            <div className="card-url">
                                {item.url}
                            </div>
                            <div className="card-content">
                                {item.message}
                            </div>
                        </div>
                    </Fragment>

                ))}
            </div>
        </div>
    )
}

export default App