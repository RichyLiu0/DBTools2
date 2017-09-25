$(function () {
    $.fn.ShowWhiteName = function (listWhiteName, CallBack) {

        var hasData = false;
        var content = '<style type="text/css" >';
        content += '.white_box{position:absolute;width:300px;left:50%;height:auto;z-index:100;background-color:#fff;border:1px #ddd solid;padding:1px;}';
        content += '.white_box h2{height:25px;font-size:14px;background-color:#3B81C7;position:relative;padding-left:10px;line-height:25px;color:#fff;}';
        content += '.white_box h2 a{position:absolute;right:5px;font-size:12px;color:#fff;}';
        content += '.white_box .list{padding:10px;height:340px;overflow-y: auto;}';
        content += '.white_box .list li{height:24px;line-height:24px;}';
        content += '#white_bg{background-color:#666;position:absolute;z-index:99;left:0;top:0;display:none;width:100%;height:100%;opacity:0.5;filter: alpha(opacity=50);-moz-opacity: 0.5;}';
        content += '.blue{color: #0066FF;cursor: pointer;}';
        content += '</style>';

        content += '<div id="white_bg"></div>';
        content += '<div class="white_box" style="display:none">';
        content += '<h2>白名单设置<a href="#" class="close" onclick="closeWhiteName(\'' + $(this).attr("id") + '\')">关闭</a></h2>';
        content += '    <div class="list">';
        content += '        可输入：用户登录名、用户真实姓名、手机号码';
        content += '        <ul id="ulWhiteName">';

        if (listWhiteName instanceof Array) {
            $.each(listWhiteName, function (i, whitename) {
                if (whitename.WhiteName != undefined && $.trim(whitename.WhiteName)!="") {
                    hasData = true;
                    content += '            <li><input whiteid="';
                    if (whitename.ID != undefined && whitename.ID != '') {
                        content += whitename.ID;
                    }
                    content += '" type="text"  maxlength="50" value="' + whitename.WhiteName + '" />';
                    content += '                <a href="javascript:void(0)" class="blue spaceI btnDelWhite">X</a>';
                    content += '                &nbsp;&nbsp;';
                    content += '                <a href="javascript:void(0)" class="blue addI btnAddWhite" style="display:none">继续添加</a>';
                    content += '            </li>';
                }
            });
        }
        if (!hasData) {
            content += '            <li><input type="text" maxlength="50" value="" />';
            content += '                <a href="javascript:void(0)" class="blue spaceI btnDelWhite">X</a>';
            content += '                &nbsp;&nbsp;&nbsp;';
            content += '                <a href="javascript:void(0)" class="blue addI btnAddWhite">继续添加</a>';
            content += '            </li>';
        }
        content += '        </ul>';
        content += '    </div>';
        content += '    <div style="text-align: center;"><input type="button" value="确定" id="btnSelectAsset" class="ButtonCss" style="" onclick="confirmWhiteName(\'' + $(this).attr("id") + '\',' + CallBack + ')"></div>';
        content += '</div>';


        $(this).html(content);
        $("#white_bg").css({
            display: "block", height: $(document).height()
        });

        var $box = $('.white_box');
        $box.css({
            //设置弹出层距离左边的位置
            left: ($("body").width() - $box.width()) / 2 - 20 + "px",
            //设置弹出层距离上面的位置
            top: ($(window).height() - $box.height()) / 2 + $(window).scrollTop() + "px",
            display: "block"
        });

        $(".btnAddWhite").hide();
        $(".btnAddWhite:last").show();
    }

    $(".btnAddWhite").live("click", function () {
        var content = '<li><input type="text" maxlength="50" value="" />&nbsp;';
        content += '<a href="javascript:void(0)" class="blue spaceI btnDelWhite">X</a>';
        content += '&nbsp;&nbsp;&nbsp;';
        content += '<a href="javascript:void(0)" class="blue addI btnAddWhite">继续添加</a></li>';
        $(this).hide();

        $("#ulWhiteName").append(content);
        $(".white_box .list").scrollTop($(".white_box .list").height());
    });

    $(".btnDelWhite").live("click", function () {
        var spacei = $(".btnDelWhite").length;
        if (spacei <= 1)
            return false;
        $(this).parent().remove();
        $(".btnAddWhite").hide();
        $(".btnAddWhite:last").show();
    });
});

function closeWhiteName(divname) {    
    $("#" + divname).html('');
}

function confirmWhiteName(divname,CallBack) {
    var listWhiteName = new Array();
    $(".white_box .list").find("li").each(function (i) {
        if ($.trim($(this).find("input").val()) != "") {
            var white = new Object();
            white.WhiteName = $(this).find("input").val();
            white.ID = $(this).find("input").attr("whiteid");
            listWhiteName.push(white);
        }
    });
    closeWhiteName(divname);
    CallBack(listWhiteName);
}

