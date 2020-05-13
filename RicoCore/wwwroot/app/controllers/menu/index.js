var postCategoryController = function () {
    //var self = this;
    this.initialize = function () {
        loadData();
        registerEvents();
        //registerControls();
        clearSelectedCheckboxes();
    }

    function registerEvents() {
        //Init validation
        $('#frmMaintainance').valid({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                Name: { required: true },
                //txtCode: { required: true },
                txtUrl: { required: true },
                //ddlPostCategoryId: { required: true },              
                ckStatus: { required: true },
                txtSortOrder: {
                    required: true,
                    number: true
                },                     
                //txtRelCanonical: { required: true },

                //txtHomeOrder: { number: true }
                //txtPassword: {
                //    required: true,
                //    minlength: 6
                //},
                //txtConfirmPassword: {
                //    equalTo: "#txtPassword"
                //},
                //txtEmail: {
                //    required: true,
                //    email: true
                //}
            }
        });

        $('#frmMaintainanceSelectPostCategory').valid({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                ddlPostCategoryId: { required: true },
            }
        });

        $('#txt-search-keyword').keypress(function (e) {
            if (e.which === 13) {
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
            //initRoleList();        
            resetFormMaintainance(); 
            initTreeDropDownCategory();
                      
            $('#modal-select-post-category').modal('show');           
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

        $('#btnSavePostCategory').on('click', function (e) {
            if ($('#frmMaintainanceSelectPostCategory').valid()) {
                e.preventDefault();

                $('#modal-select-post-category').modal('hide');
                $('#modal-add-edit').modal('show');
                var parentId = $('#ddlPostCategoryId').combotree('getValue');

                //$('input[name=ddlParentPostCategory]').change(function () {
                //    parentId = $('#ddlParentPostCategory').val();
                //});               
                setValueToNewMenu(parentId);                   
            }
        });

        $('#btn-save').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                save();
            }
            //    //var that = $('#hidMenuId').val();
            //    //var id = parseInt($('#hidMenuId').val());

            //    //var id = $('#hidMenuId').val();
            //    var name = $('#txtName').val();
            //    //var code = $('#txtCode').val();

            //    var parentId = $('#parentPostCategoryId').val();

            //    var metaTitle = $('#txtMetaTitle').val();
            //    var metaDescription = $('#txtMetaDescription').val();
            //    var metaKeywords = $('#txtMetaKeywords').val();
            //    var image = $('#txtImage').val();
            //    var description = $('#txtDescription').val();
            //    //var description = CKEDITOR.instances.txtDescription.getData();
            //    var url = $('#txtUrl').val();
            //    //var relCanonical = $('#txtRelCanonical').val();                 
            //    var sortOrder = $('#txtSortOrder').val();

            //    var homeOrder = $('#txtHomeOrder').val();
            //    var hotOrder = $('#txtHotOrder').val();
            //    //if (homeOrder == "" || homeOrder == "0") {
            //    //    homeOrder = 100;
            //    //}                
            //    var status = $('#ckStatus').prop('checked') === true ? 1 : 0;
            //    var homeFlag = $('#ckShowHome').prop('checked') === true ? 1 : 0;
            //    var hotFlag = $('#ckShowHot').prop('checked') === true ? 1 : 0;

            //    $.ajax({
            //        type: "POST",
            //        url: "/Admin/PostCategory/SaveEntity",
            //        data: {
            //            //Id: that,
            //            //Id: id,
            //            Name: name,
            //            //Code: code,

            //            ParentId: parentId,
            //            MetaTitle: metaTitle,
            //            MetaDescription: metaDescription,
            //            MetaKeywords: metaKeywords,
            //            Image: image,
            //            Description: description,
            //            //RelCanonical: relCanonical,
            //            Url: url,
            //            SortOrder: sortOrder,
            //            HomeFlag: homeFlag,
            //            HomeOrder: homeOrder,
            //            HotFlag: hotFlag,
            //            HotOrder: hotOrder,
            //            Status: status
            //        },
            //        dataType: "json",
            //        beforeSend: function () {
            //            aspnetcore.startLoading();
            //        },
            //        success: function () {
            //            aspnetcore.notify('Cập nhật sản phẩm thành công', 'success');
            //            $('#modal-add-edit').modal('hide');
            //            resetFormMaintainance();
            //            aspnetcore.stopLoading();
            //            loadData(true);
            //        },
            //        error: function () {
            //            aspnetcore.notify('Cập nhật sản phẩm có lỗi xảy ra', 'error');
            //            aspnetcore.stopLoading();
            //        }
            //    });

            //    return false;
            //}
        });

        $('body').on('click', '#btn-edit', function (e) {
            e.preventDefault();
            //var that = $(this).data('id');
            var that = $('#hidMenuId').val();
            fillData(that);
        });

        $('body').on('click', '#btn-delete', function (e) {
            e.preventDefault();
            //var that = $(this).data('id');
            var that = $('#hidMenuId').val();
            aspnetcore.confirm('Bạn có chắc chắn muốn xoá?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/Menu/Delete",
                    data: { id: that },
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá thành công', 'success');
                        aspnetcore.stopLoading();
                        loadData();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            });
        });

        $('#btn-cancel').on('click', function () {
            resetFormMaintainance();
        });

        $('.close').on('click', function () {
            resetFormMaintainance();
        });

        $('#btn-save').keypress(function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                save();
            }
        });

    }

    function save() {
        //var that = $('#hidMenuId').val();
        //var id = parseInt($('#hidMenuId').val());        

        var id = $('#hidMenuId').val();
        var name = $('#txtName').val();       
        var parentId = $('#txtParentMenuId').val();                        
        var url = $('#txtUrl').val();
        //var relCanonical = $('#txtRelCanonical').val();                 
        var sortOrder = $('#txtSortOrder').val();
       
        //var order = $('#txtOrder').val();
        //if (homeOrder == "" || homeOrder == "0") {
        //    homeOrder = 100;
        //}                
        var status = $('#ckStatus').prop('checked') === true ? 1 : 0;
       

        $.ajax({
            type: "POST",
            url: "/Admin/Menu/SaveEntity",
            data: {
                //Id: that,
                Id: id,
                Name: name,               
                ParentId: parentId,               
              
                Url: url,
                SortOrder: sortOrder,
                  
                
                Status: status
            },
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function () {
                aspnetcore.notify('Cập nhật sản phẩm thành công', 'success');
                $('#modal-add-edit').modal('hide');
                resetFormMaintainance();
                aspnetcore.stopLoading();
                loadData(true);
            },
            error: function () {
                aspnetcore.notify('Cập nhật sản phẩm có lỗi xảy ra', 'error');
                aspnetcore.stopLoading();
            }
        });

        return false;
    }

    function disableFieldEdit(disabled) {
        $('#txtUserName').prop('disabled', disabled);
        $('#txtPassword').prop('disabled', disabled);
        $('#txtConfirmPassword').prop('disabled', disabled);
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

    function resetFormMaintainance() {
        //disableFieldEdit(false);
        $('#hidMenuId').val("0");    
        $('#txtParentMenuId').val("0");       
        $('#lblParentMenuName').text('');
        $('#txtName').val('');
        $('#txtUrl').val('');
              
        initTreeDropDownCategory('');
        //$('input[name="ckRoles"]').removeAttr('checked');
      
        $('#txtSortOrder').val('');              
        $('#ckStatus').prop('checked', true);
    }

    function registerControls() {
        var editorConfig = {
            filebrowserImageUploadUrl: '/Admin/Upload/UploadImageForCKEditor?type=Images'
        }
        CKEDITOR.replace('txtDescription', editorConfig);
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

    function fillData(that) {       
        $.ajax({
            type: "GET",
            url: "/Admin/Menu/GetById",
            data: {
                id: that
            },
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function (response) {
                var data = response;
                $('#hidMenuId').val(data.Id);
                $('#txtName').val(data.Name);               
                $('#txtParentMenuId').val(data.ParentId);        
                $('#lblParentMenuName').text(data.ParentPostCategoryName);                                
               
                $('#txtUrl').val(data.Url);
                //$('#txtRelCanonical').val(data.RelCanonical);
                $('#ckStatus').prop('checked', data.Status === 1);
              
                $('#txtSortOrder').val(data.SortOrder);
                            
                //$('#txtOrder').val(data.Order);
                //disableFieldEdit(true);
                $('#modal-add-edit').modal('show');
                aspnetcore.stopLoading();

            },
            error: function () {
                aspnetcore.notify('Có lỗi xảy ra', 'error');
                aspnetcore.stopLoading();
            }
        });      
    }

    function initTreeDropDownCategory(selectedId) {
        $.ajax({
            url: "/Admin/Menu/GetAll",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (response) {
                var data = [];
                $.each(response, function (i, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder                        
                    });
                });
                var arr = aspnetcore.unflattern(data);               
                $('#ddlPostCategoryId').combotree({
                    data: arr
                });
                if (selectedId != undefined) {
                    $('#ddlPostCategoryId').combotree('setValue', selectedId);
                }
            }
        });
    }

    function setValueToNewMenu(parentId) {
        $.ajax({
            url: "/Admin/Menu/PrepareSetNewMenu",
            type: 'POST',
            dataType: 'json',
            data: {
                parentId: parentId
            },
            success: function (response) {
                $('#txtParentMenuId').val(response.parentId);
                $('#txtSortOrder').val(response.sortOrder);
                $('#lblParentMenuName').text(response.parentName);                
                //$('#txtHomeOrder').val(response.homeOrder);
                //$('#txtHotOrder').val(response.hotOrder); 
                //$('#txtOrder').val(response.order);
            }
        });
    }   
    

    function loadData() {
        $.ajax({
            url: "/Admin/Menu/GetAll",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (response) {                
                var data = [];
                               
                $.each(response, function (i, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder
                    });
                });

                var arr = aspnetcore.unflattern(data);

                arr.sort(function (a, b) {
                    return a.sortOrder - b.sortOrder;
                });

                $('#treePostCategory').tree({
                    data: arr,
                    dnd: true,
                    onDblClick: function (node) {
                        fillData(node.id);
                    },
                    onContextMenu: function (e, node) {
                        e.preventDefault();
                        // select the node
                        //$('#tt').tree('select', node.target);
                        $('#hidMenuId').val(node.id);
                        // display context menu
                        $('#contextMenu').menu('show', {
                            left: e.pageX,
                            top: e.pageY
                        });
                    },
                    onDrop: function (target, source, point) {
                        console.log(target);
                        console.log(source);
                        console.log(point);
                        var targetNode = $(this).tree('getNode', target);
                        if (point === 'append') {
                            var children = [];
                            $.each(targetNode.children, function (i, item) {
                                children.push({
                                    key: item.id,
                                    value: i
                                });
                            });

                            $.ajax({
                                url: '/Admin/Menu/UpdateParentId',
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    sourceId: source.id,
                                    targetId: targetNode.id,
                                    items: children
                                },
                                success: function () {
                                    loadData();
                                }
                            });
                        }
                        else if (point === 'top' || point === 'bottom') {
                            $.ajax({
                                url: '/Admin/Menu/ReOrder',
                                type: 'post',
                                dataType: 'json',
                                data: {
                                    sourceId: source.id,
                                    targetId: targetNode.id
                                },
                                success: function () {
                                    loadData();
                                }
                            });
                        }
                    }
                });
            }
        });
    }

        //function loadData(isPageChanged) {
        //    $.ajax({
        //        url: "/Admin/ProductCategory/GetAllPaging",
        //        type: 'GET',
        //        dataType: 'json',
        //        //async: false,
        //        data: {
        //            keyword: $('#txt-search-keyword').val(),
        //            page: aspnetcore.configs.pageIndex,
        //            pageSize: aspnetcore.configs.pageSize
        //        },
        //        beforeSend: function () {
        //            aspnetcore.startLoading();
        //        },
        //        success: function (response) {
        //            //var data = [];
        //            var template = $('#table-template').html();
        //            var render = "";
        //            if (response.RowCount > 0) {
        //                //$.each(response, function (i, item) {
        //                //    data.push({
        //                //        id: item.Id,
        //                //        text: item.Name,
        //                //        parentId: item.ParentId,
        //                //        sortOrder: item.SortOrder
        //                //    });
        //                //    });
        //                $.each(response.Results, function (i, item) {
        //                    render += Mustache.render(template, {
        //                        Id: item.Id,
        //                        Name: item.Name,
        //                        Code: item.Code,
        //                        //parentId: item.ParentId,
        //                        //pageTitle: item.PageTitle,
        //                        //metaDescription: item.MetaDescription,
        //                        //metaKeywords: item.MetaKeywords,
        //                        //image: item.Image,
        //                        //description: item.Description,
        //                        //relCanonical: item.RelCanonical,
        //                        SortOrder: item.SortOrder,
        //                        //homeFlag: item.HomeFlag,
        //                        //homeOrder: item.HomeOrder,
        //                        Status: item.Status                            
        //                    });
        //                });
        //                $("#lbl-total-records").text(response.RowCount);
        //                if (render != undefined) {
        //                    $('#tbl-content').html(render);

        //                }
        //                wrapPaging(response.RowCount, function () {
        //                    loadData();
        //                }, isPageChanged);
        //            }
        //            else {
        //                $('#tbl-content').html('');
        //            }
        //            aspnetcore.stopLoading();

        //            //var arr = aspnetcore.unflattern(data);

        //            //arr.sort(function (a, b) {
        //            //    return a.sortOrder - b.sortOrder;
        //            //});

        //            //$('#treeProductCategory').tree({
        //            //    data: arr,
        //            //    dnd: true,
        //            //    onDblClick: function (node) {
        //            //        fillData(node.id);
        //            //    },
        //            //    onContextMenu: function (e, node) {
        //            //        e.preventDefault();
        //            //        // select the node
        //            //        $('#tt').tree('select', node.target);
        //            //        $('#hideId').val(node.id);
        //            //        // display context menu
        //            //        $('#mm').menu('show', {
        //            //            left: e.pageX,
        //            //            top: e.pageY
        //            //        });
        //            //    },

        //            //    onDrop: function (target, source, point) {
        //            //        var targetNode = $(this).tree('getNode', target);
        //            //        if (point === 'append') {
        //            //            var children = [];
        //            //            $.each(targetNode.children, function (i, item) {
        //            //                children.push({
        //            //                    key: item.id,
        //            //                    value: i
        //            //                });
        //            //            });

        //            //            $.ajax({
        //            //                url: '/Admin/ProductCategory/UpdateParentId',
        //            //                type: 'post',
        //            //                dataType: 'json',
        //            //                data: {
        //            //                    sourceId: source.id,
        //            //                    targetId: targetNode.id,
        //            //                    items: children
        //            //                },
        //            //                success: function () {
        //            //                    loadData();
        //            //                }
        //            //            });
        //            //        }
        //            //        else if (point === 'top' || point === 'bottom') {
        //            //            $.ajax({
        //            //                url: '/Admin/ProductCategory/ReOrder',
        //            //                type: 'post',
        //            //                dataType: 'json',
        //            //                data: {
        //            //                    sourceId: source.id,
        //            //                    targetId: targetNode.id
        //            //                },
        //            //                success: function () {
        //            //                    loadData();
        //            //                }
        //            //            });
        //            //        }
        //            //    }

        //            //});

        //            //
        //        },
        //        error: function (status) {
        //            console.log(status);
        //            //aspnetcore.notify('Cannot loading data', 'error');
        //        }
        //    });

        //};

        //function wrapPaging(recordCount, callBack, changePageSize) {
        //    var totalsize = Math.ceil(recordCount / aspnetcore.configs.pageSize);
        //    //Unbind pagination if it existed or click change pagesize
        //    if ($('#paginationUL a').length === 0 || changePageSize === true) {
        //        $('#paginationUL').empty();
        //        $('#paginationUL').removeData("twbs-pagination");
        //        $('#paginationUL').unbind("page");
        //    }
        //    //Bind Pagination Event
        //    $('#paginationUL').twbsPagination({
        //        totalPages: totalsize,
        //        visiblePages: 7,
        //        first: 'Đầu',
        //        prev: 'Trước',
        //        next: 'Tiếp',
        //        last: 'Cuối',
        //        onPageClick: function (event, p) {
        //            aspnetcore.configs.pageIndex = p;
        //            setTimeout(callBack(), 200);
        //        }
        //    });
        //}
}