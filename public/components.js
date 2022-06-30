const e = React.createElement;

export class Post extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      'div',
      { className: "post" },
      e(
        'div',
        { className: "title" },
        this.props.title
      ),
      e(
        'div',
        { className: "body" },
        this.props.body
      ),
      this.props.thumbnail && e(
        'img',
        { src: this.props.thumbnail, className: "body", width: 300 }
      )
    );
  }
}

export class PostForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: '', text: '' };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }

  handleTextChange(event) {
    this.setState({ text: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onPost({
      title: this.state.title,
      text: this.state.text,
      photo: this.fileInput.current.files[0],
    });
  }

  render() {
    return e(
      'form', { 'onSubmit': this.handleSubmit },
      e('div', { className: "header" }, 'Post your photo'),
      e('div', { className: "title" },
        e('label', {}, 'Title: ',
          e('input', { 'type': 'text', 'value': this.state.value, 'onChange': this.handleTitleChange }),
        )
      ),
      e('div', { className: "body" },
        e('textarea', { rows: 5, width: 600, 'onChange': this.handleTextChange }),
      ),
      e('div', { className: "file" },
        e('label', {}, 'Photo',
          e('input', { 'type': 'file', ref: this.fileInput }),
        )
      ),

      e('input', { 'type': 'submit', 'text': 'Submit' })
    );
  }
}