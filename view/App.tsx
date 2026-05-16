import {Fragment, useEffect, useState} from "react";
import './index.css'

const App = () => {

    const [url, setUrl] = useState("");

    const [savedSelections, setSavedSelections] = useState([]);
    const [toast, setToast] = useState("");

    useEffect(() => {
        // Register a single listener that appends incoming highlights.
        window.api.selectedMessage('highlight:add-direct', (_, message) => {
            if (message && message.message) {
                setSavedSelections((prev) => {
                    const next = structuredClone(prev);
                    next.push(message);
                    return next;
                });
                // show visual feedback
                setToast('Highlight added');
                setTimeout(() => setToast(''), 2000);
            }
        })
    }, []);

    useEffect(() => {
        window.api.highlightSaved('text:saved', () => {
            alert('highlights saved to file')
        });
    }, []);

    const toggleView = () => {
        window.api.openWebView('toggle:web-view', url)
    }
    const saveSelected = () => {
        window.api.saveSelectedNotes('save:selected', savedSelections)
    }

    const clearSelections = () => {
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

            </div>
            <div className="left-side-footer">
                {savedSelections.length > 0 ? savedSelections.map((item, index) => (
                    <Fragment key={index}>
                        <div className="card">
                            <div className="card-url">
                                {item.url}
                            </div>
                            <div className="card-title">
                                {item.pageTitle}
                            </div>
                            <div className="card-content">
                                {item.message}
                            </div>
                        </div>
                    </Fragment>
                )) : <h2>No highlights yet</h2>}
            </div>
            {toast && <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>}
        </div>
    )
}

export default App