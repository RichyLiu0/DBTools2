///格式化时间
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
//获得当前时间
function getNowTime() {
    //取得当前时间
    var now = new Date();
    var strnow = now.format("yyyy-MM-dd hh:mm");
    //    var year = now.getFullYear();
    //    var month = now.getMonth() + 1;
    //    var day = now.getDate();
    //    var hour = now.getHours();
    //    var minute = now.getMinutes();
    //var second = now.getSeconds();
    var week = now.getDay();
    var weekname = "星期" + "天一二三四五六".split('')[week];
    var nowdate = strnow + " " + weekname;
    $("#lbltime").text(nowdate);

}
//ifram自适应
function setifHeight(id) {
    var iframe = id;
    //document.domain = "cmbchinaucs.com";
    var hheight = iframe.contentWindow.document.documentElement.scrollHeight;
    hheight = iframe.contentWindow.document.body.scrollHeight;
    var iheight = iframe.contentDocument == undefined ? 0 : iframe.contentDocument.body.scrollHeight;
    //var hheight = iframe.contentWindow.document.documentElement.scrollHeight;
    var height = Math.max(hheight, iheight);
    if ((!/*@cc_on!@*/0) && height == 650) {
        height = 950;
    }
    //    if (height < 650) {
    //        height = 600;
    //    }
    //iframe.height = height;
    iframe.style.height = height + "px";
}
//打开选项卡
function opentab(menu) {
    var isopened = false;
    //判断是否重复打开
    $("#Toggletitle li").each(function () {
        if ($.trim($(this).find("span").text()) == $.trim(menu.title)) {
            $(this).addClass("current").siblings().removeClass("current");
            $(".labelContent").hide();
            $($(this).attr('nav')).find("iframe").attr('src', menu.nav);
            $($(this).attr('nav')).show();
            isopened = true;
        }
    });
    if (isopened) {
        return true;
    }
    var tabcount = $("#labelContent iframe").length;
    //限制任务栏
    if (tabcount > 9) {
        alert('最多支持打开9个选项卡，请关闭其他暂不使用的选项卡后重试');
        return false;
    }
    //添加关闭按钮
    if (tabcount == 0) {
        $("#Toggletitle ul").append('<li  value="0" style="width:12px;height:12px;margin:25px 0 0 7px;padding:0;"  class=" " id="btnCloseAllTab"><a  href="javascript:void(0);" title="关闭所有" class="btnClose" style="background-position:-388px -32px;top:0;right:0;width:12px;height:12px;"></a></li>');
        $(".labelBox").append('<div id="labelContent"><div style="display: block"  id="ifmaindesk"><iframe src="" width="100%" height="520" frameborder="0" name="myDesk"></iframe></div></div>');
    }
    $(".labelContent").hide();
    $("#Toggletitle ul").children("li").removeClass("current");
    //动态标题
    var li = $(" <li value='" + menu.navid + "' navid='" + menu.navid + "' class='current' nav='#" + menu.navid + "'><span>&nbsp;&nbsp;&nbsp; " + menu.title + "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><a class='btnClose' title='关闭' href='javascript:void(0);'></a></li>");
    $("#Toggletitle ul").prepend(li);
    //动态iframe添加
    var ifmain = $("<div style='display:block;'></div>");
    ifmain.attr('class', 'pageBody labelContent Content_1');
    ifmain.attr('id', menu.navid);
    ifmain.append("<div class='inner_2'><div class='rightContent'><iframe id='" + menu.navid + "' name='" + menu.navid + "' src='" + menu.nav + "'  width='100%' height='100%' frameborder='0'></iframe></div></div>");
    $("#labelContent").append(ifmain);

}
$(document).ready(function () {
    getNowTime();
    window.setInterval("getNowTime();", 60000);
    //菜单展示
    $("#menu_left_ucsmy li .yj").live("click", function () {
        $("#menu_left_ucsmy li .yj a").removeClass("current");
        $(this).children("a").addClass("current");
        $(this).next("ul").slideDown(300);
        $(this).parent().siblings().children("ul").slideUp(300);
    })
    $("#menu_left_ucsmy .two span").live("click", function () {
        var nav = $(this).parent().attr("nav");
        var navid = $(this).parent().attr("navid");
        var title = $(this).text();
        var menu = { nav: nav, title: title, navid: navid };
        opentab(menu);
    });
    //标签切换
    $(".labelBox .label li span").live("click", function () {
        $(this).parent().addClass("current").siblings("li").removeClass("current");
        //$(this).closest(".label").siblings(".labelContent").hide();
        $(".labelContent").hide();
        $($(this).parent().attr('nav')).show();

        $("#labelContent iframe").each(function () {
            SetHeightByIframe(this)
        });
    });
    function SetHeightByIframe(ifr) {
        if (ifr) {
            var h = parseInt(ifr.style.height);
            if (h < 600) {
                ifr.style.height = 600 + "px"
            }
        }
    }

    $("#btnCloseAllTab").live("click", function () {
        $("#Toggletitle ul li").remove();
        $("#labelContent div").remove();
    });

    $(".btnClose").live("click", function () {
        var isCurClose = $(this).parent().hasClass("current"); //是否关闭激活状态的tab
        var showTab = $(this).parent().prev();
        if (showTab.length < 1) {//是否存在【左tab】，不存在尝试取【右tab】
            showTab = $(this).parent().next();
        }
        $($(this).parent().attr('nav')).remove();
        $(this).parent().remove();

        if (isCurClose) {
            if (showTab.length > 0) {
                showTab.find("span").click();
            }
        }
    });
});