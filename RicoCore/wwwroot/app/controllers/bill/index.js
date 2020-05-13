var BillController = function () {
    var cachedObj = {
        products: [],
        productItems: [],
        paymentMethods: [],
        billStatuses: []
    }
    this.initialize = function () {
        $.when(loadBillStatus(),
            loadPaymentMethod(),
            loadProducts())
            .done(function () {
                loadData();
            });

        registerEvents();
    }
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();
    function calculateTotalAmount() {
        var totalAmount = 0;
        $('#tbl-bill-details tr').each(function (i, item) {
            var total = parseFloat($(item).find('.hidTotal').first().val());
            totalAmount += total;
        });
        $('#lblTotalAmount').text(aspnetcore.formatNumber(totalAmount, 0));
    }

    function registerEvents() {
        $('#txtFromDate, #txtToDate').datepicker({
            autoclose: true,
            format: 'dd/mm/yyyy'
        });
        //Init validation
        $('#frmMaintainance').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                txtCustomerName: { required: true },
                txtCustomerAddress: { required: true },
                txtCustomerMobile: { required: true },
                //txtCustomerMessage: { required: true },
                ddlBillStatus: { required: true }
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

        $("#btn-create").on('click', function () {
            resetFormMaintainance();
            $('#modal-detail').modal('show');
            $('#txtCode').prop('readonly', true);
        });

        $("#ddl-show-page").on('change', function () {
            aspnetcore.configs.pageSize = $(this).val();
            aspnetcore.configs.pageIndex = 1;
            loadData(true);
        });

        $('body').on('change', '.ddlProductId', function () {
            var element = $(this);
            delay(function () {
                //var productId = parseInt($(element).val());
                var productId = $(element).val();
                var lblTotal = $(element).closest('tr').find('.lblTotal').first();               
                var hidTotal = $(element).closest('tr').find('.hidTotal').first();

                var lblPrice = $(element).closest('tr').find('.lblPrice').first();
                var hidPrice = $(element).closest('tr').find('.hidPrice').first();
                var quantity = $(element).closest('tr').find('.txtQuantity').first().val();

                if (isNaN(quantity)) {
                    lblTotal.text('0');
                    return false;
                }
                var products = $.grep(cachedObj.products, function (n) {
                    return n.Id === productId;
                });
                if (products.length > 0) {
                    var price = products[0].Price;
                    var total = price * quantity;
                    lblPrice.text(aspnetcore.formatNumber(price, 0));
                    lblTotal.text(aspnetcore.formatNumber(total, 0));
                    hidTotal.val(total);
                    hidPrice.val(price);

                    calculateTotalAmount();
                } else {
                    $('#lblTotalAmount').text('0');
                    hidTotal.val('0');
                    lblTotal.text('0');
                    hidPrice.val('0');
                    lblPrice.text('0');
                    aspnetcore.notify('Mã sản phẩm không tồn tại', 'error');
                }
                return false;
            }, 1000);
        });

        //$('.txtQuantity').bind('keyup mouseup', function () {
        //$('body').on('keyup mouseup', '.txtQuantity', function () {
        //    var element = $(this);
        //    delay(function () {
        //        var quantity = parseInt($(element).val());
        //        var lblTotal = $(element).closest('tr').find('.lblTotal').first();
        //        var hidTotal = $(element).closest('tr').find('.hidTotal').first();

        //        var lblPrice = $(element).closest('tr').find('.lblPrice').first();
        //        var hidPrice = $(element).closest('tr').find('.hidPrice').first();
        //        if (isNaN(quantity)) {
        //            lblTotal.text('0');
        //            return false;
        //        }
        //        var productId = $(element).closest('tr').find('.ddlProductId').first().val();
        //        //var productId = parseInt($(element).closest('tr').find('.ddlProductId').first().val());
        //        var products = $.grep(cachedObj.products, function (n) {
        //            return n.Id === productId;
        //        });
        //        if (products.length > 0) {
        //            var price = products[0].Price;
        //            var total = price * quantity;
        //            lblTotal.text(aspnetcore.formatNumber(total, 0));
        //            lblPrice.text(aspnetcore.formatNumber(price, 0));
        //            hidTotal.val(total);
        //            hidPrice.val(price);
        //            calculateTotalAmount();
        //        } else {
        //            $('#lblTotalAmount').text('0');
        //            hidTotal.val('0');
        //            lblTotal.text('0');
        //            hidPrice.val('0');
        //            lblPrice.text('0');
        //            aspnetcore.notify('Mã sản phẩm không tồn tại', 'error');
        //        }
        //        return false;
        //    }, 1000);

        //});

        $('body').on('click', '.btn-view', function (e) {
            e.preventDefault();
            var that = $(this).data('id');
            $.ajax({
                type: "GET",
                url: "/Admin/Bill/GetById",
                data: { id: that },
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    var data = response;
                    $('#hidId').val(data.Id);
                    $('#txtCustomerName').val(data.CustomerName);
                    $('#txtCustomerAddress').val(data.CustomerAddress);
                    $('#txtCustomerMobile').val(data.CustomerMobile);
                    $('#txtCustomerMessage').val(data.CustomerMessage);
                    $('#txtShipAddress').val(data.ShipAddress);
                    $('#txtShipMobile').val(data.ShipMobile);
                    $('#txtShipMessage').val(data.ShipMessage);
                    $('#txtCode').val(data.Code);
                    $('#txtCode').prop('readonly', true);
                    $('#ddlPaymentMethod').val(data.PaymentMethod);
                    $('#ddlCustomerId').val(data.CustomerId);
                    $('#ddlBillStatus').val(data.BillStatus);

                    $('#txtCustomerFacebook').val(data.CustomerFacebook);
                    $('#txtShippingFee').val(data.ShippingFee);

                    var billDetails = data.BillDetails;
                    if (data.BillDetails !== null && data.BillDetails.length > 0) {
                        var render = '';
                        var templateDetails = $('#template-table-bill-details').html();
                        var totalBill = 0;
                        $.each(billDetails, function (i, item) {
                            var total = item.Quantity * item.Price;                            
                            //var products = getProductOptions(item.ProductId, item.Price);
                           
                            render += Mustache.render(templateDetails,
                                {
                                    Id: item.Id,
                                    Products: item.ProductItemName,
                                    Code: item.Code,
                                    Price: aspnetcore.formatNumber(item.Price, 0),
                                    Quantity: item.Quantity,
                                    Total: aspnetcore.formatNumber(total, 0),
                                    TotalNumber: total
                                });
                            totalBill += total;
                        });
                        $('#lblTotalAmount').text(aspnetcore.formatNumber(totalBill, 0));
                        $('#tbl-bill-details').html(render);
                    }
                    $('#modal-detail').modal('show');
                    aspnetcore.stopLoading();

                },
                error: function () {
                    aspnetcore.notify('Có lỗi xảy ra', 'error');
                    aspnetcore.stopLoading();
                }
            });
        });

        $('#btn-save').on('click', function (e) {
            if ($('#frmMaintainance').valid()) {
                e.preventDefault();
                var id = $('#hidId').val();
                var customerName = $('#txtCustomerName').val();
                var customerAddress = $('#txtCustomerAddress').val();
                var customerId = $('#ddlCustomerId').val();
                var customerMobile = $('#txtCustomerMobile').val();
                var shipName = $('#txtShipName').val();
                var shipAddress = $('#txtShipAddress').val();
                var shipMobile = $('#txtShipMobile').val();
                var customerMessage = $('#txtCustomerMessage').val();
                var customerFacebook = $('#txtCustomerFacebook').val();
                var code = $('#txtCode').val();
                var shippingFee = $('#txtShippingFee').val();
                var paymentMethod = $('#ddlPaymentMethod').val();
                var billStatus = $('#ddlBillStatus').val();
                //bill detail

                var billDetails = [];
                $.each($('#tbl-bill-details tr'), function (i, item) {
                    var billDetailId = $(item).data('id');
                    var productId = $(item).find('select.ddlProductId').first().val();
                    var quantity = $(item).find('input.txtQuantity').first().val();
                    var price = $(item).find('input.hidPrice').first().val();
                    //var price = $('.hidPrice').val();
                    billDetails.push({
                        Id: billDetailId,
                        ProductId: productId,
                        Quantity: quantity,
                        Price: price,
                        BillId: id
                    });

                });
                console.log(billDetails);
                $.ajax({
                    type: "POST",
                    url: "/Admin/Bill/SaveEntity",
                    data: {
                        Id: id,
                        BillStatus: billStatus,
                        CustomerId: customerId,
                        CustomerAddress: customerAddress,                                                
                        CustomerMobile: customerMobile,
                        CustomerName: customerName,
                        CustomerMessage: customerMessage,
                        ShipAddress: shipAddress,
                        ShipMobile: shipMobile,
                        ShipName: shipName,
                        CustomerFacebook: customerFacebook,
                        ShippingFee: shippingFee,
                        PaymentMethod: paymentMethod,
                        Status: 1,
                        Code: code,
                        BillDetails: billDetails
                    },
                    dataType: "json",
                    beforeSend: function () {
                        aspnetcore.startLoading();
                    },
                    success: function () {
                        aspnetcore.notify('Cập nhật thành công', 'success');
                        $('#modal-detail').modal('hide');
                        resetFormMaintainance();

                        aspnetcore.stopLoading();
                        loadData(true);
                    },
                    error: function () {
                        aspnetcore.notify('Cập nhật có lỗi xảy ra', 'error');
                        aspnetcore.stopLoading();
                    }
                });
                return false;
            }
            return false;
        });
        $('#btnConfirm').on('click', function (e) {
            e.preventDefault();
            var id = $('#hidId').val();
            $.ajax({
                type: "POST",
                url: "/Admin/Bill/ConfirmBill",
                data: {
                    billId: id
                },
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    aspnetcore.notify(response, 'success');
                    $('#modal-detail').modal('hide');
                    resetFormMaintainance();
                    aspnetcore.stopLoading();
                    loadData(true);
                },
                error: function (err) {
                    aspnetcore.notify(err.responseText, 'error');
                    aspnetcore.stopLoading();
                }
            });
            return false;
        });

        $('#btn-cancel').on('click', function (e) {
            e.preventDefault();
            var id = $('#hidId').val();
            $.ajax({
                type: "POST",
                url: "/Admin/Bill/CancelBill",
                data: {
                    billId: id
                },
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    aspnetcore.notify(response, 'success');
                    $('#modal-detail').modal('hide');
                    resetFormMaintainance();
                    aspnetcore.stopLoading();
                    loadData(true);
                },
                error: function (err) {
                    aspnetcore.notify(err.responseText, 'error');
                    aspnetcore.stopLoading();
                }
            });
            return false;
        });

        $('#btnPending').on('click', function (e) {
            e.preventDefault();
            var id = $('#hidId').val();
            $.ajax({
                type: "POST",
                url: "/Admin/Bill/PendingBill",
                data: {
                    billId: id
                },
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    aspnetcore.notify(response, 'success');
                    $('#modal-detail').modal('hide');
                    resetFormMaintainance();
                    aspnetcore.stopLoading();
                    loadData(true);
                },
                error: function (err) {
                    aspnetcore.notify(err.responseText, 'error');
                    aspnetcore.stopLoading();
                }
            });
            return false;
        });

        $('#btnAddDetail').on('click', function () {
            var template = $('#template-table-bill-details').html();
            var render = Mustache.render(template,
                {
                    Id: 0,
                    Products: getProductOptions(0, 0),
                    Quantity: 1,
                    Price: 0,
                    Total: 0,
                    TotalNumber: 0
                });
            $('#tbl-bill-details').append(render);
        });

        $('body').on('click', '.btn-delete-detail', function () {
            $(this).parent().parent().remove();
        });

        $("#btnExport").on('click', function () {
            var that = $('#hidId').val();
            $.ajax({
                type: "POST",
                url: "/Admin/Bill/ExportExcel",
                data: { billId: that },
                beforeSend: function () {
                    aspnetcore.startLoading();
                },
                success: function (response) {
                    window.location.href = response;

                    aspnetcore.stopLoading();

                }
            });
        });
    };

    function loadBillStatus() {
        return $.ajax({
            type: "GET",
            url: "/admin/bill/GetBillStatus",
            dataType: "json",
            success: function (response) {
                cachedObj.billStatuses = response;
                var render = "";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Value + "'>" + item.Name + "</option>";
                });
                $('#ddlBillStatus').html(render);
            }
        });
    }
    function loadPaymentMethod() {
        return $.ajax({
            type: "GET",
            url: "/admin/bill/GetPaymentMethod",
            dataType: "json",
            success: function (response) {
                cachedObj.paymentMethods = response;
                var render = "";
                $.each(response, function (i, item) {
                    render += "<option value='" + item.Value + "'>" + item.Name + "</option>";
                });
                $('#ddlPaymentMethod').html(render);
            }
        });
    }

    function loadProducts() {
        return $.ajax({
            type: "GET",
            url: "/Admin/Product/GetAll",
            dataType: "json",
            beforeSend: function () {
                aspnetcore.startLoading();
            },
            success: function (response) {
                cachedObj.products = response;
                aspnetcore.stopLoading();
                $('#btn-create').removeAttr('disabled');
            },
            error: function () {
                aspnetcore.notify('Có lỗi xảy ra', 'error');
            }
        });
    }
    function getProductOptions(selectedId, price) {
        var products = "<select data-price='" + price + "' class='form-control ddlProductId'>";
        products += '<option value="00000000-0000-0000-0000-000000000000" selected="select">Chọn sản phẩm</option>';
        $.each(cachedObj.products, function (i, product) {
            if (selectedId === product.Id)
                products += '<option value="' + product.Id + '" selected="select">' + product.Name + '</option>';
            else
                products += '<option value="' + product.Id + '">' + product.Name + '</option>';
        });
        products += "</select>";
        return products;
    }
    function resetFormMaintainance() {
        $('#hidId').val("00000000-0000-0000-0000-000000000000");
        $('#txtCustomerName').val('');
        $('#txtCode').val('');
        $('#txtCustomerAddress').val('');
        $('#txtCustomerMobile').val('');
        $('#txtCustomerMessage').val('');
        $('#txtShipName').val('');
        $('#txtShipAddress').val('');
        $('#txtShipMobile').val('');
        $('#ddlPaymentMethod').val('');
        $('#ddlCustomerId').val('');
        $('#ddlBillStatus').val('');
        $('#tbl-bill-details').html('');

        $('#txtCustomerFacebook').val('');
        $('#txtShippingFee').val('0');
        $('#lblTotalAmount').val('0');
    }

    function loadData(isPageChanged) {
        $.ajax({
            type: "GET",
            url: "/admin/bill/GetAllPaging",
            data: {
                startDate: $('#txtFromDate').val(),
                endDate: $('#txtToDate').val(),
                keyword: $('#txtSearchKeyword').val(),
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
                            CustomerName: item.CustomerName,
                            Id: item.Id,
                            PaymentMethod: getPaymentMethodName(item.PaymentMethod),
                            DateCreated: aspnetcore.dateTimeFormatJson(item.DateCreated),
                            BillStatus: getBillStatusName(item.BillStatus)
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
    function getPaymentMethodName(paymentMethod) {
        var method = $.grep(cachedObj.paymentMethods, function (element) {
            return element.Value === paymentMethod;
        });
        if (method.length > 0)
            return method[0].Name;
        else return '';
    }
    function getBillStatusName(status) {
        if (status === 1)
            return '<span class="badge bg-red">Đơn mới</span>';
        else if (status === 2)
            return '<span class="badge badge-primary">Đang xử lý</span>';
        else if (status === 3)
            return '<span class="badge badge-secondary">Đã huỷ</span>';
        else if (status === 5)
            return '<span class="badge badge-info">Đang giao</span>';
        else if (status === 6)
            return '<span class="badge badge-success">Đã hoàn tất</span>';
        else if (status === 7)
            return '<span class="badge badge-warning">Đã hoãn</span>';
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
}