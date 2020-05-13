var ImageManagement = function () {
    //var self = this;
    //var parent = parent;

    var images = [];

    this.initialize = function () {
        registerEvents();
    }

    function registerEvents() {
        $('body').on('click', '.btn-images', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $('#hidIdImage').val(that);
            clearFileInput($("#fileImage"));
            loadImages();
            $('#modal-image-manage').modal('show');
        });

        $("#fileImage").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadImage",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    clearFileInput($("#fileImage"));
                    images.push(path);
                    $('#image-list').append('<div class="col-md-3"><img width="100"  data-path="' + path + '" src="' + path + '"></div>');
                    aspnetcore.notify('Đã tải ảnh lên thành công!', 'success');

                },
                error: function () {
                    aspnetcore.notify('There was error uploading files!', 'error');
                }
            });
        });

        $("#btnSaveImages").on('click', function () {
            var that = $('.btn-images').data('id');
            $('#hidIdImage').val(that);
            var imageList = [];
            $.each($('#image-list').find('img'), function (i, item) {
                imageList.push($(this).data('path'));
            });
            $.ajax({
                url: '/admin/Product/SaveImages',
                data: {
                    productId: $('#hidIdImage').val(),
                    images: images
                },
                type: 'post',
                dataType: 'json',
                success: function (response) {
                    $('#modal-image-manage').modal('hide');
                    $('#image-list').html('');
                    clearFileInput($("#fileImage"));
                }
            });
        });
    }
    function loadImages() {
        $.ajax({
            url: '/admin/Product/GetImages',
            data: {
                productId: $('#hidIdImage').val()
            },
            type: 'get',
            dataType: 'json',
            success: function (response) {
                var render = '';
                $.each(response, function (i, item) {
                    render += '<div class="col-md-3"><img width="100" src="' + item.Path + '"><br/><a href="#" class="btn-delete-image">Xóa</a></div>'
                });
                $('#image-list').html(render);
            }
        });
    }

    function clearFileInput(ctrl) {
        try {
            ctrl.value = null;
        } catch (ex) { }
        if (ctrl.value) {
            ctrl.parentNode.replaceChild(ctrl.cloneNode(true), ctrl);
        }
    }
}