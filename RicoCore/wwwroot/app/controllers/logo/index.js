var jsController = function () {
    this.initialize = function () {
        loadData();
        registerEvents();     
        clearSelectedCheckboxes();
    }

    function registerEvents() {
        //Init validation
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtImage: { required: true },               
                txtImageAlt: { required: true },
                txtFavicon: { required: true },
                txtSortOrder: { required: true, number: true },              
            }
        });

        $('#txtSearch').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                loadData();
            }
        });

        $("#btn-search").on('click', function () {
            loadData();
        });

        $("#ddl-show-page").on('change', function () {
            aspnetcore.configs.pageSize = $(this).val();
            aspnetcore.configs.pageIndex = 1;
            loadData(true);
        });

        $('#btnSelectImg').on('click', function () {
            $('#fileInputImage').click();
        });

        $("#fileInputImage").on('change', function () {
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
                    $('#txtImage').val(path);
                    aspnetcore.notify('Up ảnh thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh bị lỗi', 'error');
                }
            });
        });

        $('#btnSelectImg2').on('click', function () {
            $('#fileInputImage2').click();
        });

        $("#fileInputImage2").on('change', function () {
            var fileUpload = $(this).get(0);
            var files = fileUpload.files;
            var data = new FormData();
            for (var i = 0; i < files.length; i++) {
                data.append(files[i].name, files[i]);
            }
            $.ajax({
                type: "POST",
                url: "/Admin/Upload/UploadFavicon",
                contentType: false,
                processData: false,
                data: data,
                success: function (path) {
                    $('#txtFavicon').val(path);
                    aspnetcore.notify('Up Favicon thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up Favicon bị lỗi', 'error');
                }
            });
        });


        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit').modal('show');            
            setNewOrder();
        });      
      
        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $.ajax({
                type: "GET",
                url: "/Admin/Logo/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidLogoId').val(data.Id);
                    $('#txtFavicon').val(data.Favicon);
                    $('#txtSize').val(data.Size);
                    $('#txtSortOrder').val(data.SortOrder);
                    $('#txtImage').val(data.Image);
                    $('#txtImageAlt').val(data.ImageAlt);
                    $('#ckStatus').prop('checked', data.Status === 1);                   
                    $('#modal-add-edit').modal('show');
                    aspnetcore.stopLoading();
                },
                error: function (status) {
                    aspnetcore.notify('Có lỗi xảy ra', 'error');
                    aspnetcore.stopLoading();
                }
            });
        });

        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            aspnetcore.confirm('Bạn có chắc chắn muốn xoá?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Logo/Delete",
                    data: { id: that },
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function (response) {
                        aspnetcore.notify('Xoá thành công', 'success');
                        aspnetcore.stopLoading();
                        loadData();
                    },
                    error: function (status) {
                        aspnetcore.notify('Xoá không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            });
        });

        function updateMasterCheckbox() {
            var numChkBoxes = $('#tbl-content input[type=checkbox][id!=mastercheckbox]').length;
            var numChkBoxesChecked = $('#tbl-content input[type=checkbox][id!=mastercheckbox]:checked').length;
            $('#mastercheckbox').prop('checked', numChkBoxes == numChkBoxesChecked && numChkBoxes > 0);
        }

        $('#mastercheckbox').on('click', function () {
            //$('#mastercheckbox').click(function () {
            $('.checkboxGroups').prop('checked', $(this).prop('checked'));
            //$('.checkboxGroups').prop('checked', $(this).is(':checked')).change();
        });

        $('body').on('click', '#delete-selected', function (e) {
        //$('#delete-selected').click(function (e) {
                e.preventDefault();
            var selectedIds = [];           
          
            updateMasterCheckbox();
            
            $.each($('input[type=checkbox][id!=mastercheckbox]'), function (i, item) {
            if ($(item).prop('checked') === true)
                selectedIds.push($(item).prop('value'));
            });
       
                var postData = {
                    selectedIds: selectedIds
                };
                //addAntiForgeryToken(postData);
                aspnetcore.confirm('Bạn có chắc chắn muốn xoá?', function () {           
                $.ajax({                    
                    type: "POST",
                    url: "/Admin/Logo/MultiDelete",
                    data: postData,
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function (response) {
                        aspnetcore.notify('Xoá thành công', 'success');
                        aspnetcore.stopLoading();
                        loadData();
                    },
                    error: function (status) {
                        aspnetcore.notify('Xoá không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });                
            });
        });

     
        $('#btn-save').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                var id = $('#hidLogoId').val(); 
                var favicon = $('#txtFavicon').val();
                var image = $('#txtImage').val();
                var imageAlt = $('#txtImageAlt').val();               
                var sortOrder = $('#txtSortOrder').val();  
                var size = $('#txtSize').val();
                var status = $('#ckStatus').prop('checked') === true ? 1 : 0;                
                $.ajax({
                    type: "POST",
                    url: "/Admin/Logo/SaveEntity",
                    data: {
                        Id: id,
                        Name: name,
                        Favicon: favicon,
                        Image: image,
                        ImageAlt: imageAlt,
                        Size: size,
                        SortOrder: sortOrder,                       
                        Status: status
                    },
                    dataType: "json",
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function (response) {
                        aspnetcore.notify('Cập nhật thành công', 'success');
                        $('#modal-add-edit').modal('hide');
                        resetFormMaintainance();
                        aspnetcore.stopLoading();
                        loadData(true);
                    },
                    error: function () {
                        aspnetcore.notify('Cập nhật có lỗi xảy ra', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            }
            return false;
        });            
    };

    function clearSelectedCheckboxes() {
        $(document).ready(function () {
            var selectedIds = [];
            //clear selected checkboxes
            $('.checkboxGroups').prop('checked', false).change();
            selectedIds = [];
            return false;
        });
    }

    function setNewOrder() {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/Admin/Logo/SetOrder",            
            success: function (data) {
                $('#txtSortOrder').val(data.order);
            },
            error: function () {
                alert('Lỗi thiết lập thứ tự!');
            }
        });
    }


    function resetFormMaintainance() {
        $('#hidLogoId').val('0');      
        $('#txtSortOrder').val('');
        $('#txtImage').val('');
        $('#txtImageAlt').val('');  
        $('#txtFavicon').val('');
        $('#txtSize').val('');
        $('#ckStatus').prop('checked', true);
      
    }

    function loadData(isPageChanged) {
        $.ajax({
            type: "POST",
            url: "/Admin/Logo/GetAllPaging",
            data: {              
                page: aspnetcore.configs.pageIndex,
                pageSize: aspnetcore.configs.pageSize
            },
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function (response) {
                var template = $('#table-template').html();
                var render = "";
                if (response.RowCount > 0) {
                    $.each(response.Results, function (i, item) {
                        render += Mustache.render(template, {                           
                            Id: item.Id,
                            Image: item.Image == null ? '<img src="/admin-side/images/user.png" width=60' : '<img src="' + item.Image + '" width=60 />',
                            Favicon: item.Favicon == null ? '<img src="/admin-side/images/user.png" width=25' : '<img src="' + item.Favicon + '" width=25 />',
                            ImageAlt: item.Alt,
                            Size: item.Size,
                            SortOrder: item.SortOrder,                          
                            Status: aspnetcore.getStatus(item.Status)                           
                        });
                    });
                    $("#lbl-total-records").text(response.RowCount);
                    if (render != undefined) {
                        $('#tbl-content').html(render);

                    }
                    wrapPaging(response.RowCount, function () {
                        loadData();
                    }, isPageChanged);
                }
                else {
                    $('#tbl-content').html('');
                }
                aspnetcore.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    };

    function wrapPaging(recordCount, callBack, changePageSize) {
        var totalsize = Math.ceil(recordCount / aspnetcore.configs.pageSize);
        //Unbind pagination if it existed or click change pagesize
        if ($('#paginationUL a').length === 0 || changePageSize === true) {
            $('#paginationUL').empty();
            $('#paginationUL').removeData("twbs-pagination");
            $('#paginationUL').unbind("page");
        }
        //Bind Pagination Event
        $('#paginationUL').twbsPagination({
            totalPages: totalsize,
            visiblePages: 7,
            first: 'Đầu',
            prev: 'Trước',
            next: 'Tiếp',
            last: 'Cuối',
            onPageClick: function (event, p) {
                aspnetcore.configs.pageIndex = p;
                setTimeout(callBack(), 200);
            }
        });
    }

    //function onDataBound(e) {
    //    $('#tbl-content input[type=checkbox][id!=mastercheckbox]').each(function () {
    //        var currentId = $(this).val();
    //        var checked = jQuery.inArray(currentId, selectedIds);
    //        //set checked based on if current checkbox's value is in selectedIds.
    //        $(this).prop('checked', checked > -1);
    //    });
    //    updateMasterCheckbox();
    //}
       
        };            


