var productColorController = function () {
    var cachedObj = {
        products: [],
        productItems: [],
        productCategories: []        
    }
    this.initialize = function () {
        initialDdlProductCategoryAndDdlProduct();
        var ddlProductCategories = $('#ddlProductCategories');
        $.when(showProductCategories(ddlProductCategories))
            .done(function () {
                loadData();
            });
        
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
                ProductCategories: { required: true },
                Products: { required: true },
                Colors: { required: true },
                ColorImage: { required: true },               
                SortOrder: { required: true, number: true }
            }
        });

        
        $('#ProductCategories').on('change', function () {
            var ddlProducts = $('#Products');           
            ddlProducts.html('');           
                showProductsByProductCategory($('#ProductCategories').val(), ddlProducts); 
        });

        $('#Products').on('change', function () {
            var productId = $(this).val();
            setNewOrder(productId);
        });

        $('#ddlProductCategories').on('change', function () {
            var ddlProducts = $('#ddlProducts');
            var check = $(this).val();
            ddlProducts.html('');
            if (check != 0) 
            showProductsByProductCategory($('#ddlProductCategories').val(), ddlProducts);
        });

        $('#ddlProducts').on('change', function () {
            var productId = $(this).val();
            setNewOrder(productId);
        });

        //$('#Colors').on('change', function () { 
        //    var colorId = $(this).val();
        //    setProductColor(colorId);
        //});

        //$('#ddlProductCategories').on('change', function () {
        //    var ddlProducts = $('#ddlProducts');
        //    ddlProducts.html('');
        //    if ($(this).val() == '0') {
        //        ddlProducts.append($('<option></option>').val('00000000-0000-0000-0000-000000000000').html("Lọc theo nhóm sản phẩm"));
        //    }
        //    else {
        //        showProductsByProductCategory($('#ddlProductCategories').val(), ddlProducts);
        //    }
        //}); 

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
                    $('#ColorImage').val(path);
                    aspnetcore.notify('Up ảnh thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh bị lỗi', 'error');
                }
            });
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
            
            var ddlProductCategories = $("#ProductCategories");
            setProductCategoriesAndProducts(ddlProductCategories);
        });

        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $.ajax({
                type: "GET",
                url: "/Admin/ProductColor/GetById",
                data: { id: that },
                dataType: "json",
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidColorId').val(data.Id);

                    var ddlProductCategories = $('#ProductCategories');
                    var ddlProducts = $('#Products');
                    var ddlColors = $('#Colors');
                    var productCategoryId = data.ProductCategoryId;
                    var productId = data.ProductId;
                    var colorId = data.ColorId;

                    showProductCategories(ddlProductCategories, productCategoryId);
                    showProductsByProductCategory(productCategoryId, ddlProducts, productId);
                    showColors(ddlColors, colorId);
                  
                    $('#Url').val(data.Url);
                    $('#SortOrder').val(data.SortOrder);
                    $('#ColorImage').val(data.ColorImage);
                    $('#Status').prop('checked', data.Status === 1);
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
                    url: "/Admin/ProductColor/Delete",
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
                    url: "/Admin/ProductColor/MultiDelete",
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
                var id = $('#hidColorId').val();                                
                var productCategoryId = $('#ProductCategories').val();
                var productId = $('#Products').val();
                var colorId = $('#Colors').val();
                var colorImage = $('#ColorImage').val().trim();
                
                var sortOrder = $('#SortOrder').val();
                var status = $('#Status').prop('checked') === true ? 1 : 0;
                var url = $('#Url').val();
                $.ajax({
                    type: "POST",
                    url: "/Admin/ProductColor/SaveEntity",
                    data: {
                        Id: id,
                        ProductCategoryId: productCategoryId,
                        ProductId: productId,
                        ColorId: colorId,
                        ColorImage: colorImage,
                      
                        SortOrder: sortOrder,
                        Status: status,
                        Url: url
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


    function showProductCategories(ddlProductCategories, productCategoryId) {
        return $.ajax({
            type: "GET",
            url: "/Admin/ProductCategory/GetAll",
            dataType: "json",
            success: function (response) {
                cachedObj.productCategories = response;
                $.each(response, function (i, item) {
                    if (item.Id == productCategoryId) {
                        ddlProductCategories.append($('<option selected=\"selected\"></option>').val(item.Id).html(item.Name));
                    }
                    else {
                    ddlProductCategories.append($('<option></option>').val(item.Id).html(item.Name));
                    }
                });
            }
        });
    }



   

    function initialDdlProductCategoryAndDdlProduct() {
        $('#ddlProductCategories').append($('<option></option>').val('0').html("Danh mục sản phẩm"));
        $('#ddlProducts').append($('<option></option>').val('00000000-0000-0000-0000-000000000000').html("Sản phẩm"));  
        $('#ProductCategories').append($('<option></option>').val('0').html("Danh mục sản phẩm"));
        $('#Products').append($('<option></option>').val('00000000-0000-0000-0000-000000000000').html("Sản phẩm")); 
    }

    function setProductCategoriesAndProducts(ddlProductCategories) {
        ddlProductCategories.html('');
        var lstProductCategory = showProductCategories(ddlProductCategories);
        lstProductCategory.then(function () {
            var ddlProducts = $("#Products");
            ddlProducts.html('');
            showProductsByProductCategoryAndSetOrder($('#ProductCategories').val(), ddlProducts);
        });
    }

    function setNewOrder(productId) {        
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductColor/SetOrder",
            data: {
                productId
            },
            success: function (data) {
                $('#SortOrder').val(data.order);
            },
            error: function () {
                alert('Lỗi thiết lập thứ tự!');
            }
        });
    }

    function showProductsByProductCategoryAndSetOrder(productCategoryId, ddlProducts) {
        var lstProducts = showProductsByProductCategory(productCategoryId, ddlProducts);
        lstProducts.then(function () {
            var productId = $("#Products").val();
            setNewOrder(productId);
            var ddlColors = $('#Colors');
            ddlColors.html('');
            showColors(ddlColors);
        });
    }

    function showColors(ddlColors, colorId) {       
        return $.ajax({
            type: "POST",
            url: "/Admin/ProductColor/GetAllColors",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i, item) {
                    if (item.id == colorId) {
                        ddlColors.append($('<option selected=\"selected\"></option>').val(item.id).html(item.name));
                    }
                    else {
                        ddlColors.append($('<option></option>').val(item.id).html(item.name));
                    }
                });
            },
            error: function () {
                alert('Lỗi chọn ma`u!');
            }
        });
    }

    function setProductColor(colorId) {
        
        $.ajax({
            cache: false,
            type: "POST",
            url: "/Admin/ProductColor/SetColor",
            data: {
                colorId: colorId
            },
            success: function (data) {
                $('#hidColorId').val(data.id);
                $('#colorName').val(data.name);
                $('#Url').val(data.url);
            },
            error: function () {
                alert('Lỗi chọn màu!');
            }
        });
    }

    function showProductsByProductCategory(productCategoryId, ddlProducts, productId) {
        return $.ajax({
            //cache: false,
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductColor/GetProductsByProductCategoryId",
            //data: postData,
            data: {
                productCategoryId: productCategoryId
            },
            success: function (data) {
                $.each(data, function (index, option) {
                    if (option.id == productId) {
                        ddlProducts.append($('<option selected=\"selected\"></option>').val(option.id).html(option.name));
                    }
                    else {
                        ddlProducts.append($('<option></option>').val(option.id).html(option.name));
                        //str += '<option value="' + option.id + '">' + option.name + '</option>';
                    }
                });
                //ddlProducts.append(str);
            },
            error: function () {
                alert('Lỗi chọn sản phẩm!');
            }
        });
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
        $('#hidColorId').val('0');
        $('#ProductCategories').val('');
        $('#Products').val('');
        $('#Colors').val('');
        $('#ColorImage').val('');
        $('#txtName').val('');
        $('#txtEnglishName').val('');
        $('#txtCode').val('');
        $('#SortOrder').val('');
        $('#Status').prop('checked', true);
        $('#Url').val('');
    }

    function loadData(isPageChanged) {
        $.ajax({
            type: "POST",
            url: "/Admin/ProductColor/GetAllPaging",
            data: {
                productCategoryId: parseInt($('#ddlProductCategories').val()),
                productId: $('#ddlProducts').val(),
                //colorId: parseInt($('#ddlProductColors').val()),
                keyword: $('#txtSearch').val(),
                sortBy: $('#sortBy').val(),
                page: aspnetcore.configs.pageIndex,
                pageSize: aspnetcore.configs.pageSize,
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
                            ProductCategoryId: item.ProductCategoryId,
                            ProductCategoryName: item.ProductCategoryName,
                            ProductId: item.ProductId,
                            ProductName: item.ProductName,
                            ColorImage: item.ColorImage == null ? '<img src="/admin-side/images/user.png" width=25' : '<img src="' + item.ColorImage + '" width=30 />',
                            Url: item.Url,
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


