import React, {Component, Fragment} from 'react';
import axios from '../axios-url';
import './Admin.css';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw, convertFromRaw} from 'draft-js'
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {CATEGORIES} from '../categories';
import Preloader from "./Preloader/Preloader";


class Admin extends Component {

    state = {
        category: '',
        title: '',
        article: '',
        editorState: EditorState.createEmpty(),
        loading: false,
    };
    id = '';

    changeValue = e => {
        const {name, value} = e.target;
        this.setState({[name]: value});
        if (name === 'category') {
            this.setState({loading: true});

            axios.get(`hw65articles.json?orderBy="category"&equalTo="${value}"`).then((response) => {

                console.log(response.data);

                const article = Object.keys(response.data).map(id => {
                    this.id = id;
                    console.log(id);

                    const contentState = convertFromRaw(JSON.parse(response.data[id].article));

                    this.setState({
                        category: response.data[id].category,
                        title: response.data[id].title,
                        editorState: EditorState.createWithContent(contentState)
                    });

                    return {...response.data[id], id}
                });
                console.log(article);
            }).finally(() => {
                this.setState({loading: false})
            });
        }
        console.log(name)
    };

    submitHandler = e => {
        e.preventDefault();

        const contentState = convertToRaw(this.state.editorState.getCurrentContent());

        console.log(this.id);

        this.setState({article: JSON.stringify(contentState)});

        let article = JSON.stringify(contentState);

        article = {
            ...this.state,
            article
        };
        this.setState({loading: true});

        axios.put('hw65articles/' + this.id + '.json', article).finally(() => {
            this.setState({loading: false});
            this.props.history.push('/' + this.state.category);
            console.log(this.state.category);
        });
    };

    onEditorStateChange = editorState => {
        this.setState({editorState});
    };


    render() {


        if (this.state.loading) { return <Preloader/>} else {
            return (<div>
                    <form className='articleForm' onSubmit={(e) => this.submitHandler(e)}>
                        <label>Category : </label>
                        <select id="category" name='category' onChange={(e) => this.changeValue(e)}
                                value={this.state.category}>
                            <option>Select category</option>
                            {CATEGORIES.map((item, index) => {
                                return <option value={item} key={index}>{item}</option>
                            })}

                        </select>
                        <label>Title : </label>

                        <input type='text' name='title' id='title' placeholder='Enter a title' value={this.state.title}
                               onChange={(e) => this.changeValue(e)}/>

                        <label>Article : </label>

                        <Editor
                            editorState={this.state.editorState}
                            onEditorStateChange={this.onEditorStateChange}/>

                        <button type='submit'> Save</button>
                    </form>
                </div>
            );
        }
    }
}

export default Admin;