var roleController = function () {
    this.initialize = function () {
        loadData();
        registerEvents();
        clearSelectedCheckboxes();
    }

    function registerEvents() {        
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
        $('#mastercheckbox').on('click', function () {
            //$('#mastercheckbox').click(function () {
            $('.checkboxGroups').prop('checked', $(this).prop('checked'));
            //$('.checkboxGroups').prop('checked', $(this).is(':checked')).change();
        });         
           
        $('body').on('click', '.recover-soft-deleted', function (e) {
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
            aspnetcore.confirm('Bạn có chắc chắn muốn phục hồi nhiều?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Role/MultiRecoverAsync",
                    data: postData,
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Phục hồi nhiều thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Phục hồi nhiều không thành công', 'error');
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
                aspnetcore.confirm('Bạn có chắc chắn muốn xoá nhiều vĩnh viễn?', function () {           
                $.ajax({                    
                    type: "POST",
                    url: "/Admin/Role/MultiDeleteAsync",
                    data: postData,
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá nhiều vĩnh viễn thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá nhiều vĩnh viễn không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });                
            });
        }); 
        $('body').on('click', '.btn-recover', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            aspnetcore.confirm('Bạn có chắc chắn muốn phục hồi?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Role/RecoverAsync",
                    data: { id: that },
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function (response) {
                        aspnetcore.notify('Phục hồi thành công', 'success');
                        aspnetcore.stopLoading();
                        clearSelectedCheckboxes();
                        loadData();
                    },
                    error: function (status) {
                        aspnetcore.notify('Phục hồi không thành công', 'error');
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
                    error: function (status) {
                        aspnetcore.notify('Xoá vĩnh viễn không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
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
            //var selectedIds = [];
            //clear selected checkboxes
            $('#mastercheckbox').prop('checked', false);
            $('.checkboxGroups').prop('checked', false);
            //selectedIds = [];
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

    function loadData(isPageChanged) {
        $.ajax({
            type: "GET",
            url: "/Admin/Role/GetAllSoftDeletePagingAsync",
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


