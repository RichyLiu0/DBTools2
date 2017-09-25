////////////////////////////////Extend
(function ($) {
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
    jQuery.fn.getOuterHTML = function (s) {
        return $("<p></p>").append(this.clone(true)).html();
    };
})(jQuery);

//文本框弹出层
function PopMultiInput(curEL) {
    var defaultConfig = {
        rows: 8,
        width: 200
    };
    var _seft = curEL;
    //defaultConfig.width = _seft.width();
    //控件参数
    var paramValue = _seft.attr('PopMultiInput');
    if (paramValue == null || paramValue == "") { paramValue = "{}" };
    var cfg = ToObject(paramValue);
    cfg = $.extend(defaultConfig, cfg);
    var pmid = GetGUID();
    _seft.attr("pmid", pmid);
    var targetObj = $('<div />').attr("pmid", pmid).css({ 'display': 'none' });
    var targetTextArea = $('<textarea />', { rows: cfg.rows }).css({ 'width': cfg.width + 'px' }).appendTo(targetObj);
    _seft.after(targetObj);
    _seft.attr("readonly", "readonly");
    _seft.click(function () {
        targetTextArea.val($(this).val().replace(/,/g, '\n'));
        var A_top = $(this).position().top + $(this).outerHeight(true);
        var A_left = $(this).position().left;
        targetObj.show().css({ "position": "absolute", "top": A_top + "px", "left": A_left + "px", "z-index": 999 });
        targetTextArea.focus();
    });
    $(document).click(function (event) {
        if ($(event.target).attr("pmid") != pmid && targetObj.is(':visible')) {
            targetObj.hide();
            _seft.val(GetSplitString(targetTextArea.val())).addClass("highlightQueryValue").removeClass("watermarkQueryValue");
            if (_seft.val() == "") {
                _seft.val(_seft.attr("rtip")).addClass("watermarkQueryValue").removeClass("highlightQueryValue");
            }
        }
    });
    targetObj.click(function (e) {
        e.stopPropagation();
    });
    targetTextArea.blur(function () {
        targetObj.hide();
        _seft.val(GetSplitString(targetTextArea.val())).addClass("highlightQueryValue").removeClass("watermarkQueryValue");
        if (_seft.val() == "") {
            _seft.val(_seft.attr("rtip")).addClass("watermarkQueryValue").removeClass("highlightQueryValue");
        }
    });
}

//空白（空格、换行、tab）和逗号分隔的字符串，变成用逗号分隔  
function GetSplitString(str, splitStr) {
    var arr = str.split(',');
    if (splitStr == null) {
        splitStr = ',';
    }
    var resources = '';
    for (var i = 0; i < arr.length; i++) {
        var arr1 = arr[i].split(/[\s|，]+/);
        for (var j = 0; j < arr1.length; j++) {
            if (jQuery.trim(arr1[j]) != '') {
                resources += jQuery.trim(arr1[j]) + splitStr;
            }
        }
    }
    if (resources != '') {
        resources = resources.substring(0, resources.length - 1);
    }
    return resources;
}

Date.prototype.format = function (format) {
    if (format) { } else {
        format = "yyyy-MM-dd";
    }
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
////////////////////////////////helper
function ToJson(obj) {
    return JSON.stringify(obj);
}
function ToObject(strJson) {
    return JSON.parse(strJson);
}
function GetGUID() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "";
    }
    return guid;
}
function CreateFormObj(key) {
    var formObj = {
    };
    var formItems = $("[" + key + "]");
    for (i = 0; i < formItems.length; i++) {
        formObj[$(formItems[i]).attr(key)] = $(formItems[i]).val();
    }
    return formObj;
}
function StrToDate(strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
    function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
    //return new Date(Date.parse(strDate));
}
function ToDateTime(strDateTime) {
    return new Date(Date.parse(strDateTime));
}
function AddDays(curDate, step) {
    //可以加上错误处理
    var a = StrToDate(curDate);
    a = a.valueOf();
    a = a + step * 24 * 60 * 60 * 1000;
    a = new Date(a);
    //alert(a.getFullYear() + "年" + (a.getMonth() + 1) + "月" + a.getDate() + "日")
    return a;
}
function AddMonths(curDate, step) {
    var tempDate = new Date(curDate);
    tempDate.setMonth(tempDate.getMonth() + step);
    return tempDate;
}
function DateCompare(startdate, enddate) {
    var arr = startdate.split("-");
    var starttime = new Date(arr[0], arr[1], arr[2]);
    var starttimes = starttime.getTime();
    var arrs = enddate.split("-");
    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
    var lktimes = lktime.getTime();
    if (starttimes >= lktimes) {
        return false;
    }
    else
        return true;
}
function FillCtl(ctlFilterStr, ctlVal) {
    $(ctlFilterStr).each(function () {
        try {
            $(this).val(ctlVal);
            $(this).html(ctlVal);
        }
        catch (e) {
        }
    });
}
function ResultDeal(jsonResult, fnConfig) {
    var result = JSON.parse(jsonResult);
    if (result.IsDone == true) {
        if (result.Message.indexOf("Fn_") > -1) {
            if (fnConfig) {
                if (fnConfig[result.Message])
                    fnConfig[result.Message]();
                else
                    alert("未指定fn:" + result.Message)
            } else {
                eval(result.Message + "();");
            }
        }
        else {
            alert(result.Message);
        }
    }
    else {
        alert(result.Message);
    }
}
function UcsResultDeal(jsonResult, fnConfig) {
    var r = JSON.parse(jsonResult);
    if (r.IsSysError) {
        alert(r.Message); return;
    }
    if (fnConfig) {
        var fnName = r.IsSuccess ? "OnSuccess" : r.ResultCode;
        if (fnConfig[fnName]) {
            fnConfig[fnName](); return;
        }
    }
    alert(r.Message);
}
function GetSelText(selFilter) {
    if ($(selFilter)[0].options.length <= 0)
        return "";
    return $(selFilter)[0].options[$(selFilter)[0].selectedIndex].text;
}
function HasChecked(cbkName) {
    var cbks = document.getElementsByName(cbkName);
    for (var i = 0; i < cbks.length; i++) {
        if (cbks[i].checked == true)
            return true;
    }
    return false;
}
function SetRadio(rdoName, val) {
    var rdos = document.getElementsByName(rdoName);
    for (var i = 0; i < rdos.length; i++) {
        if (rdos[i].value == val) {
            rdos[i].checked = true;
            break;
        }
    }
}
function GetRadio(rdoName) {
    var rdos = document.getElementsByName(rdoName);
    for (var i = 0; i < rdos.length; i++) {
        if (rdos[i].checked == true)
            return rdos[i].value;
    }
}
function GetDayCount(pBegin, pEnd) {
    var begin = StrToDate(pBegin);
    var end = StrToDate(pEnd);
    var days = end.getTime() - begin.getTime();
    return parseInt(days / (1000 * 60 * 60 * 24));
}
//利息计算
function CalculateInterest(amount, rate, daysCount) {
    var interest = (amount * rate / 360) * daysCount;
    return ToDigits2(interest);
}
function ToDigits2(floatVal) {
    var strResult = parseFloat(floatVal).toFixed(4).toString();
    return parseFloat(strResult.substr(0, strResult.length - 2));
}
function ToDigits(floatVal, fixCount) {
    var strResult = parseFloat(floatVal).toFixed(fixCount + 2).toString();
    return parseFloat(strResult.substr(0, strResult.length - 2));
}
function ToDigitsString(floatVal, fixCount) {
    var strResult = parseFloat(floatVal).toFixed(fixCount + 2).toString();
    return strResult.substr(0, strResult.length - 2);
}
//字符串纯数字验证
function IsNumber(obj) {
    var str = $.trim($(obj).val());
    var s = /^[0-9]*$/;
    if (!s.test(str))
        $(obj).val("");
}
function SetUrlParameter(sourceUrl, key, val) {
    return $.query.load(sourceUrl).set(key, val).toString();
}


//金额格式化，如100,000.00
function MoneyShow(str) {
    var str = $.trim(str);
    var newStr = "";
    var count = 0;
    if (str.indexOf(".") == -1) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = str.charAt(i) + "," + newStr;
            }
            else {
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        str = newStr + ".00";

    }
    else {
        for (var i = str.indexOf(".") - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = str.charAt(i) + "," + newStr;
            }
            else {
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
    }
    return str;
}



function BlankGoto(url) {
    if ($.browser.safari) {
        window.open(url);
    } else {
        var alinkId = "_aLinkBlank_";
        var $aLink = $("#" + alinkId);
        if ($aLink.length < 1) {
            $('<a id="' + alinkId + '" target="_blank" style="display:none">_aLinkBlank_</a>').prependTo($(document.body));
            $aLink = $("#" + alinkId);
        }
        $aLink.attr("href", url)[0].click();
    }
}
//,替换的字符，gapnumb替换长度
function GapBy(sourceStr, gapLen, gapStr, gaptxt, gapnumb) {
    if (sourceStr == null || sourceStr == undefined)
        return "";
    var len = sourceStr.length;
    if (len <= gapLen)
        return sourceStr;
    if (gaptxt != null || gaptxt != undefined) {
        if (len <= gapnumb)
            return sourceStr;
        var newsourcestr = "";
        for (var i = 0; i < gapnumb; i++) {
            newsourcestr = newsourcestr + gaptxt;
        }
        sourceStr = newsourcestr + sourceStr.substring(gapnumb, sourceStr.length);
    }
    var result = "";
    var remainStr = sourceStr;
    while (remainStr.length > 0) {
        if (remainStr.length <= gapLen) {
            result += remainStr;
            remainStr = "";
        } else {
            result += (remainStr.substr(0, gapLen) + gapStr);
            remainStr = remainStr.substr(gapLen, remainStr.length - gapLen);
        }
    }
    return result;
}
function GotoBLink(url, title) {
    if (parent.opentab) {
        parent.opentab({ nav: url, title: title, navid: GetGUID() })
    } else {
        window.open(url);
    }
}
function UCSRoundUp(n, f) {
    n = n * Math.pow(10, f);
    n = Math.ceil(n) / Math.pow(10, f);
    return n;
}
function UCSRoundDown(floatVal, fixCount) {
    var strResult = parseFloat(floatVal).toFixed(fixCount + 2).toString();
    return parseFloat(strResult.substr(0, strResult.length - 2));
}
function DisableEvent(el) {
    el.css("visibility", "hidden");
}
function EnableEvent(el) {
    el.css("visibility", "visible");
}
function TryGetByAppend(uid, html) {
    var $obj = $("#" + uid);
    if ($obj.length < 1) {
        $(document.body).append(html);
    }
    return $("#" + uid);
}
function UcsOpenWin(url, w, h) {
    var pre = url.indexOf('?') > -1 ? '&' : '?';
    url += (pre + "v=" + GetGUID());
    var ifr = TryGetByAppend('_iframe_UcsWin_', '<iframe id="_iframe_UcsWin_" frameborder="0" width="400px" height="400px" style="display: none;"></iframe>');
    ifr.attr("src", url).css("width", w).css("height", h).OpenDiv();
    return ifr;
}
function UcsCloseWin() {
    $("#_iframe_UcsWin_").attr("src", "")
    $("#_iframe_UcsWin_").CloseDiv();
}
function RMBCNStr(numberValue) {
    var numberValue = new String(Math.round(numberValue * 100)); // 数字金额
    var chineseValue = ""; // 转换后的汉字金额
    var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
    var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
    var len = numberValue.length; // numberValue 的字符串长度
    var Ch1; // 数字的汉语读法
    var Ch2; // 数字位的汉字读法
    var nZero = 0; // 用来计算连续的零值的个数
    var String3; // 指定位置的数值
    if (len > 15) {
        alert("超出计算范围");
        return "";
    }
    if (numberValue == 0) {
        chineseValue = "零元整";
        return chineseValue;
    }
    String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
    for (var i = 0; i < len; i++) {
        String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
        if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
            if (String3 == 0) {
                Ch1 = "";
                Ch2 = "";
                nZero = nZero + 1;
            }
            else if (String3 != 0 && nZero != 0) {
                Ch1 = "零" + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else {
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
        }
        else { // 该位是万亿，亿，万，元位等关键位
            if (String3 != 0 && nZero != 0) {
                Ch1 = "零" + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else if (String3 != 0 && nZero == 0) {
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else if (String3 == 0 && nZero >= 3) {
                Ch1 = "";
                Ch2 = "";
                nZero = nZero + 1;
            }
            else {
                Ch1 = "";
                Ch2 = String2.substr(i, 1);
                nZero = nZero + 1;
            }
            if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
                Ch2 = String2.substr(i, 1);
            }
        }
        chineseValue = chineseValue + Ch1 + Ch2;
    }
    if (String3 == 0) { // 最后一位（分）为0时，加上“整”
        chineseValue = chineseValue + "整";
    }
    return chineseValue;
}
function IsFloatNum(c) {
    var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
    return r.test(c);
}
function UcsInitHideFrame(url) {
    var pre = url.indexOf('?') > -1 ? '&' : '?';
    url += (pre + "v=" + GetGUID());
    var ifr = TryGetByAppend('_iframe_UcsHid_', '<iframe scrolling="no" id="_iframe_UcsHid_" frameborder="0" width="0px" height="0px" style="display: none;"></iframe>');
    ifr.attr("src", url);
    return ifr;
}
function InitListOrderBy() {
    var targetList = $("[listorderby]");
    targetList.css("cursor", "pointer").css("background", "green");
    targetList.click(function () {
        var btn = $(this);
        var orderby = btn.attr("listorderby");
        ListOrderby(orderby);
    });
    var orderby = $.trim($.query.get("orderby"));
    var direct = $.trim($.query.get("direct"));
    if (orderby == "")
        return;
    var targetDiv = $("[listorderby=" + orderby + "]");
    if (direct == "asc") {
        targetDiv.html(targetDiv.text() + "<span style='color:red'>↑</span>");
    } else {
        targetDiv.html(targetDiv.text() + "<span style='color:red'>↓</span>");
    }
    function ListOrderby(field) {
        var orderby = $.trim($.query.get("orderby"));
        var direct = $.trim($.query.get("direct"));
        if (orderby == "") {//第一次
            direct = "asc";
        } else {
            if (orderby == field) {//第二次，相同排序
                direct = (direct == "asc" ? "desc" : "asc");
            } else {//第二次，不同排序
                direct = "asc";
            }
        }
        window.location.href = $.query.set("orderby", field).set("direct", direct).toString();
    }
}
function RegGo(goUrl) {
    var goUrl = TrySetUrlParam(goUrl, "BackUrl", window.location.href);
    window.location.href = goUrl;
}
// 弹出层，iframe 窗口
function ShowWin(goUrl, width, height, title, closedCallback, full) {
    if (!width)
        width = 1000;
    if (!height)
        height = 500;

    if (width > $(window).width())
        width = $(window).width() - 20;
    if (height > $(window).height())
        height = $(window).height() - 20;

    if (!title) {
        title = "详细信息";
        if (window.event)
            title = $(window.event.srcElement).text();
        if (title == '') {
            title = '新窗口';
        }
    }

    if (!closedCallback) {
        closedCallback = function () {
        }
    }
    if (!full) {
        full = false;
    }

    if (goUrl.indexOf("http://") != 0) {
        var vpath = window.location.pathname;
        // 非完整url 获取url目录部分
        if (goUrl.substr(0, 1) != '/') {
            var pathDir = vpath.substr(0, vpath.lastIndexOf('/') + 1);
            goUrl = pathDir + goUrl;
        }
    }

    // 弹出iframe 层
    var layerIndex = layer.open({
        type: 2,
        //skin: 'layui-layer-lan',
        title: title,
        fix: false,
        shadeClose: false,
        maxmin: true,
        area: [width.toString() + 'px', height.toString() + 'px'],
        content: goUrl,
        end: closedCallback
    });

    if (full) {
        layer.full(layerIndex);
    }
}
function TrySetUrlParam(url, key, val) {
    var targetUrl = url;
    var urlQuery = $.query.load(targetUrl);
    if (key)
        urlQuery = urlQuery.set(key, val);
    var idx = targetUrl.indexOf('?');
    if (idx > 0) {
        targetUrl = targetUrl.substring(0, idx);
    }
    targetUrl += urlQuery.toString();
    return targetUrl;
}
function InitRTip() {
    $("input[rtip]").each(function () {
        var rTip = $(this).attr("rtip");
        if (rTip == null || rTip == '')
            return;
        if ($(this).val() == '') {
            $(this).val(rTip);
        }
        $(this).focus(function () {
            var tip = rTip;
            if (this.value == rTip)
                this.value = '';
        });
        $(this).blur(function () {
            var tip = rTip;
            if (this.value == '')
                this.value = rTip;
        });
    });
}
function CheckRTip() {
    $("input[rtip]").each(function () {
        var rTip = $(this).attr("rtip");
        if ($(this).val() == rTip) {
            $(this).val("");
        }
    });
}

//高亮显示用户有效的输入值
function HighlightQueryValue() {
    $("input[type='text']").each(function () {
        var tipText = $(this).attr("rtip");
        if (tipText == null)
            tipText = '';

        var enbaled = this.value != tipText;
        EnableQueryValue(this, enbaled);

        $(this).focus(function () {
            EnableHighlight(this, false);
            EnableWatermark(this, false);
        });
        $(this).blur(function () {
            var tip = tipText;
            var enbaled = this.value != tip;
            EnableQueryValue(this, enbaled);
        });
    });

    $("select[search]").each(function () {
        var enbaled = this.value != '';
        EnableQueryValue(this, enbaled);

        $(this).find('option').each(function () {
            var enbaled = this.value != '';
            EnableQueryValue(this, enbaled);
        });
        $(this).change(function () {
            var enbaled = this.value != '';
            EnableQueryValue(this, enbaled);
        });
    });
}
function EnableQueryValue(obj, enbaled) {
    EnableHighlight(obj, enbaled);
    EnableWatermark(obj, !enbaled);
}
function EnableHighlight(obj, enbaled) {
    if (enbaled) {
        $(obj).addClass('highlightQueryValue');
    }
    else {
        $(obj).removeClass('highlightQueryValue');
    }
}
function EnableWatermark(obj, enbaled) {
    if (enbaled) {
        $(obj).addClass('watermarkQueryValue');
    }
    else {
        $(obj).removeClass('watermarkQueryValue');
    }
}

// 搜索
// queryType：搜索类型，0：:重置，1：普通搜索，2：快速搜索，3：显示总计搜索
// obj：触发的对象，queryType 为2和3时必须
function DoSearch(queryType, obj) {
    CheckRTip();
    var url = window.location.pathname;
    if (queryType == 0) { }// 重置
    else if (queryType == 1) {
        // 普通搜索
        var tempObj = {
        };
        $(".search [search]").each(function () {
            if ($(this).attr("type") != undefined && $(this).attr("type").toLowerCase() == "checkbox") {
                //如果是复选框的
                if ($(this).attr('checked')) {
                    tempObj[$(this).attr("search")] = true;
                }
            } else {
                if ($(this).val())
                    tempObj[$(this).attr("search")] = $.trim($(this).val());
            }
        });
        var urlParamPart = $.param(tempObj);
        url = url + "?" + urlParamPart;
    }
    else if (queryType == 2) {
        // 快速搜索

        // 保持总计
        var sum = "";
        if ($(".search [search=IsShowSum]").length > 0
            && $(".search [search=IsShowSum]").is(':checked')) {
            sum = "&IsShowSum=true";
        }

        var para;
        if (obj.tagName == "SELECT") {  // 判断是否是select 标签
            para = $(obj).find("option:selected").attr("data-para");
            if (para && para != "")
                url = url + "?" + para + sum + "&qv=" + $(obj).val(); // qv 参数用于锁定下拉列表
        }
        else {
            para = $(obj).attr("data-para");
            if (para && para != "")
                url = url + "?" + para + sum;
        }
    }
    else if (queryType == 3) {
        // 显示总计搜索
        var tempObj = {
        };
        var posturl = $(obj).attr("href");
        $(".search [search]").each(function () {
            if ($(this).attr("type") != undefined && $(this).attr("type").toLowerCase() == "checkbox") {
                //如果是复选框的
                if ($(this).attr('checked')) {
                    tempObj[$(this).attr("search")] = true;
                }
            } else {
                if ($(this).val())
                    tempObj[$(this).attr("search")] = $.trim($(this).val());
            }
        });
        var urlParamPart = $.param(tempObj);

        if (urlParamPart) {
            if (posturl.indexOf("?") <= 0) {
                urlParamPart = "?" + urlParamPart;
            } else {
                urlParamPart = "&" + urlParamPart;
            }
        }
        url = posturl + urlParamPart;
    }

    if (url.indexOf("IsDoQuery=1") == -1 && url.indexOf("?") > -1) {
        url += "&IsDoQuery=1";
    }
    window.location.href = url;
}

function GetQueryUrl() {
    var tempObj = {
    };
    $(".search [search]").each(function () {
        if ($(this).attr("type") != undefined && $(this).attr("type").toLowerCase() == "checkbox") {
            //如果是复选框的
            if ($(this).attr('checked')) {
                tempObj[$(this).attr("search")] = true;
            }
        } else {
            if ($(this).val())
                tempObj[$(this).attr("search")] = $.trim($(this).val());
        }
    });
    var urlParamPart = $.param(tempObj);
    if (urlParamPart)
        urlParamPart = "?" + urlParamPart;
    var url = window.location.pathname + urlParamPart;
    return url;
}
function DoQuery() {
    var url = GetQueryUrl();
    window.location.href = url;
}
function DoQueryByUrl(posturl) {
    var tempObj = {
    };
    $(".search [search]").each(function () {
        if ($(this).attr("type") != undefined && $(this).attr("type").toLowerCase() == "checkbox") {
            //如果是复选框的
            if ($(this).attr('checked')) {
                tempObj[$(this).attr("search")] = true;
            }
        } else {
            if ($(this).val())
                tempObj[$(this).attr("search")] = $.trim($(this).val());
        }
    });
    var urlParamPart = $.param(tempObj);

    if (urlParamPart) {
        if (posturl.indexOf("?") <= 0) {
            urlParamPart = "?" + urlParamPart;
        } else {
            urlParamPart = "&" + urlParamPart;
        }
    }
    var url = posturl + urlParamPart;
    window.location.href = url;
}
function UrlParamsToObject() {
    var URLParams = {
    };
    var aParams = window.location.search.substr(1).split('&');
    for (i = 0; i < aParams.length; i++) {
        var p = aParams[i].split('=');
        URLParams[p[0]] = decodeURIComponent((p[1] + '').replace(/\+/g, '%20'));
    }
    return URLParams;
}

// 设置url 参数，原url 不存在则添加，存在则替换值
function SetUrlParam(url, key, value) {
    var newUrl = url;
    if (url.indexOf('?' + key + '=') > -1 || url.indexOf('&' + key + '=') > -1) {
        // 如果已经包含key，替换原有参数
        var reg = new RegExp("([\?&]" + key + "=)[^&]+");
        newUrl = url.replace(reg, "$1" + value);
    }
    else if (url.indexOf('?') == -1) {
        // 不带参数的url，直接添加参数
        newUrl = url + "?" + key + "=" + value;
    }
    else {
        // 带参数的url，最后添加参数
        newUrl = url + "&" + key + "=" + value;
    }
    return newUrl;
}

// 移除url 参数
function RemoveUrlParam(url, key) {
    var newUrl = url;
    if (url.indexOf('?' + key + '=') > -1 || url.indexOf('&' + key + '=') > -1) {
        // 如果包含key   
        var reg = new RegExp("([\?&])" + key + "=[^&]+&*");
        newUrl = url.replace(reg, "$1");
        if (newUrl.charAt(newUrl.length - 1) == "&") {
            newUrl = newUrl.substr(0, newUrl.length - 1);
        }
    }
    return newUrl;
}

function InitSearch() {
    var params = UrlParamsToObject();
    $(".search [search]").each(function () {
        if (params[$(this).attr("search")]) {
            if ($(this).attr("type") != undefined && $(this).attr("type").toLowerCase() == "checkbox") {
                //如果是复选框的
                if (params[$(this).attr("search")] == "true") {
                    $(this).attr("checked", true);
                }
            } else if (this.tagName.toLowerCase() == "select" && $(this).attr("multiple") && $(this).attr("multiple").toLowerCase() == "multiple") {
                // 不处理，下拉多选另外处理
            }
            else {
                $(this).val(params[$(this).attr("search")]);
            }

        }
    });
    InitRTip();
    HighlightQueryValue();
}
function ValidateForm() {
    var notEmptyList = $("[notempty]");
    if (notEmptyList.length > 0) {
        for (var i = 0; i < notEmptyList.length; i++) {
            if ($(notEmptyList[i]).val() == "") {
                alert($(notEmptyList[i]).attr("notempty") + "不能为空");
                notEmptyList[i].focus();
                return false;
            }
        }
    }
    return true;
}
function CreateFormObject(formItemName) {
    var tempObj = {
    };
    $("[" + formItemName + "]").each(function () {
        var el = $(this);
        var vt = el.attr("valuetype");
        if (vt == "text") {
            tempObj[el.attr(formItemName)] = el.text();
        } else {
            tempObj[el.attr(formItemName)] = el.val();
        }
    });
    return tempObj;
}
function SubmitConfirm(cfg) {
    var defaultConfig = {
        Msg: "确定要执行此操作？",
        ConfirmFn: null,
        MaskArea: "body"
    };
    var cfg = $.extend(defaultConfig, cfg);
    var isSubmit = false;
    if (cfg.ConfirmFn != null) {
        isSubmit = cfg.ConfirmFn();
    } else {
        isSubmit = confirm(cfg.Msg);
    }
    if (isSubmit == false)
        return false;
    $(cfg.MaskArea).mask("正在处理...");
    return true;
}
function AppCall(cfg) {
    var defaultConfig = {
        Action: "/App/Test/Connect",
        async: true,
        Data: {
            Render: "1"
        },
        MaskArea: "body",
        MaskMsg: "正在处理...",
        FormTarget: "",
        CallBack: function (jr) {
            alert(jr.message);
        }
    };
    if (cfg.FormTarget) {
        defaultConfig.Data = $.extend(defaultConfig.Data, $(cfg.FormTarget).serializeJson());
    }
    cfg.Data = $.extend(defaultConfig.Data, cfg.Data);
    cfg = $.extend(defaultConfig, cfg);
    if (cfg.MaskArea) {
        $(cfg.MaskArea).mask(cfg.MaskMsg);
    }
    $.ajax({
        url: cfg.Action,
        type: 'post',
        async: cfg.async,
        data: cfg.Data,
        dataType: 'text',
        error: function (err) {
            alert("脚本执行异常，请刷新页面重试(ajax error)：" + err.statusText);
            if (cfg.MaskArea) {
                $(cfg.MaskArea).unmask();
            }
        },
        success: function (result) {
            try {
                var jr = ToObject(result);
                cfg.CallBack(jr);
            } catch (e) {
                alert(e.Message);
            }
            if (cfg.MaskArea) {
                $(cfg.MaskArea).unmask();
            }
        }
    });
}
function TryElseDo(tryDoFn, elseFn) {
    try {
        tryDoFn();
    } catch (e) {
        if (elseFn)
            elseFn();
    }
}
function ShowTimeCounter(config) {
    var defaultConfig = {
        isShowDay: true,
        isShowSecond: true,
        endText: null,
        endFn: null,
        targetHolder: ".clock",
        totalIntervalAttribute: "totalinterval",
        //beginTime: new Date().getTime(),
        dayUnit: "天", hourUnit: "小时", minUnit: "分"
    };
    var config = $.extend(defaultConfig, config);
    //window.PageBeginTime = window.PageBeginTime || config.beginTime;
    var now = new Date().getTime();
    var clocklist = $(config.targetHolder);
    var liveCount = 0;
    for (var i = 0; i < clocklist.length; i++) {
        var totalinterval = $(clocklist[i]).attr(config.totalIntervalAttribute);
        var remainInterval = totalinterval - 1;
        $(clocklist[i]).attr(config.totalIntervalAttribute, remainInterval);
        //var remainInterval = Math.round(totalinterval - (now - window.PageBeginTime) / 1000);
        if (remainInterval < 1) {
            if (config.endFn) {
                config.endFn();
            } else {
                if (config.endText) {
                    $(clocklist[i]).html(config.endText);
                }
            }
            continue;
        }
        liveCount++;
        var day, hour, min, sec;
        if (config.isShowDay) {
            day = remainInterval / (24 * 60 * 60)
            day = Math.floor(day); //相差的总天数
            remainInterval = remainInterval - day * 24 * 60 * 60; //抛去相差天数后的秒数
        }
        hour = (remainInterval / (60 * 60));
        hour = Math.floor(hour); //相差的小时数
        remainInterval = remainInterval - hour * 60 * 60; //抛去相差小时后的秒数
        min = remainInterval / 60;
        min = Math.floor(min); //相差的分钟数
        remainInterval = remainInterval - min * 60; //抛去相差分钟后的秒数
        sec = remainInterval;
        day = (day + "").length == 1 ? "0" + day : day;
        hour = (hour + "").length == 1 ? "0" + hour : hour;
        min = (min + "").length == 1 ? "0" + min : min;
        sec = (sec + "").length == 1 ? "0" + sec : sec;
        if (config.isShowDay == true) { day += config.dayUnit } else {
            day = "";
        }
        if (config.isShowSecond == true) { sec += "秒" } else {
            sec = "";
        }
        $(clocklist[i]).html(day + hour + config.hourUnit + min + config.minUnit + sec);
    }
    if (liveCount > 0) {
        setTimeout(function () { ShowTimeCounter(config); }, 1000);
    }
}
function FocusTop(dom) {
    var txtId = "_txtFocus_" + GetGUID() + "_";
    var $txt = $("#" + txtId);
    if ($txt.length < 1) {
        var d = dom || $(document.body);
        $('<div style="padding:0px;margin:0px;width:0px;height:0px;"><input id="' + txtId + '" type="text" style="width: 0px; border: 0px;" /></div>').prependTo(d);
        $txt = $("#" + txtId);
    }
    $txt[0].focus()
    setTimeout(function () { $txt[0].blur(); $txt.hide(); }, 1);
}
////////////////////////////////////pager
function CreateIntArr(min, max) {
    var arr = [];
    for (var i = min; i <= max; i++)
        arr[arr.length] = i;
    return arr;
}
function GetPagerHtml(options) {
    var pindex = options.index;
    var psize = options.size;
    var total = options.total;
    var fnName = options.fnName;
    var totalPage = 0; //总页数
    var pageSize = psize; //每页显示行数
    totalPage = parseInt((total - 1) / pageSize);
    if (psize * totalPage < total)
        totalPage += 1;
    var tempHtml = "";
    if (pindex > 1) {
        tempHtml += "<span><a href=\"javascript:" + fnName + "(" + 1 + "," + psize + ")\">首页</a></span>";
    } else {
        tempHtml += "<span>首页</span>";
    }
    if (pindex > 1) {
        tempHtml += "<span><a href=\"javascript:" + fnName + "(" + (pindex - 1) + "," + psize + ")\">上一页</a></span>"
    } else {
        tempHtml += "<span>上一页</span>";
    }
    var linkArr = [];
    if (totalPage > 2) {
        if (totalPage < 9) {
            linkArr = CreateIntArr(1, totalPage);
        } else {
            if (pindex < 6) {
                linkArr = CreateIntArr(1, 9);
            }
            else {
                var min = pindex - 4;
                var max = pindex + 4;
                var overNum = max - totalPage;
                if (overNum > 0) {
                    min = totalPage - 8;
                    max = totalPage;
                }
                linkArr = CreateIntArr(min, max);
            }
        }
    }
    if (linkArr.length > 0) {
        for (var i = 0; i < linkArr.length; i++) {
            var index = linkArr[i];
            if (index == pindex) {
                tempHtml += "<span>" + index + "</span>";
                continue;
            }
            tempHtml += "<span><a style=\"text-decoration:underline; width=\"10px\" href=\"javascript:" + fnName + "(" + index + "," + psize + ")\">" + index + "</a></span>";
        }
    }
    if (pindex < totalPage) {
        tempHtml += "<span><a href=\"javascript:" + fnName + "(" + (pindex + 1) + "," + psize + ")\">下一页</a></span>";
    } else {
        tempHtml += "<span>下一页</span>";
    }
    if (pindex < totalPage) {
        tempHtml += "<span><a href=\"javascript:" + fnName + "(" + (totalPage) + "," + psize + ")\">尾页</a></span>";
    } else {
        tempHtml += "<span>尾页</span>";
    }
    return tempHtml;
}
function GetPagerHtml2(options) {
    var pindex = options.index;
    var psize = options.size;
    var total = options.total;
    var fnName = options.fnName;
    var totalPage = 0; //总页数
    var pageSize = psize; //每页显示行数
    totalPage = parseInt((total - 1) / pageSize);
    if (psize * totalPage < total)
        totalPage += 1;
    var tempHtml = "";
    if (pindex > 1) {
        tempHtml += "<a class=\"home\" href=\"javascript:" + fnName + "(" + 1 + "," + psize + ")\">&lt;&lt;</a>";
    } else {
        tempHtml += "<span class=\"home\">&lt;&lt;</span>";
    }
    if (pindex > 1) {
        tempHtml += "<a class=\"prev\" href=\"javascript:" + fnName + "(" + (pindex - 1) + "," + psize + ")\">&lt;</a>"
    } else {
        tempHtml += "<span class=\"prev\">&lt;</span>";
    }
    var linkArr = [];
    if (totalPage > 2) {
        if (totalPage < 9) {
            linkArr = CreateIntArr(1, totalPage);
        } else {
            if (pindex < 6) {
                linkArr = CreateIntArr(1, 9);
            }
            else {
                var min = pindex - 4;
                var max = pindex + 4;
                var overNum = max - totalPage;
                if (overNum > 0) {
                    min = totalPage - 8;
                    max = totalPage;
                }
                linkArr = CreateIntArr(min, max);
            }
        }
    }
    if (linkArr.length > 0) {
        for (var i = 0; i < linkArr.length; i++) {
            var index = linkArr[i];
            if (index == pindex) {
                tempHtml += "<span class=\"num current\">" + index + "</span>";
                continue;
            }
            tempHtml += "<a class=\"num\" style=\"text-decoration:underline; width=\"10px\" href=\"javascript:" + fnName + "(" + index + "," + psize + ")\">" + index + "</a>";
        }
    }
    if (pindex < totalPage) {
        tempHtml += "<a class=\"next\" href=\"javascript:" + fnName + "(" + (pindex + 1) + "," + psize + ")\">&gt;</a>";
    } else {
        tempHtml += "<span class=\"next\" >&gt;</span>";
    }
    if (pindex < totalPage) {
        tempHtml += "<a class=\"end\" href=\"javascript:" + fnName + "(" + (totalPage) + "," + psize + ")\">&gt;&gt;</a>";
    } else {
        tempHtml += "<span class=\"end\">&gt;&gt;</span>";
    }
    return tempHtml;
}
function InitEnterEvent(enterTarget, eventFn) {
    enterTarget.keydown(function (e) {
        var curKey = e.which;
        if (curKey == 13) {
            eventFn();
            return false;
        }
    });
}
////////////////////////////////////Fix
function FormAmount(str) {
    return MoneyShow(str);
}
//字符串纯数字验证
function IsNumber(obj) {
    var str = $.trim($(obj).val());
    var s = /^[0-9]*$/;
    if (!s.test(str))
        $(obj).val("");
}

$.AjaxWebService = function (url, dataMap, fnSuccess, isjsontype, isasync) {// isasync 异步
    var _contenttype = isjsontype == true ? "application/json; charset=utf-8" : "application/x-www-form-urlencoded";
    var _isasync = isasync;
    $.ajax({
        beforeSend: function () {
            //调用前要执行的方法
        },
        type: "POST",
        cache: true,
        contentType: _contenttype,
        url: url,
        data: dataMap,
        async: true,
        dataType: "json",
        complete: function () {
            //完成要执行的方法
        },
        error: function () {
            // alert(dataMap);
            //调用错误要执行的方法
        },
        success: function (result) {
            // alert(result);
            //调用成功要执行的方法
            fnSuccess(result);
        }
    });

}

/*
为表格增加合计列

表格需增加属性total，total="参数1:值||参数2:值1|值2||参数3:值"，参数包含：
remove:需要计算的列带有单位，需要去除的单位和逗号，有多个字符时以|隔开
round:保留小数位
showmoney:是否以金额的格式显示

表头th，在需要合计的列的表头增加属性total，total="参数1:值||参数2:值1|值2||参数3:值"，参数包含：
unit:单位
showmoney:是否以金额的格式显示，默认继承table里的showmoney参数
round:保留小数位，默认继承于table里的round参数
classvalue:合计单元格里需要使用的class
style:合计单元格里需要使用的style
*/
function SetTableTotal() {
    $("table[total]").each(function () {
        var tableObject = $(this);
        var indexArr = new Array();    //把需要合计的列数记起来
        var tdCount = 0;    //有多少列
        var removeArr = new Array("元", "万元", ",");    //需要计算的列包含了单位，需要替换为空的单位字符，以|分隔
        var round = 2;      //保留小数位
        var showmoney = true;

        //取出table合计的参数
        if (tableObject.attr("total") != undefined) {
            if (tableObject.attr("total") != "") {
                var parameter = getTotalTableParameter(tableObject.attr("total"));
                if (parameter.remove != undefined) {
                    removeArr = parameter.remove.split("|");
                }
                if (parameter.round != undefined) {
                    round = parameter.round;
                }
                if (parameter.showmoney != undefined) {
                    showmoney = parameter.showmoney;
                }
            }
        }

        //取出需要计算合计的列
        tableObject.find("th").each(function (index) {
            if ($(this).attr("total") != undefined) {
                var trTotal = new Object();
                trTotal.index = index;  //列数
                trTotal.total = 0;      //合计值
                if ($(this).attr("total") != "") {
                    var parameter = getTotalTableParameter($(this).attr("total"));
                    trTotal.unit = "";
                    trTotal.showmoney = showmoney;
                    trTotal.round = round;
                    trTotal.classvalue = "";
                    trTotal.style = "";
                    if (parameter.unit != undefined) {
                        trTotal.unit = parameter.unit;      //合计列的单位
                    }
                    if (parameter.showmoney != undefined) {
                        trTotal.showmoney = parameter.showmoney;
                    }
                    if (parameter.round != undefined) {
                        trTotal.round = parameter.round;
                    }
                    if (parameter.classvalue != undefined) {
                        trTotal.classvalue = parameter.classvalue;
                    }
                    if (parameter.style != undefined) {
                        trTotal.style = parameter.style;
                    }
                }
                indexArr.push(trTotal);
            }
            tdCount = index;
        });

        //计算合计值
        $.each(indexArr, function (index, value) {
            tableObject.find("tr").each(function (trindex) {
                var trObject = $(this);
                var v = $.trim(trObject.find("td:eq(" + value.index + ")").text());
                if (v != undefined && v != "") {
                    $.each(removeArr, function (ri, removestr) {
                        v = v.replace(new RegExp(removestr, "gm"), '');
                    });
                    if (v != "" && !isNaN(v)) {
                        value.total += parseFloat(v);
                    }
                    indexArr[index] = value;
                }
            });

            //格式化
            if (indexArr[index].showmoney) {
                indexArr[index].total = MoneyShow(indexArr[index].total);
                if (round == 0) {
                    indexArr[index].total = indexArr[index].total.substring(0, indexArr[index].total.length - 3);
                }
            } else {
                if (round > 0) {
                    if (indexArr[index].total.toString().indexOf(".") > -1) {
                        indexArr[index].total = parseFloat(indexArr[index].total.toString().match(new RegExp("\\d+\\.\\d{" + round + "}", "gm"))).toFixed(round)
                    } else {
                        indexArr[index].total = indexArr[index].total.toFixed(round);
                    }
                } else {
                    indexArr[index].total = parseInt(indexArr[index].total);
                }
            }
        });

        //生成合计列
        var content = "";
        for (var i = 0; i <= tdCount; i++) {
            var needtotal = false;
            if (i == 0) {
                content += '<td align="center" style="color: red"><b>合计</b></td>';
            }
            else {
                $.each(indexArr, function (index, value) {
                    if (value.index == i) {
                        needtotal = true;
                        content += "<td";
                        if (value.classvalue != "") {
                            content += ' class="' + value.classvalue + '" ';
                        }
                        if (value.style != "") {
                            content += ' style="' + value.style + '" ';
                        }
                        content += '>' + value.total + (value.unit == undefined ? "" : value.unit) + '</td>';
                    }
                });
                if (!needtotal) {
                    content += "<td></td>";
                }
            }
        }
        content = "<tr>" + content + "</tr>";
        tableObject.find("tbody").append(content);
    });
}

//将参数字符串转化为对象
//参数字符串格式：name1:value1|value2||name2:value||name3:value
function getTotalTableParameter(parameter) {
    var result = new Object();
    if (parameter != "") {
        var arr = parameter.split("||");
        $.each(arr, function (i, par) {
            var p = par.split(":");
            if (p.length > 1) {
                result[p[0]] = p[1];
            }
        });
    }
    return result;
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function FloatAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}
/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function FloatSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}
/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
function FloatMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}
/** 
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
function FloatDiv(arg1, arg2) {
    var t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
    }
    with (Math) {
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * pow(10, t2 - t1);
    }
}

/**
 * 多选下拉列表
 * selector: select 标签的id，必须
 * selectedList: 最大显示数量，可为空
 * width: 宽度，可为空
 * height: 高度，可为空
 */
function MultiSelect(selector, cfg) {
    if (!selector)
        return;
    var defaultConfig = {
        selectedList: 20,
        minWidth: 200,
        height: 200,
        multiple: true
    };
    cfg = $.extend(defaultConfig, cfg);
    var selectorId = "#" + selector;
    // 初始化默认值（如果存在）
    var val = ',' + GetQueryString(selector) + ',';
    $.each($(selectorId + " option"), function () {
        if (val.indexOf(',' + $(this).val() + ',') > -1) {
            this.selected = true;
        }
    });
    // 初始化多选下拉列表
    var obj = $(selectorId).multiselect({
        selectedList: cfg.selectedList,
        noneSelectedText: "--请选择--",
        uncheckAllText: "清空",
        checkAllText: "全选",
        selectedText: "选择了#项",
        minWidth: cfg.minWidth,
        height: cfg.height,
        multiple: cfg.multiple
    }).multiselectfilter({
        label: '',
        width: 75,
        placeholder: '可输入筛选',
        autoReset: false
    });
}

/**
 *  获取url 参数
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var search = decodeURI(window.location.search).substr(1);
    var r = search.match(reg);
    if (r != null) return unescape(r[2]); return null;
}

$(function () {
    ////////////////////////////////init
    //列表行操作样式
    $(".tableBD tr").live('click', function () {
        $(".tableBD tr").removeClass("clickTR");
        $(".tableBD tr").css("background", "none");
        $(this).css("background", "#E8E8E8");
        $(this).addClass("clickTR");
    }).live('mouseover', function () {
        if (!$(this).hasClass("clickTR")) {
            $(this).css("background", "#EEE");
        }
    }).live('mouseout', function () {
        if (!$(this).hasClass("clickTR")) {
            $(this).css("background", "none");
        }
    })

    //搜索框回车默认为执行查询按钮
    $(".search input").keydown(function (e) {
        var curKey = e.which;
        if (curKey == 13) {
            $(".searchBtn").click();
            return false;
        }
    });

    // 自动设置Tab 选中
    var tabSelect = GetQueryString("tab-select");
    if (tabSelect && tabSelect.length > 1 && tabSelect.indexOf("$") > 0) {
        try {
            var id = tabSelect.split("$")[0];
            var index = parseInt(tabSelect.split("$")[1]);
            setTimeout(function () {
                $("#" + id + " li").eq(index).click();
            }, 20);
        }
        catch (ex) {
        }
    }
    //输入框弹出多行输入
    $("input[type='text'][PopMultiInput]").each(function () {
        PopMultiInput($(this));
    });
});