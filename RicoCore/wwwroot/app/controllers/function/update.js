﻿var jsController = function () {
    //var self = this;    
    this.initialize = function () {
        registerEvents();
    }

    function registerEvents() {
        //Init validation
        $('#frm-add-or-update').validate({
            errorClass: 'red',
            ignore: [],
            lang: 'vi',
            rules: {
                Name: { required: true },
                UniqueCode: { required: true },
                ParentId: { required: true },
                Url: { required: true },
                CssClass: { required: true },
                SortOrder: {
                    required: true,
                    number: true
                },
            },
            messages: {
                Name: "Phải nhập tên chức năng",
                UniqueCode: "Phải nhập mã Code",
                ParentId: "Phải chọn chức năng cha",
                Url: "Phải điền Url",
                CssClass: "Phải điền css của Icon",
                SortOrder: {
                    required: "Phải nhập thứ tự",
                    number: "Phải nhập kiểu số"
                }
            },
        });

        $('#btn-reset').on('click', function () {
            resetFormMaintainance();
        });

        $("#ParentId").on("change", function () {
            var parentId = $('#ParentId').val();
            setValueToNewFunction(parentId);
        });

        //$('#IsActive').change(function () {
        //    isActive(this);
        //});
    };

    function isActive(check) {
        if (check.checked) {
            if ($('#hidSortOrder').val() == 0) {
                setValueToNewFunction($('#ParentId').val());
            }
            else {
                var order = $('#hidSortOrder').val();
                $('#SortOrder').val(order);
            }
        }
        else {
            $('#SortOrder').val(0);
        }
    }

    function resetFormMaintainance() {
        //disableFieldEdit(false);              
        $('#IsActive').prop('checked', true);
        $('#Name').val('');
        $('#UniqueCode').val('');
        $('#CssClass').val('');
        $('#Url').val('');
    }

    function setValueToNewFunction(parentId) {
        $.ajax({
            url: "/Admin/Function/PrepareSetNewFunction",
            type: 'POST',
            dataType: 'json',
            data: {
                parentId: parentId
            },
            success: function (response) {
                $('#ParentFunctionId').val(response.parentId);
                $('#SortOrder').val(response.sortOrder);
                $('#hidSortOrder').val(response.sortOrder);
            }
        });
    }
}