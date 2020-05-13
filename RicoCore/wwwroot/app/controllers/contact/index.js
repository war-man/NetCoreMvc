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
                //txtPhone: { required: true },
                //txtEmail: { required: true },
                //txtAddress: { required, true },                
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

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit').modal('show');            
        });
        

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $.ajax({
                type: "GET",
                url: "/Admin/Contact/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidContactId').val(data.Id);
                    $('#txtName').val(data.Name);
                    $('#txtPhone').val(data.Phone);
                    $('#txtEmail').val(data.Email);
                    $('#txtAddress').val(data.Address);
                    $('#txtWebsite').val(data.Website);
                    $('#txtLat').val(data.Lat);
                    $('#txtLng').val(data.Lng);
                    $('#ckStatus').prop('checked', data.Status === 1);
                    CKEDITOR.instances.txtOther.setData(data.Other);
                                                                          

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
                    url: "/Admin/Contact/Delete",
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
                    url: "/Admin/Contact/MultiDelete",
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
                var id = $('#hidContactId').val();
                var name = $('#txtName').val();
                var lat = parseFloat($('#txtLat').val());
                var lng = parseFloat($('#txtLng').val());
                var phone = $('#txtPhone').val();
                var email = $('#txtEmail').val();
                var address = $('#txtAddress').val();
                var website = $('#txtWebsite').val();
                var other = CKEDITOR.instances.txtOther.getData();               
                var status = $('#ckStatus').prop('checked') === true ? 1 : 0;                
                $.ajax({
                    type: "POST",
                    url: "/Admin/Contact/SaveEntity",
                    data: {
                        Id: id,
                        Name: name,
                        Lat: lat,
                        Lng: lng,
                        Phone: phone,
                        Email: email,
                        Address: address,
                        Other: other,       
                        Status: status,
                        Website: website
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

    function resetFormMaintainance() {
        $('#hidContactId').val('0');
        $('#txtName').val('');        
        $('#txtPhone').val('');
        $('#txtEmail').val('');
        $('#txtWebsite').val('');
        $('#txtAddress').val('');
        CKEDITOR.instances.txtOther.setData('');
        $('#ckStatus').prop('checked', true);        
        $('#txtLat').val(0);
        $('#txtLng').val(0);
    }

    function loadData(isPageChanged) {
        $.ajax({
            type: "POST",
            url: "/Admin/Contact/GetAllPaging",
            data: {
                keyword: $('#txtSearch').val(),              
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
                            Phone: item.Phone,                            
                            Email: item.Email,
                            Website: item.Website,
                            Address: item.Address,
                            Lat: item.Lat,
                            Lng: item.Lng,
                            Other: item.Other,
                            Status: aspnetcore.getStatus(item.Status),                            
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

    function registerControls() {
        var editorConfig = {
            filebrowserImageUploadUrl: '/Admin/Upload/UploadImageForCKEditor?type=Images'
        }
        CKEDITOR.replace('txtOther', editorConfig);       
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


