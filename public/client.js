
var blogPostTemplate = (
  '<li class="js-blog-post">' +
    '<p><span class="blog-posts js-blog-post-title"></span></p>' +
    '<div class="blog-post-controls">' +
      '<button class="js-blog-post-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);


var BLOG_POST_URL = '/blog-posts';


function getAndDisplayBlogPost() {
  console.log('Retrieving blog post');
  $.getJSON(BLOG_POST_URL, function(posts) {
    console.log('Rendering blog posts');
    var postElements = posts.map(function(post) {
      var element = $(blogPostTemplate);
      element.attr('id', post.id);
      var postTitle = element.find('.js-blog-post-title');
      postTitle.text(post.title);
      return element;
    });
    $('.js-blog-post').html(postElements);
  });
}

function addBlogPost(post) {
  console.log('Adding blog post: ' + post);
  $.ajax({
    method: 'POST',
    url: BLOG_POST_URL,
    data: JSON.stringify(post),
    success: function(data) {
      getAndDisplayBlogPost();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function deleteBlogPost(postId) {
  console.log('Deleting blog post `' + postId + '`');
  $.ajax({
    url: BLOG_POST_URL + '/' + postId,
    method: 'DELETE',
    success: getAndDisplayBlogPost
  });
}


function handleBlogPostAdd() {

  $('#js-blog-api-form').submit(function(e) {
    e.preventDefault();
    addBlogPost({
      name: $(e.currentTarget).find('#js-new-post').val(),
      checked: false
    });
  });

}

function handleBlogPostDelete() {
  $('.js-blog-posts').on('click', '.js-blog-post-delete', function(e) {
    e.preventDefault();
    deleteBlogPost(
      $(e.currentTarget).closest('.js-blog-posts').attr('id'));
  });
}


$(function() {
  getAndDisplayBlogPost();
  handleBlogPostAdd();
  handleBlogPostDelete();
});