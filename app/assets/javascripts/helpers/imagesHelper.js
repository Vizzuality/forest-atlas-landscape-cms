$(function () {
  $('input.image-uploader').on('change', function (event) {
    var files = event.target.files,
      image = files[0],
      reader = new FileReader(),
      placeholder = $(event.target).siblings('.thumbnail')[0];


    reader.addEventListener('load', function () {
      if (placeholder !== undefined) {
        placeholder.height = placeholder.height;
        placeholder.width = placeholder.width;
        placeholder.src = reader.result;
      }
    });
    if (image) {
      reader.readAsDataURL(image);
    }
  });
});
