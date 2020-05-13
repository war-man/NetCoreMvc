var colorController = function () {
    this.initialize = function () {
        loadData();
        registerEvents();
        registerControls();
        clearSelectedCheckboxes();
    }

    function registerEvents() {
        //Init validation
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtName: { required: true },
                SlideGroup: { required: true },
                txtImage: { required: true },
                txtUrl: { required: true },
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

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit').modal('show');
            var position = parseInt($('#SlideGroup').val());
            setNewOrder(position);
        });

        $('#SlideGroup').on('change', function (e) {
            e.preventDefault();
            var position = $(this).val();
            setNewOrder(position);
        });

        $('#ddlSlideGroup').on('change', function (e) {
            e.preventDefault();
            var position = $(this).val();
            setNewOrder(position);
        });


        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $.ajax({
                type: "GET",
                url: "/Admin/Slide/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidSlideId').val(data.Id);
                    $('#txtName').val(data.Name);
                    $('#SlideGroup').val(data.GroupAlias);
                    $('#txtSortOrder').val(data.SortOrder);
                    $('#txtImage').val(data.Image);
                    $('#txtUrl').val(data.Url);
                    $('#ckStatus').prop('checked', data.Status === 1);
                    CKEDITOR.instances.txtContent.setData(data.Content);
                    $('#txtMainCaption').val(data.MainCaption);
                    $('#txtSubCaption').val(data.SubCaption);
                    $('#txtSmallCaption').val(data.SmallCaption);
                    $('#txtCallToAction').val(data.ActionCaption);                                                         

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
                    url: "/Admin/Slide/Delete",
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
                    url: "/Admin/Slide/MultiDelete",
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

        //$('body').on('click', '.btnDeleteAll', function (e) {
        //    e.preventDefault();           
        //    var selectLst = [];

        //    $.each($('input[name="ckSelect"]'), function (i, item) {
        //        if ($(item).prop('checked') === true)
        //            selectLst.push($(item).prop('value'));
        //    });
        //    $('#ckCheckAllDelete').on('click', function () {
        //        $('.ckDelete').prop('checked', $(this).prop('checked'));
        //    });
        //    $('.ckDelete').on('click', function () {
        //        if ($('.ckDelete:checked').length == response.length) {
        //            $('#ckCheckAllDelete').prop('checked', true);
        //        } else {
        //            $('#ckCheckAllDelete').prop('checked', false);
        //        }
        //    });
        //    $.ajax({
        //        type: "POST",
        //        url: "/Admin/Role/DeleteAll",
        //        data: {
        //            listPermmission: selectLst                   
        //        },
        //    aspnetcore.confirm('Bạn có chắc chắn muốn xoá nhiều?', function () {                                
        //            beforeSend: function () {
        //                aspnetcore.startLoading();
        //            },
        //            success: function (response) {
        //                aspnetcore.notify('Xoá nhiều thành công', 'success');
        //                aspnetcore.stopLoading();
        //                loadData();
        //            },
        //            error: function (status) {
        //                aspnetcore.notify('Xoá nhiều không thành công', 'error');
        //                aspnetcore.stopLoading();
        //            }
        //        });
        //    });
        //});

        $('#btn-save').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                var id = $('#hidSlideId').val();
                var name = $('#txtName').val();
                var position = parseInt($('#SlideGroup').val());
                var image = $('#txtImage').val();
                var url = $('#txtUrl').val();
                var sortOrder = $('#txtSortOrder').val();
                var content = CKEDITOR.instances.txtContent.getData();
                var mainCaption = $('#txtMainCaption').val();
                var subCaption = $('#txtSubCaption').val();
                var smallCaption = $('#txtSmallCaption').val();
                var callToAction = $('#txtCallToAction').val();
                var status = $('#ckStatus').prop('checked') === true ? 1 : 0;                
                $.ajax({
                    type: "POST",
                    url: "/Admin/Slide/SaveEntity",
                    data: {
                        Id: id,
                        Name: name,
                        GroupAlias: position,
                        Url: url,
                        Image: image,
                        Content: content,
                        MainCaption: mainCaption,
                        SubCaption: subCaption,
                        SmallCaption: smallCaption,
                        ActionCaption: callToAction,
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

    function registerControls() {
        var editorConfig = {
            filebrowserImageUploadUrl: '/Admin/Upload/UploadImageForCKEditor?type=Images'
        }      
        CKEDITOR.replace('txtContent', editorConfig);
        //Fix: cannot click on element ck in modal
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
            $(document)
                .off('focusin.bs.modal') // guard against infinite focus loop
                .on('focusin.bs.modal', $.proxy(function (e) {
                    if (
                        this.$element[0] !== e.target && !this.$element.has(e.target).length
                        // CKEditor compatibility fix start.
                        && !$(e.target).closest('.cke_dialog, .cke').length
                        // CKEditor compatibility fix end.
                    ) {
                        this.$element.trigger('focus');
                    }
                }, this));
        };
    }


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
            url: "/Admin/Slide/SetOrder",            
            success: function (data) {
                $('#txtSortOrder').val(data.order);
            },
            error: function () {
                alert('Lỗi thiết lập thứ tự!');
            }
        });
    }


    function resetFormMaintainance() {
        $('#hidSlideId').val('0');
        $('#txtName').val('');        
        $('#txtUrl').val('');
        $('#txtSortOrder').val('');
        $('#txtImage').val('');
        $('#SlideGroup').val('');
        CKEDITOR.instances.txtContent.setData('');
        $('#ckStatus').prop('checked', true);
        $('#txtMainCaption').val('');
        $('#txtSubCaption').val('');
        $('#txtSmallCaption').val('');
        $('#txtCallToAction').val('');
    }

    function loadData(isPageChanged) {
        $.ajax({
            type: "POST",
            url: "/Admin/Slide/GetAllPaging",
            data: {
                keyword: $('#txtSearch').val(),
                position: $('#ddlSlideGroup').val(),
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
                            Name: item.Name,
                            Id: item.Id,
                            Image: item.Image == null ? '<img src="/admin-side/images/user.png" width=25' : '<img src="' + item.Image + '" width=30 />',
                            Url: item.Url,                           
                            SortOrder: item.SortOrder,
                            GroupAlias: item.GroupAlias,
                            Content: item.Content,
                            Status: aspnetcore.getStatus(item.Status),
                            MainCaption: item.MainCaption,
                            SubCaption: item.SubCaption,
                            SmallCaption: item.SmallCaption,
                            ActionCaption: item.ActionCaption
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


