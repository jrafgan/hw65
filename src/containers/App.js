import React, {Component, Fragment} from 'react';
import './App.css';
import Admin from "../components/Admin";
import {NavLink, Route, Switch} from "react-router-dom";
import {CATEGORIES} from "../categories";
import axios from "../axios-url";
import {EditorState, convertFromRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import Preloader from "../components/Preloader/Preloader";


class App extends Component {

    state = {
        category: '',
        title: '',
        article: '',
        editorState: EditorState.createEmpty(),
        loading: false,
    };

    componentDidMount() {
            const category = document.location.pathname.substr(1);
            this.showPage(null, category);
    }

    showPage = (e, category) => {
        let id = '';
        if (e !== null) {
            id = e.currentTarget.id;
        } else {
            id = category;
        }
        this.setState({category: id, loading: true});
        axios.get(`hw65articles.json?orderBy="category"&equalTo="${id}"`).then((response) => {

            Object.keys(response.data).map(id => {
                const contentState = convertFromRaw(JSON.parse(response.data[id].article));

                return this.setState({
                    category: response.data[id].category,
                    title: response.data[id].title,
                    editorState: EditorState.createWithContent(contentState)
                })
            });
            return {...response.data[id], id}
        }).finally(() => {
            this.setState({loading: false})
        });

    };


    render() {

        return (
            <div className="App">
                <header className="header">
                    <div className="logo">Static Pages</div>
                    <div className="navBar">
                        <ul>
                            <li className='navBarLi'><NavLink to='/'>Home</NavLink></li>
                            {CATEGORIES.map(item => {
                                return <li className='navBarLi' key={item}><NavLink to={'/' + item}
                                                                                    onClick={e => this.showPage(e)}
                                                                                    id={item}>{item}</NavLink></li>
                            })}
                            <li className='navBarLi'><NavLink to='/pages/admin'>Admin</NavLink></li>
                        </ul>
                    </div>
                </header>
                <Switch>
                    <Route path='/' exact render={() => {
                        return <div><h3>Home page</h3>
                            From Wikipedia, the free encyclopedia
                            <p>Jump to navigationJump to search</p>
                            <p>Not to be confused with home screen.</p>
                            <p>For other uses, see Home page (disambiguation).</p>
                            <p>"Start page" redirects here. For the search engine, see Startpage.com.</p>
                            <p>For Wikipedia's home page, see Wikipedia:Main Page and www.wikipedia.org</p>


                            <p>The home page of the English Wikipedia</p>
                            <p>A home page or a start page is the initial or main web page of a website or a browser.
                                The initial page of a website is sometimes called main page as well.</p></div>
                    }}/>
                    <Route path='/:category' exact render={() => {
                        let content = (<Fragment>
                                <p>Category : {this.state.category}</p>
                                <p>Title : {this.state.title}</p>
                                <Editor
                                    editorState={this.state.editorState}
                                    readOnly toolbarHidden/>
                            </Fragment>
                        );
                        if (this.state.loading) {
                            content = <Preloader/>
                        }
                        return <div>
                            {content}
                        </div>
                    }}/>
                    <Route path='/pages/admin' exact component={Admin}/>

                </Switch>
            </div>
        );
    }
}


export default App;
