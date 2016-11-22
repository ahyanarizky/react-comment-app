// statefull
var CommentBox = React.createClass({
  getInitialState: function(){
    return {data: []}
  },
  //custom function
  loadComments: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      cache: false,
      success: function(res_data){
        this.setState({
          data: res_data
        })
      }.bind(this),// for point parent this : CommentBox
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    })
  },
  componentDidMount: function(){// function name from React
    this.loadComments()
  },
  handleCommentSubmit: function(comment){
    var comments = this.state.data
    comment.id = comments.length + 1
    var newComments = comments.concat([comment])
    this.setState({
      data: newComments
    })

    $.ajax({
      url: this.props.url,
      dataType: 'JSON',
      type: 'POST',
      data: comment,
      success: function(res_new_data){
        this.setState({
          data: res_new_data
        })
      }.bind(this),
      error: function(xhr, status, err){
        this.setState({
          data: comments
        })
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments App</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    )
  }
  /*
  alternative:
  render (){
  }
  */
})

// stateless
var CommentList = React.createClass({
  render: function(){
    var h2 = <h2>Comment List</h2>
    var commentNodes = this.props.data.map((comment) => {
      // Comment is a componen
      // key for props in each data
      return(
        <Comment key={comment.id} id={comment.id} author={comment.author} text={comment.text} />
      )
    })
    // return(
    //   div(null, {commentNodes})
    // )
    return (<div>{commentNodes}</div>)
  }
})

var Comment = React.createClass({
  render(){
    return (
      <div className="comment" id={this.props.id}>
        <p>
          <b>{this.props.author}</b> - {this.props.text}
        </p>
      </div>
    )
  }
})

var CommentForm = React.createClass({
  getInitialState(){
    return ({
      author: '',
      text: ''
    })
  },
  handleAuthorChange(e){
    this.setState({
      author: e.target.value
    })
  },
  handleTextChange(e){
    this.setState({
      text: e.target.value
    })
  },
  handleSubmit(e){
    e.preventDefault()
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!author || !text){
      return
    }else{
      this.props.onCommentSubmit({
        author: author,
        text: text
      })
      this.setState({
        author: '',
        text: ''
      })
    }
  },
  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange} />
        <input type="text" onChange={this.handleTextChange} value={this.state.text} />
        <input type="submit" value="Add Post" />
      </form>
    )
  }
})

ReactDOM.render(
  <CommentBox url="http://localhost:3000/api/comments"/>, document.getElementById('content')
)