var productItemController = function () {
    var cachedObj = {
        products: [],
        productItems: [],
        productCategories: [],
        billStatuses: []
    }
    this.initialize = function () {
        
        initialDdlProductCategoryAndDdlProduct();
        var ddlProductCategories = $('#ddlProductCategories');
        $.when(showProductCategories(ddlProductCategories))
            .done(function () {
                loadData();
            });

        //$.when(initTreeDropDownCategory()).then(function () {
        //    loadData();
        //clickCreateProductItemBtn();

        registerEvents();
        registerControls();       
        clearSelectedCheckboxes();
    }


    //function clickCreateProductItemBtn() {
    //    $(document).on('click', '#btnAddProductItem', function (e) {
    //        var $this = $(e.currentTarget);
    //        if (!$this.is("#btnAddProductItem")) {
    //            return;
    //        }
    //        $('#addProductItemModal').load('/admin/productitem/create',
    //            function () {
    //                $.validator.unobtrusive.parse($('#addProductItemModal form'));
    //                $('#addProductItemModal').modal({ show: true });
    //            });
    //    });
    //}

    function registerEvents() {
        //Init validation        

        $('#frm-add-or-update').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                ProductCategoryId: { required: true },
                ProductId: { required: true },
                ProductColorId: { required: true },
                Name: { required: true },         
                Image1: { required: true },
                Image1Alt: { required: true },
                Image2: { required: true },
                Image2Alt: { required: true },
                txtPrice: { required: true },
                txtOriginalPrice: { required: true },
                //Link: { required: true },
                txtMetaTitle: { required: true },
                //txtMetaKeywords: { required: true },
                txtMetaDescription: { required: true },
                SortOrder: { required: true }
            },
            messages: {
                ProductCategoryId: "Phải chọn danh mục sản phẩm",
                ProductId: "Phải chọn nhóm sản phẩm",
                //ColorImage: "Phải upload ảnh màu",
                //ColorName: "Phải điền tên màu",
                ProductColorId: "Phải chọn màu",
                //ColorCode: "Phải điền mã màu",
                Name: "Phải điền tên sản phẩm",
                Image1: "Phải upload ảnh 1",
                Image1Alt: "Phải điền thuộc tính Alt của ảnh 1",
                Image2: "Phải upload ảnh 2",
                Image2Alt: "Phải điền thuộc tính Alt của ảnh 2",
                txtPrice: "Phải điền giá bán sản phẩm",
                txtOriginalPrice: "Phải điền giá gốc sản phẩm",
                //Link: "Phải điền link",
                //LinkTitle: "Phải điền thuộc tính Tiêu đề của link ảnh",
                txtMetaTitle: "Phải điền Meta Title",
                //txtMetaKeywords: "Phải điền Meta Keywords",
                txtMetaDescription: "Phải điền Meta Description",
                SortOrder: "Phải điền thứ tự"
            }
        });


        $('#txtSearch').keypress(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                loadData();
            }
        });

        $("#btn-search").on('click', function () {
            loadData();
        });         

            $('#ProductCategoryId').on('change', function () {
                var ddlProducts = $('#ProductId');
                ddlProducts.html('');               
                var listProducts = showProductsByProductCategory($('#ProductCategoryId').val(), ddlProducts);
                listProducts.then(function () {
                    var ddlProductColors = $('#ddlProductColors');
                    ddlProductColors.html('');
                    showProductColorsByProduct(ddlProducts.val(), ddlProductColors);
                });
            });

            $('#ProductId').on('change', function () {
                var ddlProductColors = $('#ProductColorId');
                ddlProductColors.html('');                
                showProductColorsByProduct($(this).val(), ddlProductColors);
                if ($('#Status').prop('checked') == true) {
                    setNewOrder();
                }
                else {
                    $('#SortOrder').val(0);
                }
            });


            $('#ProductColorId').on('change', function () {
                //getColorCode();
            });

            $('#ddlProductCategories').on('change', function () {
                var ddlProducts = $('#ddlProducts');
                ddlProducts.html('');
                if ($(this).val() == '0') {
                    ddlProducts.append($('<option></option>').val('00000000-0000-0000-0000-000000000000').html("Lọc theo sản phẩm"));
                }
                else {
                    //var ddlProductColors = $('#ddlProductColors');
                    //showProductsByProductCategoryAndSetOrder($('#ddlProductCategories').val(), ddlProducts, ddlProductColors);
                    var listProducts = showProductsByProductCategory($('#ddlProductCategories').val(), ddlProducts);
                    listProducts.then(function () {                        
                        var ddlProductColors = $('#ddlProductColors');
                        ddlProductColors.html('');                     
                        showProductColorsByProduct(ddlProducts.val(), ddlProductColors);
                    });

                }
        });

        $('#ddlProducts').on('change', function () {
            var ddlProductColors = $('#ddlProductColors');
            ddlProductColors.html('');
            if ($(this).val() == '0') {
                ddlProducts.append($('<option></option>').val('00000000-0000-0000-0000-000000000000').html("Lọc theo nhóm sản phẩm"));
            }
            else {  
                showProductColorsByProduct($(this).val(), ddlProductColors);
            }
        });

        $("#SortBy").on('change', function () {            
            loadData(true);
        });        

        $("#ddl-show-page").on('change', function () {
            aspnetcore.configs.pageSize = $(this).val();
            aspnetcore.configs.pageIndex = 1;
            loadData(true);
        });        

        $('#btnAddProductItem').on('click', function () {
            resetFormMaintainance();
            $('#addProductItemModal').modal('show');
            var ddlProductCategories = $("#ProductCategoryId");
            setProductCategoriesAndProducts(ddlProductCategories);            
            //showColors();
        });

        $('#btnSaveProductItem').on('click', function (e) {
            if ($('#frm-add-or-update').valid()) {
                e.preventDefault();
                saveProductItem();
            }
        });

        $('#Status').change(function () {
            if (this.checked) {
                if ($('#hidSortOrder').val() == 0) {                   
                    setNewOrder();
                }
                else {
                    var order = $('#hidSortOrder').val();
                    $('#SortOrder').val(order);
                }
            }
            else {
                $('#SortOrder').val(0);
            }

        });
        $('#ckShowHot').change(function () {
            if (this.checked) {
                if ($('#hidHotOrder').val() == 0) {
                    setNewHotOrder();
                }
                else {
                    var hotOrder = $('#hidHotOrder').val();
                    $('#txtHotOrder').val(hotOrder);
                }                
            }
            else {
                $('#txtHotOrder').val(0);
            }
        });

        $('#ckShowHome').change(function () {
            if (this.checked) {
                if ($('#hidHomeOrder').val() == 0) {
                    setNewHomeOrder();
                }
                else {
                    var homeOrder = $('#hidHomeOrder').val();
                    $('#txtHomeOrder').val(homeOrder);
                }
            }
            else {
                $('#txtHomeOrder').val(0);
            }
        });


        $('body').on('click', '.btn-edit', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            //var that = $('#hidId').val();
            fillData(that);
        });

        $('body').on('click', '.btn-delete', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            //var that = $('#hidId').val();
            aspnetcore.confirm('Bạn có chắc chắn muốn xoá?', function () {
                $.ajax({
                    type: "POST",
                    url: "/Admin/ProductItem/Delete",
                    data: { id: that },
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Xoá thành công', 'success');
                        aspnetcore.stopLoading();
                        loadData();
                        resetFormMaintainance();
                    },
                    error: function () {
                        aspnetcore.notify('Xoá không thành công', 'error');
                        aspnetcore.stopLoading();
                    }
                });
            });
        });

        $('#btnSelectImgProductItem').on('click', function () {
            $('#fileInputImageProductItem').click();
        });

        $("#fileInputImageProductItem").on('change', function () {
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
                    aspnetcore.notify('Up ảnh màu thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh màu bị lỗi', 'error');
                }
            });
        });


        $('#btnSelectImgProductItem1').on('click', function () {
            $('#fileInputImageProductItem1').click();
        });

        $("#fileInputImageProductItem1").on('change', function () {
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
                    $('#Image1').val(path);
                    aspnetcore.notify('Up ảnh 1 thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh 1 bị lỗi', 'error');
                }
            });
        });

        $('#btnSelectImgProductItem2').on('click', function () {
            $('#fileInputImageProductItem2').click();
        });

        $("#fileInputImageProductItem2").on('change', function () {
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
                    $('#Image2').val(path);
                    aspnetcore.notify('Up ảnh 2 thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh 2 bị lỗi', 'error');
                }
            });
        });

        $('#btnSelectImgProductItem3').on('click', function () {
            $('#fileInputImageProductItem3').click();
        });

        $("#fileInputImageProductItem3").on('change', function () {
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
                    $('#Image3').val(path);
                    aspnetcore.notify('Up ảnh 3 thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh 3 bị lỗi', 'error');
                }
            });
        });

        $('#btnSelectImgProductItem4').on('click', function () {
            $('#fileInputImageProductItem4').click();
        });

        $("#fileInputImageProductItem4").on('change', function () {
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
                    $('#Image4').val(path);
                    aspnetcore.notify('Up ảnh 4 thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh 4 bị lỗi', 'error');
                }
            });
        });

        $('#btnSelectImgProductItem5').on('click', function () {
            $('#fileInputImageProductItem5').click();
        });

        $("#fileInputImageProductItem5").on('change', function () {
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
                    $('#Image5').val(path);
                    aspnetcore.notify('Up ảnh 5 thành công', 'success');
                },
                error: function () {
                    aspnetcore.notify('Up ảnh 5 bị lỗi', 'error');
                }
            });
        });


        $('#btn-cancel').on('click', function () {
            resetFormMaintainance();
        });

        $('.btn-cancel').on('click', function () {
            resetFormMaintainance();
        });

        $('#btn-import').on('click', function () {
            initTreeDropDownCategory();
            $('#modal-import-excel').modal('show');
        });

        $('#btnImportExcel').on('click', function () {
            var fileUpload = $("#fileInputExcel").get(0);
            var files = fileUpload.files;

            // Create FormData object  
            var fileData = new FormData();
            // Looping over all files and add it to FormData object  
            for (var i = 0; i < files.length; i++) {
                fileData.append("files", files[i]);
            }
            // Adding one more key to FormData object  
            fileData.append('categoryId', $('#ddlCategoryImportExcel').combotree('getValue'));
            $.ajax({
                url: '/Admin/Product/ImportExcel',
                type: 'POST',
                data: fileData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success: function (data) {
                    $('#modal-import-excel').modal('hide');
                    loadData();

                }
            });
            return false;
        });

        $('#btn-export').on('click', function () {
            $.ajax({
                type: "POST",
                url: "/Admin/Product/ExportExcel",
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    window.location.href = response;
                    aspnetcore.stopLoading();
                },
                error: function () {
                    aspnetcore.notify('Has an error in progress', 'error');
                    aspnetcore.stopLoading();
                }
            });
        });

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

            $.each($('input[type=checkbox][id!=mastercheckbox][id!=Status]'), function (i, item) {
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
                    url: "/Admin/ProductItem/MultiDelete",
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
    };

   
    function initialDdlProductCategoryAndDdlProduct() {
       $('#ddlProductCategories').append($('<option></option>').val('0').html("Lọc theo danh mục sản phẩm"));
       $('#ddlProducts').append($('<option></option>').val('00000000-0000-0000-0000-000000000000').html("Lọc theo nhóm sản phẩm"));       
    }

    function updateMasterCheckbox() {
        var numChkBoxes = $('#tbl-content input[type=checkbox][id!=mastercheckbox][id!=Status]').length;
        var numChkBoxesChecked = $('#tbl-content input[type=checkbox][id!=mastercheckbox][id!=Status]:checked').length;
        $('#mastercheckbox').prop('checked', numChkBoxes == numChkBoxesChecked && numChkBoxes > 0);
    }

    function setProductCategoriesAndProducts(ddlProductCategories) {        
        ddlProductCategories.html('');
        var lstProductCategory = showProductCategories(ddlProductCategories);
        lstProductCategory.then(function () {    
            var ddlProducts = $("#ProductId");
            var ddlProductColors = $('#ProductColorId');
            showProductsByProductCategoryAndSetOrder($('#ProductCategoryId').val(), ddlProducts, ddlProductColors);
        });       
    }

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

    function showProductColorsByProduct(productId, ddlProductColors, productColorId) {
        return $.ajax({
            //cache: false,
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductItem/GetProductColorsByProductId",
            //data: postData,
            data: {
                productId: productId
            },
            success: function (data) {
                $.each(data, function (index, option) {
                    if (option.id == productColorId) {
                        ddlProductColors.append($('<option selected=\"selected\"></option>').val(option.id).html(option.name));
                    }
                    else {
                        ddlProductColors.append($('<option></option>').val(option.id).html(option.name));
                    //str += '<option value="' + option.id + '">' + option.name + '</option>';
                    }
                   
                });
                //ddlProducts.append(str);
            },
            error: function () {
                alert('Lỗi chọn màu sản phẩm!');
            }
        });
    }


    function showProductsByProductCategory(productCategoryId, ddlProducts, productId) {                
        return $.ajax({
            //cache: false,
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductItem/GetProductsByProductCategoryId",
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

    function setNewOrder() {
        var productId = $("#ProductId").val();
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductItem/SetNewOrder",
            data: {
                productId
            },
            success: function (data) {
                $('#SortOrder').val(data.order);
                $('#hidSortOrder').val(data.order);
            },
            error: function () {
                alert('Lỗi thiết lập thứ tự!');
            }
        });
    }

    function setNewHotOrder() {        
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductItem/SetNewHotOrder",          
            success: function (data) {
                $('#txtHotOrder').val(data.hotOrder);
            },
            error: function () {
                alert('Lỗi thiết lập thứ tự HOT!');
            }
        });
    }

    function setNewHomeOrder() {
        $.ajax({
            type: "POST",
            dataType: 'json',
            url: "/Admin/ProductItem/SetNewHomeOrder",
            success: function (data) {
                $('#txtHomeOrder').val(data.homeOrder);
            },
            error: function () {
                alert('Lỗi thiết lập thứ tự trang chủ!');
            }
        });
    }

    function showProductsByProductCategoryAndSetOrder(productCategoryId, ddlProducts, ddlProductColors) {        
        var lstProducts = showProductsByProductCategory(productCategoryId, ddlProducts);
        lstProducts.then(function () {
            setNewOrder();
            var productId = ddlProducts.val();            
            showProductColorsByProduct(productId, ddlProductColors);
        });
    }

    function showColors(ddlProductColors, colorId) {
        return $.ajax({
            type: "POST",
            url: "/Admin/ProductColor/GetAllColors",
            dataType: "json",
            success: function (response) {
                $.each(response, function (i, item) {
                    if (item.id == colorId) {
                        ddlProductColors.append($('<option selected=\"selected\"></option>').val(item.id).html(item.name));
                    }
                    else {
                        ddlProductColors.append($('<option></option>').val(item.id).html(item.name));
                    }
                });
            },
            error: function () {
                alert('Lỗi chọn ma`u!');
            }
        });
    }

    function getColorCode() {
        var colorData = {
            colorId: $('#ColorId').val()
        };
        $.ajax({
            cache: false,
            type: "POST",
            url: "/Admin/ProductItem/GetColorCode",
            data: colorData,
            success: function (data) {
                $('#DisplayColor').css('background-color', data.colorCode);
                $('#ColorCode').val(data.colorCode);
            },
            error: function () {
                alert('Lỗi chọn màu!');
            }
        });
    }

    function saveProductItem() {        
        var hidId = $('#hidProductItemId').val();
        var id = parseInt(hidId);
        var code = $('#Code').val();
        var name = $('#Name').val().trim();
        var metaTitle = $('#txtMetaTitle').val().trim();
        var metaDescription = $('#txtMetaDescription').val().trim();
        var metaKeywords = $('#txtMetaKeywords').val().trim();
        //var link = $('#Link').val();
        var content = CKEDITOR.instances.Content.getData();
        var productCategoryId = $('#ProductCategoryId').val();
        var productId = $('#ProductId').val();
        var productColorId = $('#ProductColorId').val();
        var price = $('#txtPrice').val();
        var promotionPrice = $('#txtPromotionPrice').val();
        var originalPrice = $('#txtOriginalPrice').val();
        var specialPrice = $('#txtSpecialPrice').val();
        var url = $('#Url').val();

        //var colorId = $('#ColorId').val();
        //var colorCode = $('#ColorCode').val();
        //var colorImage = $('#ColorImage').val().trim();
        //var colorName = $('#ColorName').val().trim();
        //var colorEnglishName = $('#ColorEnglishName').val().trim();

        var image1 = $('#Image1').val().trim();
        var image1Alt = $('#Image1Alt').val().trim();
        var image2 = $('#Image2').val().trim();
        var image2Alt = $('#Image2Alt').val().trim();
        var image3 = $('#Image3').val().trim();
        var image3Alt = $('#Image3Alt').val().trim();
        var image4 = $('#Image4').val().trim();
        var image4Alt = $('#Image4Alt').val().trim();
        var image5 = $('#Image5').val().trim();
        var image5Alt = $('#Image5Alt').val().trim();
        
        var quantity = $('#Quantity').val();
        //var linkTitle = $('#LinkTitle').val();
        var sortOrder = $('#SortOrder').val();      
        var status = $('#Status').prop('checked') === true ? 1 : 0;
        var isGood = $('#IsGood').prop('checked') === true ? 1 : 0;
        var homeOrder = $('#txtHomeOrder').val();
        var hotOrder = $('#txtHotOrder').val();
        $('#hidHotOrder').val(hotOrder);
        $('#hidHomeOrder').val(homeOrder);
        $('#hidSortOrder').val(sortOrder);
        var homeFlag = $('#ckShowHome').prop('checked') === true ? 1 : 0;
        var hotFlag = $('#ckShowHot').prop('checked') === true ? 1 : 0;
        $.ajax({
            type: "POST",
            url: "/Admin/ProductItem/SaveEntity",
            data: {
                Id: id,
                Code: code,
                Name: name,
                Content: content,
                ProductCategoryId: productCategoryId,
                ProductId: productId,
                ProductColorId: productColorId,
                //ColorImage: colorImage,
                //ColorName: colorName,
                //ColorEnglishName: colorEnglishName,
                //ColorId: colorId,
                //ColorCode: colorCode,
                Image1: image1,
                Image1Alt: image1Alt,
                Image2: image2,
                Image2Alt: image2Alt,
                Image3: image3,
                Image3Alt: image3Alt,
                Image4: image4,
                Image4Alt: image4Alt,
                Image5: image5,
                Image5Alt: image5Alt,
                //Link: link,
                //LinkTitle: linkTitle,
                MetaTitle: metaTitle,
                MetaDescription: metaDescription,
                MetaKeywords: metaKeywords,
                SortOrder: sortOrder,
                Status: status,
                Price: price,
                PromotionPrice: promotionPrice,
                OriginalPrice: originalPrice,
                SpecialPrice: specialPrice,
                HomeFlag: homeFlag,
                HomeOrder: homeOrder,
                HotFlag: hotFlag,
                HotOrder: hotOrder,
                IsGood: isGood,
                Url: url,
                Quantity: quantity
            },
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function () {
                aspnetcore.notify('Thêm mới/cập nhật thành công', 'success');
                $('#addProductItemModal').modal('hide');
                resetFormMaintainance();
                aspnetcore.stopLoading();
                loadData(true);
            },
            error: function () {
                aspnetcore.notify('Tên sản phẩm/tên màu hoặc thứ tự đã tồn tại', 'error');
                aspnetcore.stopLoading();
            }
        });

        return false;
    }    

    function saveProductItemAjax() {
        //var that = $('#hidId').val();
        //var id = parseInt($('#hidId').val());

        var id = $('#hidIdProductItem').val();
      
        var image = $('#txtImage').val();
                        
        var sortOrder = $('#txtSortOrder').val();
       
        var status = $('#ckStatus').prop('checked') === true ? 1 : 0;       

        $.ajax({
            type: "POST",
            url: "/Admin/ProductItem/SaveEntity",
            data: {
                oldTags: oldTags,
                Id: id,
                Name: name,
                Code: code,
               
                Image: image,
              
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
        $('#hidProductItemId').val('0');   
        //$('#ProductCategoryId').val('0');
        //$('#ProductId').val("00000000-0000-0000-0000-000000000000");       
        //$('#ColorId').val('0');
        $('#ProductCategoryId').html('');
        $('#ProductId').html('');
        $('#ProductColorId').html('');
        $('#Code').val('');
        $('#Name').val(''); 
        //$('#ColorName').val('');
        //$('#ColorImage').val('');
        //$('#ColorEnglishName').val('');
        //$('#ColorId').html('');       
        //$('#ColorCode').val('');
        $('#Image1').val('');
        $('#Image1Alt').val('');
        $('#Image2').val('');
        $('#Image2Alt').val('');
        $('#Image3').val('');
        $('#Image3Alt').val('');
        $('#Image4').val('');
        $('#Image4Alt').val('');
        $('#Image5').val('');
        $('#Image5Alt').val('');
        $('#Url').val('');
        $('#txtMetaTitle').val('');
        $('#txtMetaDescription').val('');
        $('#txtMetaKeywords').val('');
        //$('#LinkTitle').val('');
        $('#SortOrder').val(0);
        $('#hidSortOrder').val(0);
        $('#Status').prop('checked', true);
        CKEDITOR.instances.Content.setData('');
        $('#IsGood').prop('checked', false);
        $('#ckShowHome').prop('checked', false);
        $('#txtHomeOrder').val(0);
        $('#hidHomeOrder').val(0);
        $('#ckShowHot').prop('checked', false);
        $('#txtHotOrder').val(0);
        $('#hidHotOrder').val(0);
        $('#txtPrice').val('0');
        $('#txtPromotionPrice').val('0');
        $('#txtOriginalPrice').val('0');
        $('#txtSpecialPrice').val('0');
        $('#Quantity').val(0);
    }

    function registerControls() {
        var editorConfig = {
            filebrowserImageUploadUrl: '/Admin/Upload/UploadImageForCKEditor?type=Images'
        }
        //CKEDITOR.replace('txtDescription', editorConfig);
        CKEDITOR.replace('Content', editorConfig);
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

    function getProductCategory(productCategoryId) {
        $('#ProductCategoryId').html('');
        var ddlProductCategories = $('#ProductCategoryId');
        $.ajax({
            type: "GET",
            url: "/Admin/ProductCategory/GetById",
            data: {
                id: productCategoryId
            },
            dataType: "json",
            success: function (response) {
                ddlProductCategories.append($('<option></option>').val(response.Id).html(response.Name));
            }
        });
    }

    function getProduct(productId) {
        $('#ProductId').html('');
        var ddlProducts = $('#ProductId');
        $.ajax({
            type: "GET",
            url: "/Admin/Product/GetById",
            data: {
                id: productId
            },
            dataType: "json",
            success: function (response) {
                ddlProducts.append($('<option></option>').val(response.Id).html(response.Name));
            }
        });
    }

function fillData(that) { 
        
        $.ajax({
            type: "GET",
            url: "/Admin/ProductItem/GetById",
            data: {
                id: that
            },
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function (response) {
                var data = response;
                $('#hidProductItemId').val(data.Id);
                $('#Code').val(data.Code);
                $('#Code').prop('readonly', true);

                var ddlProductCategories = $('#ProductCategoryId');
                var ddlProducts = $('#ProductId');
                var ddlProductColors = $('#ProductColorId');
                var productCategoryId = data.ProductCategoryId;
                var productId = data.ProductId;
                var productColorId = data.ProductColorId;

                showProductCategories(ddlProductCategories, productCategoryId);
                showProductsByProductCategory(productCategoryId, ddlProducts, productId);
                //showColors(ddlProductColors, productColorId);
                showProductColorsByProduct(productId, ddlProductColors, productColorId);

                //var productCategoryId = data.ProductCategoryId;                               
                //getProductCategory(productCategoryId);               

                //var productId = data.ProductId;
                //getProduct(productId);

                //var colorVal = data.ColorId.toString();
                //$('#ColorId').val(colorVal);                               
                //showColors(colorVal);  
                //$('#ColorCode').val(data.ColorCode);
                //if (!data.ColorImage)
                //    $('#ColorImage').val('')
                //    else
                //    $('#ColorImage').val(data.ColorImage.trim());

                //if(!data.ColorName)
                //    $('#ColorName').val('')
                //else
                //    $('#ColorName').val(data.ColorName.trim());

                //if(!data.ColorEnglishName)
                //    $('#ColorEnglishName').val('')
                //else
                //    $('#ColorEnglishName').val(data.ColorEnglishName.trim());

                if(!data.Name)
                    $('#Name').val('')
                else
                    $('#Name').val(data.Name.trim());

                if(!data.Image1)
                    $('#Image1').val('')
                else
                    $('#Image1').val(data.Image1.trim());

                if(!data.Image1Alt)
                    $('#Image1Alt').val('')                
                else
                    $('#Image1Alt').val(data.Image1Alt.trim());

                if(!data.Image2)
                    $('#Image2').val('')
                else
                    $('#Image2').val(data.Image2.trim());

                if(!data.Image2Alt)
                    $('#Image2Alt').val('')
                else
                    $('#Image2Alt').val(data.Image2Alt.trim());

                if(!data.Image3)
                    $('#Image3').val('')
                else
                    $('#Image3').val(data.Image3.trim());

                if(!data.Image3Alt)
                    $('#Image3Alt').val('')
                else
                    $('#Image3Alt').val(data.Image3Alt.trim());

                if(!data.Image4)
                    $('#Image4').val('')
                else
                    $('#Image4').val(data.Image4.trim());

                if(!data.Image4Alt)
                    $('#Image4Alt').val('')
                else
                    $('#Image4Alt').val(data.Image4Alt.trim());

                if(!data.Image5)
                    $('#Image5').val('')
                else
                    $('#Image5').val(data.Image5.trim());

                if(!data.Image5Alt)
                    $('#Image5Alt').val('')
                else
                    $('#Image5Alt').val(data.Image5Alt.trim());

                if (!data.Url)
                    $('#Url').val('');
                else
                    $('#Url').val(data.Url.trim());                                               

                if (!data.MetaKeywords)
                    $('#txtMetaKeywords').val('');
                    else
                    $('#txtMetaKeywords').val(data.MetaKeywords.trim());

                if (!data.MetaDescription)
                    $('#txtMetaDescription').val('');
                    else
                    $('#txtMetaDescription').val(data.MetaDescription.trim());

                if (!data.MetaTitle)
                    $('#txtMetaDescription').val('');
                    else
                    $('#txtMetaTitle').val(data.MetaTitle.trim());

                //$('#LinkTitle').val(data.LinkTitle);
                $('#Quantity').val(data.Quantity);
                $('#SortOrder').val(data.SortOrder);
                $('#Status').prop('checked', data.Status === 1);                 
                $('#IsGood').prop('checked', data.IsGood === 1);
                $('#ckShowHome').prop('checked', data.HomeFlag === 1);
                $('#ckShowHot').prop('checked', data.HotFlag === 1);     
                CKEDITOR.instances.Content.setData(data.Content);
                //disableFieldEdit(true);
                $('#txtPrice').val(data.Price);
                $('#txtPromotionPrice').val(data.PromotionPrice);
                $('#txtOriginalPrice').val(data.OriginalPrice);
                $('#txtSpecialPrice').val(data.SpecialPrice);
                //$('#ckShowHome').prop('checked', data.HomeFlag);
                //$('#ckShowHot').prop('checked', data.HotFlag);               
                $('#txtHomeOrder').val(data.HomeOrder);
                $('#txtHotOrder').val(data.HotOrder);
                $('#hidHotOrder').val(data.HotOrder);
                $('#hidHomeOrder').val(data.HomeOrder);
                $('#hidSortOrder').val(data.SortOrder);
                $('#addProductItemModal').modal('show');
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
            url: "/Admin/ProductCategory/GetAll",
            type: 'GET',
            dataType: 'json',
            async: false,
            success: function (response) {
                var data = [];
                //data.push({
                //    id: 0,
                //    text: "Tất cả",
                //    parentId: 0,
                //    sortOrder: 0
                //});
                $.each(response, function (i, item) {
                    data.push({
                        id: item.Id,
                        text: item.Name,
                        parentId: item.ParentId,
                        sortOrder: item.SortOrder
                    });
                });
                var arr = aspnetcore.unflattern(data);                
                $('#ddlProductCategoryFilter').combotree({
                    data: arr
                }); 
                $('#ddlProductCategory').combotree({
                    data: arr
                });     
                $('#ddlCategoryImportExcel').combotree({
                    data: arr
                });
                if (selectedId != undefined) {
                    $('#ddlProductCategory').combotree('setValue', selectedId);
                }
                if (selectedId != undefined) {
                    $('#ddlProductCategoryFilter').combotree('setValue', selectedId);
                }
                if (selectedId != undefined) {
                    $('#ddlCategoryImportExcel').combotree('setValue', selectedId);
                }
            }
        });
    }

    function setValueToNewProduct(productCategoryId) {
        $.ajax({
            url: "/Admin/Product/PrepareSetNewProduct",
            type: 'POST',
            dataType: 'json',
            data: {
                productCategoryId: productCategoryId
            },
            success: function (response) {
                $('#txtProductCategoryId').val(response.productCategoryId);
                $('#txtSortOrder').val(response.order);
                $('#lblProductCategoryName').text(response.productCategoryName);                
                //$('#txtHomeOrder').val(response.homeOrder);
                //$('#txtHotOrder').val(response.hotOrder);                
            }
        });
    }   

    function loadData(isPageChanged) {        
        $.ajax({
            type: "POST",
            url: "/Admin/ProductItem/GetAllPaging",
            data: {
                productCategoryIdStr: $('#ddlProductCategories').val(), 
                productColorIdStr: $('#ddlProductColors').val(),
                productIdStr: $('#ddlProducts').val(),
                keyword: $('#txtSearch').val(),
                page: aspnetcore.configs.pageIndex,
                pageSize: aspnetcore.configs.pageSize,
                sortBy: $('#SortType').val()
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
                            Code: item.Code,
                            Name: item.Name,

                            ProductCategoryId: item.ProductCategoryId,
                            ProductCategoryName: item.ProductCategoryName,
                            ProductId: item.ProductId,
                            ProductName: item.ProductName,
                           
                            Image1: item.Image1 == null ? '<img src="/admin-side/images/user.png" width=100' : '<img src="' + item.Image1 + '" width=100 />',                           
                            ColorName: item.ColorName,

                            Price: aspnetcore.formatNumber(item.Price, 0),
                            PromotionPrice: aspnetcore.formatNumber(item.PromotionPrice, 0),
                            SpecialPrice: aspnetcore.formatNumber(item.SpecialPrice, 0),
                            OriginalPrice: aspnetcore.formatNumber(item.OriginalPrice, 0),

                            Status: aspnetcore.getStatus(item.Status),
                            SortOrder: item.SortOrder,   

                            HotStatus: aspnetcore.getStatus(item.HotFlag),
                            HotOrder: item.HotOrder,   

                            HomeStatus: aspnetcore.getStatus(item.HomeFlag),
                            HomeOrder: item.HomeOrder,   

                            IsGood: aspnetcore.isGoodItem(item.IsGood),
                            Quantity: item.Quantity,                                                                                                                             
                            DateCreated: aspnetcore.dateTimeFormatJson(item.DateCreated),
                            DateModified: aspnetcore.dateTimeFormatJson(item.DateModified),                                                                                   
                        });
                    });
                    $("#lbl-total-records").text(response.RowCount);
                    if (render !== undefined) {
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
}