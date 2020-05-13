var roleController = function () {
    this.initialize = function () {
        loadData();
        registerEvents();
        clearSelectedCheckboxes();
    }

    function registerEvents() {
        //Init validation        
        $('#txtSearch').keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                loadData();
            }
        });
        $(".btn-search").on('click', function () {
            loadData();
        });
        $("#ddl-show-page").on('change', function () {
            aspnetcore.configs.pageSize = $(this).val();
            aspnetcore.configs.pageIndex = 1;
            loadData(true);
        });
        $(".btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-add-edit').modal('show');
        });
        $('#mastercheckbox').on('click', function () {
            //$('#mastercheckbox').click(function () {
            $('.checkboxGroups').prop('checked', $(this).prop('checked'));
            //$('.checkboxGroups').prop('checked', $(this).is(':checked')).change();
        });
        
        $('body').on('click', '.recover-soft-deleted', function (e) {
            e.preventDefault();
            window.location.href = "/admin/role/softdelete";
        });
        $('body').on('click', '.soft-delete-selected', function (e) {
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
            aspnetcore.confirm('Bạn có chắc chắn muốn xoá nhiều?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Role/MultiSoftDeleteAsync",
                    data: postData,
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá nhiều thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá nhiều không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            });
        });        
        $('body').on('click', '.delete-selected', function (e) {
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
                aspnetcore.confirm('Bạn có chắc chắn muốn xoá vĩnh viễn?', function () {           
                $.ajax({                    
                    type: "POST",
                    url: "/Admin/Role/MultiDeleteAsync",
                    data: postData,
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá vĩnh viễn thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá vĩnh viễn không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });                
            });
        });        
        $('body').on('click', '.btn-soft-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            aspnetcore.confirm('Bạn có chắc chắn muốn xoá?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Role/SoftDeleteAsync",
                    data: { id: that },
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            });
        }); 
        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            aspnetcore.confirm('Bạn có chắc chắn muốn xoá vĩnh viễn?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Role/DeleteAsync",
                    data: { id: that },
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá vĩnh viễn thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá vĩnh viễn không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            });
        }); 

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $.ajax({
                type: "GET",
                url: "/Admin/Role/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidId').val(data.Id);
                    $('#txtName').val(data.Name);
                    $('#txtDescription').val(data.Description);
                    $('#modal-add-edit').modal('show');
                    aspnetcore.stopLoading();
                },
                error: function () {
                    aspnetcore.notify('Có lỗi xảy ra', 'error');
                    aspnetcore.stopLoading();
                }
            });
        });
        $('.btn-save').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                var id = $('#hidId').val();
                var name = $('#txtName').val();
                var description = $('#txtDescription').val();

                $.ajax({
                    type: "POST",
                    url: "/Admin/Role/SaveEntity",
                    data: {
                        Id: id,
                        Name: name,
                        Description: description,
                    },
                    dataType: "json",
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        //aspnetcore.notify('Cập nhật quyền thành công', 'success');
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
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtName: { required: true }
            }
        });
        
        $('body').on('click', '.btn-grant', function () {
            $('#hidRoleId').val($(this).prop('id'));
            $.when(loadFunctionList())
                .done(fillPermission($('#hidRoleId').val()));
            $('#modal-grant-permission').modal('show');
        });
        $(".btn-save-permission").off('click').on('click', function () {
            var listPermmission = [];
            $.each($('#tbl-function tbody tr'), function (i, item) {
                listPermmission.push({
                    RoleId: $('#hidRoleId').val(),
                    FunctionId: $(item).data('id'),
                    CanRead: $(item).find('.ckView').first().prop('checked'),
                    CanCreate: $(item).find('.ckAdd').first().prop('checked'),
                    CanImportExport: $(item).find('.ckImportExport').first().prop('checked'),
                    CanUpdate: $(item).find('.ckEdit').first().prop('checked'),
                    CanSoftDelete: $(item).find('.ckSoftDelete').first().prop('checked'),
                    CanDelete: $(item).find('.ckDelete').first().prop('checked'),
                });
            });
            $.ajax({
                type: "POST",
                url: "/Admin/Role/SavePermission",
                data: {
                    listPermmission: listPermmission,
                    roleId: $('#hidRoleId').val()
                },
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function () {
                    aspnetcore.notify('Lưu thành công', 'success');
                    $('#modal-grant-permission').modal('hide');
                    clearSelectedCheckboxes();
                    aspnetcore.stopLoading();
                },
                error: function () {
                    aspnetcore.notify('Có lỗi xảy ra', 'error');
                    aspnetcore.stopLoading();
                }
            });
        });                       
    };

    function updateMasterCheckbox() {
        var numChkBoxes = $('#tbl-content input[type=checkbox][id!=mastercheckbox]').length;
        var numChkBoxesChecked = $('#tbl-content input[type=checkbox][id!=mastercheckbox]:checked').length;
        $('#mastercheckbox').prop('checked', numChkBoxes == numChkBoxesChecked && numChkBoxes > 0);
    }
    function clearSelectedCheckboxes() {
        $(document).ready(function () {            
            //clear selected checkboxes
            $('#mastercheckbox').prop('checked', false);
            $('.checkboxGroups').prop('checked', false);
            return false;
        });
    }
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

    
    function loadFunctionList(callback) {
        var strUrl = "/Admin/Function/GetAll";
        return $.ajax({
            type: "GET",
            url: strUrl,
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function (response) {
                var template = $('#function-data').html();
                var render = "";
                $.each(response, function (i, item) {
                    render += Mustache.render(template, {
                        Name: item.Name,
                        treegridparent: item.ParentId != null ? "treegrid-parent-" + item.ParentId : "",
                        Id: item.Id,
                        AllowCreate: item.AllowCreate ? "checked" : "",
                        AllowEdit: item.AllowEdit ? "checked" : "",
                        AllowImportExport: item.AllowImportExport ? "checked" : "",
                        AllowView: item.AllowView ? "checked" : "",
                        AllowSoftDelete: item.AllowSoftDelete ? "checked" : "",
                        AllowDelete: item.AllowDelete ? "checked" : "",
                        Status: aspnetcore.getStatus(item.Status),
                    });
                });
                if (render != undefined) {
                    $('#lst-function-data').html(render);
                }
                $('.tree').treegrid();

                $('#ckCheckAllView').on('click', function () {
                    $('.ckView').prop('checked', $(this).prop('checked'));
                });

                $('#ckCheckAllCreate').on('click', function () {
                    $('.ckAdd').prop('checked', $(this).prop('checked'));
                });
                $('#ckCheckAllEdit').on('click', function () {
                    $('.ckEdit').prop('checked', $(this).prop('checked'));
                });
                $('#ckCheckAllImportExport').on('click', function () {
                    $('.ckImportExport').prop('checked', $(this).prop('checked'));
                });
                $('#ckCheckAllDelete').on('click', function () {
                    $('.ckDelete').prop('checked', $(this).prop('checked'));
                });
                $('#ckCheckAllSoftDelete').on('click', function () {
                    $('.ckSoftDelete').prop('checked', $(this).prop('checked'));
                });

                $('.ckView').on('click', function () {
                    if ($('.ckView:checked').length == response.length) {
                        $('#ckCheckAllView').prop('checked', true);
                    } else {
                        $('#ckCheckAllView').prop('checked', false);
                    }
                });
                $('.ckAdd').on('click', function () {
                    if ($('.ckAdd:checked').length == response.length) {
                        $('#ckCheckAllCreate').prop('checked', true);
                    } else {
                        $('#ckCheckAllCreate').prop('checked', false);
                    }
                });
                $('.ckEdit').on('click', function () {
                    if ($('.ckEdit:checked').length == response.length) {
                        $('#ckCheckAllEdit').prop('checked', true);
                    } else {
                        $('#ckCheckAllEdit').prop('checked', false);
                    }
                });
                $('.ckImportExport').on('click', function () {
                    if ($('.ckImportExport:checked').length == response.length) {
                        $('#ckCheckAllImportExport').prop('checked', true);
                    } else {
                        $('#ckCheckAllImportExport').prop('checked', false);
                    }
                });
                $('.ckSoftDelete').on('click', function () {
                    if ($('.ckSoftDelete:checked').length == response.length) {
                        $('#ckCheckAllSoftDelete').prop('checked', true);
                    } else {
                        $('#ckCheckAllSoftDelete').prop('checked', false);
                    }
                });
                $('.ckDelete').on('click', function () {
                    if ($('.ckDelete:checked').length == response.length) {
                        $('#ckCheckAllDelete').prop('checked', true);
                    } else {
                        $('#ckCheckAllDelete').prop('checked', false);
                    }
                });
                if (callback != undefined) {
                    callback();
                }
                aspnetcore.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

    function fillPermission(roleId) {
        var strUrl = "/Admin/Role/ListAllFunction";
        return $.ajax({
            type: "POST",
            url: strUrl,
            data: {
                roleId: roleId
            },
            dataType: "json",
            beforeSend: function () {
                aspnetcore.stopLoading();
            },
            success: function (response) {
                var litsPermission = response;
                $.each($('#tbl-function tbody tr'), function (i, item) {
                    $.each(litsPermission, function (j, jitem) {
                        if (jitem.FunctionId == $(item).data('id')) {
                            $(item).find('.ckView').first().prop('checked', jitem.CanRead);
                            $(item).find('.ckAdd').first().prop('checked', jitem.CanCreate);
                            $(item).find('.ckImportExport').first().prop('checked', jitem.CanImportExport);
                            $(item).find('.ckEdit').first().prop('checked', jitem.CanUpdate);
                            $(item).find('.ckSoftDelete').first().prop('checked', jitem.CanSoftDelete);
                            $(item).find('.ckDelete').first().prop('checked', jitem.CanDelete);
                        }
                    });
                });

                if ($('.ckView:checked').length == $('#tbl-function tbody tr .ckView').length) {
                    $('#ckCheckAllView').prop('checked', true);
                } else {
                    $('#ckCheckAllView').prop('checked', false);
                }
                if ($('.ckAdd:checked').length == $('#tbl-function tbody tr .ckAdd').length) {
                    $('#ckCheckAllCreate').prop('checked', true);
                } else {
                    $('#ckCheckAllCreate').prop('checked', false);
                }
                if ($('.ckImportExport:checked').length == $('#tbl-function tbody tr .ckImportExport').length) {
                    $('#ckCheckAllImportExport').prop('checked', true);
                } else {
                    $('#ckCheckAllImportExport').prop('checked', false);
                }
                if ($('.ckEdit:checked').length == $('#tbl-function tbody tr .ckEdit').length) {
                    $('#ckCheckAllEdit').prop('checked', true);
                } else {
                    $('#ckCheckAllEdit').prop('checked', false);
                }
                if ($('.ckSoftDelete:checked').length == $('#tbl-function tbody tr .ckSoftDelete').length) {
                    $('#ckCheckAllSoftDelete').prop('checked', true);
                } else {
                    $('#ckCheckAllSoftDelete').prop('checked', false);
                }
                if ($('.ckDelete:checked').length == $('#tbl-function tbody tr .ckDelete').length) {
                    $('#ckCheckAllDelete').prop('checked', true);
                } else {
                    $('#ckCheckAllDelete').prop('checked', false);
                }
                aspnetcore.stopLoading();
            },
            error: function (status) {
                console.log(status);
            }
        });
    }

    function resetFormMaintainance() {
        $('#hidId').val('');
        $('#txtName').val('');
        $('#txtDescription').val('');
    }

    function loadData(isPageChanged) {
        $.ajax({
            type: "GET",
            url: "/Admin/Role/GetAllPaging",
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
                            Description: item.Description
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
};            


