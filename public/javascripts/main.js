function confirmDelete(){
return confirm('Are you sure you want to delete this article?');
};

// $(document).ready(function(){
//   $('.delete-article').on('click', function(e){
//     $target =  $(e.target);
//     var id = $target.attr('data-id');
//     $.ajax({
//       type:'DELETE',
//       url:'/articles/delete/' + id,
//       success: function(response) {
//          alert('Deleting Article');
//          window.location.href='/articles';
//       }
//       error: function(err) {
//          concole.log(err);
//       }
//     });
//   });
// });
