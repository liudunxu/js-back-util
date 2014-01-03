//公用后台工具
var SimpleCommonUtil = {
    //设置select中文本为text的项被选中
    setSelectTextCheck: function (elems, text) {
        elems.each(function () {
            var count = $(this).find('option').length;
            for (var i = 0; i < count; i++) {
                if ($(this).get(0).options[i].text == text) {
                    var tempOption = $(this).get(0).options[i];
                    var option0 = $(this).get(0).options[0];
                    var optionText = option0.text;
                    var optionValue = option0.value;
                    option0.text = tempOption.text;
                    option0.value = tempOption.value;
                    tempOption.text = optionText;
                    tempOption.value = optionValue;
                    option0.selected = true;
                    break;
                }
            }
        });
    },

    //判断select中是否存在值为value的项  
    isExistOption: function (id, value) {
        var isExist = false;
        var count = $('#' + id).find('option').length;
        for (var i = 0; i < count; i++) {
            if ($('#' + id).get(0).options[i].value == value) {
                isExist = true;
                break;
            }
        }
        return isExist;
    },
    //点击按钮触发一处页面元素联动的逻辑    
    clickToggle: function (elem, callback) {
        var isVisible = $(elem).is(':visible');
        if (!isVisible) {
            if ($.isFunction(callback)) {
                callback.apply(this);
            }
        } else {
            $(elem).html('');
        }
        $(elem).toggle();
    },

    //通用数据提交回传处理
    AjaxSubmitDataConfig: {
        callback: false,
        errorMsg: "操作失败",
        succMsg: "操作成功",
        isShowSuccMsg: true
    },

    //通用ajax提交回传数据处理
    ajaxSubmitDataProcess: function (data, config) {
        config = $.extend({}, SimpleCommonUtil.AjaxSubmitDataConfig, config);

        var obj = $.parseJSON(data);
        if (!!obj) {
            if (obj.errorCode == 0) {
                if (config.isShowSuccMsg) {
                    if (obj.errorMsg != '') {
                        alert(obj.errorMsg);
                    } else {
                        alert(config.succMsg);
                    }
                }
                if ($.isFunction(config.callback)) {
                    config.callback.apply(this);
                }
            } else {
                if (obj.errorMsg != '') {
                    alert(obj.errorMsg);
                } else {
                    alert(config.errorMsg);
                }
            }
        }
    },

    //ajax填充下拉框默认配置
    AjaxboxConfig: {
        url: '',
        postData: {},
        dataFormat: '.data',
        defaultValue: { name: '请选择', value: '-1' },
        itemFormat: { name: 'name', value: 'value' },
        isSimpleFormat: false,
        userDefaultValue: false,
        errorCallback: false,
        successCallback: false,
        errorMsg: '后台数据出错'
    },

    //ajax方式填充单选框
    ajaxFillBox: function (target, config) {

        //判断传入的selectbox的合法性
        if (!target || !target.length) {
            return;
        }

        //应用默认配置
        config = $.extend({}, SimpleCommonUtil.AjaxboxConfig, config);

        //ajax请求
        $.ajax({
            type: 'post',
            url: config.url,
            data: config.postData,
            async: false,
            success: function (msg) {
                var obj;
                try {
                    obj = $.parseJSON(msg);
                } catch (e) {
                    alert(config.errorMsg);
                    return;
                }

                if (obj) {
                    if (obj.errorCode != 0 && obj.errorMsg != '') {
                        alert(obj.errorMsg);
                        return;
                    }

                    //清空原表格
                    target.empty();
                    if (!!config.userDefaultValue) {
                        target.append("<option selected='selected' value='" + config.defaultValue.value + "'>" + config.defaultValue.name + "</option>");
                    }
                    //获取填充数据
                    var values = eval('obj' + config.dataFormat);
                    if (!!values) {

                        //使用简单方式填充
                        if (config.isSimpleFormat) {
                            $.each(values, function (idx, item) {
                                target.append("<option value='" + idx + "'>" + item + "</option>");
                            });
                            //需要自己指定填充格式
                        } else {
                            $.each(values, function (idx, item) {
                                target.append("<option value='" + item[config.itemFormat.value] + "'>" + item[config.itemFormat.name] + "</option>");
                            });
                        }

                        if ($.isFunction(config.successCallback)) {
                            config.successCallback(obj);
                        }
                    }
                }
            },
            //错误处理
            error: function () {
                if ($.isFunction(config.errorCallback)) {
                    config.errorCallback.apply(this);
                }
            }
        });
    },

    //ajax方式上传文件，url：后台地址，fileElemId：控件id，successCallback:上传成功后触发事件
    fileUpload: function (url, fileElemId, successCallback) {
        $.ajaxFileUpload({
            url: url,
            fileElementId: 'fileUpload',
            dataType: 'string',
            success: function (msg, status) {
                successCallback(msg, status);
            }
        });
    },
    //获取url参数
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return '';
    },

    //获取当前日期
    currentDate: function (date) {
        var now = date || new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day;
        return (clock);
    },
    //获取当前时间
    curentTime: function (isUseDate) {
        var now = new Date();
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var clock = '';
        if (hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;

        if (isUseDate) {
            clock = SimpleCommonUtil.CurrentDate() + ' ' + clock;
        }

        return (clock);
    },
    //设置页面标题
    setPageTitle: function (title, context) {
        var curContext = context || window.parent;
        curContext.document.title = title;
    }
};

//form表单工具类
var SimpleFormUtil = {

    //form表单进行导出excel，适合post方式传递的excel导出
    formDownloadExtend: function (data, formName, action) {
        var theForm = document.forms[formName];
        if (!theForm) {
            theForm = eval('document.' + formName);
        }
        var jForm = $("form[name='" + formName + "']");
        jForm.empty();
        if (!!action) {
            jForm.attr("action", action);
        }
        $.each(data, function (idx, elem) {
            jForm.append("<input type='hidden' name='" + idx + "' value='" + elem + "'/>");
        });
        theForm.submit();
    },

    //form表单进行导出excel，适合post方式传递的excel导出
    formDownload: function (data, formName) {
        var theForm = document.forms[formName];
        if (!theForm) {
            theForm = eval('document.' + formName);
        }
        $.each(data, function (idx, elem) {
            var viewElem = eval('theForm.' + elem.name);
            viewElem.value = elem.value;
        });
        theForm.submit();
    }
};

//flexgrid表格工具类
var FlexGridUtil = {
    toSubmitData: function (data) {
        if (!data) return [];
        var result = [];
        $.each(data, function (idx, item) {
            result.push({ name: idx, value: item });
        });
        return result;
    }
};
//页面渲染工具类
var SimplePageRenderUtil = {
    //渲染动态页面
    renderDynamicView: function (obj) {
        $.each(obj, function (key, value) {
            var tempObj = $("#" + key);
            var tagName = tempObj[0].tagName;
            if (tagName) tagName = tagName.toLowerCase();
            if (tagName == 'input') {
                tempObj.val(value);
            } else if (tagName == 'select') {
                if (SimpleCommonUtil.isExistOption(key, value)) {
                    tempObj.val(value);
                }
            }
            else if (tagName == 'a') {
                tempObj.attr("href", value);
            } else if (tagName == 'span') {
                tempObj.text(value);
            } else {
                tempObj.html(value);
            }
        });
    },
    //渲染flexgrid
    renderFlexgridSimple: function (colModel, data) {

        var a = [];
        var b = [];
        var trRows = [];
        var thLength = colModel.length;

        var tabContent = '<table class="table table-striped"><tr>';
        for (var i = 0; i < thLength; i++) {
            tabContent += '<th>' + colModel[i].display + '</th>';
        };
        tabContent += '</tr>';

        $.each(data.rows, function (i, row) {
            b[0] = "<tr";
            if (((i & 1) == 0)) {
                b[1] = " style='background:#c1c2b2'>";
            } else {
                b[1] = ">";
            }
            for (var idx = 0; idx < thLength; idx++) {
                a[0] = '<td><div>', a[1] = row.cell[idx], a[2] = '</div></td>';
                b[2 + idx] = (a.join(""));
            }
            b[2 + idx] = "</tr>";
            trRows.push(b.join(""));
        });

        return tabContent + trRows.join("") + '</table>';
    }
};

